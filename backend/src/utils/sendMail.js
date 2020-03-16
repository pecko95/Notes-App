import nodemailer from "nodemailer";
import env from "../config/index";

// Create a transporter used for sending the emails
export const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});
