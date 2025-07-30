import mongoose from "mongoose";
import { ITutorial, TutorialModel } from "./tutorial.interface";

const tutorialSchema = new mongoose.Schema<ITutorial,TutorialModel>({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    video:{
        type:String,
        required:true
    },
    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Topic"
    },

    thumbnail:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2021/10/09/12/45/play-button-6694068_640.png"
    }

},{
    timestamps:true,
})

export const Tutorial = mongoose.model<ITutorial,TutorialModel>("Tutorial",tutorialSchema)