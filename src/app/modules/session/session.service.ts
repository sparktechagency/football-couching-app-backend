import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import QueryBuilder from "../../builder/QueryBuilder";
import { ISession } from "./session.interface";
import { Session } from "./session.model";
import { Course } from "../course/course.model";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { USER_ROLES } from "../../../enums/user";
import { Homework } from "../homework/homework.model";
import { Tutorial } from "../tutorial/tutorial.model";
import { CourseService } from "../course/course.service";
import { PerformanceService } from "../performance/performance.service";
import { Enroll } from "../enroll/enroll.model";
import { sendNotifications } from "../../../helpers/notificationHelper";

const createSessionIntoDb = async (payload: ISession) => {
    const course = await Course.findOne({ _id: payload.course });
    if (!course) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Course not found");
    }
    payload.couch = course.couch;

payload.startTime = new Date(`${payload.date} ${payload.startTime}`);
payload.endTime = new Date(`${payload.date} ${payload.endTime}`);
  const result = await Session.create(payload);
  await sendNotifications({
    title: "New Session",
    body: `You have new session on ${payload.startTime.toLocaleDateString()}`,
    reciever:[payload.couch],
    path:"session",
    referenceId: result._id
  })
  const studentList = await Enroll.find({ course: payload.course }).lean()
  for( const student of studentList){
    await sendNotifications({
      title: "New Session",
      body: `You have new session on ${payload.startTime.toLocaleDateString()}`,
      reciever:[student.user],
      path:"session",
      referenceId: result._id
    })
  }
  return result;
};

const getSessionsFromDB = async (query: Record<string, any>,user:JwtPayload) => {
  const SessionQuery = new QueryBuilder(Session.find({ }), query).paginate().sort().filter()

  const [sessions, paginationResult] = await Promise.all([
   [USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.COUCH].includes(user?.role)? SessionQuery.modelQuery.populate("course",'name').lean(): SessionQuery.modelQuery.lean(),
    SessionQuery.getPaginationInfo()
  ])
  // await Session.updateMany({},{description:"This is a test description"})
  return {
    meta: paginationResult,
    data: sessions
  }
    
};
const updateSessionIntoDb = async (id: string, payload: Partial<ISession>) => {
  const exist = await Session.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Session doesn't exist!");
  }
  for(let key in payload){
    if([null,undefined,"","undefined"].includes(payload[key as keyof Partial<ISession>] as any)){
      delete payload[key as keyof Partial<ISession>]
    }
  }
  if(payload.startTime){
    payload.startTime = new Date(`${payload.date||exist.date} ${payload.startTime}`)
  }
  if(payload.endTime){
    payload.endTime = new Date(`${payload.date||exist.date} ${payload.endTime}`)
  }
  if(payload.date){
    payload.date = new Date(payload.date)
  }

  
  const result = await Session.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const upcommingSession = async (user: JwtPayload) => {
  const currentDayStart = new Date(new Date().setHours(0, 0, 0, 0));
  const currentDayEnd = new Date(new Date().setHours(23, 59, 59, 999));
  const query = user.role == USER_ROLES.COUCH ? { couch: user.id } : {};
  const session = await Session.findOne({
    ...query,
    $or: [
      {
        startTime: {
          $gte: currentDayStart,
          $lte: currentDayEnd,
        },
      },
      {
        endTime: {
          $gte: currentDayStart,
          $lte: currentDayEnd,
        },
      },
    ]
  }).populate([
    {
      path: "course",
      select: {
        name: 1,
        image: 1,
      },
    },
    {
      path: "couch",
      select: {
        name: 1,
        image: 1,
      },
    },
  ]);

  return session;

}



const deleteSessionFromDb = async (id: string) => {
  const exist = await Session.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Session doesn't exist!");
  }
  const result = await Session.findByIdAndDelete(id);
  return result;
};


const upcommingSessionsForCouch = async (query: Record<string, any>, user: JwtPayload) => {
  const currentDayStart = new Date(new Date().setHours(0, 0, 0, 0));

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Session.aggregate([
    {
      $match: {
        couch: new Types.ObjectId(user.id),
        status: 'active',
        startTime: query?.all ? { $ne: null } : { $gte: currentDayStart },
      }
    },
    {
        $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            as: 'course',
            pipeline:[{
                $project: {
                    name: 1,
                    image: 1,
                    _id: 1
                }
            }]
        }
    },
    {
        $addFields: {
            course: {
                $arrayElemAt: ['$course', 0]
            }
        }
    },
    {
      $addFields: {
        sessionDate: {
          $dateToString: { format: "%Y-%m-%d", date: "$startTime" }
        }
      }
    },
    {
      $sort: { startTime: 1 }
    },
    {
      $group: {
        _id: "$sessionDate",
        shedules:{$sum: 1},
        sessions: { $push: "$$ROOT" }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $facet: {
        paginatedResults: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    }
  ]);

  const sessions = result[0].paginatedResults;
  const total = result[0].totalCount[0]?.count || 0;

  const pagination = {
    page,
    limit,
    total,
    totalPage: Math.ceil(total / limit)
  };

  return {
    meta: pagination,
    data: sessions
  };
};

const getSessionDetailsFromDB = async (id: string,user:JwtPayload) => {
  if([USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN].includes(user.role)){
    const result = await Session.findById(id).populate([
      {
        path: "course",
        select: {
          name: 1,
        },
      },
      {
        path: "couch",
        select: {
          name: 1,
          image: 1,
        },
      },
    ]);
    return result;
  }

  if(USER_ROLES.MEMBER==user.role){
    let result = await Session.findById(id).populate([
    {
      path: "course",
      select: {
        name: 1,
      },
    },
    {
      path: "couch",
      select: {
        name: 1,
        image: 1,
      },
    },
  ]).lean() as any

  result = {
    ...result,
    isUpcomming: result?.date! > new Date(),
  }

  const homework = await Homework.findOne({ session: id }).populate('course',"name")
  const tutorials = (await Tutorial.find({course: result?.course?._id}).populate('course',"name").limit(6).lean()).map((t) => {
    return {
      ...t,
      thumbnail:"football.png"
    };
  })
  return {
    sessionInfo: result,
    homework: homework,
    tutorials: tutorials
  };
  }

  return sessionDetailsForCouchFromDb(id)
};

const sessionDetailsForCouchFromDb = async (sessionId: string) => {
  const result = await Session.findById(sessionId).populate([
    {
      path: "course",
      select: {
        name: 1,
      },
    },
    {
      path: "couch",
      select: {
        name: 1,
        image: 1,
      },
    },
  ]);
  const homework = await Homework.findOne({ session: sessionId }).populate('course',"name")

  const studentList  = await PerformanceService.getStudentListOFCourse(sessionId)

  return {
    sessionInfo: result,
    homework: homework,
    studentList: studentList
  };
}

const todaySessionFromDb = async (user:JwtPayload)=>{
  let courses = []
  if(user.role == USER_ROLES.COUCH){
    courses = await Course.find({couch:user.id})
  }
  else {
    courses = (await Enroll.find({user:user.id}).populate("course")).map(item=>item.course)
  }

  const currentDayStart = new Date().setHours(0, 0, 0, 0);
  const currentDayEnd = new Date().setHours(23, 59, 59, 999);

  for(const course of courses){
    const sessions = await Session.find({course:course._id, startTime: {$gte: currentDayStart, $lte: currentDayEnd}}).populate('course','name')
    // console.log(sessions);
    
    if(sessions.length > 0){
      return sessions[0]
    }
    
  }
}



export const SessionService = {
  createSessionIntoDb,
  getSessionsFromDB,
  updateSessionIntoDb,
  deleteSessionFromDb,
  upcommingSession,
  upcommingSessionsForCouch,
  getSessionDetailsFromDB,
  sessionDetailsForCouchFromDb,
  todaySessionFromDb
};