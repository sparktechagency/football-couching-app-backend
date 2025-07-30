import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { CartService } from "./cart.service"
import sendResponse from "../../../shared/sendResponse"

const createCart = catchAsync(async (req:Request,res:Response)=>{
    const user = req.user
    const result = await CartService.createCartinToDB({...req.body,user:user.id})
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Cart created successfully",
        data:result
    })
})

const getCart = catchAsync(async (req:Request,res:Response)=>{
    const user = req.user
    const result = await CartService.getCartFromDB(user)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Cart fetched successfully",
        data:result
    })
})

const deleteCart = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params
    const result = await CartService.deleteCartFromDB(id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Cart deleted successfully",
        data:result
    })
})
const increaseCartQuantity = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params
    const result = await CartService.increaseCartQuantity(id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Cart quantity increased successfully",
        data:result
    })
})
const decreaseCartQuantity = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params
    const result = await CartService.decreaseCartQuantity(id)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Cart quantity decreased successfully",
        data:result
    })
})

const getCheckoutData = catchAsync(async (req:Request,res:Response)=>{
    const user = req.user
    const result = await CartService.checkOutDataOfUserFromDB(user)
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Checkout data fetched successfully",
        data:result
    })
})
export const CartController = {
    createCart,
    getCart,
    deleteCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    getCheckoutData
}