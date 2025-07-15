import { model, Schema } from "mongoose";
import { IOrder, IOrderItem, OrderItemModel, OrderModel } from "./order.interface";
import { ORDER_STATUS } from "../../../enums/order";

const orderItemSchema = new Schema<IOrderItem,OrderItemModel>({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    size: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    }
});

const OrderSchema = new Schema<IOrder, OrderModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    code: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    status: {
        type: String,
        enum:Object.values(ORDER_STATUS),
        default: ORDER_STATUS.PENDING,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
})

export const Order = model<IOrder, OrderModel>("Order", OrderSchema);
export const OrderItem = model<IOrderItem, OrderItemModel>("OrderItem", orderItemSchema);