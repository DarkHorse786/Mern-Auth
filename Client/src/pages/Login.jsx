import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();

  const {backendUrl,setlsLoggedIn}=useContext(Appcontent);

  const [state, setState] = useState("Sign Up");
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const onSubmitHandler= async (e)=>{
    try {
      e.preventDefault()
    } catch (error) {
      
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[radial-gradient(circle_at_center,_#c084fc,_#bfdbfe)]">
      <img
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
        onClick={()=>navigate('/')}
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Sign Up" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your Account"
            : "Login to your Account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
                onChange={e=> setName(e.target.value)}
                value={name}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
              required
              onChange={e=> setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
              onChange={e=> setPassword(e.target.value)}
              value={password}
            />
          </div>
          <p className="mb-4 text-indigo-500 cursor-pointer"
            onClick={()=>navigate('/reset-password')}>  
            Forgot Password? 
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline" onClick={()=>setState('Log In')}>
              Login{" "}
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline" onClick={()=>setState('Sign Up')}>
              Sign Up{" "}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
