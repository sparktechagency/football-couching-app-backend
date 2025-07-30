import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { HomeworkService } from "./homework.service"
import sendResponse from "../../../shared/sendResponse"

const createHomeWork = catchAsync(async (req:Request,res:Response)=>{
    const result = await HomeworkService.createHomeWorkToDb(req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'Homework created successfully',
        data:result
    })
})

const getAllHomeWork = catchAsync(async (req:Request,res:Response)=>{
    const result = await HomeworkService.getAllHomeWorkToDb(req.query,req.user)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'Homework fetched successfully',
        data:result.data,
        pagination:result.meta
    })
})


const getSingleHomeWork = catchAsync(async (req:Request,res:Response)=>{
    const result = await HomeworkService.getSingleHomeWork(req.params.id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'Homework fetched successfully',
        data:result
    })
})
const updateHomeWork = catchAsync(async (req:Request,res:Response)=>{
    const result = await HomeworkService.updateHomeWorkToDb(req.params.id,req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'Homework updated successfully',
        data:result
    })
})
const deleteHomeWork = catchAsync(async (req:Request,res:Response)=>{
    const result = await HomeworkService.deleteHomeWorkToDb(req.params.id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'Homework deleted successfully',
        data:result
    })
})
export const HomeworkController = {
    createHomeWork,
    getAllHomeWork,
    getSingleHomeWork,
    updateHomeWork,
    deleteHomeWork
}