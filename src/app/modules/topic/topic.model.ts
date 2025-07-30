import mongoose from "mongoose";
import { ITopic, TopicModel } from "./topic.interface";

const topicSchema = new mongoose.Schema<ITopic,TopicModel>({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{
    timestamps:true,
})


export  const Topic = mongoose.model<ITopic,TopicModel>("Topic",topicSchema)