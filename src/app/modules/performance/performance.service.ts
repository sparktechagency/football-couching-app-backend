import { object } from 'zod';
import { IPerformance, IPerformanceTopic } from './performance.interface';
import { Performance } from './performance.model';
import { PERFORMANCE_TOPIC } from '../../../enums/performance';
import { Session } from '../session/session.model';
import ApiError from '../../../errors/ApiError';
import { Enroll } from '../enroll/enroll.model';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { Submission } from '../submission/submission.model';

const createPerformanceIntoDb = async (
  payload: IPerformance
): Promise<IPerformance | null> => {
    const session = await Session.findById(payload.session);
    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

  const isExist = await Performance.findOne({
    user: payload.user,
    session: payload.session,
  });
  if (isExist) {
    await Performance.findByIdAndUpdate(isExist._id, {
        ...payload,
        atandance:isExist.atandance?false:true,
    },{new: true});
    return isExist;
  }
  payload.course = session.course;
  const result = await Performance.create(payload);
  
  return result;
};

const giveMarks = async (payload: IPerformance) => {
  const performance = await Performance.findOne({user:payload.user, session: payload.session});
  if (!performance) {
    const session = await Session.findById(payload.session);
    if (!session) {
      throw new ApiError(404, 'Session not found');
    }
    payload.course = session.course;
    return Performance.create(payload);
  }
  return await Performance.findByIdAndUpdate(performance._id, {
    ...payload,
  },{new:true})
  
}

function calculateAvarageScore(performance?: IPerformanceTopic[]) {
    const totalTopicPrice = Object.keys(PERFORMANCE_TOPIC).length * 100
    if(!performance) return totalTopicPrice
    const totalScore = performance.reduce((acc,curr)=>{
        return acc + curr.score
    },0)
    const avarageScore = (totalScore/totalTopicPrice) * 100
    return avarageScore
 
}

const getPerformanceOfUser = async (user:string,session:string) => {
  const result = await Performance.findOne({ user: user, session: session }).lean()
  return result?.performance||[];
    
}

const getStudentListOFCourse = async (sessionId:string)=>{
    const session = await Session.findById(sessionId).lean()
    if(!session) throw new ApiError(404,"Session not found")
    const course = session.course
    const studentsLean = await Enroll.find({course}).populate("user").lean()
    const students = studentsLean.map(async (student)=>{
        const user = student.user as any as IUser
        const performanceList = (await Performance.findOne({user:(user as any)._id,session:sessionId}).lean())
        const atandance = performanceList?.atandance?true:false
        const performance = performanceList?.performance?.length?calculateAvarageScore(performanceList?.performance).toFixed(0)+"%":"Review Session"
        const homework = await Submission.findOne({student:(user as any)?._id,session:session}).lean()
        return {
            _id : (user as any)._id,
            image : user.image,
            name : user.name,
            performance,
            atandance,
            homework : homework?._id??null,
        }
    })

    return await Promise.all(students)
}


const getStudentPerformance = async (studentId:string,sessionId:string)=>{
    const studentDetails = await User.findById(studentId).lean()
    if(!studentDetails) throw new ApiError(404,"Student not found")
    const session = await Session.findById(sessionId).lean()
    const course = session?.course
    const currentDate = new Date()
    const allSession = await Session.countDocuments({course,createdAt:{
        $lte:currentDate
    }}).lean()
    
    const attandance = await Performance.countDocuments({user:studentId,session:sessionId,atandance:true,createdAt:{
        $lte:currentDate
    }}).lean()

    const avarageAttandance = ((attandance/allSession) * 100).toFixed(0) + "%"

    const score = calculateAvarageScore() * allSession

    const performanceScore = await Performance.aggregate([
        {
            $match:{
                user:studentDetails._id,
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
    const avarageScore = ((performanceScore[0]?.totalScore/score) * 100).toFixed(0) + "%"
    const overView = {
        attandance:`${attandance}/${allSession}`,
        avarageAttandance:avarageAttandance,
        avarageActivity:avarageScore,
    }

    const allPerformance = await Performance.find({user:studentId,session:sessionId}).populate("session","createdAt").lean()
    const modiefiedData = allPerformance.map((performance,index)=>{
        const calculate = calculateAvarageScore(performance.performance).toFixed(0)
        return {
            _id:performance._id,
            class:index+1,
            attandance:performance.atandance,
            performance:calculate+"%",
            date:(performance as any).session.createdAt
        }
    })
    return {
        user:{
            _id:studentDetails._id,
            image:studentDetails.image,
            name:studentDetails.name
        },
        overView,
        performance:modiefiedData
    }
}




export const PerformanceService = {
  createPerformanceIntoDb,
  getStudentListOFCourse,
  getStudentPerformance,
  calculateAvarageScore,
  getPerformanceOfUser,
  giveMarks
};