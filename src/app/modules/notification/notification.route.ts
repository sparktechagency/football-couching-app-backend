import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route("/")
    .get(auth(),NotificationController.getNotifications)
    .patch(auth(),NotificationController.readAllNotification)

router.route("/:id")
    .patch(auth(),NotificationController.readNotification)

export const NotificationRoutes = router;