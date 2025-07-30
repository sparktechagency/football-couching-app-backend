import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const profileAnalatycs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.profileAnalatycs(user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile analatics retrieved successfully',
      data: result,
    })})

const getCouchAnalatycs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await UserService.couchProfileAnalatycsFromDB(user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile analatics retrieved successfully',
      data: result,
    })
  }
)

const lockUnlockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserService.lockUnlockUserIntoDb(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile analatics retrieved successfully',
      data: result,
    })
  }
)

const userListForAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.userListForAdmin(req.query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User get successfully',
      pagination: result.pagination,
      data: result.users,
    })
  }
)

const addAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.addAdminintoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admin Added successfully',
      data: result,
    })
  }
)

const getStudentInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.studentInfo(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Student Info retrieved successfully',
      data: result,
    })
  }
)
export const UserController = { createUser, getUserProfile, updateProfile,profileAnalatycs,getCouchAnalatycs,lockUnlockUser, userListForAdmin, addAdmin,getStudentInfo};
