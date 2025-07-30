import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CouponService } from "./coupon.service";
import sendResponse from "../../../shared/sendResponse";
import { ICoupon } from "./coupon.interface";
import { StatusCodes } from "http-status-codes";

const createCoupon = catchAsync(async (req: Request, res: Response) => {
    const { ...couponData } = req.body;
    const result = await CouponService.createCouponIntoDB(couponData);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Coupon created successfully",
        data: result,
    });
})

const getAllCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.getAllCouponFromDB();
    sendResponse<ICoupon[]>(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Coupon retrieved successfully",
        data: result,
    });
})

const checkCoupon = catchAsync(async (req: Request, res: Response) => {
    const { code } = req.body;
    const result = await CouponService.checkCouponFromDB(code,req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Coupon checked successfully",
        data: result,
    });
})

const couponDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CouponService.couponDeleteFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Coupon deleted successfully",
        data: result,
    });
})

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...couponData } = req.body;
    const result = await CouponService.updateCouponFromDB(id, couponData);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Coupon updated successfully",
        data: result,
    });
})

export const CouponController = {
    createCoupon,
    getAllCoupon,
    checkCoupon,
    couponDelete,
    updateCoupon
}