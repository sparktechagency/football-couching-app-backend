import { model, Schema } from "mongoose";
import { ISubscription, SUbscriptionModel } from "./subscription.interface";

const subscriptionSchema = new Schema<ISubscription,SUbscriptionModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive',
    },
    price:{
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);
export const Subscription = model<ISubscription, SUbscriptionModel>(
  'Subscription',
  subscriptionSchema
);