import mongoose, { Schema } from "mongoose";
import { CategoryModel, ICategory } from "./category.interface";
import { CATEGORY_TYPE } from "../../../enums/category";

const categoryScema = new Schema<ICategory, CategoryModel>(
  {
    title: { type: String, required: true,unique: true },
    image: { type: String, required: true },
    type: { type: String, enum: Object.values(CATEGORY_TYPE), required: true },
    status: { type: String, enum: ["active", "deleted"], default: "active" },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory, CategoryModel>("Category", categoryScema);