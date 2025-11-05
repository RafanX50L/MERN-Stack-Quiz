import { UserQuizController } from "@/controller/user/user.quiz.controller";
import { QuizRepository } from "@/repository/quiz.repository";
import { QuizResultRepository } from "@/repository/quizResult.respository";
import { UserQuizService } from "@/services/user/user.quiz..service";
import { Router } from "express";

const userQuizRoutes = Router();

const service = new UserQuizService(
    new QuizRepository(),
    new QuizResultRepository(),
);
const controller = new UserQuizController(service);

userQuizRoutes.get('/', controller.getPublicQuizzes.bind(controller));
userQuizRoutes.get('/:id', controller.getQuizById.bind(controller));
userQuizRoutes.post('/submit', controller.submitQuizResult.bind(controller));

export default userQuizRoutes;