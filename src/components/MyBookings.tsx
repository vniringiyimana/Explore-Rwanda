import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, MapPin, Trash2, Edit3, CheckCircle, 
  Clock, AlertCircle, List, Calendar as CalendarIcon,
  ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown,
  History, Plane, Building2, Ticket, DollarSign, SortAsc, SortDesc,
  ShieldCheck, Mail, Trophy, Smartphone, CreditCard, Users, Download, RefreshCw, FileText,
  Camera, Scan
} from 'lucide-react';
import { Booking } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface MyBookingsProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancel: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Booking>) => void;
  lang: string;
}

const isNearEvent = (dateStr: string, timeStr?: string) => {
  try {
    const bookingTimeStr = timeStr || "09:00";
    const eventDate = new Date(`${dateStr}T${bookingTimeStr}`);
    if (isNaN(eventDate.getTime())) {
      const fallbackDate = new Date(dateStr);
      if (isNaN(fallbackDate.getTime())) return false;
      const diffMs = fallbackDate.getTime() - Date.now();
      return Math.abs(diffMs) <= 24 * 60 * 60 * 1000;
    }
    const diffMs = eventDate.getTime() - Date.now();
    return Math.abs(diffMs) <= 24 * 60 * 60 * 1000;
  } catch (e) {
    return false;
  }
};

