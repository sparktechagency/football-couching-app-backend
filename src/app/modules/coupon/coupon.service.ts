import { JwtPayload } from "jsonwebtoken"
import { ICoupon } from "./coupon.interface"
import { Coupon } from "./coupon.model"
import mongoose from "mongoose"
import { stripe } from "../../../config/stripe"

const createCouponIntoDB = async(payload:ICoupon):Promise<ICoupon | null>=>{
   const coupon = await stripe.coupons.create({
        percent_off:payload.discount,
        duration:"once",
        name:payload.name
    })
    const result = await Coupon.create({
        code:coupon.id,
        discount:payload.discount,
        expiry:payload.expiry,
        users:[],
        name:payload.name
    })
    return result
}

const getAllCouponFromDB = async()=>{
    const result = await Coupon.find({}).sort({"createdAt":-1})
    return result
}

const checkCouponFromDB = async(code:string,user:JwtPayload)=>{
    const result = await Coupon.findOne({code})
    if(!result){
        throw new Error("Coupon not found")
    }
    if(result?.users?.includes(new mongoose.Types.ObjectId(user.id))){
        throw new Error("You already used this coupon")
    }
    if(result.expiry < new Date()){
        throw new Error("Coupon expired")
    }
    return {
        discount:result.discount,
        expiry:result.expiry,
        code:result.code
    }
}

const couponDeleteFromDB = async(id:string)=>{
    const result = await Coupon.findByIdAndDelete(id)
    return result
}

const updateCouponFromDB = async(id:string,payload:ICoupon)=>{
    const result = await Coupon.findByIdAndUpdate(id,payload,{new:true})
    return result
}

export const CouponService = {
    createCouponIntoDB,
    getAllCouponFromDB,
    checkCouponFromDB,
    couponDeleteFromDB,
    updateCouponFromDB
}