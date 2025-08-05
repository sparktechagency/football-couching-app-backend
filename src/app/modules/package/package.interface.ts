import { Model } from "mongoose";

export type IPackage = {
    name:string,
    price:number,
    features:string[],
    status:"active" | "deleted",
    duration:"month" | "year" | "week",
    paymentLink:string,
    price_id:string,
    product_id:string,
}


export type PackageModel = Model<IPackage, Record<string, unknown>>;