"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I'm ZORAX, your AI assistant. You can speak, type, or upload files. I'll respond in real-time!" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [isLiveListening, setIsLiveListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<any>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const liveListeningRef = useRef<boolean>(false);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setListening(true);
        setRecognizedText("");
      };

      recognitionRef.current.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput(prev => prev + transcript + " ");
          } else {
            interim += transcript;
          }
        }
        if (interim) setRecognizedText(interim);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
        setRecognizedText("");
        
        // Auto-continue listening in live mode
        if (liveListeningRef.current && liveMode) {
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);
      };
    }
  }, [liveMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, listening]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakText = (text: string) => {
    if (!autoSpeak || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      
      // Auto-listen if in live mode
      if (liveMode && !liveListeningRef.current) {
        liveListeningRef.current = true;
        setIsLiveListening(true);
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 800);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: any[] = [];
      let loadedCount = 0;
      
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result;
          newFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            id: Date.now() + Math.random(),
            content: base64,
          });
          loadedCount++;
          if (loadedCount === files.length) {
            setAttachedFiles(prev => [...prev, ...newFiles]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (id: number) => {
    setAttachedFiles(attachedFiles.filter((f) => f.id !== id));
  };

  const callGroqAPI = async (userMessage: string, files: any[]) => {
    try {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      
      if (!apiKey) {
        throw new Error("Groq API key not found. Please check your .env.local file");
      }

      let messageContent = userMessage;
      
      // Include file information if files are attached
      if (files.length > 0) {
        messageContent += "\n\n[Attached files: ";
        messageContent += files.map(f => `${f.name} (${f.type})`).join(", ");
        messageContent += "]";
      }

      streamAbortRef.current = new AbortController();

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: messageContent,
            },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
        signal: streamAbortRef.current.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to get response from Groq API");
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      
      return aiResponse;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return "Response stopped by user.";
      }
      console.error("Groq API Error:", error);
      return `Error: ${error.message || "Failed to connect to Groq API"}`;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    const userMessage = input.trim();
    const filesToSend = [...attachedFiles];

    const newMsg: any = {
      role: "user",
      content: userMessage,
      files: filesToSend.length > 0 ? filesToSend.map(f => ({ name: f.name, type: f.type })) : null
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setAttachedFiles([]);

    // Get AI response
    const aiResponse = await callGroqAPI(userMessage, filesToSend);

    const aiMsg = {
      role: "assistant",
      content: aiResponse
    };

    setMessages(prev => [...prev, aiMsg]);
    
    // Speak if auto-speak enabled
    if (autoSpeak) {
      speakText(aiResponse);
    } else if (liveMode) {
      // If live mode but no auto-speak, still auto-listen
      liveListeningRef.current = true;
      setIsLiveListening(true);
      setTimeout(() => {
        recognitionRef.current?.start();
      }, 500);
    }
  };

  const handleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition not supported in your browser. Use Chrome, Edge, or Safari.");
      return;
    }

    if (listening || isLiveListening) {
      recognitionRef.current.stop();
      setListening(false);
      setIsLiveListening(false);
      liveListeningRef.current = false;
    } else {
      recognitionRef.current.start();
    }
  };

  const handleNewChat = () => {
    setMessages([
      { role: "assistant", content: "Hello! I'm ZORAX, your AI assistant. You can speak, type, or upload files. I'll respond in real-time!" }
    ]);
    setInput("");
    setAttachedFiles([]);
    liveListeningRef.current = false;
    setIsLiveListening(false);
  };

  const handleClearHistory = () => {
    if (confirm("Clear all chat history?")) {
      handleNewChat();
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex overflow-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay:"2s"}}></div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed lg:hidden inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR - Claude Style */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative w-64 h-screen transition-transform duration-300 border-r border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col z-30`}>
        
        {/* Header with Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
              Z
            </div>
            <span className="font-bold text-lg">ZORAX</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              handleNewChat();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-left text-sm font-medium border border-white/10 hover:border-white/20"
          >
            <span className="text-lg">➕</span>
            <span>New Chat</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-left text-sm">
            <span className="text-lg">🔍</span>
            <span>Search</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-left text-sm">
            <span className="text-lg">💬</span>
            <span>Chats</span>
          </button>
        </nav>

        {/* Divider */}
        <div className="px-4 py-2">
          <div className="h-px bg-white/10"></div>
        </div>

        {/* Settings Section */}
        <div className="px-4 py-3 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Settings</p>
          
          {/* Auto-Speak Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Auto Speak</label>
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`relative w-10 h-6 rounded-full transition ${autoSpeak ? "bg-blue-600" : "bg-white/20"}`}
            >
              <div className={`absolute w-5 h-5 rounded-full bg-white transition top-0.5 ${autoSpeak ? "right-0.5" : "left-0.5"}`}></div>
            </button>
          </div>

          {/* Live Mode Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Live Mode</label>
            <button
              onClick={() => {
                setLiveMode(!liveMode);
                if (!liveMode) {
                  liveListeningRef.current = false;
                  setIsLiveListening(false);
                }
              }}
              className={`relative w-10 h-6 rounded-full transition ${liveMode ? "bg-green-600" : "bg-white/20"}`}
            >
              <div className={`absolute w-5 h-5 rounded-full bg-white transition top-0.5 ${liveMode ? "right-0.5" : "left-0.5"}`}></div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="px-4 py-2">
          <div className="h-px bg-white/10"></div>
        </div>

        {/* Chat History Section */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Chats</p>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm text-gray-300 truncate">
              💬 How does AI work?
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm text-gray-300 truncate">
              📄 Document Analysis
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm text-gray-300 truncate">
              🎨 Design Ideas
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm text-gray-300 truncate">
              💻 Code Debugging
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm text-gray-300 truncate">
              📝 Writing Help
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="px-4 py-2">
          <div className="h-px bg-white/10"></div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 space-y-2 border-t border-white/10">
          <button
            onClick={handleClearHistory}
            className="w-full px-3 py-2 text-xs bg-red-600/20 hover:bg-red-600/30 rounded-lg transition text-red-300 font-medium"
          >
            🗑️ Clear History
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
              U
            </div>
            <div>
              <p className="text-xs font-medium">User</p>
              <p className="text-xs text-gray-400">Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        {/* FIXED HEADER */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0 sticky top-0 z-20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10"
                title="Toggle sidebar"
              >
                ☰
              </button>
              <div className="flex items-center gap-2 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                  Z
                </div>
                <span className="font-bold text-sm">ZORAX</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Status Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
                listening || isLiveListening ? "bg-red-500/10 border border-red-500/30" :
                isSpeaking ? "bg-green-500/10 border border-green-500/30" :
                loading ? "bg-yellow-500/10 border border-yellow-500/30" :
                "bg-emerald-500/10 border border-emerald-500/30"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  listening || isLiveListening ? "bg-red-500" :
                  isSpeaking ? "bg-green-500" :
                  loading ? "bg-yellow-500" :
                  "bg-emerald-500"
                } animate-pulse`}></div>
                <span className={`hidden sm:inline ${
                  listening || isLiveListening ? "text-red-400" :
                  isSpeaking ? "text-green-400" :
                  loading ? "text-yellow-400" :
                  "text-emerald-400"
                }`}>
                  {listening || isLiveListening ? "Listening" :
                   isSpeaking ? "Speaking" :
                   loading ? "Thinking" :
                   "Ready"}
                </span>
              </div>

              {/* Stop Speech Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeech}
                  className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600/40 text-red-300"
                  title="Stop speaking"
                >
                  ⏹️
                </button>
              )}

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-white/10"
                  title="More options"
                >
                  ⋮
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur border border-blue-500/30 rounded-lg shadow-xl z-50">
                    <button
                      onClick={() => { handleNewChat(); setShowMenu(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition text-left border-b border-blue-500/10 text-sm"
                    >
                      <span>➕</span>
                      <span>New Chat</span>
                    </button>
                    <button
                      onClick={() => { setAutoSpeak(!autoSpeak); setShowMenu(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition text-left border-b border-blue-500/10 text-sm"
                    >
                      <span>{autoSpeak ? "🔊" : "🔇"}</span>
                      <span>{autoSpeak ? "Disable" : "Enable"} Auto-Speak</span>
                    </button>
                    <button
                      onClick={() => { setLiveMode(!liveMode); setShowMenu(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition text-left border-b border-blue-500/10 text-sm"
                    >
                      <span>{liveMode ? "🔴" : "⚪"}</span>
                      <span>{liveMode ? "Disable" : "Enable"} Live Mode</span>
                    </button>
                    <button
                      onClick={() => { handleClearHistory(); setShowMenu(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 transition text-left text-red-300 text-sm"
                    >
                      <span>🗑️</span>
                      <span>Clear History</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CHAT MESSAGES */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                    Z
                  </div>
                )}
                <div className={`max-w-xs sm:max-w-md md:max-w-2xl rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-white/10 border border-white/10"
                }`}>
                  {msg.files && msg.files.length > 0 && (
                    <div className="mb-2 space-y-1 pb-2 border-b border-white/20">
                      {msg.files.map((f: any, idx: number) => (
                        <div key={idx} className="text-xs">📎 {f.name}</div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* LOADING STATE */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold animate-pulse">
                  Z
                </div>
                <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                  </div>
                </div>
              </div>
            )}

            {/* LISTENING STATE */}
            {(listening || isLiveListening) && (
              <div className="flex gap-3 justify-start items-start">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex-shrink-0 flex items-center justify-center text-sm animate-pulse">🎙️</div>
                <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 flex-1 min-w-0">
                  {recognizedText ? (
                    <p className="text-sm text-yellow-300 break-words">{recognizedText}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Listening {liveMode && "(Live Mode)"}</p>
                  )}
                </div>
              </div>
            )}

            {/* SPEAKING STATE */}
            {isSpeaking && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex-shrink-0 flex items-center justify-center text-sm animate-pulse">🔊</div>
                <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3">
                  <p className="text-sm text-green-400">Speaking...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* INPUT SECTION */}
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-4 w-full">

            {/* File Preview */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachedFiles.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded text-xs">
                    <span>
                      {f.type.startsWith('image/') ? '🖼️' :
                       f.type === 'application/pdf' ? '📄' :
                       f.type === 'text/csv' ? '📊' :
                       '📎'}
                    </span>
                    <span className="truncate max-w-xs">{f.name}</span>
                    <button onClick={() => removeFile(f.id)} className="ml-1 text-gray-400 hover:text-white">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
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
                className="p-2.5 rounded-lg hover:bg-white/10 flex-shrink-0 text-lg sm:text-base transition"
                disabled={loading || listening}
                title="Attach files (PDF, images, CSV, etc.)"
              >
                📎
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Type or click microphone to speak..."
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none py-2 px-2 text-sm resize-none overflow-hidden disabled:opacity-50"
              />

              <button
                onClick={handleVoice}
                className={`p-2.5 rounded-lg flex-shrink-0 text-lg transition ${
                  listening || isLiveListening ? "bg-red-500/30 text-red-300 hover:bg-red-500/40" : "hover:bg-white/10 text-gray-300 hover:text-white"
                }`}
                disabled={loading}
                title={listening || isLiveListening ? "Stop listening" : "Start speaking"}
              >
                🎙️
              </button>

              <button
                onClick={sendMessage}
                disabled={(!input.trim() && attachedFiles.length === 0) || loading}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm flex-shrink-0 transition"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">ZORAX Pro • AI Voice + Text • Powered by Groq</p>
          </div>
        </div>

      </div>
    </div>
  );
}