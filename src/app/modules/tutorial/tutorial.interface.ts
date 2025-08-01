import { Model, Types } from "mongoose"

export type ITutorial = {
    course?:Types.ObjectId;
    title:string;
    description:string
    video:string;
    topic?:Types.ObjectId;
    thumbnail?:string;
}

export type TutorialModel = Model<ITutorial,Record<string,unknown>>