import { useAuth0 } from "@auth0/auth0-react";
import { useState,useEffect } from "react";
import conf from "../conf/conf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/Socket";




function Login() {
    const navigate = useNavigate();
    const socket = useSocket();

  const {
    
    loginWithRedirect,
    user,
 isAuthenticated,
 isLoading } = useAuth0();

    const login_button =async() => {
        await loginWithRedirect();
     

    }
    useEffect(() => {
        if(!user||!isAuthenticated|| isLoading) return
    if ( user) {
      console.log("Logged-in user:", user);
    }
    const handlelogin = async() => {
        try {
      const res = await axios.post(
        `${conf.path}/user/login`,
        {
          name: user.name,
          email: user.email,        
        },
        {
          withCredentials: true,
        },
      );

      alert("Login successful");
       if (!socket.connected) {
          socket.connect();
        }
        socket.emit("joinroom", {
            userId:user.sub
        });
      navigate(`/Workflow/${encodeURIComponent(user.sub)}`);
    } catch (error) {
      console.log(error);
    }
}
handlelogin();


  }, [ user,isAuthenticated,isLoading]);




  return  (
    <>
    

      <button onClick={login_button}>Login</button>
    </>
  );
}

export default Login;
