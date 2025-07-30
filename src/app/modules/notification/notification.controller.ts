import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { NotificationService } from "./notification.service";
import sendResponse from "../../../shared/sendResponse";

const getNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.getAllNotificationFromDB(req.query,req.user);
    sendResponse(res,{
        message: "Notifications fetched successfully",
        data: result.data,
        statusCode:200,
        success: true,
        pagination:result.pagination
    })
})


const readNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.readNotification(req.params.id,req.user);
    sendResponse(res,{
        message: "Notification read successfully",
        data: result,
        statusCode:200,
        success: true,
    })
})

const readAllNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.readAllNotification(req.user);
    sendResponse(res,{
        message: "All Notification read successfully",
        data: result,
        statusCode:200,
        success: true,
    })
})

export const NotificationController = {
    getNotifications,
    readNotification,
    readAllNotification
}