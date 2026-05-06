"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [bootText, setBootText] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixRef = useRef<HTMLCanvasElement>(null);

  const bootLines = [
    "ZORAX SYSTEM v2.0.26 INITIALIZING...",
    "LOADING AI CORE... OK",
    "CONNECTING NEURAL NETWORK... OK",
    "VOICE RECOGNITION MODULE... READY",
    "GROQ API CONNECTION... ESTABLISHED",
    "MEMORY BANK... ONLINE",
    "SECURITY PROTOCOLS... ACTIVE",
    "ALL SYSTEMS NOMINAL. WELCOME.",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setBootText((prev) => [...prev, bootLines[i]]);
        i++;
      } else clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Matrix rain
  useEffect(() => {
    const canvas = matrixRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops: number[] = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコZORAXABCDEFGHIJKLMN01010101";
    function draw() {
      ctx.fillStyle = "rgba(2,8,16,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,255,255,0.08)";
      ctx.font = "12px monospace";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  // Particles
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: any[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,255,${p.opacity})`;
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
    <main className="min-h-screen bg-[#020810] flex flex-col items-center justify-center relative overflow-hidden font-mono select-none">

      {/* Matrix Rain */}
      <canvas ref={matrixRef} className="absolute inset-0 z-0" />

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-1" />

      {/* Scan line effect */}
      <div className="absolute inset-0 z-2 pointer-events-none"
        style={{background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.01) 2px, rgba(0,255,255,0.01) 4px)"}}>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b border-cyan-500/10 bg-[#020810]/80 backdrop-blur px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-cyan-400 text-xs tracking-[0.4em]">ZORAX AI SYSTEM</span>
          <span className="text-cyan-700 text-xs">|</span>
          <span className="text-cyan-600 text-xs">v2.0.26</span>
        </div>
        <div className="text-cyan-300 text-sm tracking-widest font-bold">{time}</div>
        <div className="text-cyan-600 text-xs tracking-wider">{date}</div>
      </div>

      {/* Left Panel */}
      <div className="absolute left-4 top-20 bottom-20 z-20 w-48 flex flex-col gap-3">

        {/* Boot log */}
        <div className="border border-cyan-500/20 bg-black/40 backdrop-blur p-3 flex-1">
          <div className="text-cyan-500 text-xs mb-2 tracking-widest border-b border-cyan-500/20 pb-1">SYSTEM LOG</div>
          <div className="space-y-1">
            {bootText.map((line, i) => (
              <div key={i} className="text-cyan-700 text-xs leading-relaxed">
                <span className="text-cyan-500">›</span> {line}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="border border-cyan-500/20 bg-black/40 backdrop-blur p-3">
          <div className="text-cyan-500 text-xs mb-2 tracking-widest border-b border-cyan-500/20 pb-1">STATUS</div>
          {[
            { label: "AI CORE", value: 98 },
            { label: "VOICE", value: 100 },
            { label: "MEMORY", value: 72 },
            { label: "NETWORK", value: 85 },
          ].map((item, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyan-700">{item.label}</span>
                <span className="text-cyan-500">{item.value}%</span>
              </div>
              <div className="h-px bg-cyan-900">
                <div className="h-px bg-cyan-400" style={{ width: `${item.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Panel */}
      <div className="absolute right-4 top-20 bottom-20 z-20 w-48 flex flex-col gap-3">

        {/* Info panel */}
        <div className="border border-cyan-500/20 bg-black/40 backdrop-blur p-3">
          <div className="text-cyan-500 text-xs mb-2 tracking-widest border-b border-cyan-500/20 pb-1">MODULES</div>
          {["VOICE INPUT", "AI RESPONSE", "GMAIL API", "WEATHER", "MEMORY SAVE", "TRANSLATE"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${i < 2 ? "bg-cyan-400 animate-pulse" : "bg-cyan-800"}`}></div>
              <span className="text-cyan-700 text-xs">{item}</span>
            </div>
          ))}
        </div>

        {/* Live data */}
        <div className="border border-cyan-500/20 bg-black/40 backdrop-blur p-3 flex-1">
          <div className="text-cyan-500 text-xs mb-2 tracking-widest border-b border-cyan-500/20 pb-1">LIVE DATA</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-cyan-700">LOCATION</span>
              <span className="text-cyan-500">UAE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-700">WEATHER</span>
              <span className="text-cyan-500">38°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-700">REQUESTS</span>
              <span className="text-cyan-500">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-700">SESSION</span>
              <span className="text-cyan-500">ACTIVE</span>
            </div>
          </div>
        </div>

      </div>

      {/* CENTER - Main Interface */}
      <div className="z-10 flex flex-col items-center text-center relative">

        {/* Outer rotating rings */}
        <div className="relative flex items-center justify-center mb-6">

          <div className="absolute w-72 h-72 rounded-full border border-cyan-500/10 animate-spin" style={{animationDuration:"30s"}}></div>
          <div className="absolute w-64 h-64 rounded-full border border-cyan-500/15 animate-spin" style={{animationDuration:"20s", animationDirection:"reverse"}}></div>
          <div className="absolute w-56 h-56 rounded-full border border-cyan-400/20 animate-spin" style={{animationDuration:"15s"}}></div>
          <div className="absolute w-48 h-48 rounded-full border border-cyan-300/10 animate-spin" style={{animationDuration:"10s", animationDirection:"reverse"}}></div>

          {/* Corner marks on ring */}
          <div className="absolute w-72 h-72 flex items-center justify-center">
            {[0, 90, 180, 270].map((deg, i) => (
              <div key={i} className="absolute w-2 h-2 border border-cyan-400"
                style={{transform: `rotate(${deg}deg) translateY(-136px)`}}>
              </div>
            ))}
          </div>

          {/* Ping rings when listening */}
          {listening && (
            <>
              <div className="absolute w-80 h-80 rounded-full border border-cyan-400/40 animate-ping"></div>
              <div className="absolute w-96 h-96 rounded-full border border-cyan-400/20 animate-ping" style={{animationDelay:"0.3s"}}></div>
            </>
          )}

          {/* Center glow */}
          <div className={`absolute w-40 h-40 rounded-full blur-3xl transition-all duration-700 ${listening ? "bg-cyan-400 opacity-20" : "bg-cyan-900 opacity-30"}`}></div>

          {/* Mic Button */}
          <button
            onClick={() => setListening(!listening)}
            className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 z-10 ${
              listening
                ? "border-cyan-300 bg-cyan-400/10 shadow-2xl shadow-cyan-400/40"
                : "border-cyan-600/40 bg-black/60 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20"
            }`}
          >
            <div className={`absolute inset-2 rounded-full border ${listening ? "border-cyan-400/30 animate-pulse" : "border-cyan-800/30"}`}></div>
            <span className="text-4xl mb-1">{listening ? "⏹" : "🎤"}</span>
            <span className="text-cyan-400 text-xs tracking-widest">{listening ? "ACTIVE" : "SPEAK"}</span>
          </button>

        </div>

        {/* ZORAX Title */}
        <div className="mb-1">
          <h1 className="text-6xl font-thin text-white tracking-[0.6em]">ZORAX</h1>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-2"></div>
        </div>

        <p className={`text-xs tracking-[0.4em] uppercase mb-6 transition-all duration-500 ${listening ? "text-cyan-300" : "text-cyan-700"}`}>
          {listening ? "▶ VOICE RECOGNITION ACTIVE" : "YOUR AI • YOUR VOICE • YOUR WORLD"}
        </p>

        {/* Command Input */}
        <div className="relative w-96">
          <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="flex items-center border border-cyan-600/30 bg-black/60 backdrop-blur px-4 py-3 gap-3">
            <span className="text-cyan-500 text-xs">›</span>
            <input
              type="text"
              placeholder="ENTER COMMAND OR QUESTION..."
              className="flex-1 bg-transparent text-cyan-300 placeholder-cyan-800 text-xs tracking-wider focus:outline-none"
            />
            <button className="text-cyan-600 hover:text-cyan-400 text-xs tracking-widest transition-all">SEND</button>
          </div>
          <div className="absolute -bottom-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-cyan-500/10 bg-[#020810]/80 backdrop-blur px-8 py-2 flex justify-between items-center">
        <span className="text-cyan-700 text-xs tracking-widest">ZENNEXORA SYSTEMS © 2026</span>
        <div className="flex gap-6">
          {["VOICE", "MEMORY", "CONNECT", "SETTINGS"].map((item, i) => (
            <span key={i} className="text-cyan-700 hover:text-cyan-400 text-xs tracking-widest cursor-pointer transition-all">{item}</span>
          ))}
        </div>
        <span className="text-cyan-700 text-xs tracking-widest">POWERED BY GROQ AI</span>
      </div>

    </main>
  );
}