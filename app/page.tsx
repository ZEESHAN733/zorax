"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string; content: string; image?: string}[]>([
    { role: "assistant", content: "Hello! I'm ZORAX, your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (!input.trim() && !imagePreview) return;
    
    const newMsg: any = { 
      role: "user", 
      content: input || "Image" 
    };
    if (imagePreview) newMsg.image = imagePreview;
    
    setMessages([...messages, newMsg]);
    setInput("");
    setImagePreview(null);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm not connected to AI yet. Once we integrate Groq API, I'll give you real intelligent responses!" 
      }]);
    }, 800);
  };

  const handleVoice = () => {
    if (listening) {
      setListening(false);
      setMessages(prev => [...prev, 
        { role: "user", content: "Voice message" },
        { role: "assistant", content: "Voice recognition will work once we connect the AI!" }
      ]);
    } else {
      setListening(true);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay:"2s"}}></div>
      </div>

      {/* Sidebar */}
      <aside className={`relative z-20 ${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-white/10 bg-black/30 backdrop-blur-xl flex-col hidden md:flex`}>
        {sidebarOpen && (
          <>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-70"></div>
                  <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-xl">ZORAX</h2>
                  <p className="text-xs text-gray-400">AI Assistant</p>
                </div>
              </div>
            </div>

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

            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center font-semibold text-sm">
                  U
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">User</p>
                  <p className="text-xs text-gray-400">Free plan</p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl flex-shrink-0">
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="md:hidden flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">ZORAX</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-400 hidden sm:inline">AI Online</span>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "justify-end" : ""}`}>
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
                <div className={`max-w-[85%] md:max-w-3xl rounded-2xl px-5 md:px-7 py-4 md:py-5 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100"
                }`}>
                  {msg.image && <img src={msg.image} alt="Attached" className="rounded-lg mb-3 max-w-full" />}
                  <p className="text-base md:text-lg leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center font-semibold flex-shrink-0 border border-white/20">
                    U
                  </div>
                )}
              </div>
            ))}

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
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-5 md:px-7 py-4 md:py-5">
                  <p className="text-red-400 text-base md:text-lg">● Listening...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Section */}
        <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-xl flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-5">
            
            {/* Image preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border-2 border-blue-500" />
                <button 
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              <div className="relative flex items-end gap-2 md:gap-3 p-2 md:p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 md:p-3 rounded-xl hover:bg-white/10 transition-colors group flex-shrink-0"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Ask ZORAX anything... (Ctrl+V to paste images)"
                  rows={1}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none py-2 md:py-3 px-2 text-base md:text-lg resize-none max-h-40 overflow-y-auto min-w-0"
                />

                <button
                  onClick={handleVoice}
                  className={`p-2 md:p-3 rounded-xl transition-all flex-shrink-0 ${
                    listening 
                      ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/50" 
                      : "hover:bg-white/10"
                  }`}
                >
                  <svg className={`w-5 h-5 md:w-6 md:h-6 ${listening ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!input.trim() && !imagePreview}
                  className="px-5 md:px-7 py-2 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg shadow-blue-500/30 disabled:shadow-none text-base md:text-lg"
                >
                  Send
                </button>
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 text-center">
              ZORAX AI • Powered by Groq • Can make mistakes
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}