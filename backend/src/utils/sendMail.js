import nodemailer from "nodemailer";
import env from "../config/index";

// Create a transporter used for sending the emails
const transporter = nodemailer.createTransport({
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

// Send the mail with the recieved options
export const sendMail = options => {
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(`ERROR: ${err}`)
    } else {
      console.log(`Email has been sent!`);
    }
  })
}