import React, { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

export default function Welcome() {
  const [mode, setMode] = useState("login");

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT – HERO (DESKTOP ONLY) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-red-800 text-white flex-col items-center justify-center px-16">

        {/* LOGO */}
        <img
          src="/logoD.png"
          alt="HemoHub Logo"
          className="w-28 h-28 object-contain mb-6"
        />

        <h1 className="text-7xl font-extrabold tracking-tight mb-6">HemoHub</h1>

        <p className="text-2xl text-center max-w-lg leading-relaxed opacity-90">
          Connecting lives through blood donation
        </p>

        <div className="flex gap-4 mt-12">
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>

      {/* RIGHT – AUTH PANEL */}
      <div className="relative flex-1 bg-gray-50 flex flex-col justify-center px-6 py-8 lg:py-0">

        {/* MOBILE HEADER (Logo + Title) */}
        <div className="lg:hidden mb-6 flex flex-col items-center text-center">
          
          {/* LOGO on mobile */}
          <img
            src="/logoS.png"
            alt="HemoHub Logo"
            className="w-20 h-20 object-contain mb-3"
          />

          {/* App Name on mobile */}
          <h1 className="text-4xl font-extrabold text-red-700 tracking-tight">
            HemoHub
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            Connecting lives through blood donation
          </p>
        </div>

        {/* Scrollable Form Area */}
        <div className="max-w-md w-full mx-auto overflow-y-auto px-1 pb-24 lg:pb-32 scrollbar-thin scrollbar-thumb-gray-400">
          <div className="py-8 lg:py-12">
            {mode === "login" ? <Login /> : <Signup />}
          </div>
        </div>

        {/* TOGGLE BELOW FORM */}
        <div className="fixed lg:static inset-x-0 bottom-0 left-1/2 -translate-x-1/2 lg:translate-x-0 w-full max-w-md mx-auto bg-gray-50 border-t border-gray-300 z-10">
          <div className="py-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === "login" ? "New to HemoHub? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-bold text-red-600 hover:text-red-700 hover:underline transition"
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
