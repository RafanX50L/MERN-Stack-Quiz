import isBlocked from "@/middleware/isBlocked.middleware";
import { verifyToken } from "@/middleware/verify.token.middleware";
import { Router } from "express";
import adminDashboardRoutes from "./admin/admin.dashboard.routes";
import adminQuizRoutes from "./admin/admin.quiz.routes";
import adminUserRoutes from "./admin/admin.user.routes";

const adminRoutes = Router();

adminRoutes.use('/',verifyToken('admin'),isBlocked());

adminRoutes.use('/dashboard', adminDashboardRoutes);
adminRoutes.use('/quizzes', adminQuizRoutes);
adminRoutes.use('/users', adminUserRoutes);

export default adminRoutes;