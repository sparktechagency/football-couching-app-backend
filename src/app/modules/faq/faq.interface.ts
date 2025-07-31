import { Model } from "mongoose"

export type IFaq = {
    title:string,
    description:string,
}

export type FaqModel = Model<IFaq>