import { model, Schema } from "mongoose";
import { IPerformance, IPerformanceTopic, PerformanceModel, PerformanceTopicModel } from "./performance.interface";
import { PERFORMANCE_TOPIC } from "../../../enums/performance";

const performanceSchema = new Schema<IPerformance, PerformanceModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    atandance: {
      type: Boolean,
      required: false,
      default: false,
    },
    performance: [
      {
        topic: {
          type: String,
          enum: PERFORMANCE_TOPIC,
          required: false,
        },
        score: {
          type: Number,
          required: false,
        },
      },
    ]
  },
  {
    timestamps: true,
  }
);
export const Performance = model<IPerformance, PerformanceModel>(
  'Performance',
  performanceSchema
);

