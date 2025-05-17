import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const Appcontent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const {data}  = await axios.get(backendUrl + '/api/user/data');
      console.log(data);
      data.status && setUserData(data.userData)
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAuthState =  async ()=>{
     try {
        const data = await axios.get(backendUrl + '/api/auth/isAuthenticated')
        if(data.status)
          setIsLoggedin(true)
          getUserData()

      } catch (error) {
        toast.error(error.message);
     }
  }

  useEffect(()=>{
    getAuthState();
  },[])

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData
  };
  return (
    <Appcontent.Provider value={value}>{props.children}</Appcontent.Provider>
  );
};
