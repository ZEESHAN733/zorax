"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Hello! I'm ZORAX, your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm not connected to AI yet, but I will be soon! For now, I'm just showing you the interface." 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
              Z
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">ZORAX</h1>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
            <button className="text-sm text-gray-600 hover:text-gray-900">Settings</button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  Z
                </div>
              )}
              <div className={`max-w-2xl rounded-2xl px-5 py-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}>
                <p className="text-base leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-sm flex-shrink-0">
                  U
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                Z
              </div>
              <div className="bg-gray-100 rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:"0.1s"}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:"0.2s"}}></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Input Box */}
      <div className="border-t border-gray-200 bg-white sticky bottom-0">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message ZORAX..."
              className="flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            ZORAX can make mistakes. Verify important information.
          </p>
        </div>
      </div>

    </div>
  );
}