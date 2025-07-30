import { model, Schema } from "mongoose";
import { CourseModal, ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse,CourseModal>(
  {
    name: {
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
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    couch: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);

export const Course = model<ICourse, CourseModal>('Course', courseSchema);