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

const createOrderTODb = async (user: JwtPayload, payload: IOrder) => {
  if (!payload.address || !payload.phone)
    throw new ApiError(400, 'Address and phone number are required');
  const cart = await Cart.find({ user: user.id }).populate('product').lean();
  if (!cart.length) throw new ApiError(400, 'Cart is empty');
  const totalPrice = cart.reduce(
    (acc, item: any) => acc + item.product.price * item.quantity,
    0
  );
  const deliveryCharge = 67;

  const order = await Order.create({
    user: user.id,
    address: payload.address,
    phone: payload.phone,
    code: payload.code,
    paymentStatus: 'unpaid',
    status: ORDER_STATUS.PENDING,
    totalPrice,
    deliveryCharge,
  });

  // console.log(cart);

  const orderItems = cart.map((item: any) => {
    return {
      product: item.product.title,
      image: item.product.images[0],
      quantity: item.quantity,
      size: item.size,
      price: item.product.price,
    };
  });

  const line_items = orderItems.map((item: any) => {
    return {
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
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
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
        }
    ],
    mode: 'payment',
    success_url: `https://wallpaperaccess.com/programming-minimalist`,
    cancel_url: `https://wallpaperaccess.com/programming-minimalist`,
    metadata: {
      orderId: order._id.toString(),
    },
    customer_email:user.email,
  });

  if (session.url) {
    return session.url;
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
    .sort();
  const [orders, pagination] = await Promise.all([
    OrderQuery.modelQuery.populate('user').lean().exec(),
    OrderQuery.getPaginationInfo(),
  ]);

  const modifiedOrders = await Promise.all(
    orders.map(async order => {
      const orderItems = await OrderItem.find({ order: order._id })
        .lean();
      return {
        ...order,
        orderItems,
      };
    })
  );
  return {
    orders: modifiedOrders,
    pagination,
  };
};

export const OrderService = {
  createOrderTODb,
  getOrdersFromDb,
};
