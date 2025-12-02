import React from "react";
import { Heart } from "lucide-react";

export default function Loader({ size = 48, className = "" }) {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
          <div className="flex flex-col items-center justify-center h-screen w-full"
         style={{ transform: "translateY(-8%)" }}>

      {/* Heartbeat Animation */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.35); }
          28% { transform: scale(1); }
          42% { transform: scale(1.18); }
          70% { transform: scale(1); }
        }
      `}</style>

      <div
        style={{
          animation: "heartbeat 1s ease-in-out infinite",
          transformOrigin: "center",
        }}
      >
        <Heart size={150} className="text-red-600" />
      </div>

      {/* Static Loading Text */}
      <div className="mt-6 text-2xl font-semibold text-red-600">
        Loading...
      </div>
    </div>

  );
}