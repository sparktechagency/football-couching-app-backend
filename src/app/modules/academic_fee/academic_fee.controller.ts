import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AcademicFeeService } from "./academic_fee.service";
import sendResponse from "../../../shared/sendResponse";

const createAcademicFee = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body);
    
  const result = await AcademicFeeService.createAcademicFeeInDb({
    ...req.body,
    member: req.user?.id,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Academic fee created successfully',
    data: result,
  });
});

const getAllAcademicFees = catchAsync(async (req: Request, res: Response) => {

  const result = await AcademicFeeService.getAllAcademicFeeFromDb(req.user,req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic fees retrieved successfully',
    data: result.academicFees,
    pagination: result.pagination,
  });
});


export const AcademicFeeController = {
  createAcademicFee,
  getAllAcademicFees,
};