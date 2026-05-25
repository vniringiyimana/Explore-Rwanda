import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Heart, 
  CreditCard, 
  CloudRain,
  Timer,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Send,
  Loader2,
  Bot,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Search,
  MessageSquare,
  LifeBuoy,
  FileText,
  Bell,
  Globe,
  Languages,
  CheckCircle,
  XCircle,
  Filter,
  Settings,
  Upload,
  Paperclip,
  Check,
  Trophy,
  Target,
  Award,
  Zap,
  TrendingUp,
  Download,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardProps, UserRole } from '../../types';
import { generateItinerary } from '../../services/geminiService';
import { dbService } from '../../services/db';
import Markdown from 'react-markdown';

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

export default function TouristDashboard({ activeTab, bookings, user, onTabChange, voiceSearchQuery }: DashboardProps) {
  const isAdmin = user.role === UserRole.ADMIN;
  const [prompt, setPrompt] = useState('');
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketSearch, setTicketSearch] = useState('');
  const [trips, setTrips] = useState([
    { id: 'T-102', name: 'Summer in the Virungas', duration: '5 Days', people: 2, status: 'Active', progress: 40, emoji: '🌋' },
    { id: 'T-105', name: 'Kivu Lakeshore Escape', duration: '3 Days', people: 4, status: 'Upcoming', progress: 0, emoji: '🌊' },
  ]);

  const [managedBookings, setManagedBookings] = useState(bookings);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  // Dedicated QR Code modal states inside TouristDashboard
  const [selectedQRBooking, setSelectedQRBooking] = useState<any | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [hasGeneratedQR, setHasGeneratedQR] = useState<Record<string, boolean>>({});
  const [downloadedStatusId, setDownloadedStatusId] = useState<string | null>(null);
  const [pdfStates, setPdfStates] = useState<Record<string, 'idle' | 'generating' | 'success'>>({});
  const [downloadedPdfId, setDownloadedPdfId] = useState<string | null>(null);

  // Activities & Goals State
  const [completedActivities] = useState([
    { id: 'ACT-001', name: 'Gorilla Trekking', category: 'Adventure', date: '2024-05-10', xp: 500, location: 'Musanze', emoji: '🦍' },
    { id: 'ACT-002', name: 'Canopy Walk', category: 'Nature', date: '2024-05-12', xp: 250, location: 'Nyungwe', emoji: '🌲' },
    { id: 'ACT-003', name: 'King\'s Palace Visit', category: 'Culture', date: '2024-05-14', xp: 150, location: 'Nyanza', emoji: '👑' },
  ]);

  const [travelGoals] = useState([
    { id: 'GOAL-1', name: 'The Big Five', target: 5, current: 3, icon: '🦁', description: 'See all Big Five animals in Akagera.' },
    { id: 'GOAL-2', name: 'Summit Seeker', target: 3, current: 1, icon: '🌋', description: 'Hike 3 major volcanoes.' },
    { id: 'GOAL-3', name: 'Culture Collector', target: 10, current: 4, icon: '🎭', description: 'Visit 10 cultural heritage sites.' },
    { id: 'GOAL-4', name: 'XP Master', target: 5000, current: 1250, icon: '✨', description: 'Reach 5,000 Travel XP.' },
  ]);
  
  // Support Ticket Form State
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [ticketFormStatus, setTicketFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Dynamic user profile fields editable in Sandbox mode
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePassword, setProfilePassword] = useState(user.password || 'password123');
  const [profileBio, setProfileBio] = useState(user.bio || 'Eco-tourist exploring the thousand hills of Rwanda.');
  const [profileAvatar, setProfileAvatar] = useState(user.avatar || '');
  const [pushNotif, setPushNotif] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePassword(user.password || 'password123');
      setProfileBio(user.bio || 'Eco-tourist exploring the thousand hills of Rwanda.');
      setProfileAvatar(user.avatar || '');
    }
  }, [user]);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dbService.updateUser(user.id, {
        name: profileName,
        email: profileEmail,
        password: profilePassword,
        bio: profileBio,
        avatar: profileAvatar,
      });
      window.dispatchEvent(new CustomEvent('app-toast', { detail: '📋 Profile & Settings updated locally!' }));
    } catch (err: any) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: '❌ Failed to save profile details.' }));
    }
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
  };

  const handleCancelBooking = (id: string) => {
    setManagedBookings(managedBookings.filter(b => b.id !== id));
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tripData = {
      id: editingTrip?.id || `T-${Math.floor(Math.random() * 1000)}`,
      name: formData.get('name') as string,
      duration: formData.get('duration') as string,
      people: parseInt(formData.get('people') as string),
      status: formData.get('status') as string,
      progress: editingTrip?.progress || 0,
      emoji: formData.get('emoji') as string || '🌍',
    };

    if (editingTrip) {
      setTrips(trips.map(t => t.id === editingTrip.id ? tripData : t));
    } else {
      setTrips([...trips, tripData]);
    }
    setEditingTrip(null);
    setIsAddingTrip(false);
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = {
      ...editingBooking,
      itemName: formData.get('itemName') as string,
      date: formData.get('date') as string,
      price: parseInt(formData.get('price') as string),
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      paymentMethod: formData.get('paymentMethod') as string || 'Credit Card'
    };

    setManagedBookings(managedBookings.map(b => b.id === editingBooking.id ? bookingData : b));
    setEditingBooking(null);
  };

  const renderTripModal = (trip: any, isNew = false) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-950/80 backdrop-blur-md" onClick={() => {setEditingTrip(null); setIsAddingTrip(false);}} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[3rem] p-8 border border-white/10 w-full max-w-lg relative z-10"
      >
        <h3 className="text-2xl font-display font-bold text-white mb-6">{isNew ? 'New Adventure' : 'Edit Journey'}</h3>
        <form onSubmit={handleSaveTrip} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Trip Name</label>
              <input name="name" defaultValue={trip?.name} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" placeholder="e.g. Gorilla Trekking" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Duration</label>
              <input name="duration" defaultValue={trip?.duration} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" placeholder="e.g. 5 Days" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">People</label>
              <input type="number" name="people" defaultValue={trip?.people} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Emoji</label>
              <input name="emoji" defaultValue={trip?.emoji} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" placeholder="🌍" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Status</label>
              <select name="status" defaultValue={trip?.status || 'Upcoming'} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50">
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-gold-500 text-forest-900 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-gold-500/20">Save Plan</button>
            <button type="button" onClick={() => {setEditingTrip(null); setIsAddingTrip(false);}} className="flex-1 bg-white/5 text-white/40 py-4 rounded-2xl font-bold text-sm">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  const renderBookingModal = (booking: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-950/80 backdrop-blur-md" onClick={() => setEditingBooking(null)} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[3rem] p-8 border border-white/10 w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <h3 className="text-2xl font-display font-bold text-white mb-6">Modify Ticket</h3>
        <form onSubmit={handleSaveBooking} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Experience Name</label>
            <input name="itemName" defaultValue={booking?.itemName} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Date</label>
              <input name="date" defaultValue={booking?.date} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Price ($)</label>
              <input type="number" name="price" defaultValue={booking?.price} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Traveler Email</label>
              <input name="email" type="email" defaultValue={booking?.email || user?.email || ''} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Traveler Phone</label>
              <input name="phone" type="tel" defaultValue={booking?.phone || ''} placeholder="+250 78X XXX XXX" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Payment Method</label>
            <select name="paymentMethod" defaultValue={booking?.paymentMethod || 'Credit Card'} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50">
              <option className="bg-forest-900" value="Credit Card">Credit Card</option>
              <option className="bg-forest-900" value="MTN MoMo">MTN MoMo</option>
              <option className="bg-forest-900" value="Airtel Money">Airtel Money</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-gold-500 text-forest-900 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-gold-500/20">Update Ticket</button>
            <button type="button" onClick={() => setEditingBooking(null)} className="flex-1 bg-white/5 text-white/40 py-4 rounded-2xl font-bold text-sm">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  const triggerDashboardQR = (id: string) => {
    setIsGeneratingQR(true);
    setTimeout(() => {
      setIsGeneratingQR(false);
      setHasGeneratedQR(prev => ({ ...prev, [id]: true }));
    }, 2400);
  };

  const downloadDashboardTicket = (id: string) => {
    setDownloadedStatusId(id);
    setTimeout(() => {
      setDownloadedStatusId(null);
    }, 3000);
  };

  const downloadDashboardPDF = (booking: any) => {
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
(Adventure: ${booking.itemName} [${(booking.itemType || 'activity').toUpperCase()}]) Tj
0 -25 Td
(Date of Travel: ${booking.date}) Tj
0 -25 Td
(Group / Party Size: ${booking.partySize || 1} Guest\(s\)) Tj
0 -25 Td
(Primary Traveler: ${booking.email || 'Adventure Seeker'}) Tj
0 -25 Td
(Reservation Status: ${(booking.status || 'confirmed').toUpperCase()}) Tj
0 -25 Td
(Total Amount Invoiced: USD ${booking.price || 0}) Tj
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

  const renderQRModal = (booking: any) => {
    if (!booking) return null;
    const isGenerating = isGeneratingQR;
    const hasQR = hasGeneratedQR[booking.id];
    const qrData = `rwandahub://ticket/${booking.id}/${encodeURIComponent(booking.itemName)}/${booking.date}/${booking.partySize || 'Solo'}`;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-forest-950/80 backdrop-blur-md" onClick={() => setSelectedQRBooking(null)} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass rounded-[3rem] p-8 border border-white/10 w-full max-w-md relative z-10 flex flex-col items-center"
        >
          {/* Header */}
          <div className="w-full text-center pb-6 border-b border-dashed border-white/10 relative">
            <span className="text-3xl mb-2 block">{booking.itemEmoji || '🏷️'}</span>
            <h3 className="text-xl font-display font-bold text-white leading-tight">{booking.itemName}</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Digital Venue Pass</p>

            <div className="absolute -left-11 top-full -translate-y-1/2 w-6 h-6 rounded-full bg-forest-900 border-r border-white/10 opacity-30" />
            <div className="absolute -right-11 top-full -translate-y-1/2 w-6 h-6 rounded-full bg-forest-900 border-l border-white/10 opacity-30" />
          </div>

          {/* Body */}
          <div className="w-full space-y-4 py-6 border-b border-dashed border-white/10">
            <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold tracking-widest text-white/50">
              <div>
                <span className="text-[8px] text-white/20 block mb-0.5">Booking ID</span>
                <span className="text-white font-mono break-all">{booking.id}</span>
              </div>
              <div>
                <span className="text-[8px] text-white/20 block mb-0.5">Date</span>
                <span className="text-white font-mono">{booking.date}</span>
              </div>
              <div>
                <span className="text-[8px] text-white/20 block mb-0.5">Price Group</span>
                <span className="text-white font-mono">${booking.price}</span>
              </div>
              <div>
                <span className="text-[8px] text-white/20 block mb-0.5">Holder Code</span>
                <span className="text-white font-mono truncate block max-w-[100px]">{booking.email?.split('@')[0]}</span>
              </div>
            </div>
          </div>

          {/* Actions & QR Code Wrapper */}
          <div className="w-full pt-6 flex flex-col items-center justify-center min-h-[160px]">
            {downloadedStatusId && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full mb-4 text-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider"
              >
                ✓ Secure Device Pass saved offline
              </motion.div>
            )}

            {downloadedPdfId && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full mb-4 text-center bg-gold-500/10 border border-gold-500/20 text-gold-400 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider"
              >
                ✓ Secure Ticket PDF Generated & Downloaded
              </motion.div>
            )}

            {hasQR ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative p-2.5 bg-white rounded-2xl group/qr h-36 w-36 shadow-lg shadow-gold-500/10">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=c9a84c&bgcolor=0a1a0f&data=${encodeURIComponent(qrData)}`}
                    alt="Scan Code"
                    className="w-full h-full bg-forest-900 rounded-lg shadow-inner"
                  />
                  <motion.div
                    animate={{ y: [0, 126, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute left-2.5 right-2.5 h-0.5 bg-gold-400 shadow-[0_0_8px_4px_rgba(212,175,55,0.45)] pointer-events-none"
                  />
                </div>
                
                <div className="flex items-center gap-2 flex-wrap justify-center w-full">
                  <button
                    onClick={() => downloadDashboardTicket(booking.id)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={10} /> Save Offline copy
                  </button>

                  <button
                    onClick={() => pdfStates[booking.id] !== 'generating' && downloadDashboardPDF(booking)}
                    disabled={pdfStates[booking.id] === 'generating'}
                    className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-md relative ${
                      pdfStates[booking.id] === 'generating'
                        ? 'bg-white/5 border border-white/10 text-white/40 select-none cursor-not-allowed animate-pulse'
                        : pdfStates[booking.id] === 'success'
                        ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'
                        : 'bg-gold-500 hover:bg-gold-400 text-forest-900 shadow-gold-500/5 hover:scale-102'
                    }`}
                  >
                    {pdfStates[booking.id] === 'generating' ? (
                      <>
                        <RefreshCw size={10} className="animate-spin text-gold-400" />
                        Generating PDF...
                      </>
                    ) : pdfStates[booking.id] === 'success' ? (
                      <>
                        <CheckCircle size={10} className="text-white animate-bounce" />
                        PDF Downloaded!
                      </>
                    ) : (
                      <>
                        <FileText size={10} />
                        Download Ticket PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : isGenerating ? (
              <QRAnimationLoader />
            ) : (
              <div className="w-full flex flex-col items-center space-y-4">
                <button
                  onClick={() => triggerDashboardQR(booking.id)}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-forest-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gold-500/20 hover:scale-102 transition-all cursor-pointer"
                >
                  Generate QR Gate Pass
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedQRBooking(null)}
            className="mt-6 text-white/30 hover:text-white/60 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            Close Voucher Window
          </button>
        </motion.div>
      </div>
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generateItinerary(prompt);
      setItinerary(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const images = [
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80', // Gorillas
    'https://images.unsplash.com/photo-1542113300-474be6f89073?auto=format&fit=crop&q=80', // Lake Kivu
    'https://images.unsplash.com/photo-1540206276207-3f2439c50400?auto=format&fit=crop&q=80', // Kigali
  ];
  const [currentImage, setCurrentImage] = useState(0);

  const handleSaveAIPlanToTrips = () => {
    if (!itinerary) return;
    
    // Extract a simple title from the itinerary or prompt
    const name = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt || 'AI Planned Trip';
    
    setEditingTrip({
      id: `T-${Math.floor(Math.random() * 1000)}`,
      name: name,
      duration: 'TBD',
      people: 1,
      status: 'Upcoming',
      progress: 0,
      emoji: '✨'
    });
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const subject = formData.get('subject') as string;
    const priority = formData.get('priority') as string;
    const description = formData.get('description') as string;

    setTicketFormStatus('submitting');
    
    // Save to DB
    dbService.sendMessage({
      senderId: user.id,
      senderName: user.name,
      receiverId: '1', // Admin
      content: `[TICKET - ${priority}] ${subject}: ${description}`,
      type: 'support'
    });

    setTimeout(() => {
      setTicketFormStatus('success');
      setAttachedFiles([]);
      setTimeout(() => {
        setTicketFormStatus('idle');
        setShowTicketForm(false);
      }, 3000);
    }, 1500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Basic validation
    if (!name || !email || !subject || !message) return;
    if (!email.includes('@')) return;

    setContactFormStatus('submitting');
    
    // Save to DB as support message
    dbService.sendMessage({
      senderId: user.id,
      senderName: name,
      receiverId: '1', // Admin
      content: `[CONTACT] ${subject}: ${message} (Reply to: ${email})`,
      type: 'support'
    });

    setTimeout(() => {
      setContactFormStatus('success');
      setTimeout(() => {
        setContactFormStatus('idle');
        setShowContactForm(false);
      }, 3000);
    }, 1500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const travelPatterns = [
    { label: 'Adventure', icon: '🌋', items: ['5-day Gorilla Trekking', 'Nyungwe Canopy & Nature', 'Volcanoes Hiking Safari'] },
    { label: 'Relaxation', icon: '🌊', items: ['Lake Kivu Weekend Escape', 'Kigali Spa & Luxury Retreat', 'Twin Lakes Serenity'] },
    { label: 'Culture', icon: '🏛️', items: ['Nyanza King\'s Palace Tour', 'Kigali Art & History Walk', 'Rural Village Experience'] },
    { label: 'Wildlife', icon: '🐘', items: ['Akagera Big Five Safari', 'Bird Watching in Bugesera', 'Primate Adventure'] }
  ];

  const renderActivitiesAndGoals = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            <Trophy className="text-gold-500" size={24} /> Journey Milestones
          </h2>
          <p className="text-xs text-white/30 italic">\"Every step in Rwanda is a story. Track yours here.\"</p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-gold-500/10 to-transparent">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Total Experience</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display font-bold text-white">1,250</span>
            <span className="text-xs font-bold text-gold-500">XP</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className="h-full bg-gold-500" />
          </div>
          <p className="text-[10px] text-white/30 mt-2">Level 4 Nomad • 750 XP to next level</p>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Goals Completed</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display font-bold text-white">2</span>
            <span className="text-xs font-bold text-emerald-500">of 12</span>
          </div>
          <div className="h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '16%' }} className="h-full bg-emerald-500" />
          </div>
          <p className="text-[10px] text-white/30 mt-2">Rising Explorer Status</p>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Badges Earned</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display font-bold text-white">4</span>
            <span className="text-xs font-bold text-blue-400">Total</span>
          </div>
          <p className="text-[10px] text-white/30 mt-2">Top 15% of monthly travelers</p>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Provinces Visited</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display font-bold text-white">3</span>
            <span className="text-xs font-bold text-white/40">of 5</span>
          </div>
          <p className="text-[10px] text-white/30 mt-2">North, South, and Kigali City</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Travel Goals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Target className="text-gold-500" size={20} /> Active Missions
            </h3>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">In Progress</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelGoals.map((goal) => (
              <div key={goal.id} className="glass rounded-[2rem] p-6 border border-white/5 hover:border-gold-500/20 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {goal.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">{goal.current} / {goal.target}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{goal.name}</h4>
                <p className="text-[10px] text-white/40 mb-4 leading-relaxed line-clamp-2 italic">\"{goal.description}\"</p>
                
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(goal.current / goal.target) * 100}%` }} 
                    className="h-full bg-gold-500" 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-[2rem] p-8 border border-white/5 text-center bg-gradient-to-t from-gold-500/5 to-transparent">
            <Award className="mx-auto text-gold-500/50 mb-4" size={32} />
            <h4 className="text-white font-bold mb-2">Claim Your Rewards</h4>
            <p className="text-[10px] text-white/40 mb-6 italic">Completing goals unlocks exclusive discounts and hidden experiences.</p>
            <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-gold-500 hover:text-forest-900 transition-all">View All Challenges</button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Zap className="text-gold-500" size={20} /> History
            </h3>
            <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">View All</button>
          </div>

          <div className="space-y-4">
            {completedActivities.map((activity) => (
              <div key={activity.id} className="glass rounded-3xl p-5 border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl shadow-inner">
                  {activity.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-xs font-bold text-white truncate">{activity.name}</h4>
                    <span className="text-[9px] font-bold text-gold-500">+{activity.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">{activity.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] text-white/40 font-bold">{activity.location}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 px-2">
              <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <TrendingUp size={16} />
                  </div>
                  <p className="text-[10px] font-bold text-white/60">Weekly momentum is up 14%</p>
                </div>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                   Sync Garmin / Strava
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlanner = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden relative min-h-[80vh]">
      {/* Background Slideshow */}
      <div className="absolute inset-0 -top-8 -mx-10 rounded-[4rem] overflow-hidden -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 9000)}
            className="absolute inset-0"
          >
            <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            <Sparkles className="text-gold-500" size={24} /> AI Pilot
          </h2>
          <p className="text-xs text-white/30 italic">\"Your personal AI concierge for bespoke Rwandan adventures.\"</p>
        </div>
      </div>

      {!itinerary && !isLoading ? (
        <div className="glass rounded-[2.5rem] p-12 border border-white/5 bg-radial-at-t from-gold-500/5 to-transparent flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gold-500/10 flex items-center justify-center mb-8 border border-gold-500/20">
            <Bot size={40} className="text-gold-500" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-4">Where should we go?</h3>
          <p className="text-white/40 text-sm mb-10 max-w-sm">
            Describe your dream trip. Are you seeking gorillas in Musanze, coffee tours in Gisenyi, or Kigali's urban pulse?
          </p>
          
          <div className="w-full relative group">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A 3-day adventure focused on nature and local food for 2 people starting from Kigali..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 min-h-[150px] transition-all"
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="absolute bottom-4 right-4 bg-gold-500 text-forest-900 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-gold-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} 
              Launch Pilot
            </button>
          </div>

          <div className="mt-12 w-full space-y-6">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Common travel patterns</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {travelPatterns.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-sm">{category.icon}</span>
                    <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{category.label}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {category.items.map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => setPrompt(item)}
                        className="p-3 bg-white/5 rounded-xl border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-tight hover:border-gold-500/30 hover:text-white transition-all text-left truncate"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="glass rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 p-8">
                 <button 
                  onClick={() => {setItinerary(null); setPrompt('');}}
                  className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors"
                  title="New Plan"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-24 space-y-6">
                  <div className="relative">
                    <Loader2 size={48} className="text-gold-500 animate-spin" />
                    <Sparkles className="absolute -top-2 -right-2 text-gold-400 animate-pulse" size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-display font-bold text-white">Mapping your journey...</p>
                    <p className="text-xs text-white/30 italic">Consulting with local experts and rangers.</p>
                  </div>
                </div>
              ) : (
                <article className="prose prose-invert prose-gold max-w-none prose-sm md:prose-base prose-headings:font-display prose-headings:font-bold prose-p:text-white/70 prose-li:text-white/70 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="markdown-body">
                    <Markdown>{itinerary || ''}</Markdown>
                  </div>
                </article>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-white px-2">Pilot Analysis</h3>
            <div className="glass rounded-[2rem] p-6 border border-white/5 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sustainability Score</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    className="h-full bg-emerald-500" 
                  />
                </div>
                <p className="text-[10px] text-emerald-500 font-bold">92% Eco-Friendly</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Travel Tempo</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-8 flex-1 rounded-md ${i <= 3 ? 'bg-gold-500/20 text-gold-500' : 'bg-white/5 text-white/10'} flex items-center justify-center text-[10px] font-bold`}>
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/40 italic">Balanced pace</p>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <button 
                  onClick={handleSaveAIPlanToTrips}
                  className="w-full py-4 bg-gold-500 text-forest-900 font-bold rounded-2xl text-xs shadow-xl shadow-gold-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Save to My Trips
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 text-white/60 font-bold rounded-2xl text-xs hover:bg-white/10 transition-all">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTrips = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">My Trips</h2>
          <p className="text-xs text-white/30">Manage your active and upcoming adventures.</p>
        </div>
        <button 
          onClick={() => setIsAddingTrip(true)}
          className="bg-gold-500 text-forest-900 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> New Trip Plan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="glass rounded-[2.5rem] p-8 border border-white/5 group hover:border-white/10 transition-all flex flex-wrap items-center gap-8">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
              {trip.emoji}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-lg font-bold text-white">{trip.name}</h4>
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${trip.status === 'Active' ? 'bg-emerald-500 text-white' : trip.status === 'Completed' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  {trip.status}
                </span>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">ID: {trip.id} • {trip.duration} • {trip.people} People</p>
            </div>
            
            <div className="w-48 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Progress</span>
                <span className="text-[10px] font-bold text-gold-400">{trip.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold-500" style={{ width: `${trip.progress}%` }} />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setEditingTrip(trip)}
                className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all" 
                title="Edit Trip"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => handleDeleteTrip(trip.id)}
                className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all" 
                title="Cancel Trip"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {trips.length === 0 && (
          <div className="glass rounded-[2rem] p-12 border border-white/5 text-center">
            <Compass size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-sm text-white/30 italic">No trips planned yet. Start your journey today!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTickets = () => {
    const activeSearchKey = (ticketSearch || voiceSearchQuery || '').toLowerCase();
    const filteredBookings = managedBookings.filter(b => 
      b.itemName.toLowerCase().includes(activeSearchKey) || 
      b.id.toLowerCase().includes(activeSearchKey) ||
      (b.notes || '').toLowerCase().includes(activeSearchKey)
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center px-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-bold text-white">Digital Tickets</h2>
            {voiceSearchQuery && (
              <p className="text-[10px] text-gold-400 font-bold uppercase animate-pulse">Filtered by voice command: "{voiceSearchQuery}"</p>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder="Search tickets..." 
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking, idx) => {
          const isNear = isNearEvent(booking.date, booking.time);
          return (
            <div 
              key={idx} 
              className={`glass rounded-[2.5rem] p-6 border relative overflow-hidden group transition-all duration-300 flex flex-col justify-between ${
                isNear 
                  ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)] bg-gradient-to-b from-forest-900/50 via-forest-950 to-amber-950/10' 
                  : 'border-white/5'
              }`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Ticket size={100} />
              </div>

              {isNear && (
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[pulse_1.5s_infinite] opacity-80" />
              )}

              <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl relative">
                      {booking.itemEmoji}
                      {isNear && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-forest-950 flex items-center justify-center text-[7px] font-black text-white">!</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{booking.itemName}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                        {booking.date}
                        {isNear && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[6.5px] font-bold uppercase tracking-wide animate-pulse">
                            ⚠️ within 24h
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display font-bold text-gold-400">${booking.price}</p>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter">Paid Full</p>
                  </div>
                </div>

                {/* Traveler & Payment Contact Details */}
                <div className="py-2.5 my-2 border-y border-white/5 space-y-1 text-[9px] uppercase font-bold tracking-wider text-white/30">
                  <div className="flex justify-between items-center">
                    <span>Email:</span>
                    <span className="text-white font-mono lowercase">{booking.email}</span>
                  </div>
                  {booking.phone && (
                    <div className="flex justify-between items-center">
                      <span>Phone:</span>
                      <span className="text-white font-mono">{booking.phone}</span>
                    </div>
                  )}
                  {booking.paymentMethod && (
                    <div className="flex justify-between items-center">
                      <span>Payment Method:</span>
                      <span className="text-gold-400 font-mono text-[8px] tracking-normal">{booking.paymentMethod}</span>
                    </div>
                  )}
                </div>
              
                <div className="mt-auto flex justify-between items-end">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Entry Code</p>
                     <p className="text-sm font-mono font-bold text-white tracking-[0.2em]">{booking.id}</p>
                  </div>
                  <div className="flex gap-2">
                     <button 
                      onClick={() => setEditingBooking(booking)}
                      className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-gold-500 transition-all"
                    ><Edit size={16} /></button>
                    <button onClick={() => setSelectedQRBooking(booking)} className="px-4 py-2 bg-gold-500 text-forest-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer">View QR</button>
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 bg-white/5 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredBookings.length === 0 && (
          <div className="col-span-full glass rounded-[2rem] p-12 border border-white/5 text-center">
            <Ticket size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-sm text-white/30 italic animate-pulse">No tickets match your search parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

  const renderWishlist = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-display font-bold text-white">Saved Collections</h2>
        <div className="flex gap-2">
           <button className="p-3 glass rounded-xl text-white/40 hover:text-white transition-all"><Filter size={18} /></button>
           <button className="p-3 glass rounded-xl text-white/40 hover:text-white transition-all"><Plus size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Volcanoes National Park', cat: 'Adventure', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801', price: '$1,500' },
          { name: 'Akagera Elephant Lodge', cat: 'Lodge', img: 'https://images.unsplash.com/photo-1540959733332-e94e270b6598', price: '$450/night' },
          { name: 'Kigali Cultural Village', cat: 'Culture', img: 'https://images.unsplash.com/photo-1542113300-474be6f89073', price: 'Free' },
        ].map((item, i) => (
          <div key={i} className="group relative glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all cursor-pointer aspect-square">
            <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-linear-to-t from-forest-950 via-forest-950/20 to-transparent" />
            <button className="absolute top-4 right-4 p-3 glass rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl">
              <Heart size={16} fill="currentColor" />
            </button>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.3em] mb-1">{item.cat}</p>
              <h4 className="text-xl font-display font-bold text-white mb-2 leading-tight">{item.name}</h4>
              <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                <span className="text-sm font-bold text-white/70">{item.price}</span>
                <button className="text-[10px] font-black text-gold-500 uppercase tracking-widest flex items-center gap-2">Book Now <ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-display font-bold text-white">Traveler Community</h2>
        <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all border border-white/5">Post a Tip</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-[2rem] p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6">Forums</h3>
            <div className="space-y-4">
              {['Gorilla Trekking', 'Kigali Dining', 'Visa Tips', 'Transport Tips'].map(forum => (
                <button key={forum} className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-gold-400 hover:bg-gold-500/10 transition-all">
                  {forum} <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           {[
             { user: 'Elena P.', avatar: 'EP', date: '4h ago', text: 'Just finished the canopy walk in Nyungwe. Pro tip: Arrive as early as possible (6 AM) for the best mist photography!', tags: ['Nyungwe', 'Photography'], likes: 24, comments: 5 },
             { user: 'Liam W.', avatar: 'LW', date: '1d ago', text: 'Has anyone tried the express boat from Rubavu to Karongi lately? Looking for schedule updates.', tags: ['Lake Kivu', 'Transport'], likes: 12, comments: 18 },
           ].map((post, i) => (
             <div key={i} className="glass rounded-[2.5rem] p-8 border border-white/5 hover:border-white/10 transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 font-bold border border-gold-400/20">{post.avatar}</div>
                   <div>
                     <p className="text-sm font-bold text-white">{post.user}</p>
                     <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">{post.date}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   {post.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-white/40 uppercase tracking-tighter">#{tag}</span>
                   ))}
                 </div>
               </div>
               <p className="text-sm text-white/70 leading-relaxed mb-6">"{post.text}"</p>
               <div className="flex gap-6 border-t border-white/5 pt-6">
                 <button className="flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-red-400 transition-colors uppercase tracking-widest">
                   <Heart size={14} /> {post.likes} Likes
                 </button>
                 <button className="flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-gold-400 transition-colors uppercase tracking-widest">
                   <MessageSquare size={14} /> {post.comments} Comments
                 </button>
                 <button className="ml-auto text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest">Report</button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-display font-bold text-white">Billing & Payments</h2>
        <button className="flex items-center gap-2 text-gold-500 font-bold text-sm hover:underline">
          <FileText size={18} /> Export History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-[2rem] p-8 border border-white/5">
             <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Payment History</h3>
             <div className="space-y-2">
                {[
                  { desc: 'Volcanoes Permit #102', date: 'May 10, 2026', amount: '-$1,500.00', status: 'Completed', icon: CheckCircle },
                  { desc: 'Kivu Lakeshore Deposit', date: 'May 08, 2026', amount: '-$85.50', status: 'Completed', icon: CheckCircle },
                  { desc: 'Platform Refund #042', date: 'May 05, 2026', amount: '+$24.00', status: 'Refunded', icon: RefreshCw },
                  { desc: 'Airport Pickup Slot', date: 'May 01, 2026', amount: '-$45.00', status: 'Failed', icon: XCircle },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-white/5 ${row.status === 'Completed' ? 'text-emerald-400' : row.status === 'Refunded' ? 'text-blue-400' : 'text-red-400'}`}>
                        <row.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{row.desc}</p>
                        <p className="text-[10px] text-white/30">{row.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${row.amount.startsWith('-') ? 'text-white' : 'text-emerald-400'}`}>{row.amount}</p>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter">{row.status}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden bg-radial-at-br from-gold-500/10 to-transparent">
             <div className="relative z-10">
               <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">Active Wallet</h3>
               <p className="text-3xl font-display font-bold text-white mb-2">$424.20<span className="text-xs text-white/30 ml-2 font-black uppercase tracking-widest">Credit</span></p>
               <p className="text-[10px] text-white/40 mb-10">Linked to visa ending in **4242</p>
               <div className="flex gap-3">
                 <button className="flex-1 py-4 bg-gold-500 text-forest-900 rounded-2xl font-bold text-xs shadow-xl shadow-gold-500/10 hover:scale-105 transition-all">Top Up</button>
                 <button className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all"><Settings size={18} /></button>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderAssistance = () => {
    const renderCardContainer = () => (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageSquare, title: 'Support Ticket', desc: 'Submit a detailed request for our team.', action: 'Open Form', onClick: () => setShowTicketForm(true) },
            { icon: LifeBuoy, title: 'FAQ Hub', desc: 'Instant answers to common questions.', action: 'Browse FAQs', onClick: () => {} },
            { icon: FileText, title: 'Travel Guides', desc: 'Cultural etiquette and travel laws.', action: 'Read More', onClick: () => {} },
            { icon: ShieldCheck, title: 'Contact Us', desc: 'Reach our team directly for help.', action: 'Open Contact Form', onClick: () => setShowContactForm(true) },
          ].map((item, i) => (
            <div key={i} onClick={item.onClick} className="glass rounded-[2rem] p-8 border border-white/5 group hover:border-gold-500/20 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-gold-500 group-hover:scale-110 group-hover:bg-gold-500/10 transition-all">
                <item.icon size={24} />
              </div>
              <h4 className="text-white font-bold mb-2">{item.title}</h4>
              <p className="text-[11px] text-white/40 leading-relaxed mb-6 italic">"{item.desc}"</p>
              <button className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-gold-500 transition-colors uppercase">{item.action}</button>
            </div>
          ))}
        </div>

        <div className="glass rounded-[2.5rem] p-10 border border-white/5 text-center max-w-2xl mx-auto">
           <LifeBuoy size={40} className="mx-auto text-gold-500/50 mb-6" />
           <h3 className="text-xl font-display font-bold text-white mb-4">Have a specific question?</h3>
           <p className="text-white/40 text-sm mb-10 leading-relaxed italic">"Our mission is to ensure your Rwandan experience is seamless, safe, and soulful. Don't hesitate to reach out for any clarity."</p>
           <button 
            onClick={() => setShowTicketForm(true)}
            className="bg-gold-500 text-forest-900 px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-gold-500/20 hover:scale-105 transition-all"
           >
             Open Support Ticket
           </button>
        </div>
      </>
    );

    const renderContactFormView = () => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {contactFormStatus === 'success' ? (
          <div className="glass rounded-[3rem] p-12 border border-white/5 text-center py-24">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
              <Check className="text-emerald-500" size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">Message Sent</h3>
            <p className="text-white/40 text-sm italic">"Thank you for reaching out. We've received your message and will respond shortly via email."</p>
          </div>
        ) : (
          <div className="glass rounded-[3rem] p-10 border border-white/5">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Full Name</label>
                  <input 
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Subject</label>
                <input 
                  name="subject"
                  required
                  placeholder="What is this regarding?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Message</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help you today?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all resize-none"
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="submit"
                  disabled={contactFormStatus === 'submitting'}
                  className="flex-1 bg-gold-500 text-forest-900 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {contactFormStatus === 'submitting' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white/40 font-black text-sm uppercase tracking-widest rounded-[2rem] hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-display font-bold text-white">
            {showTicketForm ? 'Submit Support Ticket' : showContactForm ? 'Contact Support' : 'Help & Assistance'}
          </h2>
          {(showTicketForm || showContactForm) ? (
            <button 
              onClick={() => { setShowTicketForm(false); setShowContactForm(false); }}
              className="text-xs font-bold text-white/40 hover:text-white transition-colors"
            >
              Go Back
            </button>
          ) : (
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Support Live</span>
          )}
        </div>

        {showTicketForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {ticketFormStatus === 'success' ? (
              <div className="glass rounded-[3rem] p-12 border border-white/5 text-center py-24">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
                  <Check className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Ticket Submitted</h3>
                <p className="text-white/40 text-sm">Your request (Ref: #SR-{Math.floor(Math.random() * 9000) + 1000}) has been received. A travel ranger will contact you shortly.</p>
              </div>
            ) : (
              <div className="glass rounded-[3rem] p-10 border border-white/5">
                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Subject</label>
                      <input 
                        name="subject"
                        required
                        placeholder="Brief title of the issue"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Priority</label>
                      <select 
                        name="priority"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all appearance-none"
                      >
                        <option value="Low" className="bg-forest-900">Low - Observation</option>
                        <option value="Medium" className="bg-forest-900" selected>Medium - Assistance Needed</option>
                        <option value="High" className="bg-forest-900">High - Urgent Issue</option>
                        <option value="Critical" className="bg-forest-900">Critical - Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Description</label>
                    <textarea 
                      name="description"
                      required
                      rows={5}
                      placeholder="Provide details about your inquiry..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 ml-1">Attachments</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center text-center ${
                        dragActive ? 'border-gold-500 bg-gold-500/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                      }`}
                    >
                      <Upload className={`mb-4 transition-colors ${dragActive ? 'text-gold-500' : 'text-white/20'}`} size={32} />
                      <p className="text-xs text-white/40 mb-1">Drag and drop files here, or <label className="text-gold-500 cursor-pointer hover:underline"><input type="file" className="hidden" multiple onChange={handleFileChange} />click to browse</label></p>
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Max file size: 10MB</p>
                    </div>

                    {attachedFiles.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {attachedFiles.map((file, idx) => (
                          <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between group">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Paperclip size={14} className="text-gold-500 shrink-0" />
                              <span className="text-[10px] text-white/60 truncate font-bold">{file.name}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="p-1 text-white/20 hover:text-red-400 transition-colors"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="submit"
                      disabled={ticketFormStatus === 'submitting'}
                      className="flex-1 bg-gold-500 text-forest-900 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {ticketFormStatus === 'submitting' ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Processing...
                        </>
                      ) : (
                        'Transmit Ticket'
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowTicketForm(false)}
                      className="px-10 py-5 bg-white/5 border border-white/10 text-white/40 font-black text-sm uppercase tracking-widest rounded-[2rem] hover:bg-white/10 hover:text-white transition-all"
                    >
                      Discard
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        ) : showContactForm ? (
          renderContactFormView()
        ) : (
          renderCardContainer()
        )}
      </div>
    );
  };

  const renderPreferences = () => (
    <form onSubmit={handleUpdateProfileSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Account Profile</h3>
            <p className="text-xs text-white/30">Update your traveler details, credentials, and bio.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gold-400/10 flex items-center justify-center text-gold-400 font-bold border-2 border-dashed border-gold-400/20 shrink-0 overflow-hidden">
                {profileAvatar ? <img src={profileAvatar} className="w-full h-full object-cover" /> : <span className="text-2xl">{profileName ? profileName[0].toUpperCase() : 'U'}</span>}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-white">Select Traveler Avatar Profile Picture</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
                  ].map((url, i) => (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => setProfileAvatar(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${profileAvatar === url ? 'border-gold-500 scale-105' : 'border-transparent hover:border-white/20'}`}
                    >
                      <img src={url} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setProfileAvatar('')}
                    className="px-2.5 h-10 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-white"
                  >
                    Clear Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)} 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" 
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profileEmail} 
                    onChange={(e) => setProfileEmail(e.target.value)} 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ml-1">Account Password</label>
                  <input 
                    type="password" 
                    value={profilePassword} 
                    onChange={(e) => setProfilePassword(e.target.value)} 
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 font-sans tracking-widest" 
                  />
               </div>
            </div>

            <div>
               <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ml-1">Travel Bio</label>
               <textarea 
                 rows={3} 
                 value={profileBio} 
                 onChange={(e) => setProfileBio(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 resize-none" 
               />
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Experiences & Locale</h3>
            <p className="text-xs text-white/30">Customize your app interface and alerts.</p>
          </div>

          <div className="space-y-4">
             {[
               { icon: Bell, title: 'Push Notifications', desc: 'Booking updates and chat alerts.', active: pushNotif, onClick: () => setPushNotif(!pushNotif) },
               { icon: Globe, title: 'Language Preferences', desc: 'App interface language.', value: 'English (US)' },
               { icon: Languages, title: 'Currency', desc: 'Display prices in your currency.', value: 'USD ($)' },
               { icon: ShieldCheck, title: 'Privacy Mode', desc: 'Hide your profile from forums.', active: privacyMode, onClick: () => setPrivacyMode(!privacyMode) },
             ].map((opt, i) => (
                <div key={i} className="flex justify-between items-center p-6 glass rounded-3xl border border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl text-gold-500"><opt.icon size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5">{opt.title}</p>
                        <p className="text-[10px] text-white/30">{opt.desc}</p>
                      </div>
                   </div>
                   {opt.active !== undefined ? (
                     <button 
                       type="button" 
                       onClick={opt.onClick} 
                       className={`w-12 h-6 rounded-full relative transition-all ${opt.active ? 'bg-gold-500' : 'bg-white/10'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${opt.active ? 'left-7' : 'left-1'}`} />
                     </button>
                   ) : (
                     <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">{opt.value}</span>
                   )}
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="flex pt-12 border-t border-white/5">
        <button type="submit" className="bg-gold-500 text-forest-900 px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-gold-500/20 active:scale-95">
          Secure Preferences
        </button>
      </div>
    </form>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'activities': return renderActivitiesAndGoals();
      case 'planner': return renderPlanner();
      case 'trips': return renderTrips();
      case 'bookings': return renderTickets();
      case 'wishlist': return renderWishlist();
      case 'reviews': return renderCommunity();
      case 'payments': return renderPayments();
      case 'support': return renderAssistance();
      case 'settings': return renderPreferences();
      case 'overview':
      default:
        return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[80vh] pt-4 px-4 md:px-0">
        {/* Elegant Background Slideshow */}
        <div className="absolute inset-0 -top-12 -mx-10 rounded-[5rem] overflow-hidden -z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.25 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 8, ease: "linear" }}
              onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 6000)}
              className="absolute inset-0"
            >
              <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
            </motion.div>
          </AnimatePresence>
        </div>

        {isAdmin && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 ml-4">
              <ShieldCheck className="text-emerald-500" size={20} />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Platform Integrity Mode Active</span>
            </div>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">Export User Data</button>
          </div>
        )}
        {/* Welcome Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-gold-500/20 transition-all" />
            <span className="text-[10px] font-black text-gold-500 uppercase tracking-[0.3em] mb-4 block">Muraho!</span>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Discover the Soul of Rwanda</h2>
            <p className="text-white/50 text-sm max-w-md leading-relaxed mb-6">
              From the mist-covered peaks of Virunga to the vibrant streets of Kigali, your next adventure is waiting to be written.
            </p>
            <button className="flex items-center gap-2 bg-gold-500 text-forest-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20">
              Start Planning <ArrowRight size={16} />
            </button>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Local Weather</span>
                <CloudRain className="text-gold-500" size={20} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-display font-bold text-white">24°C</span>
                <span className="text-sm text-white/40 mb-1">Kigali, RW</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/30">Humidity</span>
                <span className="text-white/60">65%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/30">Chance of Rain</span>
                <span className="text-white/60">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Booking Advisory & Real-time Reminders Timeline */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden bg-radial-at-b from-amber-500/5 to-transparent">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Clock size={120} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /> Real-Time Smart Reminders
              </span>
              <h3 className="text-xl font-display font-bold text-white">Your Upcoming Trip Advisory</h3>
            </div>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider font-mono bg-white/5 px-3 py-1.5 rounded-xl">3 ACTIVE TIMELINE ALERTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'TREK-1',
                title: '🦍 Volcanoes National Park (Bisoke Trek)',
                status: 'Gear Check Overdue',
                time: 'Tomorrow, August 25 - 06:30 AM',
                alert: 'High rain predicted. Ensure double layer gaiters, waterproof boots, and long trousers are secure.',
                priority: 'Critical'
              },
              {
                id: 'STAY-2',
                title: '🏨 One&Only Nyungwe House Stay',
                status: 'Automated Shuttle Assigned',
                time: 'August 27 at 02:00 PM Check-In',
                alert: 'Driver Jean-Claude leaving Kigali city square at 07:30 AM sharp. Please be in primary lobby.',
                priority: 'High'
              },
              {
                id: 'TOUR-3',
                title: '🛶 Lake Kivu Boat Expedition',
                status: 'Payment Escrow Balanced',
                time: 'September 1 at 10:00 AM',
                alert: 'Acoustic life vest and digital authorization tickets have been synced. Secondary crew ready.',
                priority: 'Optimal'
              }
            ].map((adv, idx) => (
              <div key={idx} className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/10 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono text-white/40 tracking-wider">ID: {adv.id}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      adv.priority === 'Critical' ? 'bg-red-500/10 text-red-400 animate-pulse' :
                      adv.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {adv.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white mb-2 leading-relaxed">{adv.title}</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed italic mb-4">"{adv.alert}"</p>
                </div>
                <div className="flex items-center gap-1.5 pt-3 border-t border-white/5 text-[9px] text-white/30 font-black">
                  <Calendar size={10} className="text-gold-400" />
                  <span>{adv.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats & Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Saved', value: '12', sub: 'Places', icon: Heart, color: 'text-red-400' },
              { label: 'Upcoming', value: '2', sub: 'Confirmed', icon: Calendar, color: 'text-blue-400' },
              { label: 'Spent', value: '$1,240', sub: 'Total', icon: CreditCard, color: 'text-green-400' },
              { label: 'Days Left', value: '45', sub: 'To Journey', icon: Timer, color: 'text-gold-400' },
            ].map((stat, idx) => (
              <div key={idx} className="glass rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <stat.icon size={18} className={stat.color} />
                </div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-display font-bold text-white">{stat.value}</span>
                  <span className="text-[10px] font-bold text-white/30">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="glass rounded-3xl p-6 border border-white/5 bg-emerald-500/5">
             <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <ShieldCheck size={14} /> Readiness
             </h4>
             <div className="space-y-3">
                {[
                  { label: 'Digital Visa', done: true },
                  { label: 'Yellow Fever Cert', done: true },
                  { label: 'Travel Insurance', done: false },
                  { label: 'Hotel Booked', done: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.done ? <CheckCircle size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-white/20" />}
                    <span className={`text-[10px] font-bold ${item.done ? 'text-white/60' : 'text-white/20'}`}>{item.label}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-display text-xl font-bold text-white">My Bookings</h3>
              <button 
                onClick={() => onTabChange?.('bookings')}
                className="text-[10px] font-black text-gold-500 uppercase tracking-widest hover:text-gold-400 transition-colors"
              >
                Manage All Bookings
              </button>
            </div>
            <div className="space-y-4">
              {bookings.length > 0 ? bookings.slice(0, 3).map((booking, idx) => (
                <div key={idx} className="glass rounded-3xl p-4 border border-white/5 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">{booking.itemEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{booking.itemName}</h4>
                    <p className="text-[10px] text-white/30 truncate">{booking.date} • {booking.partySize} People</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gold-400">${booking.price}</p>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter">Confirmed</span>
                  </div>
                </div>
              )) : (
                <div className="glass rounded-3xl p-12 border border-white/5 text-center">
                  <Compass size={40} className="mx-auto text-white/10 mb-4" />
                  <p className="text-sm text-white/30 italic">"Adventure is calling... You haven't booked yet."</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-display text-xl font-bold text-white">Saved Destinations</h3>
              <button 
                onClick={() => onTabChange?.('wishlist')}
                className="text-[10px] font-black text-gold-500 uppercase tracking-widest text-[#D4AF37]"
              >
                Manage
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Volcanoes National Park', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801' },
                { name: 'Lake Kivu Shoreline', img: 'https://images.unsplash.com/photo-1542133800-474be6f89073' },
              ].map((dest, idx) => (
                <div key={idx} className="group relative rounded-3xl overflow-hidden aspect-video border border-white/5">
                  <img src={dest.img} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h4 className="text-xs font-bold text-white truncate">{dest.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      {getContent()}
      
      <AnimatePresence>
        {isAddingTrip && renderTripModal(null, true)}
        {editingTrip && renderTripModal(editingTrip)}
        {editingBooking && renderBookingModal(editingBooking)}
        {selectedQRBooking && renderQRModal(selectedQRBooking)}
      </AnimatePresence>
    </div>
  );
}
