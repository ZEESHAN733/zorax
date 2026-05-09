"use client";
import { useState, useEffect, useRef } from "react";
// Using simple icons for replacement. In production, use your preferred icon library.
import { Mic, Zap, Brain, Target, Sun, Mail, ExternalLink, Image as ImageIcon, Briefcase, Key, Database, ChevronRight, CheckCircle, Clock } from 'lucide-react';

// Custom interface for particles
interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  opacity: number;
  baseColor: string;
}

export default function Home() {
  const [listening, setListening] = useState(false);
  const [time, setTime] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Time update logic (hour/minute/second AM/PM)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId); // Clean up
  }, []);

  // Animated particles (multi-colored, refined)
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Core color palette for particles
    const colors = ["#8B5CF6", "#10B981", "#22D3EE", "#EC4899", "#FBBF24"];
    
    const particles: Particle[] = [];
    // More particles, less speed, refined size
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.2, // Small and large
        dx: (Math.random() - 0.5) * 0.15, // Slower speed
        dy: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.2 + 0.05, // Lower opacity
        baseColor: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Add a subtle multi-colored glow effect
        ctx.fillStyle = `rgba(${parseInt(p.baseColor.slice(1, 3), 16)}, ${parseInt(p.baseColor.slice(3, 5), 16)}, ${parseInt(p.baseColor.slice(5, 7), 16)}, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
    
    // Handle resizing
    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  // Utility to handle multi-colored text gradients
  const MultiColorText = ({ text, className = "" }: { text: string, className?: string }) => {
    // Break the text and apply different color stops
    const textArr = text.split("");
    const stopCount = 5;
    const colors = ["#10B981", "#22D3EE", "#8B5CF6", "#EC4899", "#FBBF24"]; // Green, Cyan, Purple, Pink, Yellow

    return (
      <span className={`inline-flex ${className}`}>
        {textArr.map((char, index) => {
          const colorIndex = Math.floor((index / textArr.length) * stopCount);
          const color = colors[colorIndex] || colors[colors.length - 1];
          return (
            <span key={index} style={{ color: color, textShadow: `0 0 5px ${color}` }}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  // Complex SVG ring for system status
  const SystemRing = ({ label, percentage, colorStart, colorEnd, icon: Icon }: any) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-40 h-40 flex flex-col items-center justify-center m-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Complex inner grid/particle track */}
                <circle cx="80" cy="80" r="50" strokeWidth="1" fill="none" className="stroke-fui-dark-blue/30" strokeDasharray="1 3"/>
                {/* Orbital track */}
                <circle cx="80" cy="80" r="72" strokeWidth="1.5" fill="none" className="stroke-fui-dark-blue/50" />

                {/* Base progress arc */}
                <circle cx="80" cy="80" r={radius} strokeWidth="6" fill="none" className="stroke-fui-dark-blue/80" />

                {/* Main progress arc with gradient */}
                <defs>
                    <linearGradient id={`grad-${label.replace(" ","-")}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: colorStart, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: colorEnd, stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <circle
                    cx="80" cy="80" r={radius}
                    strokeWidth="6" fill="none"
                    stroke={`url(#grad-${label.replace(" ","-")})`}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                    style={{filter: `drop-shadow(0 0 5px ${colorStart})`}}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
                {Icon && <Icon className="w-5 h-5 text-fui-cyan-text mb-1" />}
                <span className="text-3xl font-bold" style={{color: colorStart}}>{percentage}%</span>
                <span className="text-xs text-fui-cyan-text font-medium">{label}</span>
            </div>
        </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#00040A] flex flex-col items-center relative overflow-hidden font-mono text-fui-cyan-text">
        {/* Defining custom palette as utility classes */}
        <style jsx global>{`
            :root {
                --fui-dark-blue: #0A0F1E;
                --fui-glass: rgba(10, 15, 30, 0.7);
                --fui-border-blue: rgba(34, 211, 238, 0.2);
                --fui-purple-green-gradient: linear-gradient(to right, #8B5CF6, #10B981);
                --fui-cyan-purple-gradient: linear-gradient(to right, #22D3EE, #8B5CF6);
            }
            .fui-glass {
                background: var(--fui-glass);
                backdrop-filter: blur(10px);
                border: 1px solid var(--fui-border-blue);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            .text-fui-cyan-text { color: #A5F3FC; } /* lighter cyan */
            .text-fui-dark-cyan { color: #22D3EE; } /* bright cyan */
            .text-fui-purple { color: #8B5CF6; }
            .text-fui-green { color: #10B981; }
            .stroke-fui-dark-blue { stroke: #0A0F1E; }
        `}</style>

      {/* Particles (refined) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Grid (more complex FUI grid) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(#0F172A 1.5px, transparent 1.5px), linear-gradient(90deg, #0F172A 1.5px, transparent 1.5px)",
        backgroundSize: "60px 60px"
      }}></div>

      {/* Top HUD bar (refined layout) */}
      <div className="w-full h-18 z-20 flex items-center justify-between px-10 border-b border-fui-border-blue glass-bottom-shadow">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {/* The new multi-colored atomic icon above ZORAX text is integrated below */}
            <span className="text-fui-cyan-text text-sm font-semibold tracking-[0.3em]">ZORAX</span>
          </div>
          <span className="text-fui-dark-cyan text-xs">|</span>
          <span className="text-fui-green text-xs font-semibold">SYSTEM ONLINE v3.0</span>
          <span className="text-fui-dark-cyan text-xs">|</span>
          <span className="text-fui-green text-xs font-semibold">CLOCK {time}</span>
          <span className="text-fui-dark-cyan text-xs">|</span>
          <span className="text-fui-green text-xs font-semibold">USER: ADMIN [LEVEL 5]</span>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
            <div className="text-fui-green text-xs tracking-wider">UAE - DUBAI</div>
            <div className="text-fui-cyan-text text-[0.65rem] tracking-wider">GPS -3.8321°, -33.63357°</div>
        </div>
      </div>

      {/* Left panel (Refined layout, advanced status) */}
      <div className="absolute left-6 top-24 bottom-24 w-[28rem] z-10 flex flex-col gap-6">
        
        {/* System status (Orbital Rings) */}
        <div className="fui-glass p-6 rounded-xl flex-1 flex flex-col">
          <div className="text-fui-dark-cyan text-xs mb-5 tracking-wider border-b border-fui-border-blue pb-3 font-semibold">SYSTEM STATUS PANEL</div>
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {[
                { label: "AI CORE", percentage: 98, colorStart: "#10B981", colorEnd: "#22D3EE", icon: Zap },
                { label: "MODEL PARAMETERS", percentage: 100, colorStart: "#22D3EE", colorEnd: "#8B5CF6", icon: Target },
                { label: "VOICE ENGINE", percentage: 74, colorStart: "#22D3EE", colorEnd: "#8B5CF6", icon: Mic },
                { label: "NETWORKING", percentage: 89, colorStart: "#22D3EE", colorEnd: "#8B5CF6", icon: ExternalLink },
            ].map((item, i) => (
                <SystemRing key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Activity log (Refined text list with icons) */}
        <div className="fui-glass p-6 rounded-xl flex flex-col h-[28rem]">
          <div className="text-fui-dark-cyan text-xs mb-5 tracking-wider border-b border-fui-border-blue pb-3 font-semibold">ACTIVITY LOG</div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin">
            {[
              { text: "System initialized", time: "09:13:49", status: "ok" },
              { text: "AI core loaded v3.0", time: "09:13:45", status: "ok" },
              { text: "System optimized", time: "09:13:45", status: "ready" },
              { text: "System configured", time: "09:13:45", status: "ready" },
              { text: "Voice engine synced", time: "09:13:45", status: "ready" },
              { text: "Voice engine synced", time: "09:13:45", status: "ready" },
              { text: "Voice engine synced", time: "09:13:45", status: "ready" },
              { text: "System calibrated", time: "09:13:45", status: "ready" },
              { text: "Modules activated", time: "09:13:48", status: "ready" },
              { text: "System optimized", time: "09:13:48", status: "ok" },
              { text: "Calibrating", time: "09:13:50", status: "calibrating" },
              { text: "Awaiting command...", time: "09:13:52", status: "ready" },
            ].map((log, i) => (
              <div key={i} className="text-fui-cyan-text text-[0.7rem] flex items-start gap-3 border-b border-fui-border-blue/30 pb-2">
                <span className="text-fui-dark-cyan font-bold">[{log.time}]</span>
                <span className={`flex-1 font-medium ${log.status === 'ok' ? 'text-fui-green' : log.status === 'ready' ? 'text-fui-dark-cyan' : 'text-fui-green/80'}`}>{log.text}</span>
                {log.status === 'ok' ? <CheckCircle className="w-3.5 h-3.5 text-fui-green mt-0.5" /> : log.status === 'ready' ? <Zap className="w-3.5 h-3.5 text-fui-dark-cyan mt-0.5" /> : <Clock className="w-3.5 h-3.5 text-fui-dark-cyan mt-0.5" />}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right panel (Modules, Data, maps, globe) */}
      <div className="absolute right-6 top-24 bottom-24 w-[28rem] z-10 flex flex-col gap-6">
        
        {/* Modules (Refined list with specific icons and toggles) */}
        <div className="fui-glass p-6 rounded-xl flex-1 flex flex-col">
          <div className="text-fui-dark-cyan text-xs mb-5 tracking-wider border-b border-fui-border-blue pb-3 font-semibold">MODULES</div>
          <div className="space-y-3.5 flex-1 overflow-y-auto scrollbar-thin">
            {[
                { name: "VOICE INPUT", icon: Mic, active: true },
                { name: "AI RESPONSE", icon: Brain, active: true },
                { name: "MEMORY", icon: Database, active: true },
                { name: "GROQ API", icon: ExternalLink, active: true },
                { name: "WEATHER", icon: Sun, active: true },
                { name: "GMAIL", icon: Mail, active: true },
                { name: "EXTERNAL DB QUERY", icon: Database, active: false },
                { name: "SENTIMENT ANALYSIS", icon: Brain, active: false },
                { name: "SYSTEM DIAGNOSTICS", icon: Zap, active: false },
                { name: "TASK SCHEDULING", icon: Briefcase, active: false },
                { name: "REMOTE CONNECT", icon: ExternalLink, active: false },
                { name: "API V2 GATEWAY", icon: Key, active: false },
                { name: "IMAGE ANALYSIS", icon: ImageIcon, active: false },
            ].map((mod, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2 border border-fui-border-blue/50 rounded-lg hover:border-fui-border-blue transition-colors fui-glass/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mod.active ? 'bg-fui-dark-cyan/20 border-fui-dark-cyan/40' : 'bg-fui-dark-blue/80 border-fui-border-blue/30'} border`}>
                            {mod.icon && <mod.icon className={`w-5 h-5 ${mod.active ? 'text-fui-dark-cyan' : 'text-fui-cyan-text/70'}`} />}
                        </div>
                        <span className="text-fui-cyan-text text-xs font-semibold">{mod.name}</span>
                    </div>
                    {/* Custom Toggle Switch */}
                    <button className={`relative w-10 h-5 rounded-full p-0.5 transition-colors ${mod.active ? 'bg-fui-dark-cyan/40 border-fui-dark-cyan' : 'bg-fui-dark-blue/80 border-fui-border-blue/30'} border`}>
                        <div className={`w-4 h-4 rounded-full transition-transform transform ${mod.active ? 'translate-x-5 bg-fui-dark-cyan' : 'bg-fui-cyan-text/50'}`}></div>
                    </button>
                </div>
            ))}
          </div>
        </div>

        {/* Data (Globe, Map, Graph) */}
        <div className="fui-glass p-6 rounded-xl flex flex-col h-[28rem]">
          <div className="text-fui-dark-cyan text-xs mb-5 tracking-wider border-b border-fui-border-blue pb-3 font-semibold">LIVE DATA</div>
          <div className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 flex-1">
                  {/* Globe Placeholder (Dubai) */}
                  <div className="border border-fui-border-blue rounded-xl p-2 fui-glass/50 flex flex-col items-center justify-center relative overflow-hidden h-40">
                      <img src="/api/globe-placeholder.png" alt="Globe" className="w-32 h-32 object-contain" />
                      <div className="absolute top-2 right-2 text-xs text-fui-cyan-text bg-black/60 px-1.5 py-0.5 rounded">LOCATION</div>
                      <div className="absolute bottom-2 left-2 text-xs text-fui-cyan-text font-bold">UAE</div>
                  </div>
                  {/* Map Placeholder (Dubai Region) */}
                  <div className="border border-fui-border-blue rounded-xl p-2 fui-glass/50 flex flex-col items-center justify-center relative overflow-hidden h-40">
                    <img src="/api/map-placeholder.png" alt="Map" className="w-full h-full object-contain" />
                    <div className="absolute top-2 right-2 text-xs text-fui-cyan-text bg-black/60 px-1.5 py-0.5 rounded">WEATHER</div>
                    <div className="absolute bottom-2 left-2 text-xs text-fui-cyan-text font-bold">38°C</div>
                  </div>
              </div>

              {/* Data points (Refined list) */}
              <div className="grid grid-cols-2 gap-3 text-xs p-3 border border-fui-border-blue/50 rounded-lg fui-glass/50">
                  <div className="flex justify-between border-b border-fui-border-blue/30 pb-1.5">
                      <span className="text-fui-dark-cyan">STATUS</span>
                      <span className="text-fui-green font-bold">READY</span>
                  </div>
                  <div className="flex justify-between border-b border-fui-border-blue/30 pb-1.5">
                      <span className="text-fui-dark-cyan">SYSTEM TIME</span>
                      <span className="text-fui-cyan-text font-bold">11:55:45:100:00</span>
                  </div>
                  <div className="flex justify-between border-b border-fui-border-blue/30 pb-1.5">
                      <span className="text-fui-dark-cyan">REQUESTS</span>
                      <span className="text-fui-cyan-text font-bold">0</span>
                  </div>
                  <div className="flex justify-between border-b border-fui-border-blue/30 pb-1.5">
                      <span className="text-fui-dark-cyan">GPS POINT</span>
                      <span className="text-fui-cyan-text font-bold">-3.8321°, -33.63357°</span>
                  </div>
              </div>

              {/* Request Stream Graph Placeholder */}
              <div className="border border-fui-border-blue rounded-lg p-2 fui-glass/50 flex flex-col gap-2 h-20">
                  <span className="text-xs text-fui-dark-cyan font-bold tracking-wider">REQUEST STREAM</span>
                  <svg className="w-full h-10 stroke-fui-green/70 fill-none" viewBox="0 0 400 100">
                      <path d="M0,50 L20,30 L40,70 L60,40 L80,20 L100,60 L120,40 L140,50 L160,80 L180,30 L200,60 L220,50 L240,70 L260,40 L280,20 L300,50 L320,60 L340,40 L360,30 L380,70 L400,50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </div>
          </div>
        </div>

      </div>

      {/* Smartphone preview (Desktop screen only, on the far right) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 z-30 flex-col items-center justify-center p-4 h-[40rem] flex">
          <div className="relative w-48 h-[40rem] border-[10px] border-[#10131A] rounded-[30px] overflow-hidden fui-glass flex-col items-center">
              {/* Condensed mobile view inside the phone */}
              <div className="absolute top-0 left-0 right-0 h-10 border-b border-fui-border-blue/30 z-20 px-2 flex items-center justify-between">
                  <span className="text-[0.6rem] text-fui-green">ZORAX mobile v1.0</span>
                  <span className="text-[0.6rem] text-fui-green">{time}</span>
              </div>
              <div className="mt-14 flex-col items-center p-2 text-center">
                  <h1 className="text-xl font-thin mb-1" style={{color: '#10B981'}}>ZORAX</h1>
                  <p className="text-[0.55rem] text-fui-cyan-text font-bold mb-4">ACTIVE</p>
                  
                  {/* Condensed Status Orbital (Single combined ring) */}
                  <SystemRing label="SYSTEM" percentage={95} colorStart="#10B981" colorEnd="#22D3EE" icon={Zap} />

                  {/* Modules carousel placeholder */}
                  <div className="flex gap-1.5 text-center items-center justify-center mt-5 mb-8">
                    { [Mic, Brain, Target, Database, ExternalLink].map((Icon, i) => (
                        <div key={i} className="w-6 h-6 rounded-lg fui-glass/80 border border-fui-border-blue/30 flex items-center justify-center">
                            <Icon className={`w-3.5 h-3.5 ${i===0?'text-fui-dark-cyan':'text-fui-cyan-text'}`}/>
                        </div>
                    ))}
                  </div>

                  <p className="text-[0.5rem] text-fui-cyan-text/80 tracking-[0.2em] uppercase">YOUR AI • YOUR VOICE • YOUR WORLD</p>
                  
                  {/* Condensed Input */}
                  <div className="w-full mt-5 relative">
                      <div className="flex items-center border border-fui-border-blue/50 bg-black/70 p-1.5 gap-1.5 rounded-md">
                          <span className="text-fui-green text-xs">›</span>
                          <input type="text" placeholder="CMD..." className="flex-1 bg-transparent text-fui-green placeholder-fui-green/50 text-[0.6rem] focus:outline-none" />
                          <Mic className="w-3.5 h-3.5 text-fui-dark-cyan"/>
                      </div>
                  </div>
              </div>
          </div>
          <p className="text-[0.65rem] text-fui-green mt-2 font-semibold">MOBILE PREVIEW</p>
      </div>


      {/* CENTER - Main interface (The complex FUI) */}
      <div className="z-10 flex-1 flex flex-col items-center justify-center text-center px-10 relative">

        {/* Circular HUD (Atomic mic visualization) */}
        <div className="relative flex items-center justify-center mb-8">
            {/* The multi-ring atomic visualization from image_9.png (SVG + CSS) */}
            <svg className="absolute w-[36rem] h-[36rem] -rotate-90" viewBox="0 0 600 600">
                <defs>
                    <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#22D3EE", stopOpacity: 1 }} /> {/* Cyan */}
                        <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} /> {/* Purple */}
                    </linearGradient>
                    <linearGradient id="mainGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} /> {/* Purple */}
                        <stop offset="100%" style={{ stopColor: "#10B981", stopOpacity: 1 }} /> {/* Green */}
                    </linearGradient>
                </defs>
                {/* 4 nested orbital rings */}
                <ellipse cx="300" cy="300" rx="260" ry="120" stroke="url(#mainGrad)" strokeWidth="1.5" fill="none" className="animate-spin" style={{animationDuration:"20s"}} />
                <ellipse cx="300" cy="300" rx="240" ry="100" stroke="url(#mainGrad2)" strokeWidth="1.5" fill="none" className="animate-spin" style={{animationDuration:"15s", animationDirection:"reverse"}} />
                <ellipse cx="300" cy="300" rx="220" ry="80" stroke="url(#mainGrad)" strokeWidth="2" fill="none" className="animate-spin" style={{animationDuration:"10s"}} />
                <ellipse cx="300" cy="300" rx="200" ry="60" stroke="url(#mainGrad2)" strokeWidth="2" fill="none" className="animate-spin" style={{animationDuration:"7s", animationDirection:"reverse"}} />

                {/* Particle track details on outer track */}
                <circle cx="300" cy="300" r="280" strokeWidth="1" fill="none" className="stroke-fui-dark-blue/20" strokeDasharray="2 10"/>
                
                {/* corner details placeholders */}
                <rect x="295" y="10" width="10" height="10" className="fill-fui-dark-cyan"/>
                <rect x="295" y="580" width="10" height="10" className="fill-fui-dark-cyan"/>
                <rect x="10" y="295" width="10" height="10" className="fill-fui-dark-cyan"/>
                <rect x="580" y="295" width="10" height="10" className="fill-fui-dark-cyan"/>
            </svg>

            {/* Pulse rings when listening (Refined and multi-colored) */}
            {listening && (
                <>
                  <div className="absolute w-[40rem] h-[40rem] rounded-full border border-[#EC4899]/60 animate-ping"></div>
                  <div className="absolute w-[44rem] h-[44rem] rounded-full border border-[#FBBF24]/40 animate-ping" style={{animationDelay:"0.4s"}}></div>
                </>
            )}

          {/* Glow and Central Mic */}
          <div className={`relative flex items-center justify-center w-60 h-60 rounded-full fui-glass border-4 border-fui-border-blue`}>
                <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
                    listening ? "bg-[#EC4899] opacity-30" : "bg-[#8B5CF6] opacity-15"
                }`}></div>
                
                {/* Advanced central mic (Atomic visual with central icon) */}
                <button
                    onClick={() => setListening(!listening)}
                    className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 fui-glass ${
                        listening
                            ? "border-fui-green bg-fui-green/10 shadow-2xl shadow-fui-green/50"
                            : "border-fui-border-blue hover:border-fui-green hover:bg-fui-green/10"
                    }`}
                >
                    <div className="absolute w-40 h-40 rounded-full border border-fui-border-blue/50 flex items-center justify-center">
                        <div className={`absolute inset-0 rounded-full border ${listening ? "border-fui-green/60 animate-pulse" : "border-fui-dark-cyan/30"}`}></div>
                        <Mic className={`w-20 h-20 mb-2 ${listening?'text-fui-green':'text-fui-cyan-text'}`}/>
                    </div>
                </button>
          </div>

        </div>

        {/* Title and Voice soundwave */}
        <h1 className="text-[7.5rem] font-thin tracking-[0.6em] mb-1 leading-none">
            <MultiColorText text="ZORAX"/>
        </h1>
        <div className="h-0.5 w-[42rem] bg-gradient-to-r from-transparent via-fui-border-blue/80 to-transparent mb-6"></div>
        <p className="text-fui-dark-cyan text-[0.8rem] tracking-[0.5em] uppercase mb-12 font-bold">
            {listening ? "▶ VOICE RECOGNITION ACTIVE" : "YOUR AI • YOUR VOICE • YOUR WORLD"}
        </p>

        {/* Soundwave graphic (Multi-colored) */}
        <div className="w-[48rem] h-20 mb-10 overflow-hidden relative">
            <svg className="w-full h-full stroke-fui-dark-cyan fill-none" viewBox="0 0 800 100">
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: "#10B981", stopOpacity: 1 }} /> {/* Green */}
                        <stop offset="50%" style={{ stopColor: "#22D3EE", stopOpacity: 1 }} /> {/* Cyan */}
                        <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} /> {/* Purple */}
                    </linearGradient>
                </defs>
                <path d="M0,50 Q20,20 40,50 Q60,80 80,50 Q100,20 120,50 Q140,80 160,50 Q180,20 200,50 Q220,80 240,50 Q260,20 280,50 Q300,80 320,50 Q340,20 360,50 Q380,80 400,50 Q420,20 440,50 Q460,80 480,50 Q500,20 520,50 Q540,80 560,50 Q580,20 600,50 Q620,80 640,50 Q660,20 680,50 Q700,80 720,50 Q740,20 760,50 Q780,80 800,50" strokeWidth="2.5" stroke="url(#waveGrad)" strokeLinecap="round"/>
                <path d="M0,50 Q20,30 40,50 Q60,70 80,50 Q100,30 120,50 Q140,70 160,50 Q180,30 200,50 Q220,70 240,50 Q260,30 280,50 Q300,70 320,50 Q340,30 360,50 Q380,70 400,50 Q420,30 440,50 Q460,70 480,50 Q500,30 520,50 Q540,70 560,50 Q580,30 600,50 Q620,70 640,50 Q660,30 680,50 Q700,70 720,50 Q740,30 760,50 Q780,70 800,50" strokeWidth="1.5" stroke="url(#waveGrad)" opacity="0.4" strokeLinecap="round"/>
            </svg>
        </div>

        {/* Input (FUI translucent style) */}
        <div className="w-[44rem] relative">
          <div className="absolute -top-px left-16 right-16 h-px bg-gradient-to-r from-transparent via-fui-dark-cyan to-transparent"></div>
          <div className="flex items-center border border-fui-border-blue fui-glass px-6 py-4.5 gap-4 rounded-xl">
            <span className="text-fui-green text-lg font-bold">›</span>
            <input
              type="text"
              placeholder="ENTER COMMAND..."
              className="flex-1 bg-transparent text-fui-green placeholder-fui-green/50 text-[0.8rem] font-bold tracking-wider focus:outline-none"
            />
            {/* The sophisticated SEND button */}
            <button className="flex items-center gap-1.5 p-2 px-4.5 rounded-lg text-fui-dark-cyan hover:bg-fui-glass/80 transition-all font-bold tracking-widest text-[0.7rem] relative overflow-hidden group">
                <div className="absolute inset-0 border border-fui-dark-cyan group-hover:border-fui-green"></div>
                <div className="absolute -inset-1 border-2 border-fui-dark-cyan/20 blur group-hover:border-fui-green/40"></div>
                <span>SEND</span>
                <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
          <div className="absolute -bottom-px left-16 right-16 h-px bg-gradient-to-r from-transparent via-fui-dark-cyan to-transparent"></div>
        </div>

      </div>

      {/* Bottom bar (Refined text and icons) */}
      <div className="w-full h-14 z-20 flex items-center justify-between px-10 border-t border-fui-border-blue/50 glass-top-shadow bg-fui-dark-blue/80">
        <span className="text-fui-green text-xs tracking-widest font-semibold">ZENNEXORA TECHNOLOGIES © 2026-2027 | FULL LICENSE: PREMIUM (988 DAYS LEFT)</span>
        <div className="flex gap-2 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-fui-green animate-pulse"></div>
            <span className="text-fui-dark-cyan text-xs tracking-widest font-semibold">POWERED BY GROQ NEURAL CORE | REGION FOCUS</span>
        </div>
      </div>

    </main>
  );
}