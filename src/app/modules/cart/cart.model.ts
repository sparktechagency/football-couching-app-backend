import mongoose, { Schema } from "mongoose";
import { CartModel, ICart } from "./cart.interface";

const cartSchema = new Schema<ICart,CartModel>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart, CartModel>("Cart", cartSchema);