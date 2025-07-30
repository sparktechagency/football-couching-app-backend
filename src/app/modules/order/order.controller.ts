import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { OrderService } from "./order.service"
import sendResponse from "../../../shared/sendResponse"
import { StatusCodes } from "http-status-codes"

const getOrders = catchAsync(async (req:Request,res:Response) => {
    const user = req.user
    const query = req.query
    const result = await OrderService.getOrdersFromDb(user,query)
    sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:"Orders fetched successfully",
        data:result.orders,
        pagination:result.pagination
    })
})

const createOrder = catchAsync(async (req:Request,res:Response) => {
    const user = req.user
    const result = await OrderService.createOrderTODb(user,req.body)
    sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:"Order created successfully",
        data:result
    })
})

const changeOrderStatus = catchAsync(async (req:Request,res:Response) => {
    const result = await OrderService.changeOrderStatus(req.params.id,req.body.status)
    sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:"Order status changed successfully",
        data:result
    })
})

const getOrder = catchAsync(async (req:Request,res:Response) => {
    const user = req.user
    const result = await OrderService.getOrderDetailsFromDB(req.params.id)
    sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:"Order fetched successfully",
        data:result
    })
})
export const OrderController = {
    getOrders,
    createOrder,
    changeOrderStatus,
    getOrder
}