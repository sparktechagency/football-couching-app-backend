import { model, Schema } from "mongoose";
import { EnrollModel, IEnroll } from "./enroll.interface";

const enrollSchema = new Schema<IEnroll, EnrollModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  couch: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Enroll = model<IEnroll, EnrollModel>("Enroll", enrollSchema);