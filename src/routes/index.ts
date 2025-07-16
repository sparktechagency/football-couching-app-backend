import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { CartRoutes } from '../app/modules/cart/cart.route';
import { OrderRoutes } from '../app/modules/order/order.route';
import { WishlistRoutes } from '../app/modules/wishlist/wishlist.route';
import { DisclaimerRoute } from '../app/modules/disclaimer/disclaimer.route';
import { TutorialRoutes } from '../app/modules/tutorial/tutorial.route';
import { AcademicFeeRoutes } from '../app/modules/academic_fee/academic_fee.route';
import { CourseRoutes } from '../app/modules/course/course.route';
import { SessionRoutes } from '../app/modules/session/session.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path:'/product',
    route:ProductRoutes,
  },
  {
    path:'/cart',
    route:CartRoutes,
  },
  {
    path:'/order',
    route:OrderRoutes,
  },
  {
    path:"/wishlist",
    route:WishlistRoutes
  },
  {
    path:"/disclaimer",
    route:DisclaimerRoute
  },
  {
    path:"/tutorial",
    route:TutorialRoutes
  },
  {
    path:"/academic-fee",
    route:AcademicFeeRoutes
  },
  {
    path:"/course",
    route:CourseRoutes
  },
  {
    path:"/session",
    route:SessionRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
