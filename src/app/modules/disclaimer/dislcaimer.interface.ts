import { Model } from "mongoose"

export type IDisclaimer = {
    content:string,
    type:"about"|"terms"|"support" | "app-support"|"privacy"
}

export type DisclaimerModel = Model<IDisclaimer, Record<string, unknown>>