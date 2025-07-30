import { Model, Types } from "mongoose"

export type ISubmission = {
    student : Types.ObjectId,
    homework : Types.ObjectId,
    session : Types.ObjectId,
    course : Types.ObjectId,
    video : string,
    statement ?: string,
}

export type SubmissionModel = Model<ISubmission, Record<string, unknown>>

