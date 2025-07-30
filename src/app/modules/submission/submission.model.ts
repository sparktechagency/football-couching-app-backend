import mongoose, { Schema } from "mongoose";
import { ISubmission, SubmissionModel } from "./submission.interface";

const submissionSchema = new Schema<ISubmission,SubmissionModel>({
    student:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    homework:{
        type:Schema.Types.ObjectId,
        ref:"Homework",
        required:true
    },
    session:{
        type:Schema.Types.ObjectId,
        ref:"Session",
        required:true
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    video:{
        type:String,
        required:true
    },
    statement:{
        type:String
    }
},{
    timestamps:true
})
export const Submission = mongoose.model<ISubmission,SubmissionModel>("Submission",submissionSchema)