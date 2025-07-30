import { Model, Types } from "mongoose";

export type ICart = {
    user: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    size: string;
}

export type CartModel = Model<ICart, Record<string, any>>;