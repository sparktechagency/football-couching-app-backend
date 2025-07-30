import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get("/analytics",auth(USER_ROLES.SUPER_ADMIN,USER_ROLES.ADMIN), DashboardController.getAnalatycs);

export const DashboardRoutes = router;