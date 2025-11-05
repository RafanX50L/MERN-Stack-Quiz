import { UserDashboardController } from "@/controller/user/user.dashboard.controller";
import { QuizResultRepository } from "@/repository/quizResult.respository";
import { UserDashboardService } from "@/services/user/user.dashboard.service";
import { Router } from "express";

const userDashboardRoutes = Router();

const service = new UserDashboardService(
    new QuizResultRepository(),
);
const controller = new UserDashboardController(service);

userDashboardRoutes.get('/:userId', controller.getUserDashboard.bind(controller));

export default userDashboardRoutes;