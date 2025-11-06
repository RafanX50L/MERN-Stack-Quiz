import { Resend } from 'resend';
import { env } from "@/config/env.config";
import logger from "./logger.utils";

const resend = new Resend(env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    await resend.emails.send({
      from: `"Mern Quiz" <no-reply@quizmail.rafan.tech>`,
      to: email,
      subject: "Mern Quiz OTP Verification",
      html: `
        <h1>OTP Verification</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Use this OTP to verify your email. Do not share it with anyone.</p>
        <br/>
        <p>If you did not request this, ignore this email.</p>
        <p>~ Mern Quiz</p>
      `,
    });
    logger.info(`✅ OTP email sent successfully to ${email}`);
  } catch (error) {
    logger.error("❌ Error sending OTP email:", error);
    throw new Error("Error sending OTP email");
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${env.RESET_PASS_URL}?token=${token}`;
    await resend.emails.send({
      from: `"Mern Quiz" <no-reply@quizmail.rafan.tech>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a><br/>
        <p>If you did not request this, ignore this email.</p>
        <p>~ Tahtib ALJuhd</p>
      `,
    });
    logger.info(`✅ Password reset email sent successfully to ${email}`);
  } catch (error) {
    logger.error("❌ Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};
