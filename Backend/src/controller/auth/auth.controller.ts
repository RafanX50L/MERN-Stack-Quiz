import { Request, Response, NextFunction } from "express";
import { IAuthService } from "@/core/interface/service/auth/IAuth.service";
import { IAuthController } from "@/core/interface/controller/auth/IAuth.controller";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import {
  deleteCookie,
  getIdFromCookie,
  setCookie,
} from "../../utils/cookie.utils";
import { createHttpError } from "../../utils";
import { env } from "@/config/env.config";
import { 
  AuthDTO,
  SignUpRequestDTO,
  SignInRequestDTO,
  VerifyOtpRequestDTO,
  ResendOtpRequestDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
  GoogleSignUpRequestDTO
} from "@/dtos/forward/auth.dto";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";

const maxAge = Number(env.COOKIE_MAX_AGE);

export class AuthController implements IAuthController {
  constructor(
    private _authService: IAuthService,
  ) {}

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request body using DTO
      const validatedBody: SignUpRequestDTO = AuthDTO.validateSignUpRequest(req.body);
      
      // Call service with validated parameters
      const user = await this._authService.signUp(validatedBody);
      console.log("User registration initiated:", user,validatedBody);
      
      ControllerErrorHandler.handleSuccess(res, { email: user }, "User registration initiated successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request body using DTO
      const validatedBody: SignInRequestDTO = AuthDTO.validateSignInRequest(req.body);
      
      // Call service with validated parameters
      const { user, accessToken, refreshToken} =
        await this._authService.signIn(validatedBody.email, validatedBody.password);
        
      
      setCookie(res, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge, // 7 days
      });

      ControllerErrorHandler.handleSuccess(res, {
        user,
        accessToken,
      }, HttpResponse.LOGIN_SUCCESS);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate and transform request body using DTO
      const validatedBody: VerifyOtpRequestDTO = AuthDTO.validateVerifyOtpRequest(req.body);
      
      // Call service with validated parameters
      const { user, accessToken, refreshToken } =
        await this._authService.verifyOtp(validatedBody.email, validatedBody.otp);
        
      
      setCookie(res, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
      });

      ControllerErrorHandler.handleSuccess(res, {
        user,
        accessToken,
      }, HttpResponse.USER_CREATION_SUCCESS, HttpStatus.CREATED);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate and transform request body using DTO
      const validatedBody: ResendOtpRequestDTO = AuthDTO.validateResendOtpRequest(req.body);
      
      // Call service with validated parameters
      const user = await this._authService.resendOtp(validatedBody.email);
      
      ControllerErrorHandler.handleSuccess(res, { user }, HttpResponse.OTP_RESEND_SUCCESS);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate and transform request body using DTO
      const validatedBody: ForgotPasswordRequestDTO = AuthDTO.validateForgotPasswordRequest(req.body);
      
      // Call service with validated parameters
      const forgotPassword = await this._authService.forgotPassword(validatedBody.email);
      
      ControllerErrorHandler.handleSuccess(res, { forgotPassword }, "Password reset email sent successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate and transform request body using DTO
      const validatedBody: ResetPasswordRequestDTO = AuthDTO.validateResetPasswordRequest(req.body);
      
      // Call service with validated parameters
      const updatedUserPassword = await this._authService.resetPassword(
        validatedBody.token,
        validatedBody.password
      );
      
      ControllerErrorHandler.handleSuccess(res, updatedUserPassword, "Password reset successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }


  async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = getIdFromCookie(req, "accessToken");
      if (!id) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Access token is missing or invalid"
        );
      }
      const { user } = await this._authService.getUserData(id);
      
      ControllerErrorHandler.handleSuccess(res, { user }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Refresh token not found"
        );
      }

      const result = await this._authService.refreshAccessToken(refreshToken);

      setCookie(res, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
      });

      ControllerErrorHandler.handleSuccess(res, {
        accessToken: result.accessToken,
        user: result.user,
      }, "Token refreshed successfully");
    } catch (error) {
      deleteCookie(res);
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}
