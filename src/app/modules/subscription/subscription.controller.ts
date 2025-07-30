import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";

const getUserSubsctiption = catchAsync(async (req:Request,res:Response)=>{
    const user = req.user;
    const result = await SubscriptionService.getUserSubscriptionFromTheDB(user)
    sendResponse(res,{
        statusCode:200,
        message:"User subscription fetched successfully",
        data:result,
        success:true
    })
})


export const SubscriptionController = {
    getUserSubsctiption
}