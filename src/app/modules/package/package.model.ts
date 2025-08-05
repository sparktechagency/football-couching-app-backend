import { model, Schema } from "mongoose";
import { IPackage, PackageModel } from "./package.interface";

const packageSchema = new Schema<IPackage, PackageModel>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
    duration: {
      type: String,
      enum: ["month", "year", "week"],
      required: true,
    },
    paymentLink: {
      type: String,
      required: true,
    },
    price_id: {
      type: String,
      required: true,
    },
    product_id:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);


export const Package = model<IPackage, PackageModel>("Package", packageSchema);