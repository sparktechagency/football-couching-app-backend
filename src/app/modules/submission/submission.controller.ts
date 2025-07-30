import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { SubmissionService } from "./submission.service"
import { ISubmission } from "./submission.interface"
import sendResponse from "../../../shared/sendResponse"
import path from "path"
import fs from "fs"
const createSubmit = catchAsync(async (req:Request,res:Response) => {
  const payload = req.body
  payload.student = req.user?.id
    const result = await SubmissionService.createSubmissionInDB(payload)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Submission created successfully",
        data:result
    })
})

const getSubmissionById = catchAsync(async (req:Request,res:Response) => {
    const id = req.params.id
    const result = await SubmissionService.getSubmissionByIdFromDB(id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Submission fetched successfully",
        data:result
    })
})


export const SubmissionController = {
    createSubmit,
    getSubmissionById
}