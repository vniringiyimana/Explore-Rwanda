import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { UI_TRANSLATIONS } from '../constants';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542133800-474be6f89073?q=80&w=2560&auto=format&fit=crop", // Misty Mountains
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2560&auto=format&fit=crop", // Savannah
  "https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=2560&auto=format&fit=crop", // Wildlife
  "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=2560&auto=format&fit=crop", // Culture
];

export default function Hero({ lang }: { lang: string }) {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-forest-950">
      {/* Dynamic Slide Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${HERO_IMAGES[currentIdx]}")` }}
          />
        </AnimatePresence>
        
        {/* Layered Overlays for Depth and Legibility */}
        <div className="absolute inset-0 bg-linear-to-b from-forest-950/80 via-forest-950/30 to-forest-950" />
        <div className="absolute inset-0 bg-linear-to-r from-forest-950 via-forest-950/40 to-transparent" />
        
        {/* Subtle Texture/Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(201,168,76,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.2)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-forest-400/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-gold-300 mb-8 border border-gold-500/20">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse shadow-[0_0_10px_#d4af37]" />
              {lang === 'rw' ? 'IKORANABUHANGA RISHYA MU BUKERARUGENDO' : lang === 'fr' ? 'PLATEFORME TOURISTIQUE IA' : 'AI-POWERED TOURISM PLATFORM'}
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 lg:pr-10 text-white">
              {t('hero_title').split(' ').slice(0, -2).join(' ')} <br />
              <span className="gold-gradient-text tracking-tight">
                {t('hero_title').split(' ').slice(-2).join(' ')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-10 max-w-xl font-medium drop-shadow-lg">
              {t('hero_subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <button 
                onClick={() => document.querySelector('#ai-planner')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 font-bold rounded-full hover:shadow-2xl hover:shadow-gold-500/30 transition-all flex items-center gap-3 active:scale-95"
              >
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                {t('plan_ai')}
              </button>
              <button 
                onClick={() => document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-3 border border-white/10 active:scale-95"
              >
                <Compass size={18} />
                {t('explore_now')}
              </button>
            </div>

            {/* Slide Navigation & Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button onClick={prevSlide} className="p-2 glass rounded-full text-white/40 hover:text-gold-300 hover:border-gold-500/30 transition-all active:scale-90">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-2 glass rounded-full text-white/40 hover:text-gold-300 hover:border-gold-500/30 transition-all active:scale-90">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex gap-2">
                {HERO_IMAGES.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${i === currentIdx ? 'w-8 bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex justify-center relative"
          >
            <div className="relative group">
              {/* Main Card */}
              <div className="w-[320px] h-[450px] rounded-[2.5rem] overflow-hidden glass border border-white/10 p-4 relative z-10 shadow-2xl">
                <div className="h-full w-full rounded-2xl overflow-hidden bg-forest-800 relative">
                  <div className="absolute inset-0 bg-linear-to-br from-forest-700/80 to-forest-900/90" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-8xl mb-8 filter drop-shadow-2xl"
                    >
                      🦍
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Volcanoes</h3>
                    <p className="text-sm text-white/50 mb-4">National Park, Musanze</p>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                      <Star size={12} className="text-gold-400 fill-gold-400" />
                      <span className="text-[10px] font-bold text-gold-300 uppercase tracking-widest">4.9 • 12,340 Visited</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-12 z-20 glass rounded-2xl p-4 shadow-xl border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center text-xl">🏔️</div>
                  <div>
                    <div className="text-xs font-bold text-white">Mt. Bisoke</div>
                    <div className="text-[10px] text-white/50">3,711m altitude</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -left-12 z-20 glass rounded-2xl p-4 shadow-xl border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-400/20 flex items-center justify-center text-xl">☕</div>
                  <div>
                    <div className="text-xs font-bold text-white">Coffee Tour</div>
                    <div className="text-[10px] text-white/50">From $25/person</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
