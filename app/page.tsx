"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [time, setTime] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    setInterval(updateTime, 1000);
  }, []);

  // Animated data streams
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const streams: any[] = [];
    for (let i = 0; i < 15; i++) {
      streams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      streams.forEach((stream) => {
        const gradient = ctx.createLinearGradient(stream.x, stream.y, stream.x, stream.y + stream.length);
        gradient.addColorStop(0, `rgba(139, 92, 246, 0)`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${stream.opacity})`);
        gradient.addColorStop(1, `rgba(168, 85, 247, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(stream.x, stream.y, 2, stream.length);
        
        stream.y += stream.speed;
        if (stream.y > canvas.height) {
          stream.y = -stream.length;
          stream.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0f0520] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Animated data streams */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600 rounded-full blur-3xl opacity-10 animate-pulse" style={{animationDelay:"1s"}}></div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-black/20 border-b border-purple-500/20 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
          <span className="text-purple-300 font-semibold tracking-wider">ZORAX AI</span>
        </div>
        <span className="text-purple-200 text-2xl font-light">{time}</span>
        <button className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all">
          Settings
        </button>
      </div>

      {/* Main content */}
      <div className="z-10 flex flex-col items-center text-center px-6 max-w-2xl">

        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur mb-6">
            <span className="text-purple-400 text-sm font-medium">AI Voice Assistant</span>
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-purple-300 bg-clip-text text-transparent mb-3 tracking-tight">
            ZORAX
          </h1>
          <p className="text-purple-400 text-sm tracking-wide">
            Your AI. Your Voice. Your World.
          </p>
        </div>

        {/* Mic button with ring */}
        <div className="relative flex items-center justify-center mb-10">
          
          {/* Outer ring */}
          <div className={`absolute w-52 h-52 rounded-full border-2 transition-all duration-700 ${
            listening ? "border-purple-400 scale-110" : "border-purple-700/30"
          }`}></div>

          {/* Pulse rings when listening */}
          {listening && (
            <>
              <div className="absolute w-60 h-60 rounded-full border border-purple-400 animate-ping"></div>
              <div className="absolute w-72 h-72 rounded-full border border-purple-400/50 animate-ping" style={{animationDelay:"0.3s"}}></div>
            </>
          )}

          {/* Inner glow */}
          <div className={`absolute w-40 h-40 rounded-full blur-2xl transition-all duration-700 ${
            listening ? "bg-purple-500 opacity-30" : "bg-purple-800 opacity-20"
          }`}></div>

          {/* Mic button */}
          <button
            onClick={() => setListening(!listening)}
            className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
              listening
                ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-2xl shadow-purple-500/50 scale-110"
                : "bg-gradient-to-br from-purple-600/50 to-violet-600/50 hover:from-purple-500/60 hover:to-violet-500/60 backdrop-blur-xl border border-purple-400/20"
            }`}
          >
            <span className="text-5xl mb-1">{listening ? "⏹" : "🎤"}</span>
            <span className="text-white text-xs font-semibold tracking-wider">
              {listening ? "STOP" : "SPEAK"}
            </span>
          </button>
        </div>

        {/* Status */}
        <p className={`text-sm font-medium tracking-wide mb-8 transition-all ${
          listening ? "text-purple-300" : "text-purple-500"
        }`}>
          {listening ? "● Listening..." : "Tap microphone to speak"}
        </p>

        {/* Input box */}
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Or type your message here..."
            className="w-full px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-purple-500/20 text-purple-100 placeholder-purple-600 text-sm focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-medium transition-all">
            Send →
          </button>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mt-6">
          {["Voice", "Text", "Settings", "Help"].map((action) => (
            <button
              key={action}
              className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-sm font-medium transition-all"
            >
              {action}
            </button>
          ))}
        </div>

      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 text-purple-600 text-xs tracking-wider">
        POWERED BY GROQ AI • ZENNEXORA © 2026
      </div>

    </main>
  );
}