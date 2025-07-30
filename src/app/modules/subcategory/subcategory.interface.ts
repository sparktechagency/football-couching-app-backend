import { Model, Types } from "mongoose";

export type ISubCategory = {
  name: string;
  category: Types.ObjectId;
}

export type SubCategoryModel = Model<ISubCategory, Record<string, unknown>>;