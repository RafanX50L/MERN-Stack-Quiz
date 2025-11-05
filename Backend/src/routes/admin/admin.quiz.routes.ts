import { AdminQuizController } from "@/controller/admin/admin.quiz.controller";
import { QuizRepository } from "@/repository/quiz.repository";
import { AdminQuizService } from "@/services/admin/admin.quiz.service";
import { Router } from "express";

const adminQuizRoutes = Router();

const service = new AdminQuizService(
    new QuizRepository()
);
const controller = new AdminQuizController(service);

adminQuizRoutes.get('/', controller.getQuizzes.bind(controller));
adminQuizRoutes.post('/', controller.createQuiz.bind(controller));
adminQuizRoutes.put('/:id', controller.updateQuiz.bind(controller));
adminQuizRoutes.delete('/:id', controller.deleteQuiz.bind(controller));
adminQuizRoutes.post('/bulk-delete', controller.bulkDeleteQuizzes.bind(controller));

export default adminQuizRoutes;