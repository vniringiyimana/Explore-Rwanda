import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, BookOpen, Send, Copy, Volume2, Sparkles, Search, ExternalLink, Info } from 'lucide-react';
import { PHRASEBOOK } from '../constants';
import { translateWithAI, getTravelAdvice } from '../services/geminiService';
import Markdown from 'react-markdown';

export default function Translate({ onToast }: { onToast: (msg: string) => void }) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [adviceData, setAdviceData] = useState<{ text: string, sources?: { uri: string, title: string }[] } | null>(null);
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('rw');
  const [mode, setMode] = useState<'translate' | 'advice'>('translate');
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: 'en', label: 'English', emoji: '🇬🇧' },
    { code: 'rw', label: 'Kinyarwanda', emoji: '🇷🇼' },
    { code: 'fr', label: 'French', emoji: '🇫🇷' },
    { code: 'sw', label: 'Swahili', emoji: '🇹🇿' }
  ];

  const handleAction = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);

    try {
      if (mode === 'translate') {
        const response = await translateWithAI(inputText, fromLang, toLang);
        if (response) {
          setTranslatedText(response);
          setAdviceData(null);
        } else {
          onToast('Demo mode: Please configure Gemini API key');
        }
      } else {
        const response = await getTravelAdvice(inputText);
        setAdviceData(response);
        setTranslatedText('');
      }
    } catch (e) {
      onToast(`${mode === 'translate' ? 'Translation' : 'Advice'} error`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onToast('Copied to clipboard');
  };

  return (
    <section id="translate" className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-900 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold text-gold-300 mb-4 border border-gold-500/20"
          >
            <Languages size={12} />
            EXPERT TOOLS
          </motion.div>
          <motion.h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Communication & <span className="gold-gradient-text">Insight</span>
          </motion.h2>
          <motion.p className="text-white/50 text-base mb-8">
            Translate local dialects or query our AI Pilot for real-time travel intelligence grounded in Google Search.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Controls */}
          <div className="flex-1">
            <div className="glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit mb-8 border border-white/5">
                <button 
                  onClick={() => { setMode('translate'); setInputText(''); setTranslatedText(''); setAdviceData(null); }}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'translate' ? 'bg-gold-500 text-forest-900 shadow-xl shadow-gold-500/20' : 'text-white/40 hover:text-white'}`}
                >
                  <Languages size={14} /> Translate
                </button>
                <button 
                  onClick={() => { setMode('advice'); setInputText(''); setTranslatedText(''); setAdviceData(null); }}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'advice' ? 'bg-gold-500 text-forest-900 shadow-xl shadow-gold-500/20' : 'text-white/40 hover:text-white'}`}
                >
                  <Search size={14} /> Travel Advice
                </button>
              </div>

              {mode === 'translate' && (
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2.5 ml-1">From</label>
                    <div className="relative">
                      <select
                        value={fromLang}
                        onChange={(e) => setFromLang(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-400/50 appearance-none font-bold"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code} className="bg-forest-800 text-white">{lang.emoji} {lang.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 font-sans">▼</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2.5 ml-1">To</label>
                    <div className="relative">
                      <select
                        value={toLang}
                        onChange={(e) => setToLang(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-400/50 appearance-none font-bold"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code} className="bg-forest-800 text-white">{lang.emoji} {lang.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 font-sans">▼</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative mb-6">
                <textarea
                  rows={mode === 'translate' ? 4 : 3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'translate' ? "Type a phrase to translate..." : "Ask about weather, events, or safety in Rwanda..."}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-lg text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all resize-none shadow-inner"
                />
              </div>

              <button
                onClick={handleAction}
                disabled={isLoading || !inputText.trim()}
                className="w-full py-5 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-gold-500/30 transition-all flex items-center justify-center gap-3 text-base active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Sparkles size={20} className="animate-spin" /> : mode === 'translate' ? <Languages size={20} /> : <Search size={20} />}
                {isLoading ? (mode === 'translate' ? 'Translating...' : 'Searching Web...') : (mode === 'translate' ? 'Translate Instantly' : 'Get Real-time Advice')}
              </button>

              <AnimatePresence>
                {translatedText && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-white/10"
                  >
                    <div className="bg-white/5 rounded-2xl p-6 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gold-400" />
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">AI Translation</span>
                        <div className="flex gap-2">
                          <button onClick={() => copyToClipboard(translatedText)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 transition-colors"><Copy size={14}/></button>
                        </div>
                      </div>
                      <div className="text-2xl font-display font-semibold text-gold-300 leading-tight">
                        {translatedText}
                      </div>
                    </div>
                  </motion.div>
                )}

                {adviceData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-white/10"
                  >
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-3xl p-8 relative border border-white/5">
                        <div className="flex items-center gap-2 mb-6 text-gold-400">
                          <Sparkles size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Grounded Real-time Advice</span>
                        </div>
                        <div className="markdown-body prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed italic">
                          <Markdown>{adviceData.text}</Markdown>
                        </div>
                      </div>

                      {adviceData.sources && adviceData.sources.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
                            <Info size={12} /> Sources & References
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {adviceData.sources.map((source, i) => (
                              <a 
                                key={i} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="glass p-4 rounded-2xl border border-white/5 hover:border-gold-500/20 transition-all flex items-center justify-between group"
                              >
                                <div className="text-[10px] font-bold text-white/60 group-hover:text-gold-300 truncate max-w-[150px]">
                                  {source.title}
                                </div>
                                <ExternalLink size={12} className="text-white/20 group-hover:text-gold-500" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-80">
            <div className="sticky top-8 space-y-6">
              <div className="glass rounded-[2rem] p-6 border border-white/5">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <BookOpen size={12} className="text-gold-400" /> Essential Phrases
                </div>
                <div className="space-y-3">
                  {PHRASEBOOK.slice(0, 5).map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => { 
                        setMode('translate');
                        setInputText(phrase.en); 
                        setTranslatedText(phrase.rw); 
                        setAdviceData(null);
                        setFromLang('en'); 
                        setToLang('rw'); 
                      }}
                      className="w-full p-4 bg-white/5 rounded-2xl text-left hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                    >
                      <div className="text-xs font-bold text-white mb-1">{phrase.en}</div>
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest leading-none flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-gold-500" /> {phrase.rw}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-[2rem] p-6 border border-white/5 bg-radial-at-tr from-gold-500/10 to-transparent">
                 <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Pro Pilot Tip</div>
                 <p className="text-xs text-white/40 leading-relaxed italic">
                   "Ask about current weather in Musanze or event schedules in Kigali for the most accurate planning."
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
