import { Model, Types } from "mongoose"
import { PERFORMANCE_TOPIC } from "../../../enums/performance";

export type IPerformance = {
    user:Types.ObjectId;
    session : Types.ObjectId;
    course : Types.ObjectId;
    atandance?:boolean;
    performance?: IPerformanceTopic[];
    avarageScore?:number;
}

export type IPerformanceTopic = {
    topic: PERFORMANCE_TOPIC;
    score: number;
}



export type PerformanceTopicModel = Model<IPerformanceTopic, Record<string, unknown>>
export type PerformanceModel = Model<IPerformance, Record<string, unknown>>