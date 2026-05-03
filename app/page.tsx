"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: any[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className={`absolute w-80 h-80 rounded-full blur-3xl transition-all duration-1000 ${listening ? "bg-blue-500 opacity-20 scale-150" : "bg-blue-800 opacity-10"}`}></div>
      <div className="z-10 flex flex-col items-center">
        <p className="text-gray-500 text-xs tracking-[0.5em] uppercase mb-4">Introducing</p>
        <h1 className="text-8xl font-thin text-white mb-2 tracking-[0.2em]">ZORAX</h1>
        <p className="text-gray-400 text-sm tracking-[0.3em] uppercase mb-20">
          Your AI. Your Voice. Your World.
        </p>
        <button
          onClick={() => setListening(!listening)}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${listening ? "bg-white shadow-2xl shadow-white scale-110" : "bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 backdrop-blur-sm"}`}
        >
          <span className="text-4xl">{listening ? "⏹" : "🎤"}</span>
        </button>
        <p className={`mt-8 text-sm tracking-widest transition-all duration-300 ${listening ? "text-white" : "text-gray-600"}`}>
          {listening ? "LISTENING..." : "TAP TO SPEAK"}
        </p>
      </div>
      <p className="absolute bottom-8 text-gray-700 text-xs tracking-widest">
        ZORAX AI — POWERED BY GROQ
      </p>
    </main>
  );
}