import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';
import { ICourse } from './course.interface';
import { Course } from './course.model';
import { USER_ROLES } from '../../../enums/user';
import { Enroll } from '../enroll/enroll.model';
import { Session } from '../session/session.model';
import { Performance } from '../performance/performance.model';
import { IPerformanceTopic } from '../performance/performance.interface';
import { PerformanceService } from '../performance/performance.service';
import { JwtPayload } from 'jsonwebtoken';
import { IEnroll } from '../enroll/enroll.interface';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IUser } from '../user/user.interface';
import { Submission } from '../submission/submission.model';

const createCourseIntoDb = async (payload: ICourse) => {
  const result = await Course.create(payload);
  return result;
};
const getAllCourseFromDb = async (
  query: Record<string, any>,
  user: JwtPayload
) => {
  const isPrevious = query.previous == 'true';
  const currentDate = new Date();
  const prevQuery = isPrevious
    ? { endDate: { $lt: currentDate } }
    : { endDate: { $gt: currentDate } };
  const queryData = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(
    user.role
  )
    ? { status: 'active' }
    : user.role == USER_ROLES.COUCH
    ? { couch: user.id, status: 'active', ...prevQuery }
    : { status: 'active', ...prevQuery };

  const CourseQuery = new QueryBuilder(Course.find(queryData), query)
    .paginate()
    .search(['name'])
    .sort();

  const [courses, paginationResult] = await Promise.all([
    CourseQuery.modelQuery.populate("couch",'name image').lean(),
    CourseQuery.getPaginationInfo(),
  ]);

  return {
    meta: paginationResult,
    data: courses,
  };
};


const coursesOfStudentFromTheDB = async(user:JwtPayload,query:Record<string,any>)=>{
  const currentDate = new Date();
  const prevQuery = query.previous == 'true' 
  const allCourses = (await Enroll.find({user:user.id,}).populate('course').lean()).map((c)=>c.course) as any as ICourse[]
  const modiefiedData = allCourses.filter((c)=>(prevQuery ? c?.endDate! < currentDate : c?.endDate! > currentDate))
  const {data, pagination} = paginationHelper.paginateArray(modiefiedData, query);
  return {
    meta: pagination,
    data: data,
  }
}

const updateCourseIntoDb = async (id: string, payload: Partial<ICourse>) => {
  const exist = await Course.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Course doesn't exist!");
  }

  const result = await Course.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteCourseFromDb = async (id: string) => {
  const exist = await Course.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Course doesn't exist!");
  }

  const result = await Course.findOneAndUpdate(
    { _id: id },
    { status: 'delete' },
    { new: true }
  );
  return result;
};

const courseOverViewFromDB = async (id: string) => {
  const exist = await Course.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Course doesn't exist!");
  }

  const totalStudents = await Enroll.countDocuments({ course: id });
  const totalSessions = await Session.countDocuments({ course: id });
  const totalAttandancesApprox = totalSessions * totalStudents;

  const totalAttandnce = await Performance.aggregate([
    {
      $match: {
        course: exist._id,
      },
    },
    {
      $group: {
        _id: null,
        totalAttandance: {
          $sum: {
            $cond: [
              {
                $eq: ['$atandance', true],
              },
              1,
              0,
            ],
          },
        },
        performances: {
          $push: '$performance',
        },
      },
    },
  ]);

  const totalAttandance = totalAttandnce[0]?.totalAttandance;
  const totalPerformance = totalAttandnce[0]?.performances;
  const totalAttandancePercentage =
    (totalAttandance/totalAttandancesApprox) * 100;
  

  const performanceRusult = totalPerformance?.map((performance: any) => {
    const total = performance.reduce((acc: any, curr: any) => {
      const currValue = curr as IPerformanceTopic
      return acc + (currValue?.score??0)
    },0);
    return total
  }).reduce((acc: any, curr: any) => {
    return acc + curr;
  }, 0);

  const totalSessionsMarks = totalSessions * PerformanceService.calculateAvarageScore()
  const avarageScorePercentage = (performanceRusult / totalSessionsMarks) * 100;


  return {
    overview :{
      totalStudents,
      attandanceRate :!isNaN(totalAttandancePercentage)? totalAttandancePercentage.toFixed(0)+"%":"0%",
      totalActivity :!isNaN(avarageScorePercentage)? avarageScorePercentage.toFixed(0)+"%":"0%",
    }
  }


};

const getStudentsCourses= async (user:JwtPayload)=>{
  const enrolls = await Enroll.find({user:user.id}).populate('course','name').lean()
  const allCoureses = enrolls.map(enroll=>enroll.course)
  return allCoureses
}

