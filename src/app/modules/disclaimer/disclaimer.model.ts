import mongoose, { Schema } from "mongoose";
import { DisclaimerModel, IDisclaimer } from "./dislcaimer.interface";

const disclaimerSchema = new Schema<IDisclaimer,DisclaimerModel>({
    content:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["about","terms","support","app-support","privacy"],
        required:true
    }
},{
    timestamps:true
})

export const Disclaimer =  mongoose.model<IDisclaimer,DisclaimerModel>("Disclaimer",disclaimerSchema)