"use client";
import { useState } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Glow Background */}
      <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>

      {/* Logo */}
      <h1 className="text-7xl font-bold text-white mb-2 tracking-widest z-10">
        ⚡ ZORAX
      </h1>
      <p className="text-blue-400 text-lg mb-16 z-10 tracking-widest uppercase">
        Your AI. Your Voice. Your World bcc.
      </p>

      {/* Mic Button */}
      <button
        onClick={() => setListening(!listening)}
        className={`z-10 w-28 h-28 rounded-full flex items-center justify-center text-5xl transition-all duration-300 ${
          listening
            ? "bg-red-500 shadow-lg shadow-red-500 scale-110 animate-pulse"
            : "bg-blue-600 shadow-lg shadow-blue-500 hover:scale-110"
        }`}
      >
        🎤
      </button>

      <p className="text-gray-500 mt-8 z-10 text-sm">
        {listening ? "Listening... Speak now!" : "Click mic to speak"}
      </p>

    </main>
  );
}