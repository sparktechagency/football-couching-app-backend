import { Types } from "mongoose";
import admin from "../config/firebase";
import { User } from "../app/modules/user/user.model";

export type IFirebaseNotification = {
  title: string;
  body: string;
  data?: any;
};

export const sendNotificationToFCM = async ({
  title,
  body,
  data,
}: IFirebaseNotification,userId:Types.ObjectId) => {
  let stringData:any = {}
  if(data){
    for(let keyData in data){
      stringData[keyData]  = String(data[keyData])
    }
  }

  const user = await User.findById(userId).lean()
  if(!user || !user?.deviceToken){
    return
  }

  
  stringData.role = user.role
  
  const message = {
    notification: {
      title,
      body,
    },
    token:user?.deviceToken,
    data:stringData,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
