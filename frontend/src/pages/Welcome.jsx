import React, { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { ModeToggle } from "@/components/mode-toggle";


export default function Welcome() {
  const [mode, setMode] = useState("login");

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-background text-foreground">

      {/* LEFT (DESKTOP ONLY) */}
      <div className="hidden lg:flex lg:w-1/2 
        bg-gradient-to-br from-red-600 to-red-800 
        dark:from-red-900 dark:to-black
        text-white flex-col items-center justify-center px-16">
          

        <img src="/logoD.png" alt="HemoHub Logo" className="w-28 h-28 mb-6" />

        <h1 className="text-7xl font-extrabold tracking-tight mb-6">
          HemoHub
        </h1>

        <p className="text-2xl text-center max-w-lg leading-relaxed opacity-90">
          Connecting lives through blood donation
        </p>

        <div className="flex gap-4 mt-12">
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
        <div className="py-4">
<ModeToggle/>
        </div>
          
      </div>

      {/* RIGHT PANEL */}
      <div className="relative flex-1 
        bg-gray-50 dark:bg-gray-900 
        flex flex-col justify-center px-6 py-8 lg:py-0">

        {/* Mobile Header */}
        <div className="lg:hidden mb-6 flex flex-col items-center text-center">
          <img src="/logoS.png" alt="HemoHub Logo" className="w-20 h-20 mb-3" />

          <h1 className="text-4xl font-extrabold text-red-700 dark:text-red-400">
            HemoHub
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Connecting lives through blood donation
          </p>
           <div className="py-4">
<ModeToggle/>
        </div>

        </div>
         
        {/* Scrollable Form */}
        <div className="max-w-md w-full mx-auto overflow-y-auto px-1 
          pb-24 lg:pb-32 
          scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">

          <div className="py-8 lg:py-12">
            {mode === "login" ? (
              <Login />
            ) : (
              <Signup onSuccess={() => setMode("login")} />
            )}
          </div>
        </div>

        {/* SWITCH */}
        <div className="
          fixed lg:static 
          inset-x-0 bottom-0 left-1/2 -translate-x-1/2 lg:translate-x-0 
          w-full max-w-md mx-auto
          bg-gray-50 dark:bg-gray-900
          border-t border-gray-300 dark:border-gray-700
          z-10">

          <div className="py-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {mode === "login" ? "New to HemoHub? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                {mode === "login" ? "Create an account" : "Sign in instead"}
              </button>
            </p>
             
          </div>
        
        </div>

      </div>
    </div>
  );
}
