import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { DisclaimerService } from "./disclaimer.service"
import { StatusCodes } from "http-status-codes"

const createDisclaimer = catchAsync(async (req:Request,res:Response) => {
    const {content,type} = req.body
    const result = await DisclaimerService.createDisclaimerToDB({content,type})
    sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:"Disclaimer created successfully",
        data:result
    })
})

const getAllDisclaimer = catchAsync(async (req:Request,res:Response) => {
    const {type} = req.query
    const result = await DisclaimerService.getAllDisclaimer(type as any as string)
    sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:"Disclaimer fetched successfully",
        data:result
    })
})

export const DisclaimerController = {
    createDisclaimer,
    getAllDisclaimer
}