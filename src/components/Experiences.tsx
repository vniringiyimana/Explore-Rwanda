import React from 'react';
import { motion } from 'motion/react';
import { Experience } from '../types';
import { Heart, Clock, Users, Star } from 'lucide-react';

export default function Experiences({ data, onBook }: { data: Experience[], onBook: (id: number) => void }) {
  return (
    <section id="experiences" className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold text-gold-300 mb-4 border border-gold-500/20"
          >
            <Heart size={12} />
            LOCAL EXPERIENCES
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold mb-6"
          >
            Unforgettable <span className="gold-gradient-text">Experiences</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto text-base"
          >
            Book curated local adventures directly — from soul-stirring gorilla 
            treks to immersive cultural connections.
          </motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => onBook(exp.id)}
              className="group cursor-pointer glass rounded-3xl p-5 border border-white/5 hover:border-gold-500/30 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{exp.emoji}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${exp.badgeColor || 'bg-white/10 text-white/60'}`}>
                  {exp.badge || 'New'}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-gold-300 transition-colors">
                {exp.name}
              </h3>
              
              <div className="flex flex-wrap gap-4 text-[10px] text-white/30 mb-6 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Clock size={12} />{exp.duration}</span>
                <span className="flex items-center gap-1.5"><Users size={12} />{exp.group}</span>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-gold-400 fill-gold-400" />
                  <span className="text-sm font-bold text-white">{exp.rating}</span>
                  <span className="text-[10px] text-white/30 font-medium">({exp.reviews?.toLocaleString() || 0})</span>
                </div>
                <div className="text-lg font-bold text-gold-300">
                  <span className="text-[10px] font-normal text-white/40 mr-1">from</span>
                  ${exp.price}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
