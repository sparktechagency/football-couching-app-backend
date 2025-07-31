import { Session } from "../app/modules/session/session.model";
import { Subscription } from "../app/modules/subscription/subscription.model";
import { User } from "../app/modules/user/user.model";
import cron from "node-cron"
import { sendNotificationToFCM } from "../helpers/sendNotificationFCM";
import { sendNotifications } from "../helpers/notificationHelper";
import { Enroll } from "../app/modules/enroll/enroll.model";
const expireSubscriptions = async () => {
    try {
    const currentDate = new Date();
    await Subscription.updateMany({endDate:{ $lt: currentDate}}, {status: "expired"});
    await User.deleteMany({verified:false})
    await upcommingSessionReminder()
    } catch (error) {
        console.log(error);
        
    }
}

const upcommingSessionReminder = async () => {
    const currentDateStart = new Date(new Date().setHours(0,0,0,0));
    const upcommingSessions = await Session.find({date: {$gte: currentDateStart}}).lean();
    for(const session of upcommingSessions){
        await sendNotificationToFCM({
            title: "Upcomming Session",
            body: `You have an upcomming session with ${session.title} at ${session.date}`,
            data: {
                path:"session",
                referenceId: session._id
            }
        },session.couch)

        await sendNotifications({
            title: "Upcomming Session",
            body: `You have an upcomming session with ${session.title} at ${session.date}`,
            reciever:[session.couch],
            path:"session",
            referenceId: session._id
        })

        const users = await Enroll.find({course:session.course}).lean();
        for(const user of users){
            await sendNotificationToFCM({
                title: "Upcomming Session",
                body: `Your course has an upcomming session with ${session.title} at ${session.date}`,
                data: {
                    path:"session",
                    referenceId: session._id
                }
            },user.user)

            await sendNotifications({
                title: "Upcomming Session",
                body: `Your course has an upcomming session with ${session.title} at ${session.date}`,
                reciever:[user.user],
                path:"session",
                referenceId: session._id
            })


        }
    }
    
}

export function cleanup() {
    cron.schedule('0 0 * * *', async () => {
        console.log("Cleaning up"); 
        await expireSubscriptions();
    });
}