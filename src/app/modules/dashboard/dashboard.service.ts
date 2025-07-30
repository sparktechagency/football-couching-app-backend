import { ORDER_STATUS } from "../../../enums/order"
import { USER_ROLES } from "../../../enums/user"
import { Order } from "../order/order.model"
import { Subscription } from "../subscription/subscription.model"
import { User } from "../user/user.model"

const analaticsFromDb = async (year:string)=>{
    const yearStartDate = new Date(year?year:new Date().getFullYear().toString())
    const yearEndDate = new Date((yearStartDate.getFullYear()+1).toString())

    
    console.log(yearStartDate,yearEndDate);
    
    const totalUser = await User.countDocuments()
    const totalSoldNumbers = await Order.aggregate([
        {
            $match:{
                status:ORDER_STATUS.DELIVERED
            }
        },
        {
            $lookup:{
                from:"orderitems",
                localField:"_id",
                foreignField:"order",
                as:"orderItems"
            }
        },
        {
            $unwind:"$orderItems"
        },
        {
            $group:{
                _id:null,
                totalSoldNumbers:{$sum:"$orderItems.quantity"}
            }
        }

    ])
    
    const totalSold = totalSoldNumbers[0]?.totalSoldNumbers || 0

    const totalOrderPrice = await Order.aggregate([
        {
            $match:{
                status:ORDER_STATUS.DELIVERED
            }
        },
        {
            $group:{
                _id:null,
                totalOrderPrice:{$sum:"$totalPrice"}
            }
        }
    ])

    const totalOrderPriceValue = totalOrderPrice[0]?.totalOrderPrice || 0

    const subscription = (await Subscription.find({}).lean()).reduce((acc, curr) =>acc+curr.price, 0)||0

    const totalEarning = totalOrderPriceValue + subscription
    
    const totalOrder = await Order.countDocuments()

    const overView = {
       totalUsers:totalUser,
       totalSold,
       totalEarning,
       totalOrder
    }

    const userListByMonths = await User.aggregate([
        {
            $match:{
                createdAt:{$gte:yearStartDate, $lte:yearEndDate}
            }
        },
        {
            $group:{
                _id:{$month:"$createdAt"},
                count:{$sum:1}
            }
        }
    ])

    const orderListByMonths = await Order.aggregate([
        {
            $match:{
                status:ORDER_STATUS.DELIVERED,
                createdAt:{$gte:yearStartDate, $lte:yearEndDate}
            }
        },
        {
            $group:{
                _id:{$month:"$createdAt"},
                count:{$sum:1}
            }
        }
    ])

    const studentListByMonths = await User.aggregate([
        {
            $match:{
                role:USER_ROLES.MEMBER,
                createdAt:{$gte:yearStartDate, $lte:yearEndDate}
            }
        },
        {
            $group:{
                _id:{$month:"$createdAt"},
                count:{$sum:1}
            }
        }
    ])

    const monthLists = {
        1:"Jan",
        2:"Feb",
        3:"Mar",
        4:"Apr",
        5:"May",
        6:"Jun",
        7:"Jul",
        8:"Aug",
        9:"Sep",
        10:"Oct",
        11:"Nov",
        12:"Dec"
    }

    const userListByMonthsData = []
    const orderListByMonthsData = []
    const studentListByMonthsData = []

    for (let i = 1; i <= 12; i++) {
        const month = monthLists[i as keyof typeof monthLists]
        const userCount = userListByMonths.find(item => item._id === i)?.count || 0
        const orderCount = orderListByMonths.find(item => item._id === i)?.count || 0
        const studentCount = studentListByMonths.find(item => item._id === i)?.count || 0
        userListByMonthsData.push({month, count:userCount})
        orderListByMonthsData.push({month, count:orderCount})
        studentListByMonthsData.push({month, count:studentCount})
    }

    return {
        overView,
        userListByMonthsData,
        orderListByMonthsData,
        studentListByMonthsData
    }

    
    
}

export const DashboardService = {
    analaticsFromDb
}