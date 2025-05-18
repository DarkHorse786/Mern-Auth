import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASS
  }
});
export default transporter