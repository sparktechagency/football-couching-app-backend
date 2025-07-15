import { Model, Types } from "mongoose";
import { ORDER_STATUS } from "../../../enums/order";

export type IOrder = {
    user: Types.ObjectId;
    address: string;
    phone?: string;
    code ?: string;
    paymentStatus:"paid" | "unpaid";
    status: ORDER_STATUS
    totalPrice: number;
    deliveryCharge: number;
}

export type IOrderItem = {
    product: Types.ObjectId;
    name?: string;
    image?: string;
    size: string[];
    price: number;
    quantity: number;
    order: Types.ObjectId;
}

export type OrderModel = Model<IOrder, Record<string, unknown>>;
export type OrderItemModel = Model<IOrderItem, Record<string, unknown>>;

