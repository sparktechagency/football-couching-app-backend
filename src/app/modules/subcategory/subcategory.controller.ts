import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { SubCategoryService } from "./subcategory.service"
import sendResponse from "../../../shared/sendResponse"

const getAllSubCategory = catchAsync(async (req:Request,res:Response)=>{
    const result = await SubCategoryService.getAllSubCategoryToDB(req.query,req?.user)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"SubCategory fetched successfully",
        data:result.subCategories,
        pagination:result.pagination
    })
})
const createSubCategory = catchAsync(async (req:Request,res:Response)=>{
    const result = await SubCategoryService.createSubCategoryToDB(req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"SubCategory created successfully",
        data:result
    })
})
const updateSubCategory = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await SubCategoryService.updateSubCategoryToDB(id,req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"SubCategory updated successfully",
        data:result
    })
})

const deleteSubCategory = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await SubCategoryService.deleteSubCategoryToDB(id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"SubCategory deleted successfully",
        data:result
    })
})
export const SubCategoryController = {
    getAllSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
}