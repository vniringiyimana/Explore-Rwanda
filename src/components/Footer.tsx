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

            {/* Download app buttons */}
            <div className="mt-8 space-y-3 font-sans">
              <h5 className="text-[9px] font-black text-white/30 tracking-[0.22em] uppercase pl-1">
                📥 Get Our Official Mobile App
              </h5>
              <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm">
                
                {/* Play store link button */}
                <a 
                  href="https://play.google.com/store" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-500/30 rounded-xl transition-all cursor-pointer select-none shrink-0"
                >
                  <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.783 12 3.609 22.186c-.18.18-.218.455-.09.673.128.217.377.307.609.22l14.288-5.358c.453-.17.754-.601.754-1.085v-9.272c0-.484-.301-.915-.754-1.085L4.128 1.157c-.232-.087-.481.003-.609.22-.128.218-.09.493.09.673zM5.38 3.511l12.433 7.643H5.38V3.511zm0 16.978V12.846h12.433l-12.433 7.643z"/>
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[8px] uppercase tracking-wider text-white/40 block">GET IT ON</span>
                    <span className="text-xs font-black text-white tracking-tight">Google Play</span>
                  </div>
                </a>

                {/* Apple store link button */}
                <a 
                  href="https://www.apple.com/app-store/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-500/30 rounded-xl transition-all cursor-pointer select-none shrink-0"
                >
                  <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.12 1.05 1.09.91 1.82a2.4 2.4 0 001-.33z"/>
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[8px] uppercase tracking-wider text-white/40 block">Download on the</span>
                    <span className="text-xs font-black text-white tracking-tight">App Store</span>
                  </div>
                </a>

              </div>
              
              {/* Direct APK Download option */}
              <div className="flex items-center gap-2 text-[9px] text-white/30 italic pl-1 pt-1 flex-wrap">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Latest secure mobile release: 
                <a 
                  href="/release/explore_rwanda_latest.apk" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('app-toast', { detail: '📦 Direct APK installation package transfer initiated successfully!' }));
                  }}
                  className="text-gold-400 hover:text-gold-300 underline font-bold cursor-pointer"
                >
                  Direct APK (v1.4.1)
                </a>
              </div>
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
