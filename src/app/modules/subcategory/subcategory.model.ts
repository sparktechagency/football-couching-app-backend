import { model, Schema } from "mongoose";
import { ISubCategory, SubCategoryModel } from "./subcategory.interface";
import { SUbscriptionModel } from "../subscription/subscription.interface";

const subcategorySchema = new Schema<ISubCategory,SubCategoryModel>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

export const Subcategory = model<ISubCategory,SubCategoryModel>("Subcategory", subcategorySchema);