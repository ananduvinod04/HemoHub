import React, { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { ModeToggle } from "@/components/mode-toggle";

export default function Welcome() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">

      {/* LEFT PANEL (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 
        bg-gradient-to-br from-red-600 to-red-800 
        dark:from-red-900 dark:to-black
        text-white flex-col items-center justify-center px-16">

        <img src="/logoD.png" alt="HemoHub Logo" className="w-28 h-28 mb-6" />

        <h1 className="text-7xl font-extrabold tracking-tight mb-4">
          HemoHub
        </h1>

        <p className="text-2xl text-center max-w-lg leading-relaxed opacity-90">
          Connecting lives through blood donation
        </p>

        <div className="flex gap-4 mt-10">
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce delay-75"></div>
          <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce delay-150"></div>
        </div>

        <div className="mt-8">
          <ModeToggle />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col px-6 py-4 lg:py-0">

        {/* Mobile Header */}
        <div className="lg:hidden flex flex-col items-center mt-6 mb-6">
          <img src="/logoS.png" alt="HemoHub Logo" className="w-20 h-20 mb-3" />

          <h1 className="text-4xl font-extrabold text-red-700 dark:text-red-400">
            HemoHub
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Connecting lives through blood donation
          </p>

          <div className="mt-4">
            <ModeToggle />
          </div>
        </div>

        {/* MAIN FORM AREA (NO OVERFLOW, NO SCROLL CUTTING) */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-md pb-20">
            {mode === "login" ? (
              <Login />
            ) : (
              <Signup onSuccess={() => setMode("login")} />
            )}
          </div>
        </div>

        {/* SWITCH BUTTON */}
        <div className="w-full
            border-t py-5 text-center">

          <p className="text-sm text-gray-700 dark:text-gray-300">
            {mode === "login"
              ? "New to HemoHub? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}
