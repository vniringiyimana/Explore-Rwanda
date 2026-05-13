import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Calendar, Car, Tag, Users, MessageSquare, 
  ChevronRight, Info, MapPin, Clock, Phone, Mail, Send,
  CreditCard, ShieldCheck, Sun, Wifi, HeartPulse, Luggage,
  HelpCircle, Music, Trophy, Sparkles, Pizza, Image,
  Star, LifeBuoy, MessageCircle, AlertTriangle, Smartphone,
  Activity, PlaneTakeoff, Mic2, Globe, Landmark, Coffee,
  Camera, MessageSquareText, ThumbsUp, HelpCircle as HelpIcon,
  Search, ExternalLink, Navigation, CheckCircle2, Ticket
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../constants';

interface HubSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  lang: string;
}

const HubSection = ({ id, title, icon, children }: HubSectionProps) => (
  <section id={id} className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 scroll-mt-20">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
          {icon}
        </div>
        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  </section>
);

export default function TravelHub({ lang, onBook }: { lang: string, onBook?: (id: number, cat?: any) => void }) {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;
  
  // Active sub-tabs for each section
  const [activeGuide, setActiveGuide] = useState('Visa');
  const [activeEvents, setActiveEvents] = useState('Festivals');
  const [activeTransport, setActiveTransport] = useState('Transfers');
  const [activeDeals, setActiveDeals] = useState('Hotels');
  const [activeCommunity, setActiveCommunity] = useState('Reviews');
  const [activeSupport, setActiveSupport] = useState('Emergency');

  // Filters for Transport
  const [carFilter, setCarFilter] = useState('All');
  const [carPriceFilter, setCarPriceFilter] = useState('All');
  const [motoFilter, setMotoFilter] = useState('All');
  const [busRoute, setBusRoute] = useState('All');

  const guideTabs = [
    { id: 'Visa', icon: Landmark, label: 'Visa Info' },
    { id: 'Currency', icon: CreditCard, label: 'Currency' },
    { id: 'Safety', icon: ShieldCheck, label: 'Safety Tips' },
    { id: 'Season', icon: Sun, label: 'Best Time' },
    { id: 'Etiquette', icon: Users, label: 'Etiquette' },
    { id: 'SIM', icon: Smartphone, label: 'SIM/Internet' },
    { id: 'Health', icon: HeartPulse, label: 'Health' },
    { id: 'Packing', icon: Luggage, label: 'Packing' },
    { id: 'FAQs', icon: HelpCircle, label: 'FAQs' },
  ];

  const eventsTabs = [
    { id: 'Festivals', icon: Sparkles, label: 'Festivals' },
    { id: 'Concerts', icon: Music, label: 'Concerts' },
    { id: 'Sports', icon: Trophy, label: 'Sports' },
    { id: 'Cultural', icon: Globe, label: 'Cultural' },
    { id: 'Nightlife', icon: Mic2, label: 'Nightlife' },
    { id: 'Expo', icon: Landmark, label: 'Conferences' },
    { id: 'Calendar', icon: Calendar, label: 'Calendar' },
  ];

  const transportTabs = [
    { id: 'Transfers', icon: PlaneTakeoff, label: 'Airport' },
    { id: 'Rentals', icon: Car, label: 'Car Rental' },
    { id: 'Moto', icon: Activity, label: 'Taxi/Moto' },
    { id: 'Bus', icon: Navigation, label: 'Bus' },
    { id: 'Flights', icon: Globe, label: 'Domestic' },
    { id: 'Driving', icon: Landmark, label: 'Driving' },
    { id: 'Maps', icon: MapPin, label: 'Maps' },
  ];

  const dealsTabs = [
    { id: 'Hotels', icon: Landmark, label: 'Hotels' },
    { id: 'Packages', icon: Luggage, label: 'Tour Packages' },
    { id: 'Seasonal', icon: Sun, label: 'Seasonal' },
    { id: 'Food', icon: Coffee, label: 'Restaurants' },
    { id: 'Group', icon: Users, label: 'Group' },
  ];

  return (
    <div className="bg-forest-950">
      {/* 1. Travel Guide */}
      <HubSection 
        id="travel-guide" 
        title={t('travel_guide')} 
        icon={<BookOpen size={24} />}
        lang={lang}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 flex flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide flex-row lg:flex-col">
            {guideTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGuide(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all whitespace-nowrap lg:whitespace-normal ${activeGuide === tab.id ? 'bg-gold-500 text-forest-900' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGuide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-[2rem] p-8 lg:p-12 border border-white/10 min-h-[400px]"
              >
                {activeGuide === 'Visa' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Visa Information</h3>
                    <p className="text-white/60 leading-relaxed">Rwanda offers visa-on-arrival for citizens of all countries. Many nationalities (including AU, Commonwealth, and La Francophonie) get a free 30-day or 90-day visa.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-gold-400 font-bold mb-1">Fee-Free Visas</div>
                        <p className="text-[10px] text-white/40">Commonwealth & African Union citizens.</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-gold-400 font-bold mb-1">East Africa Tourist Visa</div>
                        <p className="text-[10px] text-white/40">90 days, multiple entry for Rwanda, Kenya, Uganda ($100).</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeGuide === 'Currency' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Currency & Payments</h3>
                    <p className="text-white/60 leading-relaxed">The Rwandan Franc (RWF) is the local currency. US Dollars (post-2013) are widely accepted for larger tourism payments.</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                        <span className="text-sm font-bold text-white">Mobile Money (MoMo)</span>
                        <span className="text-[10px] text-gold-400 font-bold uppercase">Must Have</span>
                      </div>
                      <p className="text-xs text-white/40 italic">Exchange bureaus are plentiful in Kigali and at border crossings.</p>
                    </div>
                  </div>
                )}
                {activeGuide === 'Safety' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Safety Tips</h3>
                    <p className="text-white/60 leading-relaxed">Rwanda is consistently ranked as one of the safest countries in Africa and globally. Solo female travelers report very high security.</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Walk freely at night in Kigali', 'Clean streets, follow local laws', 'Emergency number: 112', 'Official motos have helmets'].map(s => (
                        <li key={s} className="flex items-center gap-2 text-xs text-white/70">
                          <CheckCircle2 size={14} className="text-gold-500" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeGuide === 'Season' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Best Time to Visit</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-gold-500 font-bold text-sm mb-2">Dry Seasons</div>
                        <p className="text-xs text-white/60">June - Sept & Dec - Feb. Best for Gorilla trekking and hiking.</p>
                      </div>
                      <div>
                        <div className="text-gold-500 font-bold text-sm mb-2">Wet Seasons</div>
                        <p className="text-xs text-white/60">March - May & Oct - Nov. Lush scenery, birdwatching heaven.</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeGuide === 'Etiquette' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Local Etiquette</h3>
                    <p className="text-white/60 leading-relaxed">Rwandans are generally modest and polite. "Umuganda" (community service) on the last Saturday of every month is a sacred tradition.</p>
                    <div className="p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
                      <p className="text-[10px] text-gold-400 font-bold uppercase mb-1">Critical Rule</p>
                      <p className="text-xs text-white/70">Single-use plastic bags are strictly prohibited in Rwanda. Avoid bringing them into the country.</p>
                    </div>
                  </div>
                )}
                {activeGuide === 'SIM' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">SIM Cards & Internet</h3>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2">MTN Rwanda</div>
                        <p className="text-[10px] text-white/40">Widest coverage, best for rural areas.</p>
                      </div>
                      <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-white mb-2">Airtel-Tigo</div>
                        <p className="text-[10px] text-white/40">Competitive data packages in cities.</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/40 italic">SIM cards can be bought at the airport or any service center with your passport.</p>
                  </div>
                )}
                {activeGuide === 'Health' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Health Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-white/70">
                        <ShieldCheck size={16} className="text-gold-500" /> Yellow Fever certificate often required.
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/70">
                        <HeartPulse size={16} className="text-gold-500" /> Malaria prophylaxis recommended for all regions.
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">Drinking tap water is generally discouraged; bottled water is cheap and widely available. World-class private hospitals (King Faisal) are located in Kigali.</p>
                    </div>
                  </div>
                )}
                {activeGuide === 'Packing' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Packing Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Light Layers (Temps vary)', 'Sturdy Hiking Boots', 'Rain Jacket for Forest', 'Sunscreen & Hat', 'Reusable Bag', 'Voltage G Adapter'].map(item => (
                        <div key={item} className="px-4 py-3 bg-white/5 rounded-xl text-xs text-white/70 flex items-center gap-2">
                           <CheckCircle2 size={12} className="text-gold-500/50" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeGuide === 'FAQs' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      <details className="group border-b border-white/5 pb-3 cursor-pointer">
                        <summary className="text-sm font-bold text-white list-none flex justify-between items-center">
                          Is Rwanda expensive?
                          <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-2 text-xs text-white/40">It can be both. Mid-range to luxury is excellent value, but high-end trekking is premium priced.</p>
                      </details>
                      <details className="group border-b border-white/5 pb-3 cursor-pointer">
                        <summary className="text-sm font-bold text-white list-none flex justify-between items-center">
                          Can I self-drive?
                          <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-2 text-xs text-white/40">Yes, roads are excellent. Left-hand drive (drive on the right).</p>
                      </details>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </HubSection>

      {/* 2. Events */}
      <HubSection 
        id="events" 
        title={t('events')} 
        icon={<Calendar size={24} />}
        lang={lang}
      >
        <div className="space-y-8">
          <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
             {eventsTabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveEvents(tab.id)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${activeEvents === tab.id ? 'bg-gold-500 text-forest-900 border-gold-400' : 'bg-white/5 text-white/40 border-white/10'}`}
               >
                 {tab.label}
               </button>
             ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {activeEvents === 'Festivals' && (
                <>
                  {[
                    { name: 'Kwita Izina (Gorilla Naming)', date: 'Sept 2026', id: 300, img: 'https://images.unsplash.com/photo-1542133800-474be6f89073' },
                    { name: 'Hobe Rwanda Festival', date: 'August 2026', id: 301, img: 'https://images.unsplash.com/photo-1514525253361-bee8d40d9b4b' },
                    { name: 'Kigali UP Music Festival', date: 'July 2026', id: 302, img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3' },
                  ].map((e) => (
                    <motion.div key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative rounded-3xl overflow-hidden aspect-video">
                      <img src={e.img} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                         <span className="text-[10px] font-bold text-gold-400 uppercase mb-1">{e.date}</span>
                         <div className="flex justify-between items-end">
                           <h4 className="text-lg font-bold text-white">{e.name}</h4>
                           <button 
                             onClick={() => onBook?.(e.id, 'event')}
                             className="p-2 glass rounded-xl text-white hover:text-gold-400 transition-colors"
                           >
                              <Ticket size={16} />
                           </button>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
              {activeEvents === 'Concerts' && (
                <>
                  {[
                    { name: 'Kigali Jazz Junction', date: 'Monthly', id: 2001, img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4' },
                    { name: 'Symphony Orchestra KGL', date: 'June 2026', id: 302, img: 'https://images.unsplash.com/photo-1514320298322-2bb6da79afca' }
                  ].map((e) => (
                    <motion.div key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative rounded-3xl overflow-hidden aspect-video">
                      <img src={e.img} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                         <span className="text-[10px] font-bold text-gold-400 uppercase mb-1">{e.date}</span>
                         <div className="flex justify-between items-end">
                           <h4 className="text-lg font-bold text-white">{e.name}</h4>
                           <button 
                             onClick={() => onBook?.(e.id, 'event')}
                             className="p-2 glass rounded-xl text-white hover:text-gold-400 transition-colors"
                           >
                              <Ticket size={16} />
                           </button>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
              {activeEvents === 'Sports' && (
                <>
                  {[
                    { name: 'Tour du Rwanda', date: 'Feb 2026', id: 900, img: 'https://images.unsplash.com/photo-1541625602330-2277a1cd13a1' },
                    { name: 'KGL Peace Marathon', date: 'May 2026', id: 901, img: 'https://images.unsplash.com/photo-1452626012306-dd03d0774246' }
                  ].map((e) => (
                    <motion.div key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative rounded-3xl overflow-hidden aspect-video">
                      <img src={e.img} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                         <span className="text-[10px] font-bold text-gold-400 uppercase mb-1">{e.date}</span>
                         <div className="flex justify-between items-end">
                           <h4 className="text-lg font-bold text-white">{e.name}</h4>
                           <button 
                             onClick={() => onBook?.(e.id, 'event')}
                             className="p-2 glass rounded-xl text-white hover:text-gold-400 transition-colors"
                           >
                              <Ticket size={16} />
                           </button>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
              {activeEvents === 'Nightlife' && (
                <div className="lg:col-span-3 glass p-12 rounded-[3rem] border border-white/10 text-center">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500 mx-auto mb-6">
                    <Mic2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Kigali After Dark</h3>
                  <p className="text-white/50 max-w-xl mx-auto mb-8 text-sm">Discover the vibrant nightlife of the capital. From jazz at Hotel des Mille Collines to high-energy clubs in Kimihurura.</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {['Rendez-vous Jazz', 'Sundowners at Pili-Pili', 'Clubbing in K-Town'].map(item => (
                      <div key={item} className="p-4 bg-white/5 rounded-2xl text-xs font-bold text-white uppercase tracking-widest">{item}</div>
                    ))}
                  </div>
                </div>
              )}
               {activeEvents === 'Calendar' && (
                <div className="lg:col-span-3 glass p-12 rounded-[3rem] border border-white/10">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h3 className="text-2xl font-bold text-white uppercase">2026 Season Highlights</h3>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/40 hover:text-white uppercase">View Full Calendar</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { m: 'FEB', event: 'Tour du Rwanda (Cycling)', type: 'Sports' },
                      { m: 'MAY', event: 'Kigali International Peace Marathon', type: 'Sports' },
                      { m: 'JUL', event: 'Liberation Day Celebrations', type: 'Cultural' },
                      { m: 'OCT', event: 'Kigali Fashion Week', type: 'Expo' }
                    ].map((h, idx) => (
                       <div key={h.event} className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                         <div className="w-16 text-center">
                            <div className="text-gold-500 font-bold text-lg">{h.m}</div>
                            <div className="text-[10px] text-white/20 font-black">2026</div>
                         </div>
                         <div className="flex-1">
                            <div className="text-sm font-bold text-white">{h.event}</div>
                            <div className="text-[10px] text-white/30 uppercase tracking-widest">{h.type}</div>
                         </div>
                         <button 
                            onClick={() => onBook?.(900 + idx, 'event')}
                            className="bg-white/5 p-2 rounded-xl text-white/40 hover:text-gold-400 border border-white/5 hover:border-gold-500/20 transition-all font-bold text-[10px]"
                         >
                            BOOK
                         </button>
                         <ChevronRight size={16} className="text-white/20" />
                       </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Fallback for other status */}
              {activeEvents !== 'Festivals' && activeEvents !== 'Nightlife' && activeEvents !== 'Calendar' && (
                <div className="lg:col-span-3 py-20 text-center text-white/20 font-bold uppercase tracking-[0.3em]">
                   Coming Soon to 2026
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </HubSection>

      {/* 3. Transport */}
      <HubSection 
        id="transport" 
        title={t('transport')} 
        icon={<Car size={24} />}
        lang={lang}
      >
        <div className="space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {transportTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTransport(tab.id)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all group ${activeTransport === tab.id ? 'bg-gold-500 border-gold-400 text-forest-900' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
              >
                <tab.icon size={20} className={activeTransport === tab.id ? '' : 'group-hover:text-gold-400 transition-colors'} />
                <span className="text-[10px] font-black uppercase tracking-tight">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="glass rounded-[3rem] border border-white/10 overflow-hidden">
             <div className="grid lg:grid-cols-2">
               <div className="p-10 lg:p-16 space-y-8">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={activeTransport}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="min-h-[200px]"
                   >
                     {activeTransport === 'Transfers' && (
                       <>
                         <h3 className="text-3xl font-bold text-white mb-4">Airport Transfers</h3>
                         <p className="text-white/60 mb-8 leading-relaxed">Book a reliable, air-conditioned pickup from Kigali International (KGL). Standard and VIP luxury options available.</p>
                         <div className="space-y-3">
                           <div className="flex justify-between p-4 bg-white/5 rounded-xl items-center">
                             <div>
                               <div className="text-white font-bold">Economy Sedan</div>
                               <div className="text-[10px] text-white/30">Up to 3 passengers</div>
                             </div>
                             <div className="flex items-center gap-4">
                               <span className="text-gold-400 font-bold">$20</span>
                               <button 
                                 onClick={() => onBook?.(1001)}
                                 className="px-4 py-2 bg-gold-500 text-forest-900 text-[10px] font-black rounded-lg uppercase hover:bg-gold-400 transition-colors"
                               >
                                 Book
                               </button>
                             </div>
                           </div>
                           <div className="flex justify-between p-4 bg-white/5 rounded-xl items-center">
                             <div>
                               <div className="text-white font-bold">VIP SUV</div>
                               <div className="text-[10px] text-white/30">Luxury 4x4 Land Cruiser</div>
                             </div>
                             <div className="flex items-center gap-4">
                               <span className="text-gold-400 font-bold">$60</span>
                               <button 
                                 onClick={() => onBook?.(1002)}
                                 className="px-4 py-2 bg-gold-500 text-forest-900 text-[10px] font-black rounded-lg uppercase hover:bg-gold-400 transition-colors"
                               >
                                 Book
                               </button>
                             </div>
                           </div>
                         </div>
                       </>
                     )}

                     {activeTransport === 'Rentals' && (
                       <div className="space-y-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-3xl font-bold text-white">Car Rentals</h3>
                            <div className="flex gap-2">
                               <select 
                                 value={carFilter}
                                 onChange={(e) => setCarFilter(e.target.value)}
                                 className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-white focus:outline-none"
                               >
                                 <option value="All">All Types</option>
                                 <option value="Sedan">Sedan</option>
                                 <option value="SUV">4x4 SUV</option>
                                 <option value="Luxury">Luxury</option>
                               </select>
                               <select 
                                 value={carPriceFilter}
                                 onChange={(e) => setCarPriceFilter(e.target.value)}
                                 className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-white focus:outline-none"
                               >
                                 <option value="All">All Prices</option>
                                 <option value="budget">Under $50</option>
                                 <option value="premium">Over $50</option>
                               </select>
                            </div>
                         </div>
                         <div className="grid gap-4">
                            {[
                              { id: 1001, name: 'Toyota RAV4 (Self-Drive)', type: 'SUV', price: 45, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400' },
                              { id: 1009, name: 'Mercedes S-Class (Chauffeur)', type: 'Luxury', price: 150, img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400' }
                            ].filter(c => {
                              const matchType = carFilter === 'All' || c.type === carFilter;
                              const matchPrice = carPriceFilter === 'All' || (carPriceFilter === 'budget' ? c.price < 50 : c.price >= 50);
                              return matchType && matchPrice;
                            }).map(car => (
                              <div key={car.id} className="p-4 bg-white/5 rounded-3xl border border-white/5 flex gap-4 items-center">
                                 <img src={car.img} className="w-24 h-16 object-cover rounded-xl grayscale group-hover:grayscale-0" />
                                 <div className="flex-1">
                                    <div className="text-sm font-bold text-white">{car.name}</div>
                                    <div className="text-[10px] text-gold-500/50 uppercase font-black">{car.type}</div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-gold-400 font-bold">${car.price}/day</div>
                                    <button 
                                      onClick={() => onBook?.(car.id)}
                                      className="text-[9px] font-black text-white hover:text-gold-400 uppercase mt-1 transition-colors"
                                    >
                                      Book Now
                                    </button>
                                 </div>
                              </div>
                            ))}
                         </div>
                       </div>
                     )}

                     {activeTransport === 'Moto' && (
                       <div className="space-y-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-3xl font-bold text-white">Taxi & Moto</h3>
                            <select 
                              value={motoFilter}
                              onChange={(e) => setMotoFilter(e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-white focus:outline-none"
                            >
                               <option value="All">All Services</option>
                               <option value="Private">Private</option>
                               <option value="Shared">Shared</option>
                            </select>
                         </div>
                         <p className="text-white/60 mb-6 text-sm">Efficient urban transport. Choose between a private moto chauffeur or a shared smart taxi.</p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: 1004, name: 'Moto Chauffeur', type: 'Private', price: '$15/day', icon: <Activity size={16} /> },
                              { id: 1006, name: 'Shared Yego Cab', type: 'Shared', price: '$2/trip', icon: <Users size={16} /> }
                            ].filter(m => motoFilter === 'All' || m.type === motoFilter).map(m => (
                              <div key={m.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                                 <div className="flex justify-between items-center">
                                    <div className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-400">
                                       {m.icon}
                                    </div>
                                    <span className="text-[9px] font-black text-gold-500/50 uppercase">{m.type}</span>
                                 </div>
                                 <div>
                                    <div className="text-white font-bold">{m.name}</div>
                                    <div className="text-gold-400 font-bold mt-1">{m.price}</div>
                                 </div>
                                 <button 
                                   onClick={() => onBook?.(m.id)}
                                   className="w-full py-2 bg-white/10 text-[9px] font-bold text-white rounded-xl uppercase hover:bg-white/20 transition-all"
                                 >
                                   Reserve Service
                                 </button>
                              </div>
                            ))}
                         </div>
                       </div>
                     )}

                     {activeTransport === 'Bus' && (
                       <div className="space-y-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-3xl font-bold text-white">Bus Services</h3>
                            <select 
                              value={busRoute}
                              onChange={(e) => setBusRoute(e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-white focus:outline-none"
                            >
                               <option value="All">All Routes</option>
                               <option value="Kigali-Rubavu">Kigali-Rubavu</option>
                               <option value="Kigali-Musanze">Kigali-Musanze</option>
                               <option value="Kigali-Butare">Kigali-Butare</option>
                            </select>
                         </div>
                         <div className="space-y-3">
                            {[
                              { id: 1003, route: 'Kigali-Rubavu', time: '07:00, 09:00, 14:00', price: '$5' },
                              { id: 1007, route: 'Kigali-Musanze', time: 'Every 30 mins', price: '$3' },
                              { id: 1008, route: 'Kigali-Butare', time: '08:00, 10:00, 15:00', price: '$4' }
                            ].filter(b => busRoute === 'All' || b.route === busRoute).map(bus => (
                              <div key={bus.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                                 <div>
                                    <div className="text-white font-bold">{bus.route}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest leading-none mt-1">{bus.time}</div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <span className="text-gold-400 font-bold">{bus.price}</span>
                                    <button 
                                      onClick={() => onBook?.(bus.id)}
                                      className="px-4 py-2 bg-gold-500 text-forest-900 text-[10px] font-black rounded-lg uppercase"
                                    >
                                      Get Ticket
                                    </button>
                                 </div>
                              </div>
                            ))}
                         </div>
                       </div>
                     )}

                     {activeTransport === 'Flights' && (
                       <div className="space-y-6">
                         <h3 className="text-3xl font-bold text-white mb-4">Domestic Flights</h3>
                         <p className="text-white/60 mb-6 text-sm">Experience the "Land of a Thousand Hills" from above. Direct flights between Kigali and regional airports.</p>
                         
                         <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className="text-[10px] font-bold text-white/30 uppercase block mb-2">From</label>
                               <select className="w-full bg-forest-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500/40">
                                 <option>Kigali (KGL)</option>
                                 <option>Kamembe (KME)</option>
                                 <option>Gisenyi (GYI)</option>
                               </select>
                             </div>
                             <div>
                               <label className="text-[10px] font-bold text-white/30 uppercase block mb-2">To</label>
                               <select className="w-full bg-forest-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500/40">
                                 <option>Kamembe (KME)</option>
                                 <option>Kigali (KGL)</option>
                                 <option>Gisenyi (GYI)</option>
                                 <option>Butare (BTQ)</option>
                               </select>
                             </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className="text-[10px] font-bold text-white/30 uppercase block mb-2">Date</label>
                               <input type="date" className="w-full bg-forest-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white ml-0 focus:outline-none focus:border-gold-500/40" />
                             </div>
                             <div>
                               <label className="text-[10px] font-bold text-white/30 uppercase block mb-2">Passengers</label>
                               <select className="w-full bg-forest-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500/40">
                                 <option>1 Passenger</option>
                                 <option>2 Passengers</option>
                                 <option>3+ Passengers</option>
                               </select>
                             </div>
                           </div>
                           <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all text-[10px] uppercase tracking-widest">
                             Search Available Flights
                           </button>
                         </div>

                         <div className="space-y-2 mt-6">
                            <div 
                              onClick={() => onBook?.(1005)}
                              className="p-4 bg-gold-400/5 border border-gold-400/20 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-gold-400/10 transition-all"
                            >
                               <div className="flex items-center gap-4">
                                  <div className="text-center">
                                     <div className="text-white font-bold">08:30</div>
                                     <div className="text-[9px] text-white/30 uppercase">KGL</div>
                                  </div>
                                  <div className="flex flex-col items-center gap-1">
                                     <div className="text-[8px] text-gold-500/50 font-bold">35 MIN</div>
                                     <div className="w-12 h-[1px] bg-white/10 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-gold-500 rounded-full" />
                                     </div>
                                  </div>
                                  <div className="text-center">
                                     <div className="text-white font-bold">09:05</div>
                                     <div className="text-[9px] text-white/30 uppercase">KME</div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="text-gold-400 font-bold">$125</div>
                                  <div className="text-[8px] text-white/30 uppercase font-black">Book Seat</div>
                               </div>
                            </div>
                         </div>
                       </div>
                     )}
                     {(activeTransport !== 'Transfers' && activeTransport !== 'Moto' && activeTransport !== 'Flights' && activeTransport !== 'Rentals' && activeTransport !== 'Bus') && (
                       <div className="py-12 text-center text-white/30 italic">Detailed information for {activeTransport} loading...</div>
                     )}
                   </motion.div>
                 </AnimatePresence>
                 <div className="flex flex-col sm:flex-row gap-4">
                   <button className="flex-1 py-5 bg-gold-500 text-forest-900 font-bold rounded-2xl hover:bg-gold-400 transition-all uppercase tracking-[0.2em] text-xs">
                     Book Your Transport Now
                   </button>
                   <a 
                     href="mailto:transport@explorerwanda.rw"
                     className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2"
                   >
                     <Mail size={16} /> Contact Specialist
                   </a>
                 </div>
               </div>
               <div className="bg-white/5 flex items-center justify-center p-12 lg:p-0">
                  <div className="relative w-full h-full min-h-[300px]">
                    <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" />
                    <div className="absolute inset-0 bg-gold-500/10" />
                  </div>
               </div>
             </div>
          </div>
        </div>
      </HubSection>

      {/* 4. Deals */}
      <HubSection 
        id="deals" 
        title={t('deals')} 
        icon={<Tag size={24} />}
        lang={lang}
      >
        <div className="space-y-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {dealsTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDeals(tab.id)}
                className={`px-8 py-3 rounded-full text-xs font-bold transition-all border ${activeDeals === tab.id ? 'bg-gold-500 text-forest-900 border-gold-400 shadow-xl shadow-gold-500/20' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {activeDeals === 'Hotels' && [
                { title: 'The Kigali Marriott Staycation', desc: 'Complimentary breakfast and spa access for residents and tourists.', discount: '20%', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
                { title: 'Bisate Lodge Eco-Special', desc: 'Book 3 nights, pay for 2. Discover the heart of the Volcanoes.', discount: '33%', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4' }
              ].map((deal, idx) => (
                <motion.div key={idx} layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="group relative rounded-[3rem] overflow-hidden min-h-[350px]">
                  <img src={deal.img} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-forest-950 via-forest-950/40" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="inline-flex px-3 py-1 bg-gold-500 text-forest-900 text-[10px] font-black rounded-lg uppercase w-fit mb-4">{deal.discount} OFF</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{deal.title}</h3>
                    <p className="text-sm text-white/60 mb-6 line-clamp-2">{deal.desc}</p>
                    <button className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-widest text-[10px] group-hover:translate-x-2 transition-transform">
                      Redeem Deal <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {activeDeals !== 'Hotels' && (
                <motion.div layout className="md:col-span-2 py-20 text-center glass rounded-[3rem] border border-white/5">
                  <Tag size={40} className="text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 font-bold uppercase tracking-widest">Exclusive {activeDeals} deals are unlocking soon.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </HubSection>

      {/* 5. Community */}
      <HubSection 
        id="community" 
        title={t('community')} 
        icon={<Users size={24} />}
        lang={lang}
      >
        <div className="grid lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3 space-y-8">
             <div className="flex gap-4 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
               {['Reviews', 'Stories', 'Gallery', 'Forum'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveCommunity(tab)}
                   className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all relative ${activeCommunity === tab ? 'text-gold-500' : 'text-white/30 hover:text-white'}`}
                 >
                   {tab}
                   {activeCommunity === tab && <motion.div layoutId="communityLine" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-gold-500" />}
                 </button>
               ))}
             </div>

             <div className="min-h-[400px]">
                {activeCommunity === 'Reviews' && (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { user: 'Clara M.', text: 'The gorilla trekking was life-changing. Everything organized by the park rangers was seamless.', rating: 5 },
                      { user: 'David K.', text: 'Kigali is the cleanest city I have ever seen. The people are incredibly welcoming.', rating: 5 },
                    ].map((rev, i) => (
                      <div key={rev.user} className="glass p-8 rounded-3xl border border-white/5 space-y-4" id={`review-${i}`}>
                        <div className="flex gap-1">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} className="fill-gold-500 text-gold-500" />)}
                        </div>
                        <p className="text-sm text-white/60 italic leading-relaxed">"{rev.text}"</p>
                        <div className="text-xs font-bold text-white uppercase tracking-widest">{rev.user}</div>
                      </div>
                    ))}
                  </div>
                )}
                {activeCommunity === 'Gallery' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      'https://images.unsplash.com/photo-1542133800-474be6f89073',
                      'https://images.unsplash.com/photo-1484186139897-d5fc6b908812',
                      'https://images.unsplash.com/photo-1514525253361-bee8d40d9b4b',
                      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
                      'https://images.unsplash.com/photo-1519046904884-53103b34b206',
                      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'
                    ].map((img, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden aspect-square group relative cursor-pointer">
                        <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera size={24} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeCommunity !== 'Reviews' && activeCommunity !== 'Gallery' && (
                  <div className="flex flex-col items-center justify-center py-20 text-white/20">
                     <MessageSquareText size={48} className="mb-4 opacity-10" />
                     <p className="font-bold uppercase tracking-widest text-xs">Community {activeCommunity} module is scaling...</p>
                  </div>
                )}
             </div>
           </div>

           <div className="space-y-6">
             <div className="glass p-6 rounded-3xl border border-white/5">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Trending Discussions</h4>
                <div className="space-y-4">
                   {['Best coffee in Kigali?', 'Solo trekking tips', 'Lake Kivu weekend', 'EV Charging spots'].map(topic => (
                     <div key={topic} className="group cursor-pointer">
                        <div className="text-[11px] text-white/50 group-hover:text-gold-400 transition-colors mb-1">{topic}</div>
                        <div className="flex items-center gap-2 text-[9px] text-white/20 uppercase font-black">
                           <MessageSquare size={10} /> 12 replies • <ThumbsUp size={10} /> 45
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest transition-all">
               Start a Discussion
             </button>
           </div>
        </div>
      </HubSection>

      {/* 6. Support */}
      <HubSection 
        id="contact" 
        title={t('contact_support')} 
        icon={<Phone size={24} />}
        lang={lang}
      >
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {['Emergency', 'Tourist Center', 'Chat Support', 'Feedback', 'Report Issue'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSupport(tab)}
                className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${activeSupport === tab ? 'bg-forest-900 border-gold-500/50 text-white' : 'bg-white/5 border-white/5 text-white/30 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeSupport}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.02 }}
                 className="glass p-8 lg:p-12 rounded-[3rem] border border-white/10 min-h-[500px]"
               >
                 {activeSupport === 'Emergency' && (
                   <div className="space-y-8">
                     <div className="flex items-center gap-4 text-red-500 mb-8">
                        <AlertTriangle size={32} />
                        <h3 className="text-2xl font-bold uppercase tracking-tight">24/7 Helpline</h3>
                     </div>
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl text-center">
                           <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Emergency Police</div>
                           <div className="text-4xl font-display font-black text-white">112</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                           <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Ambulance Service</div>
                           <div className="text-4xl font-display font-black text-white">912</div>
                        </div>
                     </div>
                     <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 p-8 rounded-3xl space-y-4">
                           <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Traveler Assistance Line</h4>
                           <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-white">+250 788 123 456</span>
                              <button className="p-3 bg-gold-500 text-forest-900 rounded-xl"><Phone size={20} /></button>
                           </div>
                        </div>
                        <div className="bg-white/5 p-8 rounded-3xl space-y-4">
                           <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Transport Logistics Email</h4>
                           <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">transport@explorerwanda.rw</span>
                              <div className="p-3 bg-gold-500/10 text-gold-400 rounded-xl"><Mail size={20} /></div>
                           </div>
                        </div>
                     </div>
                   </div>
                 )}
                 {activeSupport === 'Chat Support' && (
                   <div className="flex flex-col h-[400px] bg-forest-900/50 rounded-3xl overflow-hidden border border-white/5">
                      <div className="p-6 border-b border-white/5 flex items-center gap-3">
                         <div className="w-2 h-2 bg-green-500 rounded-full" />
                         <span className="text-xs font-bold text-white uppercase tracking-widest">Live Concierge</span>
                      </div>
                      <div className="flex-1 p-6 space-y-4 bg-forest-950/20 overflow-y-auto">
                         <div className="max-w-[80%] bg-white/5 p-4 rounded-2xl rounded-tl-none">
                            <p className="text-xs text-white/70 tracking-wide">Hello! How can we assist you with your Rwanda adventure today?</p>
                         </div>
                      </div>
                      <div className="p-4 bg-white/5 flex gap-2">
                         <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-white" />
                         <button className="p-2 text-gold-500 hover:text-gold-400 transition-colors"><Send size={18} /></button>
                      </div>
                   </div>
                 )}
                 {activeSupport === 'Tourist Center' && (
                   <div className="space-y-8">
                     <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Visit Us In Person</h3>
                     <div className="grid sm:grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <div className="flex gap-4">
                            <MapPin className="text-gold-500 flex-shrink-0" />
                            <div>
                               <div className="font-bold text-white mb-1">Kigali City Center</div>
                               <p className="text-xs text-white/40 leading-relaxed text-balance">KN 2 St, Kigali. Near the City Hall. Daily 8 AM - 6 PM.</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <MapPin className="text-gold-500 flex-shrink-0" />
                            <div>
                               <div className="font-bold text-white mb-1">Musanze Visitor Hub</div>
                               <p className="text-xs text-white/40 leading-relaxed text-balance">Main Road to Kinigi. Open Weekends 7 AM - 5 PM.</p>
                            </div>
                         </div>
                       </div>
                       <div className="rounded-3xl overflow-hidden grayscale brightness-50 border border-white/5 aspect-square sm:aspect-auto h-full min-h-[200px]">
                          <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206" className="w-full h-full object-cover" />
                       </div>
                     </div>
                   </div>
                 )}
                 {(activeSupport !== 'Emergency' && activeSupport !== 'Chat Support' && activeSupport !== 'Tourist Center') && (
                   <div className="h-full flex flex-col justify-center items-center">
                      <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">{activeSupport}</h3>
                      <form className="w-full max-w-xl space-y-4" onSubmit={e => e.preventDefault()}>
                         <input type="email" placeholder="Your Email Address" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-gold-500/40" required />
                         <input type="text" placeholder="Subject" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-gold-500/40" />
                         <textarea placeholder={`Please describe the ${activeSupport.toLowerCase()}...`} className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-xs text-white focus:outline-none focus:border-gold-500/40 h-40 resize-none" />
                         <button className="w-full py-5 bg-gold-500 text-forest-900 font-bold rounded-2xl text-xs uppercase tracking-[0.2em]">Submit Request</button>
                      </form>
                   </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </HubSection>
    </div>
  );
}
