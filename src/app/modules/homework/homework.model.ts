import mongoose, { Schema } from "mongoose";
import { HomeworkModel, IHomework } from "./homework.interface";

const homeworkSchema = new Schema<IHomework,HomeworkModel>({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    couch : { type: Schema.Types.ObjectId, ref: "User", required: true },
    deadline: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

export const Homework = mongoose.model<IHomework, HomeworkModel>("Homework", homeworkSchema);