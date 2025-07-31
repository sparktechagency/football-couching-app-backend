import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { getMultipleFilesPath } from "../../../shared/getFilePath"
import { ProductService } from "./product.service"
import sendResponse from "../../../shared/sendResponse"

const createProduct = catchAsync(async (req:Request,res:Response)=>{
    const image = getMultipleFilesPath(req.files,"image")
    req.body.images = image
    if(req.body.sizes){
        req.body.sizes = JSON.parse(req.body.sizes)
    }
    console.log(req.body);
    
    const result = await ProductService.createProductToDB(req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Product created successfully",
        data:result
    })
})

const updateProduct = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params;
    const image = getMultipleFilesPath(req.files,"image")
    req.body.images = image
    console.log(req.body);
    
    if(req.body.sizes){
        req.body.sizes = JSON.parse(req.body.sizes)
    }
    // console.log(req.body);
    
    const result = await ProductService.updateProductToDb(id,req.body)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Product updated successfully",
        data:result
    })
})
const deleteProduct = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await ProductService.deleteProductToDb(id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Product deleted successfully",
        data:result
    })
})
const getAllProduct = catchAsync(async (req:Request,res:Response)=>{
    const result = await ProductService.getAllProductToDb(req.query,req.user)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Product fetched successfully",
        data:result.products,
        pagination:result.pagination
    })
})

const getSingleProduct = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await ProductService.getSingleProduct(id,req.user)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Product fetched successfully",
        data:result
    })
})


export const ProductController = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getSingleProduct
}