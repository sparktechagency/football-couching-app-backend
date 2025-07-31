import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { getRandomId } from '../../../shared/idGenerator';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { SubscriptionService } from '../subscription/subscription.service';
import { Enroll } from '../enroll/enroll.model';
import { ICourse } from '../course/course.interface';
import { Session } from '../session/session.model';
import { ISession } from '../session/session.interface';
import { Performance } from '../performance/performance.model';
import { Homework } from '../homework/homework.model';
import { Submission } from '../submission/submission.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { PerformanceService } from '../performance/performance.service';
import { PERFORMANCE_TOPIC } from '../../../enums/performance';
import { Course } from '../course/course.model';
import { Package } from '../package/package.model';
import { stripe } from '../../../config/stripe';
import { sendNotifications } from '../../../helpers/notificationHelper';

const createUserToDB = async (
  payload: Partial<IUser & { packageId: string }>
) => {
  if (payload.role == USER_ROLES.GUEST) {
    const user = await User.create({
      ...payload,
      role: USER_ROLES.GUEST,
      status: 'active',
      verified: true,
      profileImage: null,
    });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    const packageData = await Package.findById(payload.packageId);

    // if (payload.packageId) {
    //   await SubscriptionService.createSubscriptionInDb(
    //     user._id.toString(),
    //     payload.packageId
    //   );
    // }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: packageData?.price_id,
          quantity: 1,
        },
      ],
      success_url: `${config.url.frontend_url}/success`,
      cancel_url: `${config.url.frontend_url}/cancel`,
      customer_email: user.email,
      metadata:{
        packageId: payload.packageId!
      }

      // its will be expire after 30 days
      // expires_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    });

    return checkoutSession.url;
  }
    payload.verified = true;
  const createUser = await User.create({
    ...payload,
    verified:true
  });
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  await sendNotifications({
    title:`You are successfully registered as a ${payload.role?.toUpperCase()}`,
    body:`Welcome to Elite Academy! We are excited to have you on board.`,
    reciever:[createUser._id],
    path:"user",
    referenceId: createUser._id,
  })


  const emailTamplate = emailTemplate.createAccountData({
    name: payload.name!,
    email: payload.email!,
    password: payload.password!,
    role: payload.role!,
  });

  await emailHelper.sendEmail(emailTamplate)

  
  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findOne({ _id: id }).populate("subscription");
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  for (const key in payload) {
    if (payload[key as keyof IUser] === "undefined") {
      delete payload[key as keyof IUser];
    }
  }
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const profileAnalatycs = async (user: JwtPayload) => {
  const { id } = user;
  // console.log(id);

  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const courses = await Enroll.find({ user: id }).lean();

  let totalSessions = (
    await Promise.all(
      courses.map(async course => {
        const sessions = await Session.find({ course: course.course }).lean();
        return sessions;
      })
    )
  ).flat();

  const myAttandednes = await Performance.find({
    user: id,
    atandance: true,
  }).lean();

  const myAttandednesPercentage =
    (myAttandednes.length / totalSessions.length) * 100;

  const totalHomeWork = (
    await Promise.all(
      courses.map(async course => {
        const homework = await Homework.countDocuments({
          course: course.course,
        }).lean();
        return homework;
      })
    )
  ).reduce((a, b) => a + b, 0);
  // console.log(totalHomeWork);

  const mySubmission = await Submission.find({ student: id }).lean();

  const mySubmissionPercentage = (mySubmission.length / totalHomeWork) * 100;
  const totalPerformanceAmount =
    totalSessions.length * PerformanceService.calculateAvarageScore();
  const myPerformanceAmount = await Performance.aggregate([
    {
      $match: {
        user: isExistUser._id,
      },
    },
    {
      $unwind: '$performance',
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$performance.score' },
      },
    },
  ]);
  const myPerformanceAmountPercentage =
    (myPerformanceAmount[0]?.total / totalPerformanceAmount) * 100;

  const overView = {
    attandance:!isNaN(myAttandednesPercentage)? myAttandednesPercentage.toFixed(0) + '%':"0%",
    homework:isNaN(mySubmissionPercentage)? "0%":mySubmissionPercentage.toFixed(0) + '%',
    activity:isNaN(myPerformanceAmountPercentage)? "0%":myPerformanceAmountPercentage.toFixed(0) + '%',
  };

  const myPerformance = await Promise.all(
    totalSessions.map(async (session, idx) => {
      // console.log(session);

      const performance = await Performance.findOne({
        user: id,
        session: session._id,
      }).lean();
      const performanceData = PerformanceService.calculateAvarageScore(
        performance?.performance
      );
      const homeWork = await Submission.findOne({
        student: id,
        session: session._id,
      }).lean();

      if (performance) {
        return {
          session: idx + 1,
          performance: performanceData.toFixed(0) + '%',
          date: (session as any).createdAt,
          attandance: performance.atandance,
          homework: homeWork ? homeWork._id : false,
        };
      }
      return {
        session: idx + 1,
        performance: 0 + '%',
        date: (session as any).createdAt,
        attandance: false,
        homework: homeWork ? homeWork._id : false,
      };
    })
  );

  const allActivityAmount = { ...PERFORMANCE_TOPIC } as any;

  for (let topic in PERFORMANCE_TOPIC) {
    allActivityAmount[topic as keyof typeof PERFORMANCE_TOPIC] =
      totalSessions.length * 100;
  }

  const performanceResult = await Performance.aggregate([
    {
      $match: {
        user: isExistUser._id,
      },
    },
    {
      $unwind: '$performance',
    },
    {
      $group: {
        _id: '$performance.topic',
        total: { $sum: '$performance.score' },
      },
    },
  ]);

  for (let result of performanceResult) {
    allActivityAmount[result._id as keyof typeof allActivityAmount] =
      (
        (((result?.total ?? 0) /
          allActivityAmount[
            result._id as keyof typeof allActivityAmount
          ]) as number) * 100
      ).toFixed(0) + '%';
  }

  return {
    user: isExistUser,
    overView,
    performanceOverView: allActivityAmount,
    myPerformance,
  };
};

const userListForAdmin = async (query: Record<string, unknown>) => {
  const filterQuery = query.subscriber=='Subscribed User' ? {subscription:{ $exists: true, $ne: null}} : query.subscriber=='Normal User' ? {subscription:{ $exists: false}} : {};
  delete query.subscriber;
  for(const key in query){
    if(['undefined',''].includes(query[key] as string)){
      delete query[key];
    }
  }
  const UserQuery = new QueryBuilder(User.find(filterQuery), query)
    .filter()
    .search(['name', 'email', 'contact', 'employeeId', 'studentId'])
    .sort()
    .paginate();

  const [users, pagination] = await Promise.all([
    UserQuery.modelQuery.populate([{
      path: 'subscription',
      select:"package",
      populate: {
        path: 'package',
        select: 'name',
      }
    }]).lean(),
    UserQuery.getPaginationInfo(),
  ]);
  // await User.updateMany({},{contact:"01883847915"})
  return {
    users:query.role== USER_ROLES.MEMBER ?await Promise.all(users.map(async (user:any)=>{
      const overview = await profileAnalatycs({id:user._id})
      return {...user,overview:overview.overView,position:user?.ground_role??"Striker"}
    })) : users,
    pagination,
  };
};

const couchProfileAnalatycsFromDB = async (user: JwtPayload) => {
  const isExistUser = await User.findById(user.id).lean();
  if (!isExistUser) throw new Error('User not found');
  const currentCourse = await Course.countDocuments({
    couch: isExistUser._id,
    endDate: { $gt: new Date() },
  });
  const allCourses = await Course.find({ couch: isExistUser._id }).lean();

  let totalStudents = 0;
  for (const course of allCourses) {
    totalStudents += await Enroll.countDocuments({ course: course._id });
  }

  const overView = {
    currentCourse,
    totalCourse: allCourses.length,
    totalStudents,
  };

  return {
    overView,
  };
};

const lockUnlockUserIntoDb = async (userId: string) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(404, 'User not found');
  const userData = await User.findByIdAndUpdate(userId, {
    status: user?.status == 'active' ? 'delete' : 'active',
  },{new:true});
  let message = userData?.status == 'active' ? 'User unlocked successfully' : 'User locked successfully';
  return {
    message,
    userData
  };
};

const addAdminintoDB = async (payload: IUser) => {
  payload.verified = true;
  const user = await User.create(payload);
  return user;
};

const studentInfo = async (userId: string) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(404, 'User not found');
  const profileData = await profileAnalatycs({id:user._id})
  return {
    _id:user._id,
    studentId:user.studentId,
    name:user.name,
    image:user.image,
    position:user.ground_role??"Striker",
    homework:profileData.overView.homework,
    attantance:profileData?.overView?.attandance,
    performance:profileData?.overView?.activity,
    
  }
}

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  profileAnalatycs,
  userListForAdmin,
  couchProfileAnalatycsFromDB,
  lockUnlockUserIntoDb,
  addAdminintoDB,
  studentInfo
};
