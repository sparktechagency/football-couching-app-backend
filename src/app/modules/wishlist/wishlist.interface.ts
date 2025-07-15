import { Model, Types } from "mongoose";

export type IWishlist = {
  user: Types.ObjectId;
  product: Types.ObjectId;
};

export type WishlistModel = Model<IWishlist, Record<string, unknown>>;