import nodemailer from "nodemailer";
import { ENV } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to, code) {
  const mailOptions = {
    from: '"Recipe App" <raonaveedbilal@gmail.com>',
    to,
    subject: "Verify Your Recipe App Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto;">
        <h2>Recipe App</h2>
        <p>Your verification code is:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          text-align:center;
          letter-spacing:6px;
          padding:20px;
          background:#f2f2f2;
          border-radius:10px;
          margin:20px 0;">
          ${code}
        </div>

        <p>This code will verify your account.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}