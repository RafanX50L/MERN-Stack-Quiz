import { env } from "@/config/env";

export const HOST = env.PUBLIC_DOMAIN;

const AUTH_ROUTE = "/auth";

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_ROUTE}/login`,
  REGISTER: `${AUTH_ROUTE}/register`,
  VERIFY_OTP: `${AUTH_ROUTE}/verify-otp`,
  RESEND_OTP: `${AUTH_ROUTE}/resend-otp`,
  FORGOT_PASSWORD: `${AUTH_ROUTE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_ROUTE}/reset-password`,
  REFRESH_ACESS_TOKEN: `${AUTH_ROUTE}/refresh-Token`,
};

export const USER_ROUTES = {
  DASHBOARD: (userId: string) => `/user/dashboard/${userId}`,
  USER_QUIZ_ROUTES: {
    GET_ALL: `/user/quizzes`,
    GET_BY_ID: (id: string) => `/user/quizzes/${id}`,
    SUBMIT: `/user/quizzes/submit`
  }
};

export const ADMIN_ROUTES = {
  DASHBOARD: `/admin/dashboard`,
  ADMIN_QUIZ_ROUTES: {
    GET_ALL: `/admin/quizzes`,
    CREATE: `/admin/quizzes`,
    UPDATE: (id: string) => `/admin/quizzes/${id}`,
    DELETE: (id: string) => `/admin/quizzes/${id}`,
    BULK_DELETE: `/admin/quizzes/bulk-delete`
  },
  ADMIN_USER_ROUTES: {
    GET_ALL: `/admin/users`,
    TOGGLE_BLOCK: (id: string) => `/admin/users/${id}/block`,
    BULK_BLOCK: `/admin/users/bulk-block`
  }
};