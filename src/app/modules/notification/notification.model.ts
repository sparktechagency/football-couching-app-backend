import mongoose from "mongoose";
import { INotification, NotifcationModel } from "./notification.interface";

const notificationSchema = new mongoose.Schema<INotification,NotifcationModel>({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    reciever: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    seener: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    path: {
        type: String,
        required: false,
        enum:["order","user","support","session"]
    },
    referenceId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    }

},{
    timestamps: true,
})

export const Notification = mongoose.model<INotification,NotifcationModel>("Notification", notificationSchema);