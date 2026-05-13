import React from 'react';
import { motion } from 'motion/react';
import { Target, Shield, Heart, Award, Users, Leaf, Cpu, Globe } from 'lucide-react';
import { UI_TRANSLATIONS } from '../constants';

interface CompanyInfoProps {
  lang: string;
}

export default function CompanyInfo({ lang }: CompanyInfoProps) {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;

  const values = [
    { icon: Target, title: 'Integrity', desc: 'Operating with unwavering honesty and transparency in every interaction.' },
    { icon: Shield, title: 'Safety', desc: 'Ensuring the highest security standards for our travelers and their data.' },
    { icon: Heart, title: 'Passion', desc: 'A deep-rooted love for Rwanda and a commitment to showcasing its beauty.' },
    { icon: Award, title: 'Excellence', desc: 'Striving for perfection in every service, from AI planning to on-site tours.' },
    { icon: Users, title: 'Community', desc: 'Empowering local communities and promoting authentic cultural exchange.' },
    { icon: Leaf, title: 'Sustainability', desc: 'Pioneering eco-friendly tourism that protects our precious ecosystems.' },
  ];

  return (
    <div className="space-y-32 py-20">
      {/* About Section */}
      <section id="about" className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-xs pb-4 block">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                  Pioneering the Future of <span className="text-gold-400">Rwandan Travel</span>
                </h2>
              </div>
              <p className="text-lg text-white/60 leading-relaxed">
                Founded in the heart of Kigali, Explore Rwanda is more than just a travel platform. We are a technology-driven 
                bridge between the world and the breathtaking "Land of a Thousand Hills." Our platform combines cutting-edge 
                AI with deep local expertise to create journeys that are as seamless as they are transformative.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <div className="text-3xl font-display font-bold text-gold-400">10k+</div>
                  <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Happy Travelers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-display font-bold text-gold-400">100%</div>
                  <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Local Guides</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 bg-linear-to-br from-gold-500/20 to-transparent rounded-[3rem] -rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop" 
                alt="Rwandan Landscape"
                className="w-full h-full object-cover rounded-[3rem] relative z-10 shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white/5 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="text-gold-500" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-widest">{t('our_mission')}</h2>
            <p className="text-xl text-white/70 italic leading-relaxed font-light">
              "To revolutionize the African travel experience through innovation, sustainability, and authentic connection, 
              ensuring every visitor leaves with a piece of Rwanda in their soul."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="text-center mb-20 space-y-4">
          <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-xs">Foundation</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-widest">{t('core_values')}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-gold-500/30 transition-all group"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-gold-500/10 group-hover:border-gold-500/20 transition-all">
                <v.icon className="text-white/40 group-hover:text-gold-400 transition-colors" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{v.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Long-term Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="glass rounded-[4rem] p-12 md:p-20 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-[120px]" />
          
          <div className="grid lg:grid-cols-2 gap-16 relative z-10 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight uppercase tracking-widest">
                Built to Last: <br/>Our Strategic <span className="text-gold-400">Vision</span>
              </h2>
              <p className="text-white/50 leading-relaxed">
                We believe in Rwanda's Vision 2050. Our platform is continuously evolving with:
              </p>
              <div className="space-y-6">
                {[
                  { icon: Cpu, title: 'AI Advancements', text: 'Integrating real-time predictive analytics for travel safety and personalized discovery.' },
                  { icon: Globe, title: 'Regional Expansion', text: 'Connecting East Africa through a unified digital tourism ecosystem.' },
                  { icon: Shield, title: 'Data Sovereignty', text: 'Leading the way in African data privacy and local hosting infrastructure.' }
                ].map((item) => (
                  <div key={item.title} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-xs text-white/30">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
               <div className="absolute inset-0 bg-gold-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 relative z-10 glass flex items-center justify-center">
                 <div className="text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto">
                     <Target className="text-gold-400" size={32} />
                   </div>
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Excellence in Motion</p>
                   <p className="text-xs text-white/20 italic">Digital twin of Rwandan Tourism Council</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
