import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../builder/QueryBuilder";
import { Notification } from "./notification.model";
import { timeAgo } from "../../../shared/timeAgo";
import { USER_ROLES } from "../../../enums/user";

const getAllNotificationFromDB = async (query:Record<string,any>,user:JwtPayload) => {
    const NotificationQuery = new QueryBuilder(Notification.find({reciever:{$in:[user.id]}}),query).paginate().sort()
    const [notification,pagination]= await Promise.all([
        NotificationQuery.modelQuery.lean(),
        NotificationQuery.getPaginationInfo()
    ])
    const unreadCount = await Notification.countDocuments({reciever:{$in:[user.id]},seener:{$nin:[user.id]}})
    
    return user.role==USER_ROLES.MEMBER?{
        data:notification.map((noti:any)=>{
            return {...noti,read:noti.seener?.map((id:any)=>id?.toString()).includes(user.id),timeAgo:timeAgo(noti.createdAt||0)}
        }),pagination
    } : {data:{
        unreadCount,
        notification:notification.map((noti:any)=>{
        return {...noti,read:noti.seener?.map((id:any)=>id?.toString()).includes(user.id),timeAgo:timeAgo(noti.createdAt||0)}
    })
    },pagination}

}

const readNotification = async (notificationId:string,user:JwtPayload) => {
    const notification = await Notification.findOneAndUpdate({_id:notificationId},{
        $addToSet:{seener:user.id}
    })

    return notification
}

const readAllNotification = async (user:JwtPayload) => {
    const notification = await Notification.updateMany({reciever:{$in:[user.id]},seener:{$nin:[user.id]}},{
        $addToSet:{seener:user.id}
    })
    return notification
}

export const NotificationService = {
    getAllNotificationFromDB,
    readNotification,
    readAllNotification
}