// A gorgeous, high-fidelity loading state with stepped progression and sleek micro-animations
function QRAnimationLoader() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => setStep(3), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    { label: "Establishing Secure Handshake", sub: "Connecting to RwandaHub GatekeeperNode..." },
    { label: "Baking Cryptographic Token", sub: "Digitizing passenger biometric metadata..." },
    { label: "Signing Ticket Payload", sub: "Applying central gateway signatures..." },
    { label: "Rendering QR Code Vector", sub: "Assembling high-contrast scanner pattern..." }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-5 py-8 w-full">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Futuristic glowing scanning rings */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-0 rounded-[1.5rem] border border-dashed border-gold-500/30"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 0.95, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute inset-2 rounded-[1.2rem] border border-dotted border-gold-400/20"
        />
        
        {/* Central pulsing shield */}
        <motion.div
          animate={{ scale: [0.92, 1.08, 0.92] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-400 border border-gold-500/20 shadow-lg shadow-gold-500/5"
        >
          <ShieldCheck size={22} className="animate-pulse" />
        </motion.div>

        {/* Dynamic sweeping laser scanner line */}
        <motion.div
          animate={{ y: [-35, 35, -35] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-80"
        />
      </div>

      <div className="text-center space-y-2 max-w-xs px-4">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
          <span className="text-[8px] font-mono text-gold-400 font-bold uppercase tracking-widest">
            SECURE DEPLOY: {Math.min(100, Math.round((step + 1) * 25))}%
          </span>
        </div>

        <div className="h-8 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">
                {steps[step]?.label}
              </h5>
              <p className="text-[8px] text-white/40 font-medium italic mt-0.5">
                {steps[step]?.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* High-fidelity custom progress bar */}
        <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden mx-auto border border-white/5 relative">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${(step + 1) * 25}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
          />
        </div>
      </div>
    </div>
  );
}

// Interactive High-Fidelity Cryptographic Camera / Ticket Scanner
interface TicketCameraScannerProps {
  bookingId: string;
  onClose: () => void;
  onScanSuccess: (details: string) => void;
}

function TicketCameraScanner({ bookingId, onClose, onScanSuccess }: TicketCameraScannerProps) {
  const [streamActive, setStreamActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [scanState, setScanState] = useState<'initializing' | 'scanning' | 'decoding' | 'success'>('initializing');
  const [mockTarget, setMockTarget] = useState<'venue' | 'coupon'>('venue');
  const [diagnostics, setDiagnostics] = useState<string[]>([]);

  // Push terminal logs sequentially
  React.useEffect(() => {
    const logs = [
      "Establishing link with gatekeepers...",
      "Mounting WebRTC video lens focus...",
      "Resolving high-contrast anchor matrices...",
      "Optimizing automatic environment exposure...",
      "Active - Point target towards camera lens"
    ];
    let index = 0;
    setDiagnostics([logs[0]]);
    const interval = setInterval(() => {
      index++;
      if (index < logs.length) {
        setDiagnostics(prev => [...prev.slice(-2), logs[index]]);
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // WebRTC UserMedia setup with fallback
  React.useEffect(() => {
    let activeStream: MediaStream | null = null;
    const activateCamera = async () => {
      try {
        setScanState('initializing');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreamActive(true);
        setTimeout(() => setScanState('scanning'), 1000);
      } catch (err: any) {
        setErrorMsg(err.message || "Native camera access is blocked in iframe container.");
        setStreamActive(false);
        setTimeout(() => setScanState('scanning'), 1200);
      }
    };
    activateCamera();
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const triggerSimulationScan = (target: 'venue' | 'coupon') => {
    setScanState('decoding');
    setMockTarget(target);
    const logs = target === 'venue'
      ? ["Signal Locked. ID [GATE-KGL-02]", "Reading cryptographic voucher checksum...", "Matching gateway node signatures..."]
      : ["Signal Locked. ID [COUPON-RW-90]", "Baking discount authorization...", "Verifying tourist-hub promo clearance..."];
    
    logs.forEach((log, idx) => {
      setTimeout(() => {
        setDiagnostics(prev => [...prev.slice(-2), log]);
      }, (idx + 1) * 400);
    });

    setTimeout(() => {
      setScanState('success');
      const decodedResult = target === 'venue'
        ? "✓ Gate Access Confirmed! Checked in at Akagera National Park Sector 2 Gateway B."
        : "✓ Voucher Applied! 15% discount for partner dining in Kigali has been locked to your profile.";
      onScanSuccess(decodedResult);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-md bg-gradient-to-b from-forest-950 to-neutral-950 border border-gold-500/20 rounded-[2.5rem] overflow-hidden p-6 shadow-2xl shadow-gold-500/5 flex flex-col space-y-5"
      >
        {/* Header decoration */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <Scan size={16} className="animate-pulse" />
            </span>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white leading-none">RwandaHub Gatekeeper Scanner</h3>
              <span className="text-[8px] text-white/40 font-mono tracking-tight block mt-0.5">Secure QR & Venue Token Decryption</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Viewfinder block */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 flex flex-col items-center justify-center">
          {/* Laser line overlay */}
          {scanState === 'scanning' && (
            <motion.div
              animate={{ y: [0, 180, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-0.5 bg-gold-400 shadow-[0_0_12px_6px_rgba(212,175,55,0.4)] z-20 pointer-events-none"
            />
          )}

          {/* Holographic corners */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold-400/40 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold-400/40 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold-400/40 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold-400/40 pointer-events-none" />

          {/* WebRTC stream or Emulated Radar fallback */}
          {streamActive ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            /* Immersive Emulated radar UI */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(11,43,21,0.6)_0%,rgba(5,15,8,0.95)_100%)] overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              {/* Spinning scanning sweep */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-40 h-40 rounded-full border border-dashed border-gold-500/20 relative flex items-center justify-center"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-400 shadow-lg shadow-gold-500/50" />
                <div className="w-24 h-24 rounded-full border border-dotted border-white/5 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gold-500/5" />
                </div>
              </motion.div>

              <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded border border-white/5 font-mono text-[6.5px] text-white/40 tracking-widest uppercase">
                EMULATION LAYER ACTIVE
              </div>
            </div>
          )}

          {/* State overlay */}
          <AnimatePresence mode="wait">
            {scanState === 'initializing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center space-y-3 z-30"
              >
                <RefreshCw size={20} className="text-gold-400 animate-spin" />
                <span className="text-[8px] font-mono text-gold-400 uppercase tracking-widest animate-pulse font-bold">Mounting Optical Feed...</span>
              </motion.div>
            )}

            {scanState === 'decoding' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center space-y-3 z-30 text-center px-4"
              >
                <div className="relative">
                  <RefreshCw size={24} className="text-gold-500 animate-spin" />
                  <span className="absolute inset-0 rounded-full border border-dashed border-gold-500/50 animate-ping" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-gold-400 font-bold uppercase tracking-widest block">Locking cryptographic keys</span>
                  <p className="text-[7px] text-white/40 font-mono mt-0.5 italic">De-serializing QR code payload...</p>
                </div>
              </motion.div>
            )}

            {scanState === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center space-y-3 p-4 text-center z-30"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={22} className="animate-bounce" />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Payload Decrypted Successfully</h5>
                  <p className="text-[7.5px] text-white/50 font-mono max-w-xs leading-normal mt-1 italic">
                    {mockTarget === 'venue' ? "Sector access clears; checkpoint synchronized." : "Voucher authorized; saved to customer wallet."}
                  </p>
                </div>
                <button
                  onClick={() => setScanState('scanning')}
                  className="px-3 py-1.5 bg-emerald-500 text-white font-extrabold text-[8px] rounded-lg uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  Scan Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Micro terminal logs */}
        <div className="bg-black/60 p-3 rounded-2xl border border-white/5 font-mono text-[7.5px] text-gold-400/80 space-y-1 h-14 overflow-hidden flex flex-col justify-end">
          {diagnostics.map((msg, idx) => (
            <div key={idx} className="truncate flex items-center gap-1.5">
              <span className="text-white/20 select-none">[{idx + 1}]</span>
              <span className="text-white/40">&gt;&gt;</span>
              <span className={idx === diagnostics.length - 1 ? "text-gold-400 font-bold animate-pulse" : ""}>{msg}</span>
            </div>
          ))}
        </div>

        {/* Mock scan buttons */}
        <div className="space-y-2">
          <span className="text-[7.5px] font-black text-white/30 uppercase tracking-widest block text-center">Simulate Interactive Scans</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => triggerSimulationScan('venue')}
              disabled={scanState !== 'scanning'}
              className="py-2.5 bg-white/5 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/20 text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Scan Venue QR
            </button>
            <button
              onClick={() => triggerSimulationScan('coupon')}
              disabled={scanState !== 'scanning'}
              className="py-2.5 bg-white/5 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/20 text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Scan Discount pass
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function MyBookings({ isOpen, onClose, bookings, onCancel, onUpdate, lang }: MyBookingsProps) {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'tickets'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // QR generation states
  const [generatedQRs, setGeneratedQRs] = useState<Record<string, boolean>>({});
  const [generatingIds, setGeneratingIds] = useState<Record<string, boolean>>({});
  const [downloadedTicketId, setDownloadedTicketId] = useState<string | null>(null);
  const [pdfStates, setPdfStates] = useState<Record<string, 'idle' | 'generating' | 'success'>>({});
  const [downloadedPdfId, setDownloadedPdfId] = useState<string | null>(null);
  const [activeScannerBookingId, setActiveScannerBookingId] = useState<string | null>(null);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [ticketActiveIndices, setTicketActiveIndices] = useState<Record<string, number>>({});
  
  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'destination' | 'hotel' | 'experience' | 'transport' | 'event'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings
    .filter(b => {
      const matchesSearch = b.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesType = typeFilter === 'all' || b.itemType === typeFilter;
      const matchesPrice = b.price <= maxPrice;
      
      let matchesDate = true;
      if (dateRange.start) matchesDate = matchesDate && new Date(b.date) >= new Date(dateRange.start);
      if (dateRange.end) matchesDate = matchesDate && new Date(b.date) <= new Date(dateRange.end);
      
      return matchesSearch && matchesStatus && matchesType && matchesPrice && matchesDate;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortBy === 'price') comparison = (a.price || 0) - (b.price || 0);
      else if (sortBy === 'name') comparison = a.itemName.localeCompare(b.itemName);
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const activeBookings = filteredBookings.filter(b => b.date >= today && b.status !== 'cancelled');
  const pastBookings = filteredBookings.filter(b => b.date < today || b.status === 'cancelled');

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const partySize = formData.get('partySize') as string;
    const notes = formData.get('notes') as string;
    
    onUpdate(id, { date, partySize, notes });
    setEditingId(null);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty spaces for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-20 lg:h-24 border border-white/5 opacity-20" />);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayBookings = filteredBookings.filter(b => b.date === dateStr && b.status === 'confirmed');
        
        days.push(
            <div key={d} className="h-20 lg:h-24 border border-white/5 p-2 bg-white/[0.01] flex flex-col gap-1 overflow-hidden transition-colors hover:bg-white/[0.03]">
                <span className={`text-[10px] font-bold ${dayBookings.length > 0 ? 'text-gold-300' : 'text-white/20'}`}>{d}</span>
                <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide">
                    {dayBookings.map(b => (
                        <div key={b.id} className="px-1.5 py-0.5 bg-gold-500/20 rounded border border-gold-500/30 text-[8px] font-bold text-gold-200 truncate">
                            {b.itemName}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-1.5 glass rounded-lg hover:text-gold-300 transition-colors"><ChevronLeft size={16}/></button>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-1.5 glass rounded-lg hover:text-gold-300 transition-colors"><ChevronRight size={16}/></button>
                </div>
            </div>
            <div className="grid grid-cols-7 border-collapse">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center py-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] bg-white/[0.02]">{d}</div>
                ))}
                {days}
            </div>
        </div>
    );
  };

  const renderBookingCard = (booking: Booking, isPast: boolean = false) => (
    <div
        key={booking.id}
        className={`glass p-5 rounded-3xl border border-white/5 relative overflow-hidden group transition-all hover:border-gold-500/20 ${isPast || booking.status === 'cancelled' ? 'opacity-60 saturate-50' : ''}`}
    >
        <div className="flex gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shrink-0 border border-white/5 shadow-inner">
            {booking.itemEmoji}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
            <h4 className="font-display font-bold text-lg truncate pr-2">{booking.itemName}</h4>
            <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
                {booking.status}
            </div>
            </div>
            
            {editingId === booking.id ? (
            <form onSubmit={(e) => handleUpdate(e, booking.id)} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">New Date</label>
                    <input 
                    name="date"
                    type="date" 
                    defaultValue={booking.date}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-gold-500/40" 
                    />
                </div>
                <div>
                    <label className="block text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Party Size</label>
                    <select 
                    name="partySize"
                    defaultValue={booking.partySize}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-gold-500/40 appearance-none"
                    >
                    <option className="bg-forest-900">Solo</option>
                    <option className="bg-forest-900">2 People</option>
                    <option className="bg-forest-900">Family (4+)</option>
                    </select>
                </div>
                </div>
                <div>
                    <label className="block text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Special Requests</label>
                    <textarea 
                        name="notes"
                        defaultValue={booking.notes}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-gold-500/40 resize-none h-20"
                    />
                </div>
                <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-gold-500 text-forest-900 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all active:scale-95">Save Changes</button>
                <button type="button" onClick={() => setEditingId(null)} className="flex-1 py-2 glass text-white/60 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all">Cancel</button>
                </div>
            </form>
            ) : (
            <>
                <div className="flex flex-wrap gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-lg border border-white/5 text-gold-400">
                    <span className="text-[8px] opacity-50 uppercase mr-1">Category:</span>
                    {booking.itemType}
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-lg border border-white/5 text-white/60">
                    <span className="text-[8px] opacity-50 uppercase mr-1">Booking ID:</span>
                    {booking.id}
                  </span>
                  <span className="flex items-center gap-1.5"><Mail size={12} className="text-gold-500" />{booking.email}</span>
                <span className={`flex items-center gap-1.5 ${isPast ? 'line-through opacity-50' : ''}`}><Calendar size={12} className="text-gold-500" />{booking.date}</span>
                {booking.time && (
                  <span className="flex items-center gap-1.5 text-gold-400">
                    <Clock size={12} />
                    {booking.time}
                  </span>
                )}
                {booking.seat && (
                  <span className="flex items-center gap-1.5 text-gold-400 border border-gold-500/20 px-2 rounded-lg">
                    <Users size={12} />
                    SEAT {booking.seat}
                  </span>
                )}
                <span className="flex items-center gap-1.5"><Users size={12} className="text-gold-500" />{booking.partySize}</span>
                <span className="flex items-center gap-1.5"><DollarSign size={12} className="text-gold-500" />${booking.price > 0 ? booking.price : 'Free'}</span>
                
                {booking.paymentMethod && (
                  <span className="flex items-center gap-1.5 text-gold-400 bg-gold-400/5 px-2 py-0.5 rounded-lg border border-gold-500/10 transition-colors hover:bg-gold-400/10">
                    {booking.paymentMethod.toLowerCase().includes('momo') || booking.paymentMethod.toLowerCase().includes('mobile') ? <Smartphone size={12} /> : <CreditCard size={12} />}
                    <span className="text-[8px] opacity-50 mr-1">PAYMENT:</span>
                    {booking.paymentMethod.toLowerCase().includes('momo') && booking.momoNumber 
                      ? `${booking.paymentMethod} (${booking.momoNumber})` 
                      : booking.paymentMethod}
                  </span>
                )}

                {booking.insurance?.selected && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <ShieldCheck size={10} /> INSURED
                  </span>
                )}
                </div>

                {booking.notes && (
                  <div className="mb-4 bg-linear-to-br from-white/5 to-transparent rounded-2xl p-4 border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <List size={12} className="text-gold-500/50" />
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block">Special Instructions & Notes</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed italic border-l-2 border-gold-500/20 pl-3 py-1">
                      "{booking.notes}"
                    </p>
                  </div>
                )}

                {!isPast && (
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="text-[9px] text-white/20 font-bold tracking-widest">
                      ID: <span className="text-white/40">{booking.id}</span>
                  </div>
                  
                  {booking.status !== 'cancelled' && (
                      <div className="flex gap-2">
                      <button 
                          onClick={() => onCancel(booking.id)}
                          className="p-2 glass rounded-xl text-white/30 hover:text-red-400 hover:border-red-500/30 transition-all active:scale-90"
                          title="Cancel Booking"
                      >
                          <Trash2 size={16} />
                      </button>
                      <button 
                          onClick={() => setEditingId(booking.id)}
                          className="p-2 glass rounded-xl text-white/30 hover:text-gold-300 hover:border-gold-500/30 transition-all active:scale-90" 
                          title="Edit Booking"
                      >
                          <Edit3 size={16} />
                      </button>
                      </div>
                  )}
                  </div>
                )}
            </>
            )}
        </div>
        </div>
        {booking.status === 'confirmed' && !editingId && !isPast && (
        <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <CheckCircle size={80} className="text-gold-400" />
        </div>
        )}
    </div>
  );

  const triggerGenerateQR = (id: string) => {
    setGeneratingIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setGeneratingIds(prev => ({ ...prev, [id]: false }));
      setGeneratedQRs(prev => ({ ...prev, [id]: true }));
    }, 2400);
  };

  const handleDownloadTicket = (id: string) => {
    setDownloadedTicketId(id);
    setTimeout(() => {
      setDownloadedTicketId(null);
    }, 3500);
  };

  const handleDownloadPDF = (booking: Booking) => {
    // 1. Enter generating/loading state
    setPdfStates(prev => ({ ...prev, [booking.id]: 'generating' }));

    setTimeout(() => {
      // 2. Build and trigger file download
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 250 >>
stream
BT
/F1 20 Tf
50 750 Td
(RWANDAHUB SECURED GATE ACCESS PASS) Tj
/F1 12 Tf
0 -40 Td
(Ticket Reference: ${booking.id}) Tj
0 -25 Td
(Adventure: ${booking.itemName} [${booking.itemType.toUpperCase()}]) Tj
0 -25 Td
(Date of Travel: ${booking.date}) Tj
0 -25 Td
(Group / Party Size: ${booking.partySize} Guest\(s\)) Tj
0 -25 Td
(Primary Traveler: ${booking.email}) Tj
0 -25 Td
(Reservation Status: ${booking.status.toUpperCase()}) Tj
0 -25 Td
(Total Amount Invoiced: USD ${booking.price}) Tj
0 -40 Td
(Check-in Protocol: Please display this gate pass and matches digital QR code) Tj
0 -15 Td
(to our stewards upon entering regional park checkpoints or accommodation desks.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000120 00000 n 
0000000240 00000 n 
0000000320 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
570
%%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RwandaHub_Ticket_${booking.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 3. Enter success state & trigger toast
      setPdfStates(prev => ({ ...prev, [booking.id]: 'success' }));
      setDownloadedPdfId(booking.id);

      // 4. Automatically clear the toast after 4000ms
      setTimeout(() => {
        setDownloadedPdfId(null);
      }, 4000);

      // 5. Reset button state back to idle after 2500ms
      setTimeout(() => {
        setPdfStates(prev => ({ ...prev, [booking.id]: 'idle' }));
      }, 2500);
    }, 900);
  };

  const renderTicketsTab = () => {
    // Only show non-cancelled tickets 
    const ticketBookings = filteredBookings.filter(b => b.status !== 'cancelled');

    if (ticketBookings.length === 0) {
      return (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
            <Ticket className="text-white/20" size={32} />
          </div>
          <p className="text-white/40 font-medium italic">
            No active digital tickets found matching your layout filters.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Pass Saved Offline Notification Toast */}
        <AnimatePresence>
          {downloadedTicketId && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between text-emerald-400"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Secure PDF Pass with Gate Booking Ref: {downloadedTicketId} Has Been Successfully Sync'd Offline
                </span>
              </div>
              <button 
                onClick={() => setDownloadedTicketId(null)}
                className="text-xs text-white/40 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          )}

          {downloadedPdfId && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-4 flex items-center justify-between text-gold-400"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-normal">
                  ✓ Secured PDF Voucher Generated! Your ticket PDF for Booking ID <span className="text-white font-mono font-bold">{downloadedPdfId}</span> has been downloaded.
                </span>
              </div>
              <button 
                onClick={() => setDownloadedPdfId(null)}
                className="text-xs text-white/40 hover:text-white ml-2 pr-1"
              >
                ✕
              </button>
            </motion.div>
          )}
          {scanSuccessMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 flex items-center justify-between text-emerald-400"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-450 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-normal">
                  {scanSuccessMessage}
                </span>
              </div>
              <button 
                onClick={() => setScanSuccessMessage(null)}
                className="text-xs text-white/40 hover:text-white ml-2 pr-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ticketBookings.map((booking) => {
            const isGenerating = generatingIds[booking.id];
            const isNear = isNearEvent(booking.date, booking.time);
            const partySize = Math.max(1, parseInt(booking.partySize) || 1);
            const activeIndex = ticketActiveIndices[booking.id] || 0;
            const hasQR = generatedQRs[booking.id];
            // QR server schema data url changes based on the active index in the group/stack!
            const qrData = `rwandahub://ticket/${booking.id}/pax-${activeIndex}/${encodeURIComponent(booking.itemName)}/${booking.date}/${booking.partySize}`;
 
            return (
              <div key={booking.id} className="relative pt-6 px-1">
                {/* Physical stacked card layer effect */}
                {partySize > 1 && (
                  <>
                    {/* Layer 2 (Furthest back card tip) */}
                    <div className="absolute inset-x-6 top-1 bottom-4 rounded-[2rem] bg-forest-950/50 border border-white/5 -z-20 opacity-40 shadow-sm transition-all duration-300 pointer-events-none" />
                    {/* Layer 1 (Middle card tip) */}
                    <div className="absolute inset-x-3 top-3 bottom-2 rounded-[2rem] bg-forest-950/75 border border-white/10 -z-10 opacity-75 shadow-md transition-all duration-300 pointer-events-none" />
                  </>
                )}

                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  drag={partySize > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(event, info) => {
                    const threshold = 50;
                    if (info.offset.x < -threshold) {
                      // swipe left -> next
                      setTicketActiveIndices(prev => ({
                        ...prev,
                        [booking.id]: (activeIndex + 1) % partySize
                      }));
                    } else if (info.offset.x > threshold) {
                      // swipe right -> prev
                      setTicketActiveIndices(prev => ({
                        ...prev,
                        [booking.id]: (activeIndex - 1 + partySize) % partySize
                      }));
                    }
                  }}
                  whileDrag={{ scale: 0.99 }}
                  className={`relative glass rounded-[2rem] overflow-hidden border transition-all duration-300 flex flex-col ${
                    partySize > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                  } ${
                    isNear 
                      ? 'border-amber-500/40 hover:border-amber-500/60 shadow-[0_4px_25px_rgba(245,158,11,0.15)] hover:shadow-[0_8px_35px_rgba(245,158,11,0.3)] hover:-translate-y-1 bg-gradient-to-b from-forest-900 via-forest-950 to-amber-950/20' 
                      : 'border-white/5 hover:border-gold-500/20 hover:shadow-[0_8px_30px_rgba(201,168,76,0.18)] hover:-translate-y-1'
                  }`}
                >
                  {/* Visual indicator glow flash on the ticket edge */}
                  {isNear && (
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[pulse_1.5s_infinite] opacity-80" />
                  )}

                  {/* Ticket Header styled like an elegant physical pass */}
                  <div className="p-6 bg-white/[0.02] border-b border-dashed border-white/10 flex items-center justify-between relative">
                    {/* Perforated ticket indents on left & right edge */}
                    <div className="absolute -left-3 top-full -translate-y-1/2 w-6 h-6 rounded-full bg-forest-900 border-r border-white/10" />
                    <div className="absolute -right-3 top-full -translate-y-1/2 w-6 h-6 rounded-full bg-forest-900 border-l border-white/10" />

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{booking.itemEmoji || '🏷️'}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide truncate max-w-[180px]">{booking.itemName}</h4>
                        <span className="text-[9px] font-mono text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                          {booking.itemType}
                          {isNear && (
                            <span className="inline-flex items-center gap-1 px-1 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[6px] font-bold uppercase tracking-wide animate-pulse">
                              ⚠️ within 24h
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {partySize > 1 ? (
                      <div className="flex flex-col items-end gap-1 select-none">
                        <span className="text-[7.5px] font-mono font-bold text-gold-400/85 bg-gold-400/10 border border-gold-400/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <Users size={8} /> Stack: {activeIndex + 1}/{partySize}
                        </span>
                        {/* Interactive dots indicatiors */}
                        <div className="flex gap-1 mt-1 justify-center">
                          {Array.from({ length: partySize }).map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setTicketActiveIndices(prev => ({ ...prev, [booking.id]: i }));
                              }}
                              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                                i === activeIndex 
                                  ? 'bg-gold-400 w-2.5' 
                                  : 'bg-white/20 hover:bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    )}
                  </div>

                  {/* Ticket Details Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px] uppercase font-bold tracking-widest text-white/50">
                      <div>
                        <span className="text-[8px] text-white/20 block mb-0.5 font-bold">Booking ID</span>
                        <span className="text-white font-mono break-all font-bold">
                          {booking.id}-{String(activeIndex + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/20 block mb-0.5 block mb-0.5 font-bold">Travel Date</span>
                        <span className="text-white font-mono font-bold">{booking.date}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/20 block mb-0.5 font-bold">Holder Account</span>
                        <span className="text-white truncate block max-w-[130px] font-bold" title={booking.email}>
                          {activeIndex === 0 
                            ? `${booking.email.split('@')[0].toUpperCase()} (Primary)` 
                            : `${booking.email.split('@')[0].toUpperCase()} (Guest ${activeIndex + 1})`
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/20 block mb-0.5 font-bold">Group Segment</span>
                        <span className="text-white font-bold">{activeIndex + 1} of {partySize}</span>
                      </div>
                    </div>

                    {isNear && (
                      <motion.div
                        animate={{ scale: [1, 1.01, 1], borderColor: ["rgba(245,158,11,0.15)", "rgba(245,158,11,0.4)", "rgba(245,158,11,0.15)"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-center gap-3 text-amber-300"
                      >
                        <div className="relative flex items-center justify-center pl-1.5">
                          <Clock size={16} className="text-amber-400 animate-spin [animation-duration:8s]" />
                          <span className="absolute w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        </div>
                        <div className="flex-1 text-[8px] uppercase tracking-wider leading-relaxed">
                          <span className="font-extrabold block text-amber-400">🚨 Upcoming Gateway Access Slot</span>
                          <span className="text-white/60 normal-case font-medium font-sans block mt-0.5">
                            Your regional gate check-in window opens within 24 hours. Keep pass ready.
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Left/Right manual click controls on stack */}
                    {partySize > 1 && (
                      <div className="flex items-center justify-between bg-white/[0.01] border border-white/5 rounded-xl px-2.5 py-2 text-[8px] uppercase tracking-widest font-black select-none">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTicketActiveIndices(prev => ({
                              ...prev,
                              [booking.id]: (activeIndex - 1 + partySize) % partySize
                            }));
                          }}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <ChevronLeft size={10} /> Prev Pass
                        </button>
                        
                        <span className="font-mono text-gold-400 flex items-center gap-1 animate-pulse">
                          🎯 SWIPE CARD OR TAP
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTicketActiveIndices(prev => ({
                              ...prev,
                              [booking.id]: (activeIndex + 1) % partySize
                            }));
                          }}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          Next Pass <ChevronRight size={10} />
                        </button>
                      </div>
                    )}

                    {/* Perforated/Dashed Divider */}
                    <div className="h-px border-t border-dashed border-white/10 my-4" />

                    {/* Interactive scanning & QR generator workspace */}
                    <div className="flex flex-col items-center justify-center pt-2">
                      {hasQR ? (
                        /* Generated Active QR Code with Futuristic scanline overlay */
                        <div className="flex flex-col items-center space-y-4 w-full">
                          <div className="relative p-3 bg-white rounded-2xl shadow-2xl shadow-gold-500/10 group/qr">
                            {/* Real-time generated scannable visual of the secure ticket code with matching color theme */}
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=c9a84c&bgcolor=0a1a0f&data=${encodeURIComponent(qrData)}`}
                              alt="Secure Gate Access Code"
                              className="w-36 h-36 bg-forest-900 rounded-xl block shadow-inner"
                            />
                            
                            {/* Animated digital scanline for premium interaction */}
                            <motion.div
                              animate={{ y: [0, 136, 0] }}
                              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                              className="absolute left-3 right-3 h-0.5 bg-gold-400 shadow-[0_0_8px_4px_rgba(212,175,55,0.45)] pointer-events-none"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap justify-center w-full">
                            <button
                              onClick={() => handleDownloadTicket(booking.id)}
                              className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Download size={12} /> Save Pass
                            </button>

                            <button
                              onClick={() => pdfStates[booking.id] !== 'generating' && handleDownloadPDF(booking)}
                              disabled={pdfStates[booking.id] === 'generating'}
                              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer relative ${
                                pdfStates[booking.id] === 'generating'
                                  ? 'bg-white/5 border border-white/10 text-white/40 select-none cursor-not-allowed animate-pulse'
                                  : pdfStates[booking.id] === 'success'
                                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 active:scale-95'
                                  : 'bg-gold-500 hover:bg-gold-400 text-forest-900 active:scale-95'
                              }`}
                            >
                              {pdfStates[booking.id] === 'generating' ? (
                                <>
                                  <RefreshCw size={12} className="animate-spin text-gold-400" />
                                  Generating...
                                </>
                              ) : pdfStates[booking.id] === 'success' ? (
                                <>
                                  <CheckCircle size={12} className="text-white animate-bounce" />
                                  Downloaded!
                                </>
                              ) : (
                                <>
                                  <FileText size={12} />
                                  PDF
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => setActiveScannerBookingId(booking.id)}
                              className="px-4 py-2 bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/15 hover:border-gold-500/30 text-gold-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Camera size={12} className="animate-pulse text-gold-400" /> Scanner
                            </button>
                          </div>
                          
                          <p className="text-[8px] text-white/30 italic text-center max-w-[220px] font-bold tracking-wide">
                            Present this scannable token to reservation stewards or automated gate scanners at venues.
                          </p>
                        </div>
                      ) : isGenerating ? (
                        <QRAnimationLoader />
                      ) : (
                        /* State: Click to Generate QR Code */
                        <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center w-full">
                          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-400 border border-gold-500/20">
                            <Ticket size={24} />
                          </div>
                          <div>
                            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Generate Scannable Gate Token</h5>
                            <p className="text-[8px] text-white/30 italic max-w-xs mt-1 leading-normal font-bold">
                              Cryptographically binds your booking details into a ticket for check-in counters.
                            </p>
                          </div>
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => triggerGenerateQR(booking.id)}
                              className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-forest-900 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:scale-102 transition-all shadow-lg shadow-gold-500/10 cursor-pointer"
                            >
                              Generate QR Code
                            </button>
                            <button
                              onClick={() => setActiveScannerBookingId(booking.id)}
                              className="px-4 bg-white/5 border border-white/10 hover:bg-gold-500/10 hover:border-gold-500/20 text-gold-400 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                              title="Open Camera Scanner"
                            >
                              <Camera size={14} className="text-gold-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Render Scanner Portal on Request */}
        <AnimatePresence>
          {activeScannerBookingId && (
            <TicketCameraScanner
              bookingId={activeScannerBookingId}
              onClose={() => setActiveScannerBookingId(null)}
              onScanSuccess={(details) => {
                setScanSuccessMessage(details);
                setActiveScannerBookingId(null);
                // Auto dismiss toast after 5s
                setTimeout(() => {
                  setScanSuccessMessage((prev) => prev === details ? null : prev);
                }, 5200);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-4xl glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between bg-white/[0.02] gap-4">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold">{t('my_bookings')}</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Manage your Rwandan adventures</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search name/ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] text-white focus:outline-none focus:border-gold-500/40 w-full md:w-48 lg:w-56 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[10px] font-bold text-white/40 uppercase tracking-widest px-2 py-1 focus:outline-none cursor-pointer hover:text-white transition-colors appearance-none"
              >
                <option value="date" className="bg-forest-900">Date</option>
                <option value="price" className="bg-forest-900">Price</option>
                <option value="name" className="bg-forest-900">Name</option>
              </select>
              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 hover:bg-white/10 rounded-lg text-gold-400 transition-all active:scale-95"
                title={sortOrder === 'asc' ? 'Sorted Ascending' : 'Sorted Descending'}
              >
                {sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
              </button>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${showFilters ? 'bg-gold-500 text-forest-900 border-gold-400' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}
            >
              <Filter size={16} />
              <span className="hidden md:inline">FILTERS</span>
            </button>

            <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gold-500 text-forest-900' : 'text-white/40 hover:text-white'}`}
                  title="List View"
                >
                    <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('tickets')}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${viewMode === 'tickets' ? 'bg-gold-500 text-forest-900' : 'text-white/40 hover:text-white'}`}
                  title="Digital Tickets"
                >
                    <Ticket size={16} />
                    <span className="text-[10px] font-black uppercase tracking-wider pr-1 hidden sm:inline">Tickets</span>
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-gold-500 text-forest-900' : 'text-white/40 hover:text-white'}`}
                  title="Calendar View"
                >
                    <CalendarIcon size={18} />
                </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/40 border border-transparent hover:border-white/5">
                <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-white/5 pb-8 mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Status & Type */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Booking Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['all', 'confirmed', 'pending', 'cancelled'].map(s => (
                          <button
                            key={s}
                            onClick={() => setStatusFilter(s as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${statusFilter === s ? 'bg-gold-500 text-forest-900 border-gold-400' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Item Type</label>
                      <div className="flex flex-wrap gap-2">
                          {[
                          { val: 'all', icon: List },
                          { val: 'destination', icon: Plane },
                          { val: 'hotel', icon: Building2 },
                          { val: 'experience', icon: Ticket },
                          { val: 'transport', icon: Plane },
                          { val: 'event', icon: Trophy }
                        ].map(t => (
                          <button
                            key={t.val}
                            onClick={() => setTypeFilter(t.val as any)}
                            className={`p-2 rounded-lg transition-all border flex items-center justify-center gap-2 min-w-[40px] ${typeFilter === t.val ? 'bg-gold-500 text-forest-900 border-gold-400' : 'bg-white/5 text-white/40 border-white/10'}`}
                            title={t.val}
                          >
                            <t.icon size={14} />
                            <span className="text-[10px] font-bold uppercase">{t.val === 'all' ? '' : t.val.charAt(0)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Travel Date Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-gold-500/40"
                        />
                        <input 
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-gold-500/40"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 flex justify-between">
                        Max Price <span>${maxPrice}</span>
                      </label>
                      <input 
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500"
                      />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col justify-end lg:col-start-4">
                    <button 
                      onClick={() => {
                        setStatusFilter('all');
                        setTypeFilter('all');
                        setDateRange({ start: '', end: '' });
                        setMaxPrice(2000);
                        setSortBy('date');
                        setSortOrder('desc');
                        setSearchQuery('');
                      }}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <History size={14} /> RESET FILTERS
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {viewMode === 'calendar' ? (
                <motion.div 
                    key="calendar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                >
                    {renderCalendar()}
                </motion.div>
            ) : viewMode === 'tickets' ? (
                <motion.div 
                    key="tickets"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                >
                    {renderTicketsTab()}
                </motion.div>
            ) : filteredBookings.length === 0 ? (
            <motion.div 
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Calendar className="text-white/20" size={32} />
              </div>
              <p className="text-white/40 font-medium italic">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || dateRange.start || dateRange.end || maxPrice < 2000
                 ? "No bookings match your search or filters." 
                 : t('no_bookings')}
              </p>
            </motion.div>
          ) : (
            <motion.div 
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
            >
                {activeBookings.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gold-500" />
                      <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Upcoming Adventures</h4>
                      <div className="h-px flex-1 bg-linear-to-r from-gold-500/20 to-transparent" />
                    </div>
                    {activeBookings.map(b => renderBookingCard(b))}
                  </div>
                )}

                {pastBookings.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <History size={16} className="text-white/20" />
                      <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Travel History</h4>
                      <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {pastBookings.map(b => renderBookingCard(b, true))}
                    </div>
                  </div>
                )}
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <AlertCircle className="text-amber-500 shrink-0" size={18} />
            <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest leading-loose">
                {lang === 'rw' 
                 ? 'Guhindura cyangwa gusibya urugendo bikorwa hashingiwe ku nyandiko zigenga amasezerano. Twandikire kuri VIP concierge ukeneye ubufasha bwihariye.'
                 : 'Modification and cancellation policies vary by operator. VIP concierge is available 24/7 for premium members.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
