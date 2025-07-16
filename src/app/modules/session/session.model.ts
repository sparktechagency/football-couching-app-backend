import { model, Schema } from "mongoose";
import { ISession, SessionModal } from "./session.interface";

const sessionSchema = new Schema<ISession, SessionModal>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

export const Session = model<ISession, SessionModal>('Session', sessionSchema);