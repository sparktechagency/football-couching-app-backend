import { Model } from "mongoose"

export type IDisclaimer = {
    content:string,
    type:"about"|"terms"|"support"
}

export type DisclaimerModel = Model<IDisclaimer, Record<string, unknown>>