import { Model, Types } from "mongoose";

export type IProduct = {
    title : string;
    description: string;
    price: number;
    category: Types.ObjectId;
    images : string[];
    sizes : string[];
}
export type ProductModel = Model<IProduct, Record<string, any>>;