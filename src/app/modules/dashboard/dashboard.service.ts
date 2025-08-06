import { ORDER_STATUS } from '../../../enums/order';
import { USER_ROLES } from '../../../enums/user';
import { AcademicFee } from '../academic_fee/academic_fee.model';
import { Order } from '../order/order.model';
import { Subscription } from '../subscription/subscription.model';
import { User } from '../user/user.model';

const analaticsFromDb = async (year: string,sellYear:string,studentYear:string) => {

  const yearStartDate = new Date(
    year ? year : new Date().getFullYear().toString()
  );
  const yearEndDate = new Date((yearStartDate.getFullYear() + 1).toString());

  const totalUser = await User.countDocuments();
  const totalSoldNumbers = await Order.aggregate([
    {
      $match: {
        status: ORDER_STATUS.DELIVERED,
      },
    },
    {
      $lookup: {
        from: 'orderitems',
        localField: '_id',
        foreignField: 'order',
        as: 'orderItems',
      },
    },
    {
      $unwind: '$orderItems',
    },
    {
      $group: {
        _id: null,
        totalSoldNumbers: { $sum: '$orderItems.quantity' },
      },
    },
  ]);

  const totalSold = totalSoldNumbers[0]?.totalSoldNumbers || 0;

  const totalOrderPrice = await Order.aggregate([
    {
      $match: {
        status: ORDER_STATUS.DELIVERED,
      },
    },
    {
      $group: {
        _id: null,
        totalOrderPrice: { $sum: '$totalPrice' },
      },
    },
  ]);

  const totalOrderPriceValue = totalOrderPrice[0]?.totalOrderPrice || 0;

  const subscription =
    (await Subscription.find({}).lean()).reduce(
      (acc, curr) => acc + curr.price,
      0
    ) || 0;

  const totalEarning = totalOrderPriceValue + subscription;

  const totalOrder = await Order.countDocuments();

  const overView = {
    totalUsers: totalUser,
    totalSold,
    totalEarning,
    totalOrder,
  };

  const userListByMonths = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: yearStartDate, $lte: yearEndDate },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
        subscribers: {
          $sum: {
            $cond: [{ $ifNull: ['$subscription', false] }, 1, 0],
          },
        },
      },
    },
  ]);
//   console.log(userListByMonths);

const sellYearStart = new Date(
    sellYear!="" ? sellYear : new Date().getFullYear().toString()
  );
  const sellYearEnd = new Date((yearStartDate.getFullYear() + 1).toString());
  const orderListByMonths = await Order.aggregate([
    {
      $match: {
        status: ORDER_STATUS.DELIVERED,
        createdAt: { $gte: sellYearStart, $lte: sellYearEnd },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count:{$sum:"$totalPrice"}
      },
    },
  ]);


  const academic_feeListByMonths = await AcademicFee.aggregate([
    {
      $match: {
        createdAt: { $gte: sellYearStart, $lte: sellYearEnd },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count:{$sum:"$amount"} 
      }
    }
  ])

  const studentyearStartDate = new Date(
    studentYear!="" ? studentYear : new Date().getFullYear().toString()
  );
  const studentyearEndDate = new Date((yearStartDate.getFullYear() + 1).toString());

  const studentListByMonths = await User.aggregate([
    {
      $match: {
        role: USER_ROLES.MEMBER,
        createdAt: { $gte: studentyearStartDate, $lte: studentyearEndDate },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
  ]);

  const monthLists = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };

  const userListByMonthsData = [];
  const orderListByMonthsData = [];
  const studentListByMonthsData = [];
  const academic_feeListByMonthsData = [];

  for (let i = 1; i <= 12; i++) {
    const month = monthLists[i as keyof typeof monthLists];
    const userCount = userListByMonths.find(item => item._id === i) || 0;
    const orderCount =
      orderListByMonths.find(item => item._id === i)?.count || 0;
    const studentCount =
      studentListByMonths.find(item => item._id === i)?.count || 0;
    const academic_feeCount =
      academic_feeListByMonths.find(item => item._id === i)?.count || 0;
    userListByMonthsData.push({ month, count: userCount?.count||0,subscriber: userCount?.subscribers||0 });
    orderListByMonthsData.push({ month, count: orderCount,enrollment: academic_feeCount ||0});
    studentListByMonthsData.push({ month, count: studentCount });
  }

  return {
    overView,
    userListByMonthsData,
    orderListByMonthsData,
    studentListByMonthsData,
  };
};

export const DashboardService = {
  analaticsFromDb,
};
