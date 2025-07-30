import { JwtPayload } from 'jsonwebtoken';
import { IWishlist } from './wishlist.interface';
import ApiError from '../../../errors/ApiError';
import { Wislist } from './wishlist.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createWishlistToDB = async (user: JwtPayload, payload: IWishlist) => {
  const wishlist = await Wislist.findOne({
    user: user.id,
    product: payload.product,
  });
  let message = ""
  if (wishlist){
    message = "Prdocut removed from wishlist"

    await Wislist.findByIdAndDelete(wishlist._id);
    return {
      message,
      data:false
    };
  }
  const result = await Wislist.create({
    user: user.id,
    product: payload.product,
  });
  message = "Product added to wishlist"
  return {
    message,
    data:true
  };
};

const getWishlistFromDb = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  const WislistQuery = new QueryBuilder(Wislist.find({ user: user.id }), query)
    .paginate()
    .sort();
  const [wishlists, pagination] = await Promise.all([
    WislistQuery.modelQuery.populate('product').lean().exec(),
    WislistQuery.getPaginationInfo(),
  ]);
  return {
    wishlists,
    pagination,
  };
};

const deleteWishlistFromDb = async (
  user: JwtPayload,
  wishlistId: string
) => {
  const wishlist = await Wislist.findOne({
    user: user.id,
    _id: wishlistId,
  });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');
  await Wislist.findByIdAndDelete(wishlistId);
};
export const WishlistService = {
  createWishlistToDB,
  getWishlistFromDb,
  deleteWishlistFromDb,
};
