import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { EnrollService } from "./enroll.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createEnroll = catchAsync(async (req: Request, res: Response) => {
  const { ...enrollData } = req.body;
  const result = await EnrollService.createEnrollIntoDB(enrollData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Enroll created successfully",
    data: result,
  });
});
const getAllEnroll = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollService.getAllEnrollFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Enroll retrieved successfully",
    data: result,
  });
});
const updateEnroll = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...enrollData } = req.body;
  const result = await EnrollService.updateEnrollDB(id, enrollData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Enroll updated successfully",
    data: result,
  });
});
const deleteEnroll = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EnrollService.deleteEnrollDb(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Enroll deleted successfully",
    data: result,
  });
});
const getStudentBasedOnCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EnrollService.getStudentBasedOnCourse(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Enroll retrieved successfully",
    data: result,
  });
});
export const EnrollController = {
  createEnroll,
  getAllEnroll,
  updateEnroll,
  deleteEnroll,
  getStudentBasedOnCourse
};