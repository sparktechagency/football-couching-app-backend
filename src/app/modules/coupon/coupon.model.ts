import mongoose, { Schema } from "mongoose";
import { CouponModel, ICoupon } from "./coupon.interface";

const couponSchema = new Schema<ICoupon,CouponModel>({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    name: {
        type: String,
        required: true,
    }
},{
    timestamps: true,
})


export const Coupon = mongoose.model<ICoupon, CouponModel>("Coupon", couponSchema);