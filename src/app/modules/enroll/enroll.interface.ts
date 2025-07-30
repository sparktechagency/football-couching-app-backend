import { Model, Types } from "mongoose";

export type IEnroll = {
    user : Types.ObjectId,
    course : Types.ObjectId,
    couch : Types.ObjectId,
}

export type EnrollModel = Model<IEnroll, Record<string, unknown>>;