import { Model } from "mongoose";

export type ISupport ={
    email:string,
    opinion:string,
}

export type SupportModel = Model<ISupport, Record<string, unknown>>;