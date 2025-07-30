import mongoose, { Schema } from "mongoose";
import { IProduct, ProductModel } from "./product.interface";

const productSchema = new Schema<IProduct,ProductModel>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct, ProductModel>("Product", productSchema);