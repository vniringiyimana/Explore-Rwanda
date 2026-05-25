import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hotel as HotelType } from '../types';
import { Hotel as HotelIcon, MapPin, Star, Building, Trees, Coffee, Wifi, Waves, Utensils, Sparkles, Filter, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

function HotelImageGallery({ images, name, category }: { images: string[], name: string, category: string }) {
  const [index, setIndex] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded(false);
    setIndex((index + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded(false);
    setIndex((index - 1 + images.length) % images.length);
  };

  if (!images.length) return (
    <div className="h-48 bg-linear-to-br from-forest-700 to-forest-800 flex items-center justify-center relative">
       <Sparkles size={48} className="text-white/10" />
    </div>
  );

  return (
    <div className="h-56 relative group/gallery overflow-hidden bg-forest-800/50">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt={name}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onLoad={() => setIsLoaded(true)}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-linear-to-t from-forest-900/60 to-transparent" />

      <div className={`absolute top-4 left-4 px-3 py-1 glass rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 z-10 ${
        category === 'luxury' ? 'text-gold-300' : category === 'eco' ? 'text-green-300' : 'text-blue-300'
      }`}>
        {category}
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
        <button onClick={prev} className="w-8 h-8 glass rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-forest-900 transition-all">
          <ChevronLeft size={16} />
        </button>
        <button onClick={next} className="w-8 h-8 glass rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-forest-900 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-gold-500 w-4' : 'bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}

export default function Hotels({ data, onBook, onViewDetails }: { data: HotelType[], onBook: (id: number) => void, onViewDetails: (id: number) => void }) {
  const [filter, setFilter] = useState<'all' | 'luxury' | 'eco' | 'budget'>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All', icon: <HotelIcon size={14} /> },
    { id: 'luxury', label: 'Luxury', icon: <Building size={14} /> },
    { id: 'eco', label: 'Eco Lodge', icon: <Trees size={14} /> },
    { id: 'budget', label: 'Budget', icon: <Coffee size={14} /> }
  ];

  const amenityOptions = [
    { id: 'Pool', label: 'Pool', icon: <Waves size={12} /> },
    { id: 'Spa', label: 'Spa', icon: <Sparkles size={12} /> },
    { id: 'Restaurant', label: 'Restaurant', icon: <Utensils size={12} /> },
    { id: 'WiFi', label: 'WiFi', icon: <Wifi size={12} /> }
  ];

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const filtered = data.filter(h => {
    const categoryMatch = filter === 'all' || h.cat === filter;
    const amenityMatch = selectedAmenities.length === 0 || 
      selectedAmenities.every(selected => 
        h.amenities?.some(item => 
          item.toLowerCase().includes(selected.toLowerCase())
        )
      );
    return categoryMatch && amenityMatch;
  });

  return (
    <section id="hotels" className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-900 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold text-gold-300 mb-4 border border-gold-500/20"
          >
            <HotelIcon size={12} />
            ACCOMMODATION
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold mb-6"
          >
            Refined <span className="gold-gradient-text">Stays</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto text-base"
          >
            Handpicked accommodations that define Rwandan hospitality — 
            from world-class eco-lodges to boutique urban escapes.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  filter === cat.id 
                    ? 'bg-linear-to-br from-gold-400 to-gold-600 text-forest-900 border-transparent shadow-lg shadow-gold-500/20' 
                    : 'glass text-white/50 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 mr-2 border-r border-white/10 pr-4">
              <Filter size={12} className="text-gold-500/50" />
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Amenities</span>
            </div>
            {amenityOptions.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 border ${
                  selectedAmenities.includes(amenity.id)
                    ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                    : 'bg-white/5 text-white/30 border-white/5 hover:border-white/10 hover:text-white/60'
                }`}
              >
                {amenity.icon}
                {amenity.label}
              </button>
            ))}
            {selectedAmenities.length > 0 && (
              <button 
                onClick={() => setSelectedAmenities([])}
                className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-red-400 transition-colors ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((hotel) => (
              <motion.div
                key={hotel.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => onViewDetails(hotel.id)}
                className="group cursor-pointer glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-500 bg-white/[0.02]"
              >
                <HotelImageGallery images={hotel.gallery || []} name={hotel.name} category={hotel.cat} />

                <div className="p-6">
                  <h3 className="font-display font-bold text-xl mb-2 group-hover:text-gold-300 transition-colors">
                    {hotel.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4 font-medium uppercase tracking-wider">
                    <MapPin size={12} className="text-gold-400" />
                    {hotel.location}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {hotel.amenities.map(amenity => (
                      <span key={amenity} className="px-2.5 py-1 bg-white/5 rounded-full text-[9px] font-bold text-white/30 uppercase tracking-widest border border-white/5 whitespace-nowrap">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-gold-400 fill-gold-400" />
                        <span className="text-sm font-bold text-white">{hotel.rating}</span>
                        <span className="text-[10px] text-white/20 font-bold ml-1">({hotel.reviews?.length || 0})</span>
                      </div>
                      <div className="text-xl font-bold text-gold-300">
                        ${hotel.price}
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1.5">/night</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(hotel.id);
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 active:scale-95"
                      >
                        Details
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onBook(hotel.id);
                        }}
                        className="flex-[2] bg-gold-500 text-forest-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 group-hover:bg-gold-400 group-hover:shadow-gold-500/40"
                      >
                        <Zap size={14} className="fill-current" />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
