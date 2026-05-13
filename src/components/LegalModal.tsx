import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Lock, Globe, Scale, Cpu, Users } from 'lucide-react';
import { UI_TRANSLATIONS } from '../constants';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
  lang: string;
}

export default function LegalModal({ isOpen, onClose, type, lang }: LegalModalProps) {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-forest-950/80 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass rounded-[3rem] p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-white/5 relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
        >
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-transparent backdrop-blur-md pb-4 border-b border-white/10 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center">
                {type === 'terms' ? <Scale className="text-gold-500" size={24} /> : <ShieldCheck className="text-gold-500" size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold uppercase tracking-wider">
                  {type === 'terms' ? t('terms_conditions') : t('privacy_policy')}
                </h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Effective: May 11, 2026</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8 text-white/60 leading-relaxed text-sm">
            {type === 'terms' ? (
              <>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Globe size={18} className="text-gold-500" /> 1. Acceptance of Terms
                  </h3>
                  <p>By accessing and using Explore Rwanda, you agree to be bound by these Terms and Conditions. Our platform is designed to facilitate tourism in Rwanda through AI-driven insights and booking services.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <FileText size={18} className="text-gold-500" /> 2. Booking Policies
                  </h3>
                  <p>All bookings made through the app are subject to availability. We act as an intermediary between travelers and service providers (hotels, parks, experiences). Each provider may have their own specific cancellation policies which will be displayed during the booking process.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Cpu size={18} className="text-gold-500" /> 3. AI Generated Content
                  </h3>
                  <p>Our AI Planner provides suggestions based on available data. While we strive for accuracy, Explore Rwanda is not liable for inaccuracies in AI-generated itineraries or translations. Users should verify critical details with local authorities.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Scale size={18} className="text-gold-500" /> 4. User Conduct
                  </h3>
                  <p>Users must provide accurate information and respect the cultural heritage of Rwanda. Any misuse of the platform or illegal activities will result in immediate termination of account access.</p>
                </section>
              </>
            ) : (
              <>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Lock size={18} className="text-gold-400" /> 1. Data Collection
                  </h3>
                  <p>We collect personal information necessary for bookings and account management, including name, email, and travel preferences. We also use anonymized AI interaction data to improve our services.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Globe size={18} className="text-gold-400" /> 2. Data Usage
                  </h3>
                  <p>Your data is used to provide personalized itineraries, process bookings, and communicate updates. We do not sell your personal information to third parties.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <ShieldCheck size={18} className="text-gold-400" /> 3. Security
                  </h3>
                  <p>We implement industry-standard encryption and security protocols to protect your data. All transactions are handled through secure, PCI-compliant payment gateways.</p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Users size={18} className="text-gold-400" /> 4. Your Rights
                  </h3>
                  <p>In accordance with Rwandan Data Protection Laws, you have the right to access, rectify, or delete your personal data at any time through your account settings or by contacting our support team.</p>
                </section>
              </>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={onClose}
              className="px-12 py-4 bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold rounded-2xl transition-all text-sm uppercase tracking-widest active:scale-95"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
