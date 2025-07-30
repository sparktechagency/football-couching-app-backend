import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PackageService } from "./package.service";
import sendResponse from "../../../shared/sendResponse";
import { IPackage } from "./package.interface";
import { StatusCodes } from "http-status-codes";

const creeatePackage = catchAsync(async (req: Request, res: Response) => {
  const { ...packageData } = req.body;
  const result = await PackageService.createPackageToDB(packageData);
  sendResponse<IPackage>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package created successfully',
    data: result,
  });
});
const getAllPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getAllPackageFromDB();
  sendResponse<IPackage[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package retrieved successfully',
    data: result,
  });
});
const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...packageData } = req.body;
  const result = await PackageService.updatePackageToDB(id, packageData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package updated successfully',
    data: result,
  });
});
const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.deletePackageToDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package deleted successfully',
    data: result,
  });
});

export const PackageController = {
  creeatePackage,
  getAllPackage,
  updatePackage,
  deletePackage,
};