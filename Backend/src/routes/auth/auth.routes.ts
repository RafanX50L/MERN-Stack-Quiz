import { Router } from "express";
import { UserRepository } from "@/repository/user.repository";
import { AuthService } from "@/services/auth/auth.service";
import { AuthController } from "@/controller/auth/auth.controller";

const authRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);



authRouter.post("/register", authController.signUp.bind(authController));
authRouter.post("/verify-otp", authController.verifyOtp.bind(authController));
authRouter.post("/resend-otp", authController.resendOtp.bind(authController));
authRouter.post("/login", authController.signIn.bind(authController)); 
authRouter.post("/forgot-password", authController.forgotPassword.bind(authController));
authRouter.post("/reset-password", authController.resetPassword.bind(authController));
authRouter.post("/refresh-Token", authController.refreshToken.bind(authController));
authRouter.get('/autherisation',authController.verifyUser.bind(authController));

export default authRouter;