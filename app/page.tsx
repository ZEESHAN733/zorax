"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [time, setTime] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "[09:13:49] System initialized ✓",
    "[09:13:45] AI core loaded v3.0",
    "[09:13:45] System initialized",
    "[09:13:45] Voice engine synced",
    "[09:13:48] Voice engine synced",
    "[09:15:58] Modules activated ⚙",
    "[09:15:52] Awaiting command...",
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    };
    updateTime();
    setInterval(updateTime, 1000);
  }, []);

  // Background particles
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: any[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${p.opacity})`;
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

  // Audio waveform
  useEffect(() => {
    const canvas = waveRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 800;
    canvas.height = 100;
    const bars = 100;
    const values = Array(bars).fill(0).map(() => Math.random());
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars;
      values.forEach((val, i) => {
        const height = listening ? val * 60 + 10 : val * 20 + 5;
        const gradient = ctx.createLinearGradient(0, canvas.height - height, 0, canvas.height);
        gradient.addColorStop(0, "rgba(147, 51, 234, 0.8)");
        gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.8)");
        gradient.addColorStop(1, "rgba(16, 185, 129, 0.8)");
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
        values[i] = Math.random();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, [listening]);

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden font-mono text-sm">

      {/* Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-blue-950/20 z-0"></div>
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
        backgroundSize: "30px 30px"
      }}></div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-14 z-30 bg-black/40 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-cyan-400 font-semibold tracking-[0.2em]">ZORAX</span>
          </div>
          <span className="text-cyan-700">|</span>
          <span className="text-cyan-600 text-xs">SYSTEM ONLINE</span>
          <span className="text-cyan-700">|</span>
          <span className="text-cyan-600 text-xs">v3.0</span>
        </div>
        <div className="text-cyan-300 text-lg tracking-wider">{time}</div>
        <div className="text-right">
          <div className="text-cyan-400 font-semibold text-xs">UAE - DUBAI</div>
          <div className="text-cyan-700 text-xs">GPS -3.8321°, -33.6335°</div>
        </div>
      </div>

      {/* Left Panel */}
      <div className="absolute left-4 top-20 bottom-16 w-80 z-20 flex flex-col gap-4">
        
        {/* System Status */}
        <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded p-4">
          <div className="text-cyan-400 mb-4 tracking-wider border-b border-cyan-500/20 pb-2">SYSTEM STATUS PANEL</div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "AI CORE", value: 98, color: "from-cyan-500 to-blue-500" },
              { name: "VOICE ENGINE", value: 100, color: "from-purple-500 to-pink-500" },
              { name: "MEMORY", value: 74, color: "from-cyan-500 to-teal-500" },
              { name: "NETWORK", value: 89, color: "from-yellow-500 to-orange-500" },
            ].map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="6" />
                    <circle cx="40" cy="40" r="35" fill="none" stroke="url(#gradient)" strokeWidth="6"
                      strokeDasharray={`${item.value * 2.2} 220`} strokeLinecap="round" className="transition-all duration-1000" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className={`text-cyan-400`} stopColor="currentColor" />
                        <stop offset="100%" className={`text-purple-400`} stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-300 font-semibold">{item.value}%</div>
                </div>
                <div className="text-cyan-600 text-xs tracking-wider">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded p-4 flex-1 overflow-hidden">
          <div className="text-cyan-400 mb-3 tracking-wider border-b border-cyan-500/20 pb-2">ACTIVITY LOG</div>
          <div className="space-y-1 overflow-y-auto max-h-64">
            {logs.map((log, i) => (
              <div key={i} className="text-cyan-700 text-xs font-mono">{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="absolute right-4 top-20 bottom-16 w-72 z-20 flex flex-col gap-4">
        
        {/* Modules */}
        <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded p-4">
          <div className="text-cyan-400 mb-3 tracking-wider border-b border-cyan-500/20 pb-2">MODULES</div>
          {[
            { icon: "🎤", name: "VOICE INPUT", active: true },
            { icon: "💬", name: "AI RESPONSE", active: true },
            { icon: "💾", name: "MEMORY", active: false },
            { icon: "⚙️", name: "GROQ API", active: false },
            { icon: "🌤️", name: "WEATHER", active: false },
            { icon: "📧", name: "GMAIL", active: false },
          ].map((mod) => (
            <div key={mod.name} className="flex items-center gap-3 mb-2">
              <span className="text-lg">{mod.icon}</span>
              <span className="text-cyan-700 text-xs flex-1">{mod.name}</span>
              <div className={`w-2 h-2 rounded-full ${mod.active ? "bg-cyan-400 animate-pulse" : "bg-cyan-800"}`}></div>
            </div>
          ))}
        </div>

        {/* Live Data */}
        <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded p-4 flex-1">
          <div className="text-cyan-400 mb-3 tracking-wider border-b border-cyan-500/20 pb-2">LIVE DATA</div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-cyan-600">WEATHER</div>
                  <div className="text-2xl text-cyan-300 font-bold">38°</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-cyan-700 mb-3 tracking-wider">REQUEST STREAM</div>
          <div className="h-20 bg-black/40 rounded overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 60">
              {Array.from({length: 50}).map((_, i) => (
                <rect key={i} x={i * 4} y={30 + Math.sin(i * 0.2) * 15} width="2" height={Math.random() * 20 + 5} fill="url(#stream)" opacity="0.6" />
              ))}
              <defs>
                <linearGradient id="stream" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Center - Main Interface */}
      <div className="z-10 flex flex-col items-center">

        {/* Circular HUD */}
        <div className="relative flex items-center justify-center mb-6">

          {/* Rotating rings */}
          <div className="absolute w-96 h-96 rounded-full border border-cyan-500/10 animate-spin" style={{animationDuration:"40s"}}></div>
          <div className="absolute w-80 h-80 rounded-full border border-purple-500/15 animate-spin" style={{animationDuration:"30s", animationDirection:"reverse"}}></div>
          <div className="absolute w-64 h-64 rounded-full border border-cyan-400/20 animate-spin" style={{animationDuration:"20s"}}></div>
          <div className="absolute w-52 h-52 rounded-full border border-blue-400/15 animate-spin" style={{animationDuration:"15s", animationDirection:"reverse"}}></div>

          {/* Pulse when listening */}
          {listening && (
            <>
              <div className="absolute w-[28rem] h-[28rem] rounded-full border border-cyan-400/30 animate-ping"></div>
              <div className="absolute w-[32rem] h-[32rem] rounded-full border border-purple-400/20 animate-ping" style={{animationDelay:"0.5s"}}></div>
            </>
          )}

          {/* Glow */}
          <div className={`absolute w-64 h-64 rounded-full blur-3xl transition-all duration-1000 ${
            listening ? "bg-gradient-to-br from-cyan-400 to-purple-500 opacity-20" : "bg-cyan-900 opacity-10"
          }`}></div>

          {/* Mic button */}
          <button
            onClick={() => setListening(!listening)}
            className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-700 ${
              listening
                ? "border-cyan-300 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 shadow-2xl shadow-cyan-400/40"
                : "border-cyan-600/40 bg-black/80 backdrop-blur-xl hover:border-cyan-400"
            }`}
          >
            <div className={`absolute inset-4 rounded-full border-2 ${listening ? "border-purple-400/40 animate-pulse" : "border-cyan-800/20"}`}></div>
            <span className="text-6xl mb-2">{listening ? "⏹" : "🎤"}</span>
            <span className="text-cyan-400 text-xs tracking-[0.3em]">{listening ? "ACTIVE" : "SPEAK"}</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-thin text-white tracking-[0.6em] mb-3">ZORAX</h1>
        <div className="h-px w-[40rem] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-3"></div>
        <p className="text-cyan-600 text-xs tracking-[0.5em] uppercase mb-8">
          YOUR AI • YOUR VOICE • YOUR WORLD
        </p>

        {/* Waveform */}
        <div className="mb-6">
          <canvas ref={waveRef} className="w-[50rem] h-24" />
        </div>

        {/* Input */}
        <div className="flex items-center gap-3">
          <div className="relative w-[40rem]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="› ENTER COMMAND..."
              className="w-full bg-black/60 backdrop-blur-xl border border-cyan-600/40 rounded px-6 py-4 text-cyan-300 placeholder-cyan-800 text-sm tracking-wider focus:outline-none focus:border-cyan-400/60"
            />
          </div>
          <button className="px-8 py-4 rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold tracking-wider transition-all">
            SEND
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-30 bg-black/40 backdrop-blur-md border-t border-cyan-500/20 flex items-center justify-between px-6">
        <span className="text-cyan-700 text-xs tracking-widest">ZENNEXORA © 2026</span>
        <span className="text-cyan-700 text-xs tracking-widest">POWERED BY GROQ AI</span>
      </div>

    </main>
  );
}