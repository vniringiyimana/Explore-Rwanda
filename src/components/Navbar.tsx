import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, Globe, CalendarDays, ChevronDown, Hotel, Ticket, Car, Trophy, Package, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UI_TRANSLATIONS } from '../constants';
import { User } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
  lang: string;
  setLang: (l: string) => void;
  onOpenMyBookings: () => void;
  user?: User | null;
  onOpenDashboard?: () => void;
}

export default function Navbar({ onOpenAuth, lang, setLang, onOpenMyBookings, user, onOpenDashboard }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [bookingMenuOpen, setBookingMenuOpen] = useState(false);

  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bookingCategories = [
    { id: 'hotels', icon: Hotel, label: t('hotels'), href: '#hotels' },
    { id: 'tours', icon: Ticket, label: t('experiences'), href: '#experiences' },
    { id: 'transport', icon: Car, label: t('transport'), href: '#transport' },
    { id: 'events', icon: Trophy, label: t('events'), href: '#events' },
    { id: 'packages', icon: Package, label: 'Packages', href: '#deals' },
  ];

  const navLinks = [
    { label: t('home'), href: '#hero' },
    { label: t('about_us'), href: '#about' },
    { label: t('destinations'), href: '#destinations' },
    { label: t('planner'), href: '#ai-planner' },
    { label: t('travel_guide'), href: '#travel-guide' },
    { label: t('community'), href: '#community' },
    { label: t('contact_support'), href: '#contact' },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-forest-900/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
              <span className="text-forest-900 font-bold text-lg">R</span>
            </div>
            <span className="font-display font-bold text-lg tracking-wide hidden lg:block">Explore Rwanda</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <a 
              href="#hero"
              className="px-3 py-2 text-sm font-medium text-white/70 hover:text-gold-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('home')}
            </a>

            {/* Booking Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setBookingMenuOpen(true)}
              onMouseLeave={() => setBookingMenuOpen(false)}
            >
              <button className="px-3 py-2 text-sm font-medium text-white/70 group-hover:text-gold-300 transition-colors flex items-center gap-1">
                Booking <ChevronDown size={14} className={`transition-transform duration-300 ${bookingMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {bookingMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-0 w-56 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2"
                  >
                    {bookingCategories.map((cat) => (
                      <a
                        key={cat.id}
                        href={cat.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setBookingMenuOpen(false);
                          document.querySelector(cat.href)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-gold-300 hover:bg-white/5 transition-all"
                      >
                        <cat.icon size={16} className="text-gold-500" />
                        {cat.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-white/70 hover:text-gold-300 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 rounded-lg glass text-white/70 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
              >
                <Globe size={16} />
                <span className="hidden sm:inline uppercase">{lang}</span>
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 hover:bg-white/10 transition-colors ${lang === l.code ? 'text-gold-300 bg-white/5' : 'text-white/60'}`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={onOpenMyBookings}
              className="p-2 rounded-lg glass text-white/70 hover:text-gold-300 transition-all"
              title={t('my_bookings')}
            >
              <CalendarDays size={20} />
            </button>

            {user ? (
              <button 
                onClick={onOpenDashboard}
                className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 rounded-full hover:shadow-xl hover:shadow-gold-400/20 transition-all active:scale-95"
              >
                <LayoutDashboard size={16} />
                <span className="max-w-[80px] truncate">{user.name.split(' ')[0]} Hub</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 rounded-full hover:shadow-xl hover:shadow-gold-400/20 transition-all active:scale-95"
              >
                <UserIcon size={16} />
                {t('sign_in')}
              </button>
            )}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-forest-900/95 backdrop-blur-2xl border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-2">
              <a 
                href="#hero"
                className="block px-4 py-3 rounded-xl text-lg font-medium text-white/80 hover:bg-white/5 hover:text-gold-300 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('home')}
              </a>

              <div className="py-2">
                <div className="px-4 pb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">Booking</div>
                <div className="grid grid-cols-1 gap-1">
                  {bookingCategories.map((cat) => (
                    <a 
                      key={cat.id}
                      href={cat.href}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-md font-medium text-white/80 hover:bg-white/5 hover:text-gold-300 transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        document.querySelector(cat.href)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <cat.icon size={18} className="text-gold-500" />
                      {cat.label}
                    </a>
                  ))}
                </div>
              </div>

              {navLinks.slice(1).map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-lg font-medium text-white/80 hover:bg-white/5 hover:text-gold-300 transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenMyBookings(); }}
                  className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold glass text-white/80 rounded-2xl"
                >
                  <CalendarDays size={18} />
                  {t('my_bookings')}
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); user ? onOpenDashboard?.() : onOpenAuth(); }}
                  className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 rounded-2xl"
                >
                  {user ? <LayoutDashboard size={18} /> : <UserIcon size={18} />}
                  {user ? 'Dashboard' : t('sign_in')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
