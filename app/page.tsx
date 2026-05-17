"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat: Chat = {
      id: newId,
      title: "New Chat",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm ZORAX. I can help with anything: answer questions, search Google, open emails, check weather, or just chat. What do you need?",
        },
      ],
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newId);
    setMessages(newChat.messages);
  };

  const switchChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setSidebarOpen(false);
    }
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter(c => c.id !== chatId);
    setChats(updatedChats);
    if (currentChatId === chatId && updatedChats.length > 0) {
      switchChat(updatedChats[0].id);
    } else if (updatedChats.length === 0) {
      createNewChat();
    }
  };

  const parseCommand = (text: string) => {
    const lower = text.toLowerCase();
    
    if (lower.includes("search") || lower.includes("google")) {
      const query = text.replace(/search|google|for/gi, "").trim();
      return { type: "search", value: query };
    }
    if (lower.includes("email") || lower.includes("gmail")) {
      return { type: "email", value: "" };
    }
    if (lower.includes("weather")) {
      const place = text.replace(/weather|in|for/gi, "").trim();
      return { type: "weather", value: place };
    }
    if (lower.includes("time") || lower.includes("what time")) {
      return { type: "time", value: "" };
    }
    if (lower.includes("http://") || lower.includes("https://")) {
      const url = text.match(/https?:\/\/[^\s]+/)?.[0] || "";
      return { type: "link", value: url };
    }

    return { type: "chat", value: text };
  };

  const executeCommand = (cmd: string, value: string): string | null => {
    if (cmd === "search") {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(value)}`, "_blank");
      return `🔍 Searching Google for "${value}"...`;
    }
    if (cmd === "email") {
      window.open("https://mail.google.com", "_blank");
      return "📧 Opening Gmail...";
    }
    if (cmd === "weather") {
      window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(value)}`, "_blank");
      return `🌤️ Checking weather for ${value}...`;
    }
    if (cmd === "time") {
      return `⏰ Current time: ${new Date().toLocaleTimeString()}`;
    }
    if (cmd === "link") {
      if (value) {
        window.open(value, "_blank");
        return `🔗 Opening ${value}...`;
      }
    }
    return null;
  };

  const callDeepSeekAPI = async (userMessage: string) => {
    try {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        throw new Error("DeepSeek API key not found in .env.local");
      }

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are ZORAX, an AI assistant like Tony Stark's JARVIS. You are helpful, intelligent, and can execute commands. Be conversational and helpful.",
            },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API error");
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (error: any) {
      return `Error: ${error.message}. Make sure your DeepSeek API key is in .env.local`;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    // Add user message
    const userMsg: Message = {
      id: Date.now() + "-user",
      role: "user",
      content: userText,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // Parse and execute command
    const { type, value } = parseCommand(userText);
    const cmdResult = executeCommand(type, value);

    if (cmdResult && type !== "chat") {
      const assistantMsg: Message = {
        id: Date.now() + "-assistant",
        role: "assistant",
        content: cmdResult,
      };
      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      setChats(chats.map(c => 
        c.id === currentChatId 
          ? { ...c, messages: finalMessages, title: userText.substring(0, 30) }
          : c
      ));
      return;
    }

    // Get AI response
    const aiResponse = await callDeepSeekAPI(userText);
    const assistantMsg: Message = {
      id: Date.now() + "-assistant",
      role: "assistant",
      content: aiResponse,
    };

    const finalMessages = [...newMessages, assistantMsg];
    setMessages(finalMessages);
    setChats(chats.map(c => 
      c.id === currentChatId 
        ? { ...c, messages: finalMessages, title: userText.substring(0, 30) }
        : c
    ));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay:"2s"}}></div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed lg:hidden inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative w-64 h-screen transition-transform duration-300 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col z-30`}>
        
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">Z</div>
            <span className="font-bold">ZORAX</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">✕</button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-2 border-b border-white/10">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm border border-white/10"
          >
            <span>➕</span>
            <span>New Chat</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
            <span>🔍</span>
            <span>Search</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-sm">
            <span>💬</span>
            <span>Chats</span>
          </button>
        </nav>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs text-gray-400 uppercase mb-2">Recent</p>
          <div className="space-y-2">
            {chats.map(chat => (
              <div key={chat.id} className="group">
                <button
                  onClick={() => switchChat(chat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition ${
                    currentChatId === chat.id
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  {chat.title}
                </button>
                <button
                  onClick={() => deleteChat(chat.id)}
                  className="text-xs text-red-400 hover:text-red-300 px-3 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            onClick={() => {
              setMessages([messages[0]]);
              setChats(chats.map(c => c.id === currentChatId ? { ...c, messages: [messages[0]] } : c));
            }}
            className="w-full text-xs px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition"
          >
            🗑️ Clear
          </button>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center text-sm font-bold">U</div>
            <div>
              <p className="text-xs font-medium">User</p>
              <p className="text-xs text-gray-400">Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* HEADER */}
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10">☰</button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center text-sm font-bold">Z</div>
                <span className="font-bold">ZORAX</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 hidden sm:inline">Ready</span>
              </div>
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-lg hover:bg-white/10">⋮</button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 border border-blue-500/30 rounded-lg shadow-xl z-50">
                    <button onClick={() => { createNewChat(); setShowMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-blue-500/10 border-b border-blue-500/10 text-sm">➕ New Chat</button>
                    <button onClick={() => { setMessages([]); setShowMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-red-500/10 text-red-300 text-sm">🗑️ Clear</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MESSAGES */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold">Z</div>
                )}
                <div className={`max-w-2xl rounded-lg px-4 py-3 ${
                  msg.role === "user" ? "bg-blue-600" : "bg-white/10 border border-white/10"
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-sm font-bold">U</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold animate-pulse">Z</div>
                <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* INPUT */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-end gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Message ZORAX... (Try: search, open gmail, weather, time, or just chat)"
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none py-2 text-sm resize-none overflow-hidden disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm flex-shrink-0"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">ZORAX • Powered by DeepSeek • Commands: search, gmail, weather, time</p>
          </div>
        </div>

      </div>
    </div>
  );
}