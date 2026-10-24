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
        { sub: user.sub,
          name: user.name,
          email: user.email,        
        },
        {
          withCredentials: true,
        },
      );

       if (res.data.success) {
        

      alert("Login successful");
       if (!socket.connected) {
          socket.connect();
        }
        socket.emit("joinroom", {
            userId:user.sub
        });
      navigate(`/Workflow/${encodeURIComponent(user.sub)}`);
       }
       else {
        console.log("fdxgcvbhnm");
       }
    } catch (error) {
      console.log(error);
    }
}
handlelogin();


  }, [ user,isAuthenticated,isLoading]);




  return  (
    
<>
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b16] px-4 py-12 font-sans text-white sm:px-8">

    {/* Background gradients */}
    <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[140px]" />
    <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />

    {/* Login card */}
    <div className="relative z-10 w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-12 lg:p-16">

      {/* Logo */}
      <div className="mb-9 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-5xl shadow-xl shadow-violet-500/25">
        ✦
      </div>

      <p className="mb-5 text-sm font-bold tracking-[0.3em] text-violet-300">
        WORKFLOW AUTOMATION
      </p>

      <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
        Turn ideas into
        <span className="block bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
          workflows.
        </span>
      </h1>

      <p className="mt-7 max-w-lg text-base leading-8 text-slate-400 sm:text-lg">
        Build, connect, and run intelligent workflows
        with a visual, drag-and-drop workspace.
      </p>

      {/* Features */}
      <div className="my-10 space-y-7">

        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/10 text-2xl text-violet-300">
            ◈
          </div>

          <div className="pt-1">
            <h3 className="text-base font-semibold text-slate-200 sm:text-lg">
              Visual workflow builder
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
              Connect nodes with simple drag and drop.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/10 text-2xl text-indigo-300">
            ⚡
          </div>

          <div className="pt-1">
            <h3 className="text-base font-semibold text-slate-200 sm:text-lg">
              Real-time execution
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
              Monitor workflow progress as it happens.
            </p>
          </div>
        </div>

      </div>

      {/* Login button */}
      <button
        onClick={login_button}
        className="group flex min-h-[68px] w-full items-center justify-between rounded-2xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-5 text-base font-bold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-1 hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:translate-y-0 sm:text-lg"
      >
        <span>Continue with Auth0</span>
        <span className="text-2xl transition-transform duration-200 group-hover:translate-x-2">
          →
        </span>
      </button>

      <p className="mt-7 text-center text-sm text-slate-500">
        Secure sign-in · Your workspace awaits
      </p>
    </div>

    {/* Footer */}
    <p className="absolute bottom-4 px-4 text-center text-[10px] font-semibold tracking-[0.3em] text-slate-600">
      DESIGNED FOR CONNECTED THINKING
    </p>

  </div>
</>

  );
}

export default Login;
