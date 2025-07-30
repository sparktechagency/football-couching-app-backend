import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SupportService } from "./support.service";
import sendResponse from "../../../shared/sendResponse";

const createSupport = catchAsync(async (req:Request,res:Response)=>{
    console.log(req.body);
    
    const result = await SupportService.createSupportIntoDB(req.body);

    sendResponse(res,{
        statusCode:200,
        message:"Support created successfully",
        data:result,
        success:true
    })
})


const getSupportMessages = catchAsync(async (req:Request,res:Response)=>{
    const result = await SupportService.getAllSupportMessage(req.query);

    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Support messages fetched successfully",
        pagination:result.pagination,
        data:result,
    })
})


export const SupportController = {
    createSupport,
    getSupportMessages
}