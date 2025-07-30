import { Model, Types } from "mongoose"

export type ISubscription = {
    user:Types.ObjectId
    package:Types.ObjectId
    startDate:Date
    endDate:Date
    status:"active"|"inactive"|"expired",
    subscriptionId?:string
    price:number
}

export type SUbscriptionModel = Model<ISubscription, Record<string, unknown>> 