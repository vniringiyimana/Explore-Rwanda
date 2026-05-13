import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, User as UserIcon, Briefcase, MapPin, Star, CheckCircle, Mail, ExternalLink, ShieldCheck, CreditCard, Smartphone, Clock, ChevronRight, Zap, Coffee, Plane } from 'lucide-react';
import { User, UserRole } from '../types';
import { DESTINATIONS, HOTELS, EXPERIENCES, TRANSPORT_OPTIONS, EVENTS, UI_TRANSLATIONS } from '../constants';

interface BookingDetails {
  email: string;
  date: string;
  time?: string;
  partySize: string;
  bookingId: string;
  paymentMethod: string;
  seat?: string;
  notes?: string;
  insurance?: {
    selected: boolean;
    type: string;
    price: number;
  };
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'auth' | 'booking' | null;
  bookingData?: {
    category: 'destination' | 'hotel' | 'experience' | 'transport' | 'event';
    id: number;
  } | null;
  onConfirm: (user: User, msg: string) => void;
  onCreateBooking: (booking: any) => void;
  lang: string;
}

export default function Modals({ isOpen, onClose, type, bookingData, onConfirm, onCreateBooking, lang }: ModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const [roleSelection, setRoleSelection] = useState<UserRole>(UserRole.TOURIST);

  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = (formData.get('name') as string) || email.split('@')[0];

    // Security check: Only vedasteniringiyimana2005@gmail.com can be an admin
    let finalRole = roleSelection;
    if (roleSelection === UserRole.ADMIN && email.toLowerCase() !== 'vedasteniringiyimana2005@gmail.com') {
      finalRole = UserRole.TOURIST;
      alert("Admin access restricted. You've been signed in as a Standard Explorer.");
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: finalRole
    };

    onConfirm(user, authMode === 'login' ? `Welcome back, ${name}! 🎉` : `Account created! Welcome to Rwanda, ${name}! 🇷🇼`);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPaymentStep('idle');
      setDetails(null);
      setEmailStatus('idle');
      setShowReceipt(false);
      setPaymentMethod('card');
      setSelectedSeat(null);
    }, 300);
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>, data: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const partySize = formData.get('partySize') as string;
    const notes = formData.get('notes') as string;
    const momoNumber = formData.get('momoNumber') as string;
    const insuranceSelected = formData.get('insurance') === 'on';
    const bookingId = 'RW-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const parsePrice = (priceStr: string | number | undefined) => {
      if (typeof priceStr === 'number') return priceStr;
      if (!priceStr || priceStr === 'Free' || priceStr === 'Varies') return 0;
      return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    };

    const guestCount = partySize === 'Solo' ? 1 : partySize === '2 People' ? 2 : 4;
    const insurancePrice = insuranceSelected ? guestCount * 10 : 0;

    const insurance = {
      selected: insuranceSelected,
      type: 'Premium Coverage',
      price: insurancePrice
    };

    const newBooking = {
      id: bookingId,
      itemId: data.id,
      itemType: bookingData?.category,
      itemName: data.name,
      itemEmoji: data.emoji,
      email,
      price: parsePrice(data.price),
      insurance,
      date,
      time,
      partySize,
      seat: selectedSeat || undefined,
      notes,
      paymentMethod,
      momoNumber,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString()
    };

    setDetails({ 
      email, 
      date, 
      time,
      partySize, 
      seat: selectedSeat || undefined,
      bookingId, 
      notes, 
      insurance,
      paymentMethod: paymentMethod === 'card' ? 'Visa/Mastercard' : `Mobile Money (${momoNumber})`
    });

    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      onCreateBooking(newBooking);
      setPaymentStep('confirmed');
      
      // Simulate email/SMS sending
      setEmailStatus('sending');
      setTimeout(() => setEmailStatus('sent'), 1500);
    }, 2500);
  };

  const renderAuth = () => (
    <div className="glass rounded-[2.5rem] p-8 w-full max-w-sm mx-auto border border-white/10 shadow-2xl relative">
      <button onClick={handleClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40"><X size={20}/></button>
      <h3 className="font-display text-2xl font-bold mb-2">Welcome Back</h3>
      <p className="text-sm text-white/40 mb-8 font-medium italic">"Every journey starts with a signature."</p>
      
      <div className="flex gap-1 mb-8 bg-white/5 rounded-2xl p-1.5 border border-white/5">
        <button 
          onClick={() => setAuthMode('login')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${authMode === 'login' ? 'bg-gold-500 text-forest-900 shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          SIGN IN
        </button>
        <button 
          onClick={() => setAuthMode('register')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${authMode === 'register' ? 'bg-gold-500 text-forest-900 shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          REGISTER
        </button>
      </div>

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {authMode === 'register' && (
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
            <input name="name" type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50" />
          </div>
        )}
        <div>
          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Email</label>
          <input name="email" type="email" required placeholder="explorer@world.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Identity Access</label>
          <select 
            value={roleSelection}
            onChange={(e) => setRoleSelection(e.target.value as UserRole)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-gold-400/50 appearance-none font-bold"
          >
            <option value={UserRole.TOURIST} className="bg-forest-900">Standard Explorer</option>
            <option value={UserRole.ADMIN} className="bg-forest-900">Platform Administrator</option>
            <option value={UserRole.OPERATOR} className="bg-forest-900">Business Partner</option>
            <option value={UserRole.EDITOR} className="bg-forest-900">Content Editor</option>
            <option value={UserRole.MODERATOR} className="bg-forest-900">Community Moderator</option>
          </select>
        </div>
        {roleSelection === UserRole.ADMIN && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1 italic">Administrative Key</label>
              <input name="token" type="password" required placeholder="RW-AD-XXXX" className="w-full bg-white/5 border border-gold-500/20 rounded-xl px-5 py-3.5 text-sm text-gold-400 placeholder-white/10 focus:outline-none focus:border-gold-500" />
              <p className="text-[9px] text-white/20 mt-2 px-1">Requires approval from @vedasteniringiyimana2005</p>
            </div>
          </motion.div>
        )}
        <button type="submit" className="w-full py-4 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-gold-500/20 transition-all text-sm active:scale-95 mt-4">
          CONTINUE TO RWANDA
        </button>
      </form>
    </div>
  );

  const renderBooking = () => {
    if (!bookingData) return null;
    let data: any = null;
    if (bookingData.category === 'hotel') data = HOTELS.find(h => h.id === bookingData.id);
    if (bookingData.category === 'experience') data = EXPERIENCES.find(e => e.id === bookingData.id);
    if (bookingData.category === 'destination') data = DESTINATIONS.find(d => d.id === bookingData.id);
    if (bookingData.category === 'transport') data = TRANSPORT_OPTIONS.find(t => t.id === bookingData.id);
    if (bookingData.category === 'event') data = EVENTS.find(ev => ev.id === bookingData.id);

    if (!data) return null;

    return (
      <div className="glass rounded-[3rem] p-8 w-full max-w-md mx-auto border border-white/15 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={handleClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-2xl transition-colors text-white/40 z-20"><X size={20}/></button>
        
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6 filter drop-shadow-2xl animate-float">{data.emoji}</div>
          <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-gold-300 transition-colors uppercase tracking-tight">
            {data.name}
          </h3>
          <div className="flex items-center justify-center gap-2 text-xs text-white/40 mb-2 font-bold uppercase tracking-widest leading-none">
            <MapPin size={14} className="text-gold-500" />
            {data.location}
          </div>
          {bookingData.category === 'event' && data.date && (
            <div className="text-[10px] font-black text-gold-500/50 uppercase tracking-[0.2em] mb-6">
              Scheduled: {data.date}
            </div>
          )}

          <form onSubmit={(e) => handleBookingSubmit(e, data)} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Traveler Email</label>
              <div className="relative border-b border-white/5 pb-4">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input name="email" type="email" required placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Journey Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input name="date" type="date" required className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">
                  {(bookingData.category === 'transport' || bookingData.category === 'event') ? 'Passengers' : 'Party Size'}
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <select name="partySize" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50 appearance-none font-bold">
                    <option className="bg-forest-900">1 Person</option>
                    <option className="bg-forest-900">2 People</option>
                    <option className="bg-forest-900">3 People</option>
                    <option className="bg-forest-900">Family (4+)</option>
                  </select>
                </div>
              </div>
            </div>

            {(bookingData.category === 'transport' || bookingData.category === 'event') && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Preferred Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    name="time" 
                    type="time" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50" 
                  />
                </div>
              </motion.div>
            )}

            {bookingData.category === 'transport' && data.name.includes('Flight') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 ml-1">Select Your Seat</label>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-4 bg-white/10 rounded-t-full border-t border-x border-white/20 flex items-center justify-center text-[10px] font-bold text-white/20 tracking-widest uppercase">Cockpit</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 px-4">
                    {['A', 'B', 'C', 'D'].map((row, rIdx) => (
                      <React.Fragment key={row}>
                        {[1, 2, 3, 4, 5].map((num) => {
                          const seatId = `${row}${num}`;
                          const isSelected = selectedSeat === seatId;
                          const isTaken = ['A2', 'C4', 'B1'].includes(seatId); // Mock taken seats
                          
                          return (
                            <button
                              key={seatId}
                              type="button"
                              disabled={isTaken}
                              onClick={() => setSelectedSeat(isSelected ? null : seatId)}
                              className={`
                                aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all
                                ${isTaken ? 'bg-white/5 text-white/10 cursor-not-allowed' : 
                                  isSelected ? 'bg-gold-500 text-forest-900 shadow-lg scale-110' : 
                                  'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white border border-white/5'}
                              `}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-white/10 border border-white/5" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-gold-500" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-white/5" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Taken</span>
                    </div>
                  </div>
                </div>
                {selectedSeat && (
                  <div className="mt-4 p-4 bg-gold-500/10 border border-gold-500/20 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-gold-400">Selected Seat:</span>
                    <span className="text-xl font-display font-black text-white tracking-widest">{selectedSeat}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Payment Selection */}
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-white/5 border-white/10 text-white/40'}`}
                >
                  <CreditCard size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'momo' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-white/5 border-white/10 text-white/40'}`}
                >
                  <Smartphone size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">MoMo</span>
                </button>
              </div>
              
              {paymentMethod === 'momo' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                   <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">MTN / Airtel Number</label>
                   <input 
                     name="momoNumber" 
                     type="tel" 
                     placeholder="078 XXX XXXX" 
                     required 
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50" 
                   />
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Special Requests (Optional)</label>
              <textarea 
                name="notes"
                placeholder="Dietary requirements, pickup address, or special occasions..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50 resize-none h-20"
              />
            </div>

            <button type="submit" className="w-full py-5 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-gold-500/30 transition-all text-sm active:scale-95 uppercase tracking-widest">
              Confirm & Pay {data.price !== 'Free' && data.price}
            </button>
            <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.25em] pt-2">Secure 256-bit Encrypted Transaction</p>
          </form>
        </div>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="glass rounded-[3rem] p-12 w-full max-w-sm mx-auto border border-white/10 shadow-2xl text-center">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-gold-500/20 border-t-gold-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {paymentMethod === 'momo' ? <Smartphone className="text-gold-500 animate-pulse" size={32} /> : <CreditCard className="text-gold-500 animate-pulse" size={32} />}
        </div>
      </div>
      <h3 className="font-display text-2xl font-bold mb-4 text-white">
        {paymentMethod === 'momo' ? 'Checking Phone...' : 'Authorizing Card...'}
      </h3>
      <p className="text-sm text-white/40 mb-8 font-medium italic">
        {paymentMethod === 'momo' ? '"Please confirm the push notification on your device."' : '"Securing your spot in the heart of Africa."'}
      </p>
      <div className="flex flex-col gap-2">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full w-full bg-linear-to-r from-gold-500 to-gold-400"
          />
        </div>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.25em]">Secure Gateway</span>
      </div>
    </div>
  );

  const renderConfirmation = () => {
    if (!bookingData || !details) return null;
    let data: any = null;
    if (bookingData.category === 'hotel') data = HOTELS.find(h => h.id === bookingData.id);
    if (bookingData.category === 'experience') data = EXPERIENCES.find(e => e.id === bookingData.id);
    if (bookingData.category === 'destination') data = DESTINATIONS.find(d => d.id === bookingData.id);
    if (bookingData.category === 'transport') data = TRANSPORT_OPTIONS.find(t => t.id === bookingData.id);
    if (bookingData.category === 'event') data = EVENTS.find(ev => ev.id === bookingData.id);

    return (
      <div className="glass rounded-[3rem] p-10 w-full max-w-md mx-auto border border-gold-500/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden text-center max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-gold-400 to-gold-600" />
        
        <AnimatePresence mode="wait">
          {!showReceipt ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Visual Journey Roadmap */}
              <div className="relative mb-12 px-2">
                <div className="absolute top-4 left-0 w-full h-[2px] bg-white/5" />
                <div className="flex justify-between items-center relative gap-4">
                  {[
                    { label: 'Selection', icon: Calendar, complete: true },
                    { label: 'Payment', icon: CreditCard, complete: true },
                    { label: 'Inscribed', icon: CheckCircle, active: true },
                  ].map((step, idx, arr) => (
                    <div key={idx} className="flex flex-col items-center gap-3 relative z-10">
                      <motion.div 
                        initial={step.active ? { scale: 0.8 } : false}
                        animate={step.active ? { scale: 1, boxShadow: ["0 0 20px rgba(251,191,36,0)", "0 0 20px rgba(251,191,36,0.5)", "0 0 20px rgba(251,191,36,0)"] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border ${
                          step.active 
                            ? 'bg-gold-500 text-forest-900 border-gold-400 rotate-12' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        <step.icon size={18} />
                      </motion.div>
                      <div className="text-center">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] block ${step.active ? 'text-gold-400' : 'text-white/20'}`}>
                          {step.label}
                        </span>
                        {step.active && (
                          <motion.span 
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-[8px] text-gold-500/50 font-bold uppercase tracking-tight"
                          >
                            Live Now
                          </motion.span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="relative inline-block mb-8"
              >
                <div className="w-24 h-24 bg-gold-400/10 rounded-full flex items-center justify-center border-2 border-dashed border-gold-500/20 p-2">
                  <div className="w-full h-full bg-linear-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-2xl shadow-gold-500/40">
                    <CheckCircle className="text-forest-900" size={40} />
                  </div>
                </div>
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-2xl"
                >
                  <Zap size={16} className="text-gold-400" />
                </motion.div>
              </motion.div>

              <h3 className="font-display text-4xl font-black mb-2 text-white">Journey <span className="gold-gradient-text">Secured</span></h3>
              <p className="text-[11px] text-white/30 mb-10 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
                "Your reservation is now live in our system. Welcome to the exploration."
              </p>

              <div className="bg-white/[0.03] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl mb-10 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <ShieldCheck size={80} />
                </div>
                
                <div className="flex flex-col items-center mb-8 relative">
                  <span className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mb-3">Manifest Signature</span>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-white/10" />
                    <span className="text-4xl font-display font-black text-white tracking-[0.2em] drop-shadow-lg">{details.bookingId}</span>
                    <div className="h-px w-8 bg-white/10" />
                  </div>
                </div>
                
                <div className="space-y-4 text-left relative">
                  {[
                    { label: 'Service', value: data.name, icon: MapPin },
                    { label: 'Timing', value: `${details.date} ${details.time ? `at ${details.time}` : ''}`, icon: Clock },
                    { label: 'Seat / Slot', value: details.seat || 'General Access', icon: UserIcon, color: details.seat ? 'text-gold-400' : 'text-white/60' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                       <div className="flex items-center gap-2 text-white/30">
                         <row.icon size={14} />
                         <span className="text-[9px] font-black uppercase tracking-widest">{row.label}</span>
                       </div>
                       <span className={`text-[11px] font-bold ${row.color || 'text-white'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clearer Next Steps Roadmap */}
              <div className="text-left mb-10">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/5" />
                  Mandatory Next Steps
                  <div className="h-px flex-1 bg-white/5" />
                </h4>
                <div className="grid gap-3">
                  {[
                    { 
                      icon: Mail, 
                      title: "Secure Your Ticket", 
                      desc: "Open the PDF sent to your registered email.", 
                      action: "Check Inbox",
                      color: "text-blue-400" 
                    },
                    { 
                      icon: Plane, 
                      title: "Protocol Check", 
                      desc: `Arrive 45 mins before slot at ${data.location}.`, 
                      action: "View Map",
                      color: "text-gold-400" 
                    },
                    { 
                      icon: ShieldCheck, 
                      title: "Identification", 
                      desc: "Show your Booking ID & Photo ID on arrival.", 
                      action: "Ready",
                      color: "text-emerald-400" 
                    }
                  ].map((step, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex gap-4 p-4 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-default"
                    >
                      <div className={`p-3 rounded-2xl bg-white/5 ${step.color} shrink-0`}>
                        <step.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-white mb-0.5">{step.title}</p>
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">{step.action}</span>
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed italic">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                {emailStatus === 'sending' ? (
                  <div className="flex items-center justify-center gap-2 text-white/40 text-xs font-bold animate-pulse">
                    <Mail size={14} />
                    TRANSMITTING TICKET...
                  </div>
                ) : emailStatus === 'sent' ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-bold bg-green-400/5 py-3 rounded-2xl border border-green-400/20">
                      <ShieldCheck size={16} />
                      TICKET DELIVERED
                    </div>
                    <button 
                      onClick={() => setShowReceipt(true)}
                      className="text-[10px] text-gold-400 font-bold uppercase tracking-widest hover:text-gold-300 flex items-center justify-center gap-2"
                    >
                      Inspect Transaction Record <ChevronRight size={12} />
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href="#my-bookings" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                    document.querySelector('#my-bookings')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold rounded-2xl transition-all text-sm active:scale-95 uppercase tracking-widest shadow-xl text-center"
                >
                  Manage My Journey
                </a>
                <button 
                  onClick={handleClose}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all text-sm active:scale-95 uppercase tracking-widest border border-white/10"
                >
                  Return to Exploration
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-left"
            >
              {/* Receipt Content ... (kept existing for brevity but updated with paymentMethod) */}
              <div className="bg-white rounded-2xl p-8 text-forest-950 shadow-2xl relative">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="font-display font-bold text-xl mb-1">Explore Rwanda</h4>
                    <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Official Transaction Record</p>
                  </div>
                  <div className="p-2 bg-gold-100 rounded-lg text-gold-700">
                    <CheckCircle size={20} />
                  </div>
                </div>

                <div className="space-y-4 mb-8 text-sm leading-relaxed">
                  <p>Confirmed Booking for: <strong>{data.name}</strong></p>
                  
                  <div className="space-y-2 py-4 border-y border-forest-100">
                    <div className="flex justify-between"><span className="text-forest-400 text-xs">Guest:</span> <span className="font-bold">{details.email}</span></div>
                    <div className="flex justify-between"><span className="text-forest-400 text-xs">Payment Method:</span> <span className="font-bold text-[10px]">{details.paymentMethod}</span></div>
                    <div className="flex justify-between"><span className="text-forest-400 text-xs">Booking ID:</span> <span className="font-bold">{details.bookingId}</span></div>
                    <div className="flex justify-between"><span className="text-forest-400 text-xs">Service Date:</span> <span className="font-bold">{details.date}</span></div>
                    {details.time && <div className="flex justify-between"><span className="text-forest-400 text-xs">Time:</span> <span className="font-bold">{details.time}</span></div>}
                    {details.seat && <div className="flex justify-between"><span className="text-forest-400 text-xs">Assigned Seat:</span> <span className="font-bold text-gold-600 tracking-widest">{details.seat}</span></div>}
                    {details.notes && (
                      <div className="pt-2 border-t border-forest-50 mt-2">
                        <span className="text-forest-400 text-[10px] uppercase font-bold tracking-widest block mb-1">Special Requests</span>
                        <p className="text-[11px] text-forest-700 italic">"{details.notes}"</p>
                      </div>
                    )}
                  </div>

                  <p className="font-bold text-xs">Next Steps:</p>
                  <ul className="text-[11px] space-y-1 list-disc pl-4 text-forest-600">
                    <li>Check your inbox for the detailed itinerary</li>
                    <li>Show your mobile ticket (Booking ID) upon arrival</li>
                    <li>Flexible cancellation available up to 24h prior</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setShowReceipt(false)}
                    className="w-full py-4 bg-forest-900 text-white font-bold rounded-2xl transition-all text-xs active:scale-95 uppercase tracking-widest"
                  >
                    Back to Confirmation
                  </button>
                  <a 
                    href="#my-bookings"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClose();
                      document.querySelector('#my-bookings')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 text-center text-[10px] font-bold text-forest-500 uppercase tracking-widest hover:text-forest-900 transition-colors"
                  >
                    View All My Bookings
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderContent = () => {
    if (type === 'auth') return renderAuth();
    if (paymentStep === 'processing') return renderProcessing();
    if (paymentStep === 'confirmed') return renderConfirmation();
    return renderBooking();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 w-full"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
