import ApiError from "../../../errors/ApiError"
import unlinkFile from "../../../shared/unlinkFile"
import { Homework } from "../homework/homework.model"
import { Session } from "../session/session.model"
import { ISubmission } from "./submission.interface"
import { Submission } from "./submission.model"

const createSubmissionInDB = async (payload:ISubmission):Promise<ISubmission | null> => {
    console.log(JSON.parse(payload.video
    ));
    
    const homework = await Homework.findById(payload.homework)
    if(!homework){
        throw new ApiError(404,"Homework not found")
    }

    if(homework?.deadline&& homework.deadline>new Date()){
        throw new ApiError(400,"Deadline has not passed")
    }

    const isExist = await Submission.findOne({student:payload.student,homework:payload.homework}).lean()
    if(isExist){
       try {
         await Submission.findByIdAndDelete(isExist._id)
        unlinkFile(`${isExist.video}`)
       } catch (error) {
        console.log(error);
        
       }
    }
    
    const result = await Submission.create({
        ...payload,
        course:homework.course,
        session:homework.session
    })
    return result
}

const getSubmissionByIdFromDB = async(id:string):Promise<ISubmission | null> => {
    const result = await Submission.findById(id).populate([{
        path:"student",
        select:"name image _id"
    },
    {
        path:"homework",
        select:"title description",
    }
])
    return result
}

export const SubmissionService = {
    createSubmissionInDB,
    getSubmissionByIdFromDB
}