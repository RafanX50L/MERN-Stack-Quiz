import { AdminDashboardController } from "@/controller/admin/admin.dashboard.controller";
import { QuizRepository } from "@/repository/quiz.repository";
import { QuizResultRepository } from "@/repository/quizResult.respository";
import { AdminDashboardService } from "@/services/admin/admin.dashboard.service";
import { Router } from "express";

const adminDashboardRoutes = Router();

const service = new AdminDashboardService(
    new QuizRepository(),
    new QuizResultRepository()
);
const controller = new AdminDashboardController(service);

adminDashboardRoutes.get('/', controller.getAdminDashboard.bind(controller));

export default adminDashboardRoutes;