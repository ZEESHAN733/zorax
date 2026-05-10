"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Hello! I'm ZORAX, your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-stop voice after 3 seconds
  useEffect(() => {
    if (listening) {
      const timer = setTimeout(() => {
        setListening(false);
        setMessages(prev => [...prev, 
          { role: "user", content: "Voice message (simulated)" },
          { role: "assistant", content: "Voice recognition will work once we connect the AI! For now, this is just a preview." }
        ]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [listening]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm not connected to AI yet. This is just the interface preview!" 
      }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex">

      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay:"2s"}}></div>
      </div>

      {/* Sidebar */}
      <aside className={`relative z-20 ${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-white/10 bg-black/30 backdrop-blur-xl flex flex-col`}>
        {sidebarOpen && (
          <>
            {/* Logo */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-md opacity-70"></div>
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">ZORAX</h2>
                  <p className="text-xs text-gray-400">AI Assistant</p>
                </div>
              </div>
            </div>

            {/* Menu */}
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
                {["Finding the right business idea", "Junior IT Support jobs", "Resume strategy for IT"].map((chat, i) => (
                  <button key={i} className="w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left text-sm text-gray-300 truncate">
                    {chat}
                  </button>
                ))}
              </div>
            </nav>

            {/* User */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center font-semibold">
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
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-400">AI Online</span>
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
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-50"></div>
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100"
                }`}>
                  <p className="text-base leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center font-semibold flex-shrink-0 border border-white/20">
                    U
                  </div>
                )}
              </div>
            ))}

            {listening && (
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-50 animate-pulse"></div>
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
                  <p className="text-red-400">● Listening... (auto-stops in 3s)</p>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Input Section */}
        <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-6 py-6">
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              <div className="relative flex items-end gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                
                <button className="p-3 rounded-xl hover:bg-white/10 transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask ZORAX anything..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none py-3 px-2 text-base"
                />

                <button
                  onClick={() => setListening(true)}
                  disabled={listening}
                  className={`p-3 rounded-xl transition-all ${
                    listening 
                      ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/50 animate-pulse" 
                      : "hover:bg-white/10"
                  }`}
                >
                  <svg className={`w-5 h-5 ${listening ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg shadow-blue-500/30 disabled:shadow-none"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {["Explain quantum computing", "Write a poem", "Check weather", "Translate to Spanish"].map((text) => (
                <button key={text} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 whitespace-nowrap transition-all">
                  {text}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              ZORAX AI • Powered by Groq • Can make mistakes
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}