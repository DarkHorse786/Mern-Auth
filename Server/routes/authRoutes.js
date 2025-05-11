import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, SendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuthentication from "../middleware/userAuthentication.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuthentication,SendVerifyOtp);
authRouter.post("/verify-email", userAuthentication,verifyEmail);
authRouter.post("/isAuthenticated", userAuthentication,isAuthenticated);
authRouter.post("/send-reset-otp",sendResetOtp);
authRouter.post("/resetPassword",resetPassword);


export default authRouter;
