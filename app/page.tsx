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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Animate voice recording lines
  useEffect(() => {
    if (!listening) return;
    const interval = setInterval(() => {
      setVoiceLines([0, 1, 2, 3, 4].map(() => Math.random() * 80 + 20));
    }, 100);
    return () => clearInterval(interval);
  }, [listening]);

  // Handle paste images
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
        content: "Great! I received your message. Connect Groq API to get real AI responses! 🚀" 
      }]);
    }, 600);
  };

  const handleVoice = () => {
    if (listening) {
      setListening(false);
      setVoiceLines([0, 0, 0, 0, 0]);
      setMessages(prev => [...prev, 
        { role: "user", content: "🎙️ Voice message" },
        { role: "assistant", content: "Voice input recorded! Web Speech API coming soon." }
      ]);
    } else {
      setListening(true);
    }
  };

  const menuOptions = [
    { label: "New chat", icon: "➕" },
    { label: "Code Snippets", icon: "💻" },
    { label: "Quick Actions", icon: "⚡" },
    { label: "History", icon: "📜" },
    { label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex overflow-hidden">
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay:"2s"}}></div>
      </div>

      {/* SIDEBAR */}
      <aside className={`relative z-20 ${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-white/10 bg-black/30 backdrop-blur-xl flex flex-col hidden md:flex`}>
        {sidebarOpen && (
          <>
            {/* Logo Section */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {/* Simple Z Logo */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-lg text-white">
                  Z
                </div>
                <div>
                  <h1 className="font-bold text-lg">ZORAX</h1>
                  <p className="text-xs text-gray-400">AI Assistant</p>
                </div>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-left">
                <span>➕</span>
                <span className="text-sm">New chat</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-left">
                <span>🔍</span>
                <span className="text-sm">Search</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 transition text-left">
                <span>💬</span>
                <span className="text-sm">Chats</span>
              </button>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium">User</p>
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
          <div className="px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Mobile Logo */}
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-white">
                  Z
                </div>
                <span className="font-bold">ZORAX</span>
              </div>
            </div>

            {/* Header Right */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-400 hidden sm:inline">Online</span>
              </div>

              <button className="p-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </button>

              {/* Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-white/10"
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
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                    Z
                  </div>
                )}
                <div className={`max-w-2xl rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-white/10 border border-white/10"
                }`}>
                  {msg.image && <img src={msg.image} alt="img" className="rounded mb-2 max-w-sm max-h-48 object-cover" />}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mb-2 space-y-1 pb-2 border-b border-white/20">
                      {msg.files.map((f: any) => (
                        <div key={f.id} className="text-xs flex items-center gap-2">
                          📎 {f.name}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                    U
                  </div>
                )}
              </div>
            ))}

            {listening && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex-shrink-0 flex items-center justify-center">
                  🎙️
                </div>
                <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 flex items-center gap-2">
                  {voiceLines.map((h, i) => (
                    <div key={i} className="w-1 bg-gradient-to-t from-cyan-400 to-pink-400 rounded-full" style={{height: `${h}px`}}/>
                  ))}
                  <span className="text-xs ml-2">Listening...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* INPUT AREA */}
        <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-xl flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-4">
            
            {/* File Preview */}
            {(imagePreview || attachedFiles.length > 0) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="max-w-xs rounded border border-cyan-500 max-h-32 object-cover" />
                    <button 
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {attachedFiles.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded text-xs border border-blue-500/20">
                    📎 {f.name}
                    <button onClick={() => removeFile(f.id)} className="ml-2 text-red-400">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-end gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="*" 
                multiple 
              />

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-white/10 flex-shrink-0"
                title="Attach files"
              >
                📎
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Ask anything... (Ctrl+V to paste images)"
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none py-2 text-sm resize-none overflow-hidden"
              />

              <button
                onClick={handleVoice}
                className={`p-2 rounded-lg flex-shrink-0 transition ${
                  listening ? "bg-red-600/30" : "hover:bg-white/10"
                }`}
              >
                🎙️
              </button>

              <button
                onClick={sendMessage}
                disabled={!input.trim() && !imagePreview && attachedFiles.length === 0}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm"
              >
                Send
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">ZORAX AI • Powered by Groq • Multi-file support</p>
          </div>
        </div>

      </div>
    </div>
  );
}