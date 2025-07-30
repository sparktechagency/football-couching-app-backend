import { Model } from "mongoose";
import { CATEGORY_TYPE } from "../../../enums/category";

export type ICategory = {
    title: string;
    image: string;
    status:"active"|"deleted"
}

export type CategoryModel = Model<ICategory, Record<string, any>>;