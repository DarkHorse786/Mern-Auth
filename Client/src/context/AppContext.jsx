import { useState } from "react";
import { createContext } from "react";

export const  Appcontent = createContext();

export const AppContextProvider = (props)=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin,setIsLoggedin]=useState(false);
    const [userData,setUserData]=useState(false);

    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData
    }
    return(
        <Appcontent.Provider value={value}>
            {props.children}
        </Appcontent.Provider>
    )
}