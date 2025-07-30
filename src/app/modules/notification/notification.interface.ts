import { Model, Types } from "mongoose";

export type INotification = {
    title: string;
    body: string;
    reciever:Types.ObjectId[];
    seener?: Types.ObjectId[];
    seen?: boolean;
    path?:"order"|"user" | "support"|"session"
    referenceId?: Types.ObjectId;
}

export type NotifcationModel = Model<INotification>;