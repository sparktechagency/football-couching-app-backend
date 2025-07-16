import mongoose from "mongoose";
import { ITutorial, TutorialModel } from "./tutorial.interface";

const tutorialSchema = new mongoose.Schema<ITutorial,TutorialModel>({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    }
},{
    timestamps:true,
})

export const Tutorial = mongoose.model<ITutorial,TutorialModel>("Tutorial",tutorialSchema)