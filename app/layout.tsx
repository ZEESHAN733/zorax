"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string; content: string; image?: string; files?: any[]}[]>([
    { role: "assistant", content: "Hello! I'm ZORAX, your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [voiceLines, setVoiceLines] = useState([0, 0, 0, 0, 0]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceLinesRef = useRef<any>([0, 0, 0, 0, 0]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Animate voice recording lines
  useEffect(() => {
    if (!listening) return;

    const interval = setInterval(() => {
      const newLines = [0, 1, 2, 3, 4].map(() => Math.random() * 100);
      voiceLinesRef.current = newLines;
      setVoiceLines(newLines);
    }, 100);

    return () => clearInterval(interval);
  }, [listening]);

  // Handle paste images (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        id: Date.now() + Math.random(),
      }));
      
      // Handle images separately for preview
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImagePreview(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
      
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  const removeFile = (id: number) => {
    setAttachedFiles(attachedFiles.filter((f) => f.id !== id));
  };

  const sendMessage = () => {
    if (!input.trim() && !imagePreview && attachedFiles.length === 0) return;
    
    const newMsg: any = { 
      role: "user", 
      content: input || (attachedFiles.length > 0 ? `Sent ${attachedFiles.length} file(s)` : "Image")
    };
    if (imagePreview) newMsg.image = imagePreview;
    if (attachedFiles.length > 0) newMsg.files = attachedFiles;
    
    setMessages([...messages, newMsg]);
    setInput("");
    setImagePreview(null);
    setAttachedFiles([]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm powered by Groq! Ready to help with any questions. Connect your Groq API key to get started." 
      }]);
    }, 800);
  };

  const handleVoice = () => {
    if (listening) {
      setListening(false);
      setVoiceLines([0, 0, 0, 0, 0]);
      setMessages(prev => [...prev, 
        { role: "user", content: "Voice message" },
        { role: "assistant", content: "Voice input received! Web Speech API integration coming soon." }
      ]);
    } else {
      setListening(true);
    }
  };

  const menuOptions = [
    { label: "New chat", icon: "+" },
    { label: "Code Snippets", icon: "</>" },
    { label: "Quick Actions", icon: "⚡" },
    { label: "History", icon: "📜" },
    { label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex overflow-hidden">

      {/* Background Gradient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay:"2s"}}></div>
      </div>

      {/* SIDEBAR */}
      <aside className={`relative z-20 ${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-white/10 bg-black/30 backdrop-blur-xl flex flex-col hidden md:flex`}>
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {/* Modern ZORAX Logo */}
                <div className="relative w-11 h-11">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </linearGradient>
                      <linearGradient id="gradientPink" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#db2777" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Cyan A */}
                    <path
                      d="M 20 80 L 50 20 L 80 80 M 35 55 L 65 55"
                      stroke="url(#gradientCyan)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Pink Swoosh */}
                    <path
                      d="M 70 45 Q 85 35 90 20"
                      stroke="url(#gradientPink)"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />
                    {/* Glow dot */}
                    <circle cx="90" cy="20" r="3" fill="url(#gradientPink)" opacity="0.8" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">ZORAX</h2>
                  <p className="text-xs text-blue-300/60">AI Assistant</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">New chat</span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm">Search</span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 transition-colors text-left">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm">Chats</span>
              </button>

              <div className="pt-4 pb-2">
                <p className="text-xs text-gray-500 px-3 mb-2">RECENTS</p>
                {["AI project ideas", "Code review help", "Learn Next.js"].map((chat, i) => (
                  <button key={i} className="w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left text-sm text-gray-300 truncate">
                    {chat}
                  </button>
                ))}
              </div>
            </nav>

            {/* User Profile */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-semibold text-sm">
                  Z
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">ZORAX</p>
                  <p className="text-xs text-gray-400">Premium</p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl flex-shrink-0">
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Mobile Logo */}
              <div className="md:hidden flex items-center gap-2">
                <div className="w-9 h-9">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="gradientCyan2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </linearGradient>
                      <linearGradient id="gradientPink2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#db2777" />
                      </linearGradient>
                    </defs>
                    <path d="M 20 80 L 50 20 L 80 80 M 35 55 L 65 55" stroke="url(#gradientCyan2)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 70 45 Q 85 35 90 20" stroke="url(#gradientPink2)" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">ZORAX</span>
              </div>
            </div>

            {/* Header Right */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-400 hidden sm:inline">AI Online</span>
              </div>

              {/* Settings Button */}
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Menu Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur border border-blue-500/30 rounded-lg shadow-xl z-50">
                    {menuOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setShowMenu(false)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition text-left border-b border-blue-500/10 last:border-b-0"
                      >
                        <span className="text-cyan-400 text-lg">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CHAT MESSAGES */}
        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "justify-end" : ""}`}>
                {/* AI Avatar */}
                {msg.role === "assistant" && (
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-50"></div>
                    <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[85%] md:max-w-3xl rounded-2xl px-5 md:px-7 py-4 md:py-5 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100"
                }`}>
                  {/* Image Preview */}
                  {msg.image && <img src={msg.image} alt="Attached" className="rounded-lg mb-3 max-w-full" />}
                  
                  {/* Files List */}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mb-3 space-y-2 pb-3 border-b border-white/20">
                      {msg.files.map((file: any) => (
                        <div key={file.id} className="flex items-center gap-2 text-xs opacity-80">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Message Text */}
                  <p className="text-base md:text-lg leading-relaxed">{msg.content}</p>
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-semibold flex-shrink-0 border border-white/20">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Voice Recording Indicator */}
            {listening && (
              <div className="flex gap-3 md:gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-md opacity-70 animate-pulse"></div>
                  <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-5 md:px-7 py-4 md:py-5 flex items-center gap-2">
                  {/* Animated Voice Lines */}
                  {voiceLines.map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-cyan-400 to-pink-400 rounded-full transition-all duration-100"
                      style={{
                        height: `${height}px`,
                        minHeight: '4px',
                      }}
                    />
                  ))}
                  <span className="text-red-400 text-base md:text-lg ml-3">● Listening...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* INPUT SECTION */}
        <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-xl flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-5">
            
            {/* File Attachments Preview */}
            {(imagePreview || attachedFiles.length > 0) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border-2 border-cyan-500 max-h-32 object-cover" />
                    <button 
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {attachedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg text-xs border border-blue-500/20">
                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="truncate max-w-xs">{file.name}</span>
                    <button onClick={() => removeFile(file.id)} className="hover:text-pink-400 ml-auto font-bold text-lg leading-none flex-shrink-0">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              <div className="relative flex items-end gap-2 md:gap-3 p-2 md:p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                
                {/* File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="*" 
                  multiple 
                />

                {/* Attach Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 md:p-3 rounded-xl hover:bg-white/10 transition-colors group flex-shrink-0"
                  title="Attach files (all types supported)"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Text Input */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Ask ZORAX anything... (Ctrl+V to paste images)"
                  rows={1}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none py-2 md:py-3 px-2 text-base md:text-lg resize-none max-h-40 overflow-y-auto min-w-0"
                />

                {/* Voice Button */}
                <button
                  onClick={handleVoice}
                  className={`p-2 md:p-3 rounded-xl transition-all flex-shrink-0 ${
                    listening 
                      ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/50" 
                      : "hover:bg-white/10"
                  }`}
                  title={listening ? "Stop recording" : "Start voice input"}
                >
                  <svg className={`w-5 h-5 md:w-6 md:h-6 ${listening ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() && !imagePreview && attachedFiles.length === 0}
                  className="px-5 md:px-7 py-2 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg shadow-blue-500/30 disabled:shadow-none text-base md:text-lg"
                  title="Send message"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 text-center">
              ZORAX AI • Powered by Groq • Can make mistakes • Multi-file support enabled
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}