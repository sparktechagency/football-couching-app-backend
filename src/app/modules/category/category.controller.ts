import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CategoryService } from "./category.service";
import sendResponse from "../../../shared/sendResponse";
import { getSingleFilePath } from "../../../shared/getFilePath";

const createCategory = catchAsync(async (req:Request,res:Response)=>{
    const image = getSingleFilePath(req.files,"image")
    req.body.image = image
    const result = await CategoryService.createCategoryToDB(req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Category created successfully",
        data:result
    })
})

const updateCategory = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params;
    const image = getSingleFilePath(req.files,"image")
    req.body.image = image
    const result = await CategoryService.updateCategoryToDB(id,req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Category updated successfully",
        data:result
    })
})

const deleteCategory = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await CategoryService.deleteCategoryToDB(id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Category deleted successfully",
        data:result
    })
})

const getAllCategory = catchAsync(async (req:Request,res:Response)=>{

    const result = await CategoryService.getAllCategoryToDB(req.query)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Category fetched successfully",
        data:result.categorys,
        pagination:result.pagination
    })
})

export const CategoryController = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory
}