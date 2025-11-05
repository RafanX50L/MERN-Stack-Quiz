import isBlocked from "@/middleware/isBlocked.middleware";
import { verifyToken } from "@/middleware/verify.token.middleware";
import { Router } from "express";
import userDashboardRoutes from "./user/user.dashboard.routes";
import userQuizRoutes from "./user/user.quiz.routes";

const userRoutes = Router();

userRoutes.use('/',verifyToken('user'),isBlocked());

userRoutes.use('/dashboard', userDashboardRoutes);
userRoutes.use('/quizzes', userQuizRoutes);

export default userRoutes;