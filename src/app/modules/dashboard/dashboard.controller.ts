import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DashboardService } from "./dashboard.service";
import sendResponse from "../../../shared/sendResponse";

const getAnalatycs = catchAsync(async (req:Request,res:Response)=>{
    const result = await DashboardService.analaticsFromDb(req?.query?.year as string,req?.query?.sellYear as string,req?.query?.studentYear as string)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Analatics fetched successfully",
        data:result
    })
})

export const DashboardController = {
    getAnalatycs
}