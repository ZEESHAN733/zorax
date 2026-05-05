"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
        r: Math.random() * 1 + 0.3,
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
    <main className="min-h-screen bg-[#020810] flex flex-col items-center justify-center relative overflow-hidden font-mono">

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Grid lines */}
      <div className="absolute inset-0 z-0 opacity-5"
        style={{backgroundImage: "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)", backgroundSize: "50px 50px"}}>
      </div>

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-6">
        <div className="text-cyan-400 text-xs space-y-1">
          <div className="text-cyan-300 text-lg font-bold tracking-widest">ZORAX</div>
          <div className="text-cyan-600">SYSTEM ONLINE</div>
          <div className="text-cyan-600">STATUS: READY</div>
        </div>
        <div className="text-right text-cyan-400 text-xs space-y-1">
          <div className="text-cyan-300 text-2xl font-bold">{time}</div>
          <div className="text-cyan-600 text-xs">{date}</div>
          <div className="text-cyan-600">UAE — DUBAI</div>
        </div>
      </div>

      {/* Left Panel */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 space-y-3">
        {["VOICE", "MEMORY", "CONNECT", "SECURE"].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-cyan-600 text-xs">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            {item}
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 space-y-3 text-right">
        {["AI CORE", "GROQ API", "NEURAL", "ACTIVE"].map((item, i) => (
          <div key={i} className="flex items-center justify-end gap-2 text-cyan-600 text-xs">
            {item}
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Center Content */}
      <div className="z-10 flex flex-col items-center text-center">

        {/* Outer Ring */}
        <div className={`relative flex items-center justify-center mb-8 transition-all duration-700 ${listening ? "scale-110" : ""}`}>

          {/* Rotating rings */}
          <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20 animate-spin" style={{animationDuration:"20s"}}></div>
          <div className="absolute w-56 h-56 rounded-full border border-cyan-500/30 animate-spin" style={{animationDuration:"15s", animationDirection:"reverse"}}></div>
          <div className="absolute w-48 h-48 rounded-full border border-cyan-400/20 animate-spin" style={{animationDuration:"10s"}}></div>

          {/* Ping rings when listening */}
          {listening && (
            <>
              <div className="absolute w-72 h-72 rounded-full border border-cyan-400/30 animate-ping"></div>
              <div className="absolute w-96 h-96 rounded-full border border-cyan-400/10 animate-ping" style={{animationDelay:"0.5s"}}></div>
            </>
          )}

          {/* Glow */}
          <div className={`absolute w-32 h-32 rounded-full blur-2xl transition-all duration-700 ${listening ? "bg-cyan-400 opacity-20" : "bg-cyan-800 opacity-10"}`}></div>

          {/* Mic Button */}
          <button
            onClick={() => setListening(!listening)}
            className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 ${
              listening
                ? "border-cyan-400 bg-cyan-400/10 shadow-2xl shadow-cyan-400/50"
                : "border-cyan-600/50 bg-cyan-900/20 hover:border-cyan-400 hover:bg-cyan-400/10"
            }`}
          >
            <span className="text-4xl mb-1">{listening ? "⏹" : "🎤"}</span>
            <span className="text-cyan-400 text-xs tracking-widest">{listening ? "STOP" : "SPEAK"}</span>
          </button>
        </div>

        {/* ZORAX Title */}
        <h1 className="text-5xl font-thin text-cyan-300 tracking-[0.5em] mb-2">ZORAX</h1>
        <p className="text-cyan-600 text-xs tracking-[0.3