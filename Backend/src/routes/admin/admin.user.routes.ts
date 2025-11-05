import { AdminUserController } from "@/controller/admin/admin.user.controller";
import { QuizResultRepository } from "@/repository/quizResult.respository";
import { UserRepository } from "@/repository/user.repository";
import { AdminUserService } from "@/services/admin/admin.user.service";
import { Router } from "express";

const adminUserRoutes = Router();

const service = new AdminUserService(
    new UserRepository(),
    new QuizResultRepository()
);
const controller = new AdminUserController(service);

adminUserRoutes.get('/', controller.getUsers.bind(controller));
adminUserRoutes.patch('/:id/block', controller.toggleBlockUser.bind(controller));
adminUserRoutes.post('/bulk-block', controller.bulkToggleBlock.bind(controller));

export default adminUserRoutes;