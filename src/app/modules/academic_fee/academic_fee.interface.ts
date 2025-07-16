import { Model, Types } from "mongoose";

export type IAcademicFee = {
    member: Types.ObjectId;
    amount: number;
    paid: boolean;
    course: Types.ObjectId;
    trxId?: string;
};


export type AcademicFeeModel = Model<IAcademicFee, Record<string, unknown>>;