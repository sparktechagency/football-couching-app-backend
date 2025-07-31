import { model, Schema } from "mongoose";
import { AcademicFeeModel, IAcademicFee } from "./academic_fee.interface";

const academicFeeSchema = new Schema<IAcademicFee,AcademicFeeModel>(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    trxId: {
      type: String,
    },
    invoice: {
      type:String
    }
  },
  {
    timestamps: true,
  }
);

export const AcademicFee = model<IAcademicFee, AcademicFeeModel>(
  'AcademicFee',
  academicFeeSchema
);