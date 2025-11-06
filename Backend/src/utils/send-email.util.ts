import { transporter } from '@/config/mail.config'
import { env } from "@/config/env.config";
import logger from "./logger.utils";

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Tahtib ALJuhd OTP Verificaiton",
      html: `
                <h1>OTP Verification</h1>
                <p>Your OTP is: ${otp}</p>
                <p>Use this OTP to verify your email. Do not share it with anyone.</p><br />
                <p>If you did not request this verification, you can ignore this email.</p>
                <p>~ Tahtib ALJuhd</p>
                  `,
    };
    await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully to:", email);
  } catch (error) {
    logger.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
