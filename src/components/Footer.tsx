import React from 'react';
import { Twitter, Instagram, Facebook, Youtube, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegal?: (type: 'terms' | 'privacy') => void;
}

export default function Footer({ onOpenLegal }: FooterProps) {
  return (
    <footer className="py-20 px-4 sm:px-6 lg:px-8 bg-forest-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-forest-900 text-xl shadow-lg shadow-gold-500/20">
                R
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Explore Rwanda</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-8">
              The smartest way to discover Rwanda's beauty, culture, and innovation. 
              Built for the modern traveler with state-of-the-art AI integration.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, idx) => (
                <div key={idx} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-gold-300 hover:border-gold-500/30 cursor-pointer transition-all active:scale-90">
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Discover',
              links: ['Iconic Destinations', 'Local Experiences', 'Luxury Hotels', 'Hidden Gems']
            },
            {
              title: 'Travel Services',
              links: [
                { label: 'Travel Guide', href: '#travel-guide' },
                { label: 'Events', href: '#events' },
                { label: 'Transport', href: '#transport' },
                { label: 'Deals', href: '#deals' }
              ]
            },
            {
              title: 'Connect',
              links: [
                { label: 'Community', href: '#community' },
                { label: 'Support', href: '#contact' },
                { label: 'AI Planner', href: '#ai-planner' },
                { label: 'Translation', href: '#translate' }
              ]
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '#about' },
                { label: 'Terms', action: () => onOpenLegal?.('terms') },
                { label: 'Privacy', action: () => onOpenLegal?.('privacy') }
              ]
            }
          ]
.map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link, idx) => (
                  <li key={typeof link === 'string' ? link : idx}>
                    {typeof link === 'string' ? (
                      <a href="#" className="text-sm font-medium text-white/50 hover:text-gold-300 transition-colors">{link}</a>
                    ) : (
                      <button 
                        onClick={link.action ? (e) => { e.preventDefault(); link.action(); } : undefined}
                        className="text-sm font-medium text-white/50 hover:text-gold-300 transition-colors text-left"
                      >
                        {link.href ? <a href={link.href}>{link.label}</a> : link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center gap-3">
            © 2025 Explore Rwanda Council. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            Sustainable Living with <Heart size={12} className="text-rose-500 fill-rose-500" /> in the Heart of Africa
          </div>
        </div>
      </div>
    </footer>
  );
}
