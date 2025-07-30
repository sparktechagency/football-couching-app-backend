import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import { stripe } from "../../../config/stripe";

const createPackageToDB = async (
  payload: IPackage
) => {
  const product = await stripe.products.create({
    name: payload.name,
  })

  const price = await stripe.prices.create({
    unit_amount: payload.price * 100,
    currency: "usd",
    product: product.id,
    recurring:{
      interval: payload.duration
    }
  })

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
  })

  const result = await Package.create({
    ...payload,
    paymentLink: paymentLink.url,
    price_id: price.id,
  })
  return result;
}

const getAllPackageFromDB = async (): Promise<IPackage[]> => {
  const result = await Package.find({status:"active"});
  return result;
}

const updatePackageToDB = async (
  id: string,
  payload: Partial<IPackage>
): Promise<IPackage | null> => {
  const isExist = await Package.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }
  const result = await Package.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
}
const deletePackageToDB = async (id: string): Promise<IPackage | null> => {
  const isExist = await Package.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }
  const result = await Package.findByIdAndUpdate(
    id,
    { status: "deleted" },
    { new: true }
  );
  return result;
}
export const PackageService = {
  createPackageToDB,
  getAllPackageFromDB,
  updatePackageToDB,
  deletePackageToDB,
};