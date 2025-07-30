import { Socket } from "socket.io";
import { INotification } from "../app/modules/notification/notification.interface";
import { Notification } from "../app/modules/notification/notification.model";
import { User } from "../app/modules/user/user.model";
import { USER_ROLES } from "../enums/user";

export const sendNotifications = async (payload:INotification)=>{
    const notification = await Notification.create(payload);
    const io = (global as any).io as Socket;
    const recevers =payload.reciever

    recevers.forEach((recever)=>{
        io.emit(`notification::${recever}`,notification)
    })
}

export const sendAdminNotifications = async (payload:INotification)=>{
    const admins = (await User.find({role:{$in:[USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN]}}).lean()).map((user)=>user._id)
    payload.reciever = admins
    const notification = await Notification.create(payload);
    const io = (global as any).io as Socket;
    const recevers =payload.reciever

    recevers.forEach((recever)=>{
        io.emit(`notification::${recever}`,notification)
    })

}