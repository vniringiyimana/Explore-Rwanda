import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, X, MapPin, Navigation, Filter } from 'lucide-react';
import { MAP_POINTS } from '../constants';

export default function InteractiveMap() {
  const [selectedPoint, setSelectedPoint] = useState<typeof MAP_POINTS[0] | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<typeof MAP_POINTS[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'city' | 'park' | 'lake' | 'culture'>('all');

  const filteredPoints = useMemo(() => {
    if (activeCategory === 'all') return MAP_POINTS;
    return MAP_POINTS.filter(point => point.category === activeCategory);
  }, [activeCategory]);

  const categories = [
    { id: 'all', label: 'All Locations', icon: '🌍' },
    { id: 'city', label: 'Cities', icon: '🏙️' },
    { id: 'park', label: 'National Parks', icon: '🌿' },
    { id: 'lake', label: 'Lakes', icon: '🌊' },
    { id: 'culture', label: 'Culture', icon: '🏛️' },
  ];

  const handleGetDirections = (point: typeof MAP_POINTS[0]) => {
    const query = encodeURIComponent(`${point.title}, Rwanda`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  return (
    <section id="map-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-900 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold text-gold-300 mb-4 border border-gold-500/20"
          >
            <MapIcon size={12} />
            INTERACTIVE DISCOVERY
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold mb-8"
          >
            Explore <span className="gold-gradient-text">Rwanda's Regions</span>
          </motion.h2>

          {/* Category Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-gold-500 text-forest-900 shadow-xl shadow-gold-500/20 scale-105' 
                    : 'glass text-white/40 hover:text-white border border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-[3rem] p-8 border border-white/10 shadow-2xl relative h-[600px] overflow-hidden flex flex-col items-center justify-center">
            {/* SVG Background Map */}
            <svg viewBox="0 0 500 450" className="w-full h-full max-h-[500px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <defs>
                <radialGradient id="mapGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#1a5c38" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0d2818" stopOpacity="0.3" />
                </radialGradient>
              </defs>
              
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M120,80 Q140,60 180,50 Q220,40 260,55 Q300,40 340,50 Q380,60 400,90 Q410,120 405,160 Q400,200 380,240 Q370,270 350,300 Q330,330 300,350 Q270,370 240,380 Q200,390 170,370 Q140,350 120,320 Q100,290 90,250 Q80,210 85,170 Q90,130 100,100 Z" 
                fill="url(#mapGrad)" 
                stroke="#c9a84c" 
                strokeWidth="2" 
                strokeOpacity="0.4"
                strokeLinecap="round"
              />

              {/* Filtered Markers */}
              <AnimatePresence>
                {filteredPoints.map((point) => (
                  <motion.g 
                    key={point.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="cursor-pointer group"
                    onClick={() => setSelectedPoint(point)}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle 
                      cx={point.coordinates.cx} 
                      cy={point.coordinates.cy} 
                      r="8" 
                      fill="#c9a84c" 
                      opacity="0.3"
                    >
                      <animate attributeName="r" values="8;15;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle 
                      cx={point.coordinates.cx} 
                      cy={point.coordinates.cy} 
                      r="5" 
                      fill={selectedPoint?.id === point.id ? "#ffffff" : "#c9a84c"} 
                      className="transition-colors duration-300 shadow-lg shadow-black/50"
                    />
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>

            {/* Hover Tooltip */}
            <AnimatePresence>
              {hoveredPoint && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  style={{ 
                    position: 'absolute', 
                    left: `${(hoveredPoint.coordinates.cx / 500) * 100}%`, 
                    top: `${(hoveredPoint.coordinates.cy / 450) * 100}%`,
                    transform: 'translate(-50%, -60px)',
                    zIndex: 30
                  }}
                  className="pointer-events-none"
                >
                  <div className="glass px-4 py-2.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 whitespace-nowrap">
                    <span className="text-xl filter drop-shadow-sm">{hoveredPoint.emoji}</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{hoveredPoint.title}</span>
                  </div>
                  <div className="w-3 h-3 glass rotate-45 border-r border-b border-white/10 mx-auto -mt-1.5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Labels overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {filteredPoints.map((point) => (
                <div 
                  key={point.id}
                  style={{ 
                    position: 'absolute', 
                    left: `${(point.coordinates.cx / 500) * 100}%`, 
                    top: `${(point.coordinates.cy / 450) * 100}%`,
                    transform: 'translate(-50%, 20px)',
                    opacity: hoveredPoint?.id === point.id ? 1 : 0.4
                  }}
                  className="text-[9px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 transition-opacity duration-300"
                >
                  {point.title}
                </div>
              ))}
            </div>

            {/* Info Panel */}
            <AnimatePresence>
              {selectedPoint && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-8 right-8 w-72 glass p-6 rounded-[2rem] border border-white/20 shadow-2xl z-20"
                >
                  <button 
                    onClick={() => setSelectedPoint(null)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg text-white/40 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div className="text-4xl mb-4 filter drop-shadow-lg">{selectedPoint.emoji}</div>
                  <h4 className="font-display text-xl font-bold mb-2 text-gold-300 flex items-center gap-2">
                    <MapPin size={18} />
                    {selectedPoint.title}
                  </h4>
                  <p className="text-sm text-white/50 leading-relaxed mb-6 font-medium">
                    "{selectedPoint.desc}"
                  </p>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5 mb-6">
                    <div>
                      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Pop/Hub</div>
                      <div className="text-xs font-bold text-white/80">{selectedPoint.pop}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Altitude</div>
                      <div className="text-xs font-bold text-white/80">{selectedPoint.altitude}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleGetDirections(selectedPoint)}
                    className="w-full bg-gold-500 text-forest-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Navigation size={14} />
                    Get Directions
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-10 left-10 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-10 h-px bg-white/10" />
              Interactive Regional Mapping
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
