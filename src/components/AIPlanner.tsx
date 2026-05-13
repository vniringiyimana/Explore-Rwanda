import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bot, Send, BrainCircuit, User, Loader2 } from 'lucide-react';
import { getTravelAdvice } from '../services/geminiService';
import Markdown from 'react-markdown';
import { ExternalLink } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  sources?: { uri: string, title: string }[];
}

export default function AIPlanner() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm your Rwanda AI Guide. Tell me about your dream trip—are you interested in mountain gorillas, coffee tours, or Kigali's vibrant art scene? I can plan your entire itinerary!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 500;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getTravelAdvice(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: response.text, sources: response.sources }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "I apologize, but I encountered an error. Could we try planning that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "🦍 Gorilla trekking advice?",
    "💰 3-day budget trip",
    "☕ Best coffee tours",
    "❤️ Honeymoon ideas"
  ];

  return (
    <section id="ai-planner" className="py-24 px-4 sm:px-6 lg:px-8 relative" style={{ background: 'linear-gradient(180deg, #0a1a0f 0%, #0d2818 50%, #0a1a0f 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold text-gold-300 mb-4 border border-gold-500/20">
            <Sparkles size={12} />
            AI-POWERED
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">Smart Travel <span className="gold-gradient-text">Planner</span></h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            Tell our AI what you dream of, and get a personalized, high-end Rwanda itinerary tailored to your passions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[600px]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)] animate-pulse">
                  <Bot size={20} className="text-forest-900" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">Rwanda AI Concierge</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Operational
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <BrainCircuit size={16} className="text-white/20" />
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-none">Gemini Flash 2.0</span>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-forest-900 ${
                      msg.role === 'user' ? 'bg-gold-500' : 'bg-white/10'
                    }`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-gold-300" />}
                    </div>
                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-linear-to-br from-gold-500/10 to-gold-600/20 text-gold-50 border border-gold-500/20 rounded-tr-none' 
                        : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
                    }`}>
                      <div className="markdown-body prose prose-invert prose-sm max-w-none">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                      
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                          {msg.sources.map((source, i) => (
                            <a 
                              key={i} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-white/40 hover:text-gold-400 hover:bg-white/10 transition-all border border-white/5"
                            >
                              <ExternalLink size={10} /> {source.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Loader2 size={14} className="text-gold-300 animate-spin" />
                    </div>
                    <div className="px-5 py-3.5 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 text-white/50 text-sm italic">
                      Whispering to the volcanoes...
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02]">
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); }}
                    className="px-4 py-1.5 glass rounded-full text-[10px] font-bold text-white/40 hover:text-gold-300 hover:border-gold-500/30 transition-all uppercase tracking-widest"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative flex-1 flex gap-3">
                  <input
                    type="text"
                    value={input}
                    maxLength={MAX_CHARS}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for an itinerary or travel advice..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all font-medium pr-24"
                  />
                  <div className={`absolute right-24 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-widest ${input.length >= MAX_CHARS ? 'text-red-400' : 'text-white/20'}`}>
                    {input.length}/{MAX_CHARS}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || input.length > MAX_CHARS}
                    className="px-6 py-4 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 rounded-2xl font-bold transition-all flex items-center gap-2 hover:shadow-xl hover:shadow-gold-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
