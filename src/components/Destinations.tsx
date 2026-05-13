import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Destination } from '../types';
import { Compass, Star, MapPin, Calendar, ArrowRight, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Destinations({ data, onSelect }: { data: Destination[], onSelect: (id: number) => void }) {
  const [filter, setFilter] = useState<'all' | 'parks' | 'lakes' | 'culture' | 'adventure' | 'hidden'>('all');
  const [selectedGallery, setSelectedGallery] = useState<{ dest: Destination, index: number } | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'parks', label: 'National Parks' },
    { id: 'lakes', label: 'Lakes' },
    { id: 'culture', label: 'Culture' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'hidden', label: 'Hidden Gems' },
  ];

  const filtered = filter === 'all' ? data : data.filter(d => d.cat === filter);

  const openGallery = (e: React.MouseEvent, dest: Destination) => {
    e.stopPropagation();
    setSelectedGallery({ dest, index: 0 });
  };

  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-900 relative min-h-screen">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #c9a84c 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold text-gold-300 mb-4 border border-gold-500/20"
          >
            <Compass size={12} />
            TOURISM DISCOVERY
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold mb-6"
          >
            Iconic <span className="gold-gradient-text">Destinations</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto text-base font-medium"
          >
            Explore Rwanda's breathtaking landscapes through our curated visual 
            guide. From misty peaks to vibrant galleries.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                filter === cat.id 
                  ? 'bg-linear-to-br from-gold-400 to-gold-600 text-forest-900 border-transparent shadow-lg shadow-gold-500/20' 
                  : 'glass text-white/50 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((dest) => (
              <motion.div
                key={dest.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => onSelect(dest.id)}
                className="group cursor-pointer glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-500 bg-white/[0.02]"
              >
                <div className="aspect-[16/10] bg-linear-to-br from-forest-700 to-forest-800 relative overflow-hidden group/image">
                  {dest.gallery && dest.gallery[0] ? (
                    <img 
                      src={dest.gallery[0]} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <span className="text-7xl drop-shadow-2xl z-10 opacity-30">{dest.emoji}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-linear-to-t from-forest-900 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Action Badge */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={(e) => openGallery(e, dest)}
                      className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-gold-500 hover:text-forest-900 transition-all duration-300 border border-white/10"
                    >
                      <ImageIcon size={18} />
                    </button>
                    <div className="px-3 py-1 glass rounded-xl text-[10px] font-bold text-gold-300 tracking-[0.2em] border border-white/10 uppercase flex items-center">
                      {dest.price}
                    </div>
                  </div>

                  {/* Rating Label on Image */}
                  <div className="absolute bottom-4 left-4 flex gap-1.5 items-center px-3 py-1.5 glass rounded-xl border border-white/10 shadow-lg">
                    <Star size={14} className="text-gold-400 fill-gold-400" />
                    <span className="text-xs font-black text-white">{dest.rating}</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-black text-2xl group-hover:text-gold-300 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 mb-5 font-black uppercase tracking-[0.2em]">
                    <MapPin size={12} className="text-gold-400" />
                    {dest.location}
                  </div>
                  
                  <p className="text-sm text-white/50 leading-relaxed mb-8 line-clamp-2 italic font-medium">
                    "{dest.desc}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Best Access</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gold-300 uppercase tracking-wider">
                        <Calendar size={12} />
                        {dest.best}
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-gold-500/10 group-hover:text-gold-500 transition-all">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Gallery Modal (Lightbox) */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-forest-900/95 backdrop-blur-xl flex flex-col p-4 sm:p-10"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-gold-400 font-display text-2xl font-black">{selectedGallery.dest.name}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Visual Exploration / Gallery</p>
              </div>
              <button 
                onClick={() => setSelectedGallery(null)}
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center group/lightbox">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between z-10 px-4">
                <button 
                  onClick={() => setSelectedGallery(prev => prev ? { ...prev, index: (prev.index - 1 + (prev.dest.gallery?.length || 1)) % (prev.dest.gallery?.length || 1) } : null)}
                  className="w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-forest-900 transition-all"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={() => setSelectedGallery(prev => prev ? { ...prev, index: (prev.index + 1) % (prev.dest.gallery?.length || 1) } : null)}
                  className="w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-forest-900 transition-all"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              <motion.div 
                key={selectedGallery.index}
                initial={{ opacity: 0, scale: 0.9, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: -45 }}
                transition={{ type: "spring", damping: 12 }}
                className="relative w-full max-w-5xl aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
              >
                <img 
                  src={selectedGallery.dest.gallery?.[selectedGallery.index]} 
                  alt={`${selectedGallery.dest.name} view ${selectedGallery.index + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image Caption */}
                <div className="absolute bottom-0 inset-x-0 p-8 bg-linear-to-t from-forest-900 via-forest-900/40 to-transparent">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{selectedGallery.dest.emoji}</span>
                    <div>
                      <p className="text-white font-bold text-lg mb-1">{selectedGallery.dest.location}</p>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{selectedGallery.dest.name} — Frame {selectedGallery.index + 1}/{selectedGallery.dest.gallery?.length}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-3 mt-10 overflow-x-auto pb-4">
              {selectedGallery.dest.gallery?.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedGallery(prev => prev ? { ...prev, index: i } : null)}
                  className={`w-24 h-16 rounded-xl overflow-hidden transition-all border-2 ${selectedGallery.index === i ? 'border-gold-500 scale-110' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
