import { JwtPayload } from 'jsonwebtoken';
import { stripe } from '../../../config/stripe';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/category.model';
import { IAcademicFee } from './academic_fee.interface';
import { AcademicFee } from './academic_fee.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { USER_ROLES } from '../../../enums/user';
import { User } from '../user/user.model';
import { getRandomId } from '../../../shared/idGenerator';

const createAcademicFeeInDb = async (payload: IAcademicFee) => {
  const course = await Category.findById(payload.course);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  const user = await User.findById(payload.member);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const result = await AcademicFee.create(payload);


  if (!result) {
    throw new ApiError(400, 'Academic fee not created');
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
          },
          unit_amount: payload.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://your-paltform/academic-fee/success`,
    cancel_url: `http://your-paltform/academic-fee/cancel`,
    metadata: {
      feeId: result._id.toString(),
    },
    customer_email: user.email,
  });

  return session.url;
};

const confirmPayment = async (id: string) => {
  try {
    const fee = await AcademicFee.findById(id);
    const trxId = getRandomId("TRX", 5,"uppercase");
    const result = await AcademicFee.findByIdAndUpdate(
      id,
      { paid: true,trxId },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getAllAcademicFeeFromDb = async (user:JwtPayload,query: Record<string, any>) => {
  const academicFeeQuery = new QueryBuilder(AcademicFee.find([USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN].includes(user.role)?{paid:true}:{member:user.id,paid:true}), query)
    .filter()
    .sort()
    .paginate();
  const [academicFees, pagination] = await Promise.all([
    academicFeeQuery.modelQuery.lean(),
    academicFeeQuery.getPaginationInfo(),
  ]);

  return {
    academicFees,
    pagination,
  };
};


export const AcademicFeeService = {
  createAcademicFeeInDb,
  confirmPayment,
  getAllAcademicFeeFromDb,
};
