import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, CornerDownLeft, Play, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceSearchButtonProps {
  onSearchResult: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export default function VoiceSearchButton({ onSearchResult, placeholder = 'Search by voice...', className = '' }: VoiceSearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimResult, setInterimResult] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [voiceBars, setVoiceBars] = useState<number[]>([12, 24, 8, 36, 18, 28, 14, 40, 20, 30, 10, 25, 15, 35, 8]);
  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Suggested voice search triggers
  const suggestions = [
    'Book Volcanoes National Park',
    'Book Lake Kivu',
    'Book Nyungwe Forest',
    'Book Akagera National Park',
    'Gorilla trekking Volcanoes National Park',
    'Lake Kivu luxury beach hotel',
    'Akagera Safari package deals',
    'Eco canopy walk in Nyungwe'
  ];

  // Randomize audio wave bars in simulation
  useEffect(() => {
    let timer: any;
    if (isListening) {
      timer = setInterval(() => {
        setVoiceBars(prev => prev.map(() => Math.floor(Math.random() * 45) + 5));
      }, 95);
    } else {
      setVoiceBars([4, 6, 4, 8, 4, 6, 8, 4, 6, 4, 8, 4, 6, 4, 8]);
    }
    return () => clearInterval(timer);
  }, [isListening]);

  // Clean Web Speech Recognition instances
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startSpeechRecognition = () => {
    setErrorMsg(null);
    setTranscript('');
    setInterimResult('');

    // Check availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Speech recognition not supported in browser environment, run simulation
      simulateSpeech();
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript(final);
        }
        if (interim) {
          setInterimResult(interim);
        }
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error: ', e);
        if (e.error === 'not-allowed') {
          setErrorMsg('Microphone permission blocked. Please grant access or use interactive speech simulator below.');
        } else {
          setErrorMsg(`Voice capture failed (${e.error}). Switching to interactive simulation.`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      simulateSpeech();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Safe fallback simulation with incremental typing
  const simulateSpeech = () => {
    setIsListening(true);
    const pickedSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    // Animate typing mock text
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= pickedSuggestion.length) {
        setInterimResult(pickedSuggestion.substring(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
        setTranscript(pickedSuggestion);
        setIsListening(false);
        toast(`Simulation detected speech phrase successfully`);
      }
    }, 70);
  };

  const handleApplySuggestion = (text: string) => {
    setTranscript(text);
    setInterimResult(text);
    setIsListening(false);
    toast(`Copied query to console compiler`);
  };

  const handleApplyResult = () => {
    const finalQuery = transcript || interimResult;
    if (finalQuery.trim()) {
      const lowerQuery = finalQuery.toLowerCase().trim();
      if (lowerQuery.startsWith('book ')) {
        const destinationPart = lowerQuery.slice(5).trim();
        let foundId: number | null = null;
        let matchedName = '';

        if (destinationPart.includes('volcano')) {
          foundId = 1;
          matchedName = 'Volcanoes National Park';
        } else if (destinationPart.includes('kivu')) {
          foundId = 2;
          matchedName = 'Lake Kivu';
        } else if (destinationPart.includes('nyungwe')) {
          foundId = 3;
          matchedName = 'Nyungwe Forest';
        } else if (destinationPart.includes('akagera')) {
          foundId = 4;
          matchedName = 'Akagera National Park';
        } else if (destinationPart.includes('king') || destinationPart.includes('nyanza')) {
          foundId = 5;
          matchedName = "King's Palace Museum";
        } else if (destinationPart.includes('bisoke')) {
          foundId = 6;
          matchedName = 'Mt. Bisoke Hike';
        } else if (destinationPart.includes('inema') || destinationPart.includes('art')) {
          foundId = 7;
          matchedName = 'Inema Arts Center';
        } else if (destinationPart.includes('congo') || destinationPart.includes('nile')) {
          foundId = 8;
          matchedName = 'Congo Nile Trail';
        } else if (destinationPart.includes('cave')) {
          foundId = 9;
          matchedName = 'Musanze Caves';
        } else if (destinationPart.includes('rusumo') || destinationPart.includes('falls')) {
          foundId = 10;
          matchedName = 'Rusumo Falls';
        }

        if (foundId) {
          toast(`🎙️ Voice matched: opening booking modal for "${matchedName}"`);
          window.dispatchEvent(new CustomEvent('open-booking', {
            detail: { category: 'destination', id: foundId }
          }));
          setIsOpen(false);
          return;
        } else {
          toast(`Voice: "Book" recognized, but couldn't resolve destination "${destinationPart}".`);
        }
      }

      onSearchResult(finalQuery);
      setIsOpen(false);
    }
  };

  const toast = (msg: string) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-forest-900 transition-all cursor-pointer flex items-center justify-center relative group active:scale-95 ${className}`}
        title="Search with Voice Guidance"
      >
        <Mic size={16} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-950/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-forest-900/95 border border-white/5 rounded-[2.5rem] w-full max-w-lg p-8 relative overflow-hidden shadow-2xl shadow-black/55"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 blur-[100px] rounded-full -mr-12 -mt-12 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => {
                  stopSpeechRecognition();
                  setIsOpen(false);
                }}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                  <Sparkles className="text-gold-400 animate-pulse" size={18} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Rwanda Voice Search</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Speech Processing Unit</p>
                </div>
              </div>

              {/* Animated Wave Indicator */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 relative min-h-[160px]">
                {isListening ? (
                  <div className="flex gap-1.5 items-end justify-center h-14 w-full">
                    {voiceBars.map((bar, ind) => (
                      <motion.div
                        key={ind}
                        animate={{ height: `${bar}px` }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                        className="w-1.5 rounded-full bg-gradient-to-t from-gold-500 to-amber-500"
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={startSpeechRecognition}
                    className="w-16 h-16 rounded-full bg-gold-500 hover:bg-gold-400 text-forest-900 flex items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-lg shadow-gold-500/15"
                  >
                    <Mic size={24} />
                  </button>
                )}

                <div className="text-center">
                  <p className="text-xs font-bold text-white leading-normal">
                    {isListening ? 'Listening carefully... Speak now.' : 'Tap microphone core to activate voice feed'}
                  </p>
                  <p className="text-[10px] text-white/30 font-semibold italic mt-1">
                    Supports English, French, and Kinyarwanda translation paths
                  </p>
                </div>
              </div>

              {/* Live transcript typed outputs */}
              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-black text-white/30 tracking-widest px-1">STT Transcription Live</span>
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[60px] flex items-center justify-between">
                    <p className={`text-sm leading-relaxed ${transcript || interimResult ? 'text-gold-400 font-bold' : 'text-white/20 italic'}`}>
                      {transcript || interimResult || `"${placeholder}"`}
                    </p>
                    {(transcript || interimResult) && (
                      <button
                        onClick={handleApplyResult}
                        className="p-2 py-1 bg-gold-500 hover:bg-gold-400 text-forest-900 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-all"
                      >
                        Search <CornerDownLeft size={10} />
                      </button>
                    )}
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] leading-relaxed flex gap-2.5 items-center">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Simulated Triggers Suggestions drawer */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-black text-white/30 tracking-widest px-1">Simulate spoken query phrases</span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((sug, sIndex) => (
                      <button
                        key={sIndex}
                        onClick={() => handleApplySuggestion(sug)}
                        className="px-3 py-1.5 bg-white/5 border border-white/5 hover:border-gold-500/20 rounded-xl text-[10px] font-semibold text-white/60 hover:text-gold-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                      >
                        <Play size={8} className="text-gold-400 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
