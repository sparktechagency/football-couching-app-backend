import { JwtPayload } from "jsonwebtoken"
import QueryBuilder from "../../builder/QueryBuilder"
import { IHomework } from "./homework.interface"
import { Homework } from "./homework.model"
import { USER_ROLES } from "../../../enums/user"
import { Session } from "../session/session.model"
import { Course } from "../course/course.model"

const createHomeWorkToDb = async (payload:IHomework):Promise<IHomework | null>=>{
    const session = await Session.findById(payload.session)
    if(!session) throw new Error('Session not found')
    const course = await Course.findById(session.course)
    if(!course) throw new Error('Course not found')
    if(payload.deadline) {
        const date = new Date(payload.deadline)
        payload.deadline = date.toISOString() as any
    }
    const result = await Homework.create({
        course:session.course,
        session:payload.session,
        title:payload.title,
        description:payload.description,
        couch:course.couch,
        deadline:payload.deadline
    })
    return result
}
const getAllHomeWorkToDb = async (query:Record<string,any>,user:JwtPayload)=>{
    const homeworkQuery = new QueryBuilder(Homework.find([USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN].includes(user.role)?{couch:user.id}:{}),query).filter().search(['title','description']).sort().paginate()
    const [homeworks,pagination] = await Promise.all([
        user.role == USER_ROLES.COUCH?homeworkQuery.modelQuery.lean():homeworkQuery.modelQuery.populate(['couch','course','session']).lean(),
        homeworkQuery.getPaginationInfo()
    ])
    return {
        meta:pagination,
        data:homeworks
    }
}

const getSingleHomeWork = async(sessionId:string)=>{
    const result = await Homework.findOne({session:sessionId}).populate([{
        path:'course',
        select:'name'
    },{
        path:'session',
        select:'title'
    },
    {
        path:'couch',
        select:'name image'

    }])
    return result
}
const updateHomeWorkToDb = async (id:string,payload:Partial<IHomework>)=>{
    const result = await Homework.findByIdAndUpdate(id,payload,{new:true})
    return result
}
const deleteHomeWorkToDb = async (id:string)=>{
    const result = await Homework.findByIdAndDelete(id)
    return result
}
export const HomeworkService = {
    createHomeWorkToDb,
    getAllHomeWorkToDb,
    getSingleHomeWork,
    updateHomeWorkToDb,
    deleteHomeWorkToDb
}