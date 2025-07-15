import { Model } from "mongoose";
import { CATEGORY_TYPE } from "../../../enums/category";

export type ICategory = {
    title: string;
    image: string;
    type:CATEGORY_TYPE
    status:"active"|"deleted"
}

export type CategoryModel = Model<ICategory, Record<string, any>>;