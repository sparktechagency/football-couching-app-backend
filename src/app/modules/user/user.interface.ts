import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name?: string;
  role?: USER_ROLES;
  email?: string;
  password: string;
  image?: string;
  status: 'active' | 'delete';
  verified: boolean;
  app_id?: string;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
