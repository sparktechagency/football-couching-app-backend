import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Package } from "../package/package.model";
import { ISubscription } from "./subscription.interface";
import { Subscription } from "./subscription.model";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";

const createSubscriptionInDb = async (userId: string, packageId: string) => {
    const packageData = await Package.findById(packageId);
    if (!packageData) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
        
    }
    const  user = await User.findById(userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.subscription) {
        await Subscription.findByIdAndUpdate(user.subscription, { status: 'inactive' });
    }

    const duration = packageData.duration;
    const startDate = new Date();
    const endDate = duration=="month"?new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000):duration=="year"?new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000):new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const subscriptionData = {
        user:user._id ,
        package: packageData._id,
        startDate,
        endDate,
    };
    const subscription = await Subscription.create(subscriptionData);
    await User.findByIdAndUpdate(userId, { subscription: subscription._id });
    return subscription;
};

const getUserSubscriptionFromTheDB = async (user:JwtPayload)=>{
    const userSubscription = await Subscription.findOne({ user: user.id }).populate('package','name price features');
    if (!userSubscription) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription not found');
    }
    return userSubscription;
}


export const SubscriptionService = {
    createSubscriptionInDb,
    getUserSubscriptionFromTheDB
};