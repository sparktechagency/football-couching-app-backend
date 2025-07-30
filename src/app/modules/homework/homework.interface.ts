import { Model, Types } from "mongoose";

export type IHomework = {
    course: Types.ObjectId;
    session: Types.ObjectId;
    title: string;
    description: string;
    couch : Types.ObjectId;
    deadline?:Date;
}

export type HomeworkModel = Model<IHomework, Record<string, any>>;