import { Model, Types } from 'mongoose';
import { FootballRole, USER_ROLES } from '../../../enums/user';

export type IUser = {
  name?: string;
  role?: USER_ROLES;
  email?: string;
  password: string;
  image?: string;
  status: 'active' | 'delete';
  verified: boolean;
  app_id?: string;
  address?: string;
  student_id?: string;
  contact?: string;
  nationality?: string;
  dob: Date;
  subscription?:Types.ObjectId;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  },
  studentId?:string;
  employeeId?:string;
  deviceToken?:string;
  ground_role?:FootballRole
  
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
