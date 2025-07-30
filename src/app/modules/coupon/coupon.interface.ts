import { Model, Types } from "mongoose";

export type ICoupon = {
    code: string;
    discount: number;
    expiry: Date;
    users ?: Types.ObjectId[];
    name ?: string;
}

export type CouponModel = Model<ICoupon, Record<string, unknown>>;