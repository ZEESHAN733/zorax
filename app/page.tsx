"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: any[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.opacity})`;
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
    <main className="min-h-screen bg-[#030007] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-5"></div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center px-6">

        {/* Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs tracking-widest uppercase">
          AI Voice Assistant
        </div>

        {/* Logo */}
        <h1 className="text-7xl md:text-9xl font-extralight text-white mb-3 tracking-[0.15em]">
          ZORAX
        </h1>
        <p className="text-gray-500 text-sm tracking-[0.4em] uppercase mb-16">
          Your AI. Your Voice. Your World.
        </p>

        {/* Mic Button with rings */}
        <div className="relative flex items-center justify-center mb-10">
          {listening && (
            <>
              <div className="absolute w-36 h-36 rounded-full border border-purple-500/30 animate-ping"></div>
              <div className="absolute w-52 h-52 rounded-full border border-purple-500/10 animate-ping" style={{animationDelay:"0.3s"}}></div>
              <div className="absolute w-72 h-72 rounded-full border border-purple-500/5 animate-ping" style={{animationDelay:"0.6s"}}></div>
            </>
          )}
          <button
            onClick={() => setListening(!listening)}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 ${
              listening
                ? "bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl shadow-purple-500/50 scale-110"
                : "bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 hover:scale-105"
            }`}
          >
            <span className="text-5xl">{listening ? "⏹" : "🎤"}</span>
          </button>
        </div>

        {/* Status */}
        <p className={`text-sm tracking-[0.3em] uppercase transition-all duration-500 mb-12 ${listening ? "text-purple-400" : "text-gray-600"}`}>
          {listening ? "● Listening..." : "Tap to speak"}
        </p>

        {/* Input Box */}
        <div className="w-full max-w-md relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Or type your message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center hover:bg-purple-400 transition-all">
            <span className="text-white text-sm">→</span>
          </button>
        </div>

      </div>

      {/* Bottom */}
      <p className="absolute bottom-8 text-gray-700 text-xs tracking-widest z-10">
        ZORAX AI — POWERED BY GROQ
      </p>

    </main>
  );
}