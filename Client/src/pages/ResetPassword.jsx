import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const ResetPassword = () => {
  const inputRef = useRef([]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(0);
  const [newPassword,setNewPassword] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  const {backendUrl} = useContext(Appcontent);
  axios.defaults.withCredentials = true;


   const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").split("");
    if (pastedData.length === 6) {
      pastedData.forEach((char, index) => {
        if (inputRef.current[index]) {
          inputRef.current[index].value = char;
        }
      });
    }
  };

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(backendUrl + "/api/auth/send-reset-otp",{email});
      if (data.status) {
        setIsEmailSubmitted(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const onSubmitOtp = async (e) => {
    try {
      e.preventDefault();
      const otpCode = inputRef.current.map((input) => input.value).join("");
      setOtp(otpCode);
      setIsOtpSubmitted(true);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onSubmitNewPassword = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(backendUrl + "/api/auth/resetPassword", {
        email,
        otp,
        newPassword
      });
      if (data.status) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      {/* email form*/}
      {!isEmailSubmitted && 
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Enter Your Valid Email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none text-indigo-300"
            />
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-full hover:scale-105 transition-transform duration-200">
            Submit
          </button>
          <p className="text-center text-gray-400 mt-4">
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      }
      {/* opt input form*/}
      {isEmailSubmitted && !isOtpSubmitted && (
        <form onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-400">
            Enter the 6-digit code sent to your Email.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  required
                  ref={(element) => (inputRef.current[index] = element)}
                  onChange={(e) => {
                    if (e.target.value.length === 1 && index < 5) {
                      inputRef.current[index + 1].focus(); // Move to next field on input
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      e.target.value.length === 0 &&
                      index > 0
                    ) {
                      inputRef.current[index - 1].focus(); // Move back only if empty
                    }
                  }}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                />
              ))}
          </div>

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}
      {/* Reset Password Form */}
      {isOtpSubmitted &&
        <form onSubmit={onSubmitNewPassword}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your New Password
          </p>
          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-transparent outline-none text-indigo-300"
            />
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-full hover:scale-105 transition-transform duration-200">
            Submit
          </button>
        </form>
      }
    </div>
  );
};

export default ResetPassword;
