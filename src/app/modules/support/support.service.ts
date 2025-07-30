import { emailHelper } from "../../../helpers/emailHelper";
import { emailTemplate } from "../../../shared/emailTemplate";
import QueryBuilder from "../../builder/QueryBuilder";
import { ISupport } from "./support.interface";
import { Support } from "./support.model";

const createSupportIntoDB = async (support: ISupport) => {
    const emailTamplate = emailTemplate.supportMessage({email:support.email,message:support.opinion})
    await emailHelper.sendEmail(emailTamplate);
    const supportMessage = await Support.create(support);
    return supportMessage;
}

const getAllSupportMessage = async (query:Record<string,any>)=>{
    const SupportQuery = new QueryBuilder(Support.find(),query).paginate().sort().filter();
    const [messages,pagination]= await Promise.all([
        SupportQuery.modelQuery.lean(),
        SupportQuery.getPaginationInfo()
    ])
    return {messages,pagination}
}

export const SupportService = {
    createSupportIntoDB,
    getAllSupportMessage
}