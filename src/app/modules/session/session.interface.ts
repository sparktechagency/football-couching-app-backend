import { Model, Types } from "mongoose";

export type ISession = {
    course: Types.ObjectId;
    title: string;
    description?: string;
    status: 'active' | 'delete';
    date: Date;
    startTime: Date;
    endTime: Date;
}

export type SessionModal = {
} & Model<ISession, Record<string, unknown>>;