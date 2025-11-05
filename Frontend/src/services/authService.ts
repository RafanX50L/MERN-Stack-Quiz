import api from "./api";
import { AUTH_ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import type { UserInterface } from "@/types/user";
import type { RegisterFormData } from "@/components/auth/Register";
import type { LoginForm } from "@/components/auth/Login";

// Local AxiosError type to avoid version/type mismatches
type AxiosError<T = unknown> = { response?: { data: T } };

interface OtpData{
    email:string,
    otp:string
}
//verify otp, GoogleSignup,login,refreshToken

export const AuthService = {
  registerUser: async (formData: RegisterFormData) => {
    try {
      const response = await api.post(AUTH_ROUTES.REGISTER, formData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  },

  login: async (formData: LoginForm) => {
    try {
      const res = await api.post<{success: boolean, message: string, data: {user:UserInterface, accessToken:string}}>(AUTH_ROUTES.LOGIN, formData);
      const response = res.data;
      return { user: response.data.user, message: response.message, accessToken:response.data.accessToken, status: res.status };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  verifyOtp: async (data: OtpData) => {
    try {
      const res = await api.post<{ success: boolean, message: string, data: {user: UserInterface, accessToken:string}}>(AUTH_ROUTES.VERIFY_OTP, data);
      const response = res.data;
      return { user: response.data.user, message: response.message, accessToken:response.data.accessToken, status:res.status };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "OTP verification failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  resentOtp: async (email: string) => {
    try {
      const response = await api.post(AUTH_ROUTES.RESEND_OTP, { email });
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to resend OTP. Please try again.";
      return { data: null, error: errorMessage };
    }
  },
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to send password reset email. Please try again.";
      throw new Error(errorMessage);
    }
  },
  resetPassword: async (data: { token: string; password: string }) => {
    try {
      const response = await api.post(AUTH_ROUTES.RESET_PASSWORD, data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to reset password. Please try again.";
      throw new Error(errorMessage);
    }
  },

};
