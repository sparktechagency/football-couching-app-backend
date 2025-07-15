import { Disclaimer } from "./disclaimer.model";
import { DisclaimerModel, IDisclaimer } from "./dislcaimer.interface";

const createDisclaimerToDB = async (payload:IDisclaimer) => {
    const exist = await Disclaimer.findOne({type:payload.type})
    if(exist){
        const update = await Disclaimer.findByIdAndUpdate(exist._id,payload,{new:true})
        return update
    }
    const create = await Disclaimer.create(payload)
    return create
}

const getAllDisclaimer = async (type:string) => {
    const all = await Disclaimer.findOne({type:type})
    return all
}

export const DisclaimerService = {
    createDisclaimerToDB,
    getAllDisclaimer
}