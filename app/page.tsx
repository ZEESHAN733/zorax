"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    setInterval(updateTime, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/5 via-transparent to-transparent blur-3xl animate-pulse" style={{animationDuration:"4s"}}></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/5 via-transparent to-transparent blur-3xl animate-pulse" style={{animationDuration:"6s"}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]"></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
            Z
          </div>
          <span className="text-xl font-semibold tracking-tight">ZORAX</span>
          <span className="text-xs text-gray-500 ml-2">AI Assistant</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-sm text-gray-400">{time}</span>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">Settings</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-24">

        {/* Status Badge */}
        <div className="mb-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm text-gray-300">Online & Ready</span>
        </div>

        {/* Main Circle Interface */}
        <div className="relative mb-16">
          
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
            listening 
              ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl scale-150" 
              : "bg-blue-600/10 blur-2xl"
          }`}></div>

          {/* Outer ring */}
          <div className={`relative w-80 h-80 rounded-full border-2 transition-all duration-700 ${
            listening ? "border-blue-400 scale-105" : "border-white/10"
          }`}>
            
            {/* Inner circle */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-black border border-white/5 flex items-center justify-center">
              
              {/* Mic button */}
              <button
                onClick={() => setListening(!listening)}
                className={`w-32 h-32 rounded-full transition-all duration-500 flex flex-col items-center justify-center gap-2 ${
                  listening
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/50 scale-110"
                    : "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-white/10"
                }`}
              >
                <span className="text-5xl">{listening ? "⏹" : "🎤"}</span>
                <span className="text-xs font-medium tracking-wider opacity-80">
                  {listening ? "LISTENING" : "TAP TO SPEAK"}
                </span>
              </button>

            </div>

            {/* Pulse rings when active */}
            {listening && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"></div>
                <div className="absolute -inset-8 rounded-full border border-blue-400/20 animate-ping" style={{animationDelay:"0.3s"}}></div>
              </>
            )}

          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Your AI Assistant
          </h1>
          <p className="text-gray-400 text-lg">
            Speak naturally. Get instant, intelligent responses.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Or type your message here..."
              className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-base focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all">
              Send
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex gap-3 mt-4 justify-center flex-wrap">
            {["Check weather", "Set reminder", "Send email", "Translate"].map((text) => (
              <button key={text} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-all">
                {text}
              </button>
            ))}
          </div>
        </div>

      </main>

      {/* Bottom Stats Bar */}
      <div className="relative z-20 border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-400">AI Core Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-400">Voice Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-400">Groq API Connected</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">Powered by ZORAX AI</span>
        </div>
      </div>

    </div>
  );
}