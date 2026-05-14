"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I'm ZORAX. How can I help?" }
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  useEffect(() => {
    if (!listening) return;
    const interval = setInterval(() => {
      setVoiceLines([0, 1, 2, 3, 4].map(() => Math.random() * 60 + 20));
    }, 100);
    return () => clearInterval(interval);
  }, [listening]);

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

  const sendMessage = () => {
    if (!input.trim() && !imagePreview && attachedFiles.length === 0) return;
    const newMsg: any = { 
      role: "user", 
      content: input || "File sent"
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
        content: "Got it! Ready for Groq API integration 🚀" 
      }]);
    }, 600);
  };

  const handleVoice = () => {
    if (listening) {
      setListening(false);
      setVoiceLines([0, 0, 0, 0, 0]);
      setMessages(prev => [...prev, 
        { role: "user", content: "🎙️ Voice input" },
        { role: "assistant", content: "Voice recorded!" }
      ]);
    } else {
      setListening(true);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay:"2s"}}></div>
      </div>

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col hidden md:flex relative z-30`}>
        {sidebarOpen && (
          <>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg">
                  Z
                </div>
                <div>
                  <h1 className="font-bold text-lg">ZORAX</h1>
                  <p className="text-xs text-gray-400">AI Assistant</p>
                </div>
              </div>
            </div>

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

            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2">
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        {/* HEADER */}
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl flex-shrink-0">
          <div className="px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                ☰
              </button>
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                  Z
                </div>
                <span className="font-bold">ZORAX</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-400 hidden sm:inline">Online</span>
              </div>

              <button className="p-2 rounded-lg hover:bg-white/10">⚙️</button>

              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  ⋮
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur border border-blue-500/30 rounded-lg shadow-xl z-50">
                    {[
                      { label: "New chat", icon: "➕" },
                      { label: "Code Snippets", icon: "💻" },
                      { label: "Quick Actions", icon: "⚡" },
                      { label: "History", icon: "📜" },
                      { label: "Settings", icon: "⚙️" },
                    ].map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setShowMenu(false)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition text-left border-b border-blue-500/10 last:border-b-0 text-sm"
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CHAT */}
        <main className="flex-1 overflow-y-auto">
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
                    ? "bg-blue-600"
                    : "bg-white/10 border border-white/10"
                }`}>
                  {msg.image && <img src={msg.image} alt="img" className="rounded mb-2 max-w-sm max-h-48 object-cover" />}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mb-2 space-y-1 pb-2 border-b border-white/20">
                      {msg.files.map((f: any) => (
                        <div key={f.id} className="text-xs">📎 {f.name}</div>
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
                <div className="w-8 h-8 rounded-lg bg-red-600 flex-shrink-0 flex items-center justify-center text-sm">🎙️</div>
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

        {/* INPUT */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-4">
            
            {(imagePreview || attachedFiles.length > 0) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="max-w-xs rounded border border-cyan-500 max-h-24" />
                    <button 
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {attachedFiles.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded text-xs">
                    📎 {f.name}
                  </div>
                ))}
              </div>
            )}

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
                className="p-2 rounded-lg hover:bg-white/10 flex-shrink-0 text-lg"
              >
                📎
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Ask anything... (Ctrl+V to paste)"
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none py-2 text-sm resize-none overflow-hidden"
              />

              <button
                onClick={handleVoice}
                className="p-2 rounded-lg flex-shrink-0 text-lg hover:bg-white/10"
              >
                🎙️
              </button>

              <button
                onClick={sendMessage}
                disabled={!input.trim() && !imagePreview && attachedFiles.length === 0}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm"
              >
                Send
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">ZORAX AI • Powered by Groq</p>
          </div>
        </div>

      </div>
    </div>
  );
}
