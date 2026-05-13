import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Send, Sparkles, Globe, ShieldCheck, Edit, Trash2 } from 'lucide-react';
import { DashboardProps, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export default function ContentDashboard({ activeTab, user, bookings }: DashboardProps) {
  const isAdmin = user.role === UserRole.ADMIN;
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1540206276207-3f2439c50400?auto=format&fit=crop&q=80', // Street culture
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80', // Wildlife
    'https://images.unsplash.com/photo-1542113300-474be6f89073?auto=format&fit=crop&q=80', // Landscapes
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[80vh] pt-4">
       {/* Background Slideshow */}
       <div className="absolute inset-0 -top-8 -mx-10 rounded-[4rem] overflow-hidden -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 9000)}
            className="absolute inset-0"
          >
            <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {isAdmin && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-[2rem] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 ml-4">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Content Override Active</span>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all">Review All Drafts</button>
        </div>
      )}
      {/* Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Published', value: '184', icon: FileText, color: 'text-blue-400' },
          { label: 'SEO Score', value: '94/100', icon: Sparkles, color: 'text-gold-400' },
          { label: 'Daily Reads', value: '12.4k', icon: Globe, color: 'text-green-400' },
          { label: 'Assets', value: '2.5 GB', icon: ImageIcon, color: 'text-purple-400' },
        ].map((stat, idx) => (
          <div key={idx} className="glass rounded-[2rem] p-6 border border-white/5 relative group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon size={32} />
             </div>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-2xl font-display font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-400" size={20} /> Latest Drafts
          </h3>
          {[
            { title: 'The Ultimate Guide to Lake Kivu', author: 'Alex M.', status: 'Editing' },
            { title: '10 Hidden Gems in Kigali', author: 'Sarah J.', status: 'Review' },
          ].map((post, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group">
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">{post.title}</h4>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">{post.author}</p>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin && <Trash2 size={14} className="text-white/20 hover:text-red-400 cursor-pointer" />}
                <span className="text-[9px] font-black text-gold-500 uppercase px-2 py-1 bg-gold-500/10 rounded-full">{post.status}</span>
              </div>
            </div>
          ))}
          <button className="w-full py-3 border border-white/10 rounded-2xl text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-all">
            Write New Article
          </button>
        </div>

        <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-3">
            <Globe className="text-green-400" size={20} /> Translation Matrix
          </h3>
          <div className="space-y-4">
             {['English', 'Kinyarwanda', 'French', 'Swahili'].map(lang => (
               <div key={lang} className="flex justify-between items-center p-3 bg-white/3 rounded-xl">
                 <span className="text-xs font-bold text-white/60">{lang}</span>
                 <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-gold-500" style={{ width: lang === 'English' ? '100%' : '85%' }} />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-12 border border-white/5 flex flex-col items-center text-center">
        <Sparkles size={48} className="text-gold-500/20 mb-6" />
        <h3 className="text-xl font-bold text-white mb-2">Editor Tools</h3>
        <p className="text-sm text-white/40 italic max-w-sm">"Manage banners, SEO settings, and homepage media directly from the content workspace."</p>
      </div>
    </div>
  );
}
