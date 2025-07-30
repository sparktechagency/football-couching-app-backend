import { Model } from "mongoose";

export type ITopic = {
    title:string;
    image:string;
}

export type TopicModel = Model<ITopic,Record<string,unknown>>