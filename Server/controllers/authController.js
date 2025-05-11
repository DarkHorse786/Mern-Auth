import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.send({ status: false, message: "Missing Details" });
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.send({ status: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    /////// sending welcome email  ///////

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to the Website",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #00afb9;">Welcome to Auth Website!</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>We're excited to have you on board. You’ve successfully created your account using the email: <strong>${email}</strong>.</p>
            <p>Get started by logging in and exploring the features we’ve prepared just for you.</p>
            <a href="https://yourwebsite.com/login" style="display: inline-block; padding: 10px 20px; background-color: #00afb9; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
            <p style="margin-top: 20px;">If you have any questions, feel free to reach out to our support team.</p>
            <p>Best Regards,<br/>The Auth Team</p>
        </div>`,
    };

    transporter
      .sendMail(mailOptions)
      .then((info) => console.log("Email sent:", info.response))
      .catch((error) => console.error("Email error:", error));

    res.send({ status: true, message: "Successfully Registered" });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.send({
      status: false,
      message: "Email or Password is Required",
    });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.send({ status: false, message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.send({ status: false, message: "Incorrect Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.send({ status: true, message: "Logged In Successfully" });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.send({ status: true, message: "Logged Out" });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};

export const SendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findOne({_id:userId});
    if (user.isAccountVerified)
      return res.send({ status: false, message: "Account Already Verified!" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 60 * 1000 * 2;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa;">
            <div style="text-align: center;">
                <h2 style="color: #00afb9;">Email Verification</h2>
                <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
                <p style="font-size: 16px;">Thank you for signing up. To complete your registration, please verify your email address using the following OTP code:</p>
                <div style="margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; font-weight: bold; background-color: #00afb9; color: #fff; padding: 10px 20px; border-radius: 6px; letter-spacing: 5px;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #555;">This code is valid for two minutes. If you did not sign up for this account, you can safely ignore this email.</p>
                <p style="margin-top: 30px; font-size: 14px;">Best Regards,<br/>The Auth Team</p>
            </div>
        </div>`,
    };
    transporter
      .sendMail(mailOptions)
      .then((info) => console.log("Email sent:", info.response))
      .catch((error) => console.error("Email error:", error));

    res.send({ status: true, message: "Verification OTP sent on Email" });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

export const verifyEmail =async (req,res)=>{
    const {userId,otp} =req.body;
    if(!userId || !otp)
        res.send({ status: false, message: "Missing Details" });

    try {
        const user = await userModel.findOne({_id:userId});
        if(!user)
             res.send({ status: false, message: "User not Found" });
        
        if(user.verifyOtp ==='' || user.verifyOtp!==otp)
             res.send({ status: false, message: "Invalid OTP" });

        if(user.verifyOtpExpireAt < Date.now())
            res.send({ status: false, message: "OTP Expired" });

        user.isAccountVerified=true;
        user.verifyOtp="";
        user.verifyOtpExpireAt=0;

        await user.save();

        res.send({ status: true, message: "Email Verified Successfully" });

    } catch (error) {
         res.send({ status: false, message: error.message });
    }
}

/////////////   Check if user id Authenticated  ///////////////
export const isAuthenticated = async (req,res)=>{
    try {
        res.send({status:true,message:"Authenticated"})
    } catch (error) {
         res.send({ status: false, message: error.message });

    }

}


export const sendResetOtp = async (req,res)=>{
  const {email}=req.body;
  if(!email)
    return res.send({ status: false, message: "Email is Required!" });

  try {
    const user = await userModel.findOne({email});
    if(!user)
      return res.send({ status: false, message: "Invalid Email Address!" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 60 * 1000 * 2;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa;">
              <div style="text-align: center;">
                  <h2 style="color: #00afb9;">Password Reset Request</h2>
                  <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
                  <p style="font-size: 16px;">We received a request to reset your password. Please use the OTP code below to proceed with resetting your password:</p>
                  <div style="margin: 20px 0;">
                      <span style="display: inline-block; font-size: 24px; font-weight: bold; background-color: #00afb9; color: #fff; padding: 10px 20px; border-radius: 6px; letter-spacing: 5px;">${otp}</span>
                  </div>
                  <p style="font-size: 14px; color: #555;">This code is valid for two minutes. If you did not request a password reset, please ignore this email or contact support.</p>
                  <p style="margin-top: 30px; font-size: 14px;">Best Regards,<br/>The Auth Team</p>
              </div>
            </div>`,
    };
    transporter
      .sendMail(mailOptions)
      .then((info) => console.log("Email sent:", info.response))
      .catch((error) => console.error("Email error:", error));
        
      res.send({ status: true, message: "Password reset OTP has been sent to your Email Address" });
  } catch (error) {
      res.send({ status: false, message: error.message });

  }
}


export const resetPassword = async (req,res)=>{
  const {email,otp,newPassword}=req.body;
  if(!email || !otp || !newPassword)
    return res.send({ status: false, message: "Email, OTP & New Password is Required!" });

  try {
    const user = await userModel.findOne({email});
    if(!user)  
      res.send({ status: false, message: "User not found!" });
    if(otp==="" || user.resetOtp!==otp)  
      res.send({ status: false, message: "Invalid OTP!" });
    if(user.resetOtpExpireAt < Date.now())  
      res.send({ status: false, message: "OTP Expired!" });

    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    user.resetOtp="";
    user.resetOtpExpireAt=0;

    await user.save();
    res.send({ status: true, message: "Password has been reset successfully..." });
  } catch (error) {
     res.send({ status: false, message: error.message });
  }
}