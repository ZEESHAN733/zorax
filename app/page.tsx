"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [time, setTime] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    setInterval(updateTime, 1000);
  }, []);

  // Animated particles
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: any[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <main className="min-h-screen bg-[#000810] flex items-center justify-center relative overflow-hidden font-mono">

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}></div>

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-8 border-b border-cyan-500/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-cyan-400 text-sm tracking-[0.3em]">ZORAX</span>
          </div>
          <span className="text-cyan-700 text-xs">|</span>
          <span className="text-cyan-700 text-xs">SYSTEM ONLINE</span>
          <span className="text-cyan-700 text-xs">|</span>
          <span className="text-cyan-700 text-xs">v2.0</span>
        </div>
        <div className="text-cyan-300 text-xl font-light tracking-wider">{time}</div>
        <div className="text-cyan-700 text-xs tracking-wider">UAE — DUBAI</div>
      </div>

      {/* Left panel */}
      <div className="absolute left-4 top-20 bottom-20 w-56 z-10">
        
        {/* System status */}
        <div className="border border-cyan-500/20 bg-black/60 backdrop-blur p-4 mb-4">
          <div className="text-cyan-400 text-xs mb-3 tracking-wider border-b border-cyan-500/20 pb-2">SYSTEM STATUS</div>
          {[
            { name: "AI CORE", val: 98 },
            { name: "VOICE ENGINE", val: 100 },
            { name: "MEMORY", val: 74 },
            { name: "NETWORK", val: 89 },
          ].map((item) => (
            <div key={item.name} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyan-700">{item.name}</span>
                <span className="text-cyan-400">{item.val}%</span>
              </div>
              <div className="h-1 bg-cyan-950 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000"
                  style={{ width: `${item.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity log */}
        <div className="border border-cyan-500/20 bg-black/60 backdrop-blur p-4">
          <div className="text-cyan-400 text-xs mb-3 tracking-wider border-b border-cyan-500/20 pb-2">ACTIVITY LOG</div>
          <div className="space-y-2">
            {[
              "System initialized",
              "AI core loaded",
              "Voice ready",
              "Awaiting input...",
            ].map((log, i) => (
              <div key={i} className="text-cyan-700 text-xs flex items-start gap-2">
                <span className="text-cyan-500">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right panel */}
      <div className="absolute right-4 top-20 bottom-20 w-56 z-10">
        
        {/* Modules */}
        <div className="border border-cyan-500/20 bg-black/60 backdrop-blur p-4 mb-4">
          <div className="text-cyan-400 text-xs mb-3 tracking-wider border-b border-cyan-500/20 pb-2">MODULES</div>
          {["VOICE INPUT", "AI RESPONSE", "MEMORY", "GROQ API", "WEATHER", "GMAIL"].map((mod, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${i < 2 ? "bg-cyan-400 animate-pulse" : "bg-cyan-800"}`}></div>
              <span className="text-cyan-700 text-xs">{mod}</span>
            </div>
          ))}
        </div>

        {/* Data */}
        <div className="border border-cyan-500/20 bg-black/60 backdrop-blur p-4">
          <div className="text-cyan-400 text-xs mb-3 tracking-wider border-b border-cyan-500/20 pb-2">LIVE DATA</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-cyan-700">LOCATION</span>
              <span className="text-cyan-400">UAE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-700">WEATHER</span>
              <span className="text-cyan-400">38°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-700">REQUESTS</span>
              <span className="text-cyan-400">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-700">STATUS</span>
              <span className="text-cyan-400">READY</span>
            </div>
          </div>
        </div>

      </div>

      {/* CENTER - Main interface */}
      <div className="z-10 flex flex-col items-center">

        {/* Circular HUD */}
        <div className="relative flex items-center justify-center mb-6">

          {/* Outer rotating rings */}
          <div className="absolute w-80 h-80 rounded-full border border-cyan-500/10 animate-spin" style={{animationDuration:"30s"}}></div>
          <div className="absolute w-72 h-72 rounded-full border border-cyan-500/15 animate-spin" style={{animationDuration:"20s", animationDirection:"reverse"}}></div>
          <div className="absolute w-64 h-64 rounded-full border border-cyan-400/20 animate-spin" style={{animationDuration:"15s"}}></div>
          <div className="absolute w-56 h-56 rounded-full border border-cyan-300/15 animate-spin" style={{animationDuration:"10s", animationDirection:"reverse"}}></div>

          {/* Corner markers */}
          {[0, 90, 180, 270].map((deg) => (
            <div key={deg} className="absolute w-3 h-3 border border-cyan-400"
              style={{ transform: `rotate(${deg}deg) translateY(-140px)` }}></div>
          ))}

          {/* Pulse rings when listening */}
          {listening && (
            <>
              <div className="absolute w-96 h-96 rounded-full border border-cyan-400/40 animate-ping"></div>
              <div className="absolute w-[28rem] h-[28rem] rounded-full border border-cyan-400/20 animate-ping" style={{animationDelay:"0.4s"}}></div>
            </>
          )}

          {/* Glow */}
          <div className={`absolute w-48 h-48 rounded-full blur-3xl transition-all duration-700 ${
            listening ? "bg-cyan-400 opacity-20" : "bg-cyan-800 opacity-10"
          }`}></div>

          {/* Mic button */}
          <button
            onClick={() => setListening(!listening)}
            className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 ${
              listening
                ? "border-cyan-300 bg-cyan-400/10 shadow-2xl shadow-cyan-400/40"
                : "border-cyan-600/40 bg-black/80 backdrop-blur hover:border-cyan-400 hover:bg-cyan-400/5"
            }`}
          >
            <div className={`absolute inset-3 rounded-full border ${listening ? "border-cyan-400/30 animate-pulse" : "border-cyan-800/20"}`}></div>
            <span className="text-5xl mb-2">{listening ? "⏹" : "🎤"}</span>
            <span className="text-cyan-400 text-xs tracking-[0.3em]">{listening ? "ACTIVE" : "SPEAK"}</span>
          </button>

        </div>

        {/* Title */}
        <h1 className="text-6xl font-thin text-cyan-300 tracking-[0.5em] mb-2">ZORAX</h1>
        <div className="h-px w-96 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-4"></div>
        <p className="text-cyan-700 text-xs tracking-[0.4em] uppercase mb-8">
          {listening ? "▶ VOICE RECOGNITION ACTIVE" : "YOUR AI • YOUR VOICE • YOUR WORLD"}
        </p>

        {/* Input */}
        <div className="w-[32rem] relative">
          <div className="absolute -top-px left-16 right-16 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="flex items-center border border-cyan-600/30 bg-black/80 backdrop-blur px-5 py-4 gap-3">
            <span className="text-cyan-500 text-sm">›</span>
            <input
              type="text"
              placeholder="ENTER COMMAND..."
              className="flex-1 bg-transparent text-cyan-300 placeholder-cyan-800 text-xs tracking-wider focus:outline-none"
            />
            <button className="text-cyan-600 hover:text-cyan-400 text-xs tracking-widest transition-all">SEND</button>
          </div>
          <div className="absolute -bottom-px left-16 right-16 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-20 flex items-center justify-between px-8 border-t border-cyan-500/10">
        <span className="text-cyan-700 text-xs tracking-widest">ZENNEXORA © 2026</span>
        <span className="text-cyan-700 text-xs tracking-widest">POWERED BY GROQ AI</span>
      </div>

    </main>
  );
}