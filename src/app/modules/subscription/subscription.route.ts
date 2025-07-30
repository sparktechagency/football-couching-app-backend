import express from 'express';
import { SubscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route("/user")
    .get(auth(), SubscriptionController.getUserSubsctiption)

export const SubscriptionRoutes = router;