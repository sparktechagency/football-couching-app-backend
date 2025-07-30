import { Model, Types } from "mongoose";

export type IProduct = {
    title : string;
    description: string;
    subcategory: Types.ObjectId;
    price: number;
    category: Types.ObjectId;
    images : string[];
    sizes : string[];
    quantity?: number;
}
export type ProductModel = Model<IProduct, Record<string, any>>;