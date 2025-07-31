import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { FootballRole, USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';
import { getRandomId } from '../../../shared/idGenerator';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
      minlength: 8,
    },
    image: {
      type: String,
      default: '/avtar.jpg',
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    app_id: {
      type: String,
      required: false,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
      select: 0,
    },
    address: {
      type: String,
      required: false,
    },
    student_id: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    nationality: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: false,
    },
    ground_role:{
      type:String,
      enum:Object.values(FootballRole),
      required:false
    },
    employeeId:{
      type:String,
      required:false
    },
    studentId:{
      type:String,
      required:false
    },
    deviceToken:{
      type:String,
      required:false
    }
  },
  { timestamps: true }
);

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//check user
userSchema.pre('save', async function (next) {
  //check user
  const isExist = await User.findOne({ email: this.email });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
  }

  if(this.role == USER_ROLES.MEMBER){
    this.studentId = getRandomId("STU",5,"uppercase")
  }
  else if(this.role == USER_ROLES.COUCH){
    this.employeeId = getRandomId("EMP",5,"uppercase")
    
  }

  //password hash
  this.password! = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModal>('User', userSchema);
