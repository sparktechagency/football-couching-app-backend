import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { WishlistService } from "./wishlist.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await WishlistService.createWishlistToDB(user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Wishlist created successfully',
    data: result,
  });
});

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const query = req.query;
  const result = await WishlistService.getWishlistFromDb(user, query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Wishlist fetched successfully',
    data: result.wishlists,
    pagination: result.pagination,
  });
});
const deleteWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const wishlistId = req.params.id;
  await WishlistService.deleteWishlistFromDb(user, wishlistId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Wishlist deleted successfully',
  });
});
export const WishlistController = {
  createWishlist,
  getWishlist,
  deleteWishlist,
};
