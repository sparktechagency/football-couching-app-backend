import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SessionService } from "./session.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import e from "cors";

const createSession = catchAsync(async (req: Request, res: Response) => {
  const { ...sessionData } = req.body;
  const result = await SessionService.createSessionIntoDb(sessionData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Session created successfully",
    data: result,
  });
});

const getAllSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionService.getSessionsFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Sessions fetched successfully",
    data: result.data,
    pagination: result.meta,
  });
});
const updateSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...sessionData } = req.body;
  const result = await SessionService.updateSessionIntoDb(id, sessionData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Session updated successfully",
    data: result,
  });
});
const deleteSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SessionService.deleteSessionFromDb(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Session deleted successfully",
    data: result,
  });
});

const upcommingSessions = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SessionService.upcommingSessions(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Upcomming Sessions fetched successfully",
    data: result,
  });
});

export const SessionController = {
  createSession,
  getAllSessions,
  updateSession,
  deleteSession,
  upcommingSessions,
};