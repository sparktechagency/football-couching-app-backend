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
import { PackageRoutes } from '../app/modules/package/package.route';
import { SubCategoryRoutes } from '../app/modules/subcategory/subcategory.route';
import { Homework } from '../app/modules/homework/homework.model';
import { HomeworkRoutes } from '../app/modules/homework/homework.route';
import { SubmissionRoutes } from '../app/modules/submission/submission.route';
import { TopicRoutes } from '../app/modules/topic/topic.route';
import { EnrollRoutes } from '../app/modules/enroll/enroll.route';
import { PerformanceRoutes } from '../app/modules/performance/performance.route';
import { CouponRoutes } from '../app/modules/coupon/coupon.route';
import { SupportRoutes } from '../app/modules/support/support.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
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
    path:"/sub-category",
    route:SubCategoryRoutes,
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
  },
  {
    path:"/package",
    route:PackageRoutes
  },
  {
    path:"/homework",
    route:HomeworkRoutes
  },
  {
    path:"/submission",
    route:SubmissionRoutes
  },
  {
    path:"/topic",
    route:TopicRoutes
  },
  {
    path:"/enroll",
    route:EnrollRoutes
  },
  {
    path:"/performance",
    route:PerformanceRoutes
  },
  {
    path:"/coupon",
    route:CouponRoutes
  },
  {
    path:"/support",
    route:SupportRoutes
  },
  {
    path:"/notification",
    route:NotificationRoutes
  },
  {
    path:"/subscription",
    route:SubscriptionRoutes
  },
  {
    path:"/dashboard",
    route:DashboardRoutes
  },
  {
    path:"/faq",
    route:FaqRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
