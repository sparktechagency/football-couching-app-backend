import { JwtPayload } from "jsonwebtoken"
import { ICoupon } from "./coupon.interface"
import { Coupon } from "./coupon.model"
import mongoose from "mongoose"
import { stripe } from "../../../config/stripe"
import ApiError from "../../../errors/ApiError"

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
    const exist = await Coupon.findById(id)
    if(!exist){
        throw new ApiError(404,"Coupon not found")
    }
    if(payload.discount && payload.discount !== exist.discount){
        // check if discount is greater than 100
        if(payload.discount > 100){
            throw new ApiError(400,"Discount cannot be greater than 100")
        }

        const coupon = await stripe.coupons.create({
            percent_off:payload.discount,
            duration:"once",
            name:payload.name
        })
        payload.code = coupon.id
    }
    console.log(payload);
    
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