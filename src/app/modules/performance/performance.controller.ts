import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PerformanceService } from "./performance.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createPerformance = catchAsync(async (req: Request, res: Response) => {
  req.body.atandance = Boolean(req.body.atandance);

  const result = await PerformanceService.createPerformanceIntoDb({
    ...req.body
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Performance created successfully",
    data: result,
  });
});

const getStudentListOFCourse = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id;
  const result = await PerformanceService.getStudentListOFCourse(sessionId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student list fetched successfully",
    data: result,
  });
});
const getStudentPerformance = catchAsync(async (req: Request, res: Response) => {
  const {user,session} = req.query
  const result = await PerformanceService.getStudentPerformance(
    user as string,
    session as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student performance fetched successfully",
    data: result,
  });
});


const getPerformance = catchAsync(async (req: Request, res: Response) => {
  const {user,session} = req.query
  const result = await PerformanceService.getPerformanceOfUser(user as string, session as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Performance fetched successfully",
    data: result,
  });
})

const giveMarks = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  // body.performance = JSON.parse(body.performance)
  
  
  const result = await PerformanceService.giveMarks(body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Marks given successfully",
    data: result,
  })
})

export const PerformanceController = {
  createPerformance,
  getStudentListOFCourse,
  getStudentPerformance,
  getPerformance,
  giveMarks
}
