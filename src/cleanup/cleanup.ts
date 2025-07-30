import { Subscription } from "../app/modules/subscription/subscription.model";
import { User } from "../app/modules/user/user.model";
import cron from "node-cron"
const expireSubscriptions = async () => {
    try {
    const currentDate = new Date();
    await Subscription.updateMany({endDate:{ $lt: currentDate}}, {status: "expired"});
    await User.deleteMany({verified:false})
    } catch (error) {
        console.log(error);
        
    }
}

export function cleanup() {
    cron.schedule('0 0 * * *', async () => {
        await expireSubscriptions();
    });
}