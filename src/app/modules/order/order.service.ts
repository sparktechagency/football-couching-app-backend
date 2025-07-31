import { JwtPayload } from 'jsonwebtoken';
import { IOrder } from './order.interface';
import { Order, OrderItem } from './order.model';
import { Cart } from '../cart/cart.model';
import ApiError from '../../../errors/ApiError';
import { ORDER_STATUS } from '../../../enums/order';
import { stripe } from '../../../config/stripe';
import config from '../../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { USER_ROLES } from '../../../enums/user';
import mongoose from 'mongoose';
import { CouponService } from '../coupon/coupon.service';
import { Coupon } from '../coupon/coupon.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { sendNotificationToFCM } from '../../../helpers/sendNotificationFCM';

const createOrderTODb = async (user: JwtPayload, payload: IOrder) => {
  const mongooseSession  = await mongoose.startSession();
  mongooseSession.startTransaction();
try {
  
    if (!payload.address)
    throw new ApiError(400, 'Address required');
  const cart = await Cart.find({ user: user.id }).populate('product').lean();
  if (!cart.length) throw new ApiError(400, 'Cart is empty');
  let totalPrice = cart.reduce(
    (acc, item: any) => acc + item.product.price * item.quantity,
    0
  );

  
  const deliveryCharge = 67;
  if(payload.code){
    const couponCode = await CouponService.checkCouponFromDB(payload.code,user);
    if(couponCode){
      totalPrice = totalPrice - (totalPrice * (couponCode.discount / 100));

    }


  }

  const order = (await Order.create({
    user: user.id,
    address: payload.address,
    phone: payload.phone,
    code: payload.code,
    paymentStatus: 'unpaid',
    status: ORDER_STATUS.PENDING,
    totalPrice,
    deliveryCharge,
  }))

  // console.log(cart);

  const orderItems = cart.map((item: any) => {
    return {
      product: item.product.title,
      image: item.product.images[0],
      quantity: item.quantity,
      size: item.size,
      price: item.product?.price,
    };
  });

  

  const line_items = orderItems.map((item: any) => {
    const itemData=  {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product,
        //   images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,

    };
    return itemData
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    discounts: [
      {
        coupon:payload.code,
      },
    ],
    line_items:[
        ...line_items,
        {
            price_data:{
                currency:"usd",
                product_data:{
                    name:"Delivery Charge"
                },
                unit_amount:deliveryCharge*100
            },
          
            quantity:1
        },
    ],
    mode: 'payment',
      success_url: `${config.url.frontend_url}/success`,
      cancel_url: `${config.url.frontend_url}/cancel`,
    metadata: {
      orderId: (order as any)?._id.toString(),
    },
    invoice_creation:{
      enabled:true
    },
    customer_email:user.email,
  });

  if (session.url) {
  await mongooseSession.commitTransaction();
  await mongooseSession.endSession();
    return session.url;
  }
} catch (error) {
  await mongooseSession.abortTransaction();
  await mongooseSession.endSession();
  throw new ApiError(400, (error as any).message);
  
}
};

const getOrdersFromDb = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  const OrderQuery = new QueryBuilder(
    Order.find(
      [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)
        ? { paymentStatus: 'paid' }
        : { user: user.id, paymentStatus: 'paid' }
    ),
    query
  )
    .paginate()
    .search(['orderid','address',"phone","status"])
    .sort().filter()
  const [orders, pagination] = await Promise.all([
   [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)? OrderQuery.modelQuery.populate('user','name image').lean().exec():OrderQuery.modelQuery.lean(),
    OrderQuery.getPaginationInfo(),
  ]);

  const modifiedOrders = await Promise.all(
    orders.map(async (order:any) => {
      const orderItems = await OrderItem.find({ order: order._id })
        .lean();
      if([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user.role)){
        return {
        ...order,
        orderItems,
      };
      }
      else{
        return {
          _id:order._id,
          orderId:order.orderid,
          price:order.totalPrice,
          deliveryCharge:order.deliveryCharge,
          status:order.status,
          orderDate:order.createdAt,
          totalItems :orderItems.length,

        }
      }
    })
  );
  return {
    orders: modifiedOrders,
    pagination,
  };
};

const changeOrderStatus = async (orderId: string, status: ORDER_STATUS) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  if([ORDER_STATUS.CANCELED, ORDER_STATUS.DELIVERED].includes(order.status)){
    throw new ApiError(400, 'Order is already delivered or canceled');
  }

  if(status == ORDER_STATUS.DELIVERED && order.status != ORDER_STATUS.SHIPPING){
    throw new ApiError(400, 'Order is not packed yet');
  }

  if(status == ORDER_STATUS.SHIPPING && order.status != ORDER_STATUS.PACKING){
    throw new ApiError(400, 'Order is not packed yet');
  }

  if(status == ORDER_STATUS.PACKING && order.status != ORDER_STATUS.PENDING){
    throw new ApiError(400, 'Order is not packed yet');
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  await sendNotifications({
    title:`Order is on ${status}`,
    body: `Your order #${updatedOrder?.orderid} is on ${status}`,
    reciever:[updatedOrder?.user!],
    path:"order",
    referenceId: updatedOrder?._id
  })

  await sendNotificationToFCM({
    title:`Order is on ${status}`,
    body: `Your order #${updatedOrder?.orderid} is on ${status}`,
    data: {
      path:"order",
      referenceId: updatedOrder?._id
    }
  },order.user)
  return updatedOrder;
  
}

const getOrderDetailsFromDB = async (orderId: string) => {
  const order = await Order.findById(orderId).populate("user")
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const orderItems = await OrderItem.find({ order: order._id })
  
  return {
    order,
    orderItems
  };
}

export const OrderService = {
  createOrderTODb,
  getOrdersFromDb,
  changeOrderStatus,
  getOrderDetailsFromDB
};