const getCourseHistoryForStudent = async (user:JwtPayload,courseId:string)=>{
  const course = await Course.findById(courseId).populate('couch',"name image").lean()
  const allSessions = await Session.find({course:courseId}).lean()
  const allPerformance = await Performance.find({user:user.id,course:courseId,atandance:true}).populate('session','name').lean()
  const totalScore = allPerformance.reduce((acc,curr)=>{
    const total = curr.performance?.reduce((ac,cr)=>{
      return ac+cr.score
    },0
    )
    return acc+(total || 0)
  },0)

  const totalMarks = allSessions.length * PerformanceService.calculateAvarageScore()
  const avarageActivity = (totalScore/totalMarks)*100
  const avarageAttandance = (allPerformance.length/allSessions.length)*100

  const studentPerFormance = await Promise.all(allSessions.map(async(item,index)=>{
    const performance = await Performance.findOne({user:user.id,course:courseId,session:item._id}).lean()
    const performanceData = performance?.performance?.reduce((acc,curr)=>{
      return acc+curr.score
    },0)
    const avarage = ((performanceData||0)/PerformanceService.calculateAvarageScore())*100
    return {
      session:index+1,
      date:item.date,
      performance:performance?avarage.toFixed(0)+"%":"Review Session",
      attandance:performance?.atandance?true:false
    }
    
  }
  ))

  return {
    courseDetails:course,
    overview :{
      attandance:`${allSessions.length}/${allPerformance.length}`,
      avarageActivity:avarageActivity.toFixed(0)+"%",
      avarageAttandance:avarageAttandance.toFixed(0)+"%"
    },
    performance:studentPerFormance
  }

}

const manageClassForCouchFromDb = async (sessionId:string)=>{
  const session = await Session.findById(sessionId).lean() 
  if(!session){
    throw new ApiError(404,"Session not found")
  }
  const course = await Course.findById(session?.course).lean()
  const totalSessions = await Session.countDocuments({course:course?._id})
  const totalPlayers = await Enroll.countDocuments({course:course?._id})
  const attandance = await Performance.countDocuments({session:sessionId,atandance:true})
  const avarageAttandance = (attandance/totalPlayers)*100
  const totalPerformance = totalSessions * PerformanceService.calculateAvarageScore()
  const studentPerFormance = await Performance.aggregate([
    {
      $match:{
        session:session?._id
      }
    },
    {
      $unwind:"$performance"
    },
    {
      $group:{
        _id:null,
        totalScore:{$sum:"$performance.score"}
      }
    }
  ])
  // console.log(studentPerFormance);
  
  const avarageScore = (studentPerFormance[0]?.totalScore/totalPerformance)*100
  // console.log(avarageScore);
  
  const overview = {
    totalStudents:totalPlayers,
    avarageAttandance:avarageAttandance.toFixed(0)+"%",
    avarageActivity :isNaN(avarageScore)?"0": avarageScore.toFixed(0)+"%",
  }

  const students = (await Enroll.find({course:course?._id}).populate("user").lean()).map((student)=>student.user) as any as IUser[]

  const studentLists = await Promise.all(students.map(async (student)=>{
    const performance = await Performance.findOne({session:session?._id,user:(student as any)._id}).populate("user").lean()
    const totalScore = performance?.performance?.reduce((acc,curr)=>acc+curr.score,0)
    console.log(totalScore,PerformanceService.calculateAvarageScore());
    
    const totalPerformance = totalScore?((totalScore / PerformanceService.calculateAvarageScore())*100).toFixed(0)+"%":"Review Session"
    const homeWork = await Submission.findOne({session:session?._id,student:(student as any)._id}).populate("student").lean()
    return {
      image:student?.image,
      name:student?.name,
      userId:(student as any)?._id,
      totalPerformance:totalPerformance,
      attandance:performance?.atandance?true:false,
      homeWork:homeWork?homeWork._id:false
    }
  }))

  return {
    sessionDetails:{
      name:session?.title,
      date:session?.date,
      startTime:session?.startTime,
      endTime:session?.endTime,
      courseName:course?.name,
      courseId:course?._id,
    },
    overview,
    studentLists,
  }
}

export const CourseService = {
  createCourseIntoDb,
  getAllCourseFromDb,
  updateCourseIntoDb,
  deleteCourseFromDb,
  courseOverViewFromDB,
  getStudentsCourses,
  getCourseHistoryForStudent,
  coursesOfStudentFromTheDB,
  manageClassForCouchFromDb
};
