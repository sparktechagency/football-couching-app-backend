import { model, Schema } from "mongoose";
import { ISupport, SupportModel } from "./support.interface";

export const supportSchema = new Schema<ISupport, SupportModel>(
  {
    email: {
      type: String,
      required: true,
    },
    opinion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export const Support = model<ISupport, SupportModel>("Support", supportSchema);