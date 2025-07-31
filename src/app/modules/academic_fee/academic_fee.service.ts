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
import { Course } from '../course/course.model';
import config from '../../../config';

const createAcademicFeeInDb = async (payload: IAcademicFee) => {
  console.log(payload);
  
  const course = await Course.findById(payload.course);
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
            name: `Fee for the ${course.name} course`,
          },
          unit_amount: payload.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.url.frontend_url}/success`,
    cancel_url: `${config.url.frontend_url}/cancel`,
    metadata: {
      feeId: result._id.toString(),
    },
    customer_email: user.email,
    invoice_creation:{
      enabled:true
    }

  });

  return session.url;
};

const confirmPayment = async (id: string,invoiceLink:string) => {
  try {
    const fee = await AcademicFee.findById(id);
    const trxId = getRandomId("TRX", 5,"uppercase");
    const invoice = await stripe.invoices.retrieve(invoiceLink);
    const result = await AcademicFee.findByIdAndUpdate(
      id,
      { paid: true,trxId,invoice:invoice.invoice_pdf},
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
    .search(['trxId'])
    .paginate();
  const [academicFees, pagination] = await Promise.all([
    academicFeeQuery.modelQuery.populate('member','name image email studentId').lean(),
    academicFeeQuery.getPaginationInfo(),
  ]);

  if([USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN].includes(user.role)){
    return { academicFees, pagination };
  }
};


export const AcademicFeeService = {
  createAcademicFeeInDb,
  confirmPayment,
  getAllAcademicFeeFromDb,
};
