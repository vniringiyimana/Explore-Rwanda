import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, User as UserIcon, Briefcase, MapPin, Star, CheckCircle, Mail, ExternalLink, ShieldCheck, CreditCard, Smartphone, Clock, ChevronRight, Zap, Coffee, Plane, Minus, FileText } from 'lucide-react';
import { User, UserRole, Hotel, Review } from '../types';
import { DESTINATIONS, HOTELS, EXPERIENCES, TRANSPORT_OPTIONS, EVENTS, UI_TRANSLATIONS, MASTER_EMAIL } from '../constants';
import { dbService } from '../services/db';

import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

interface BookingDetails {
  email: string;
  phone?: string;
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
  travelerName?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'auth' | 'booking' | 'hotel-details' | null;
  bookingData?: {
    category: 'destination' | 'hotel' | 'experience' | 'transport' | 'event';
    id: number;
  } | null;
  hotelId?: number | null;
  user?: User | null;
  onConfirm: (user: User, msg: string) => void;
  onCreateBooking: (booking: any) => void;
  onOpenAuth?: () => void;
  onBookFromDetails?: (id: number) => void;
  lang: string;
}

export default function Modals({ isOpen, onClose, type, bookingData, hotelId, user, onConfirm, onCreateBooking, onOpenAuth, onBookFromDetails, lang }: ModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const [roleSelection, setRoleSelection] = useState<UserRole>(UserRole.TOURIST);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Custom visual verification token simulation states
  const [verificationPendingUser, setVerificationPendingUser] = useState<any | null>(null);
  const [verificationPendingCode, setVerificationPendingCode] = useState<string>('');
  const [enteredVerificationCode, setEnteredVerificationCode] = useState<string>('');
  const [verificationPendingMsg, setVerificationPendingMsg] = useState<string>('');

  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = (formData.get('name') as string) || email.split('@')[0];

    // Basic Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please enter a valid email address.");
      setAuthLoading(false);
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      setAuthLoading(false);
      return;
    }

    if (authMode === 'register' && password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      setAuthLoading(false);
      return;
    }

    // Role Restriction Logic
    const isMaster = email.toLowerCase() === MASTER_EMAIL.toLowerCase();
    
    if (roleSelection === UserRole.ADMIN) {
      if (!isMaster) {
        setAuthError(`Access Denied. The ADMIN role is strictly reserved for the primary owner (${MASTER_EMAIL}).`);
        setAuthLoading(false);
        return;
      }
    }

    if (!auth) {
      // Offline Local Sandbox Auth Fallback
      try {
        if (authMode === 'register') {
          const dbState = dbService.get();
          const existingUser = dbState.users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (existingUser) {
            setAuthError("An account with this email already exists locally.");
            setAuthLoading(false);
            return;
          }

          // Generate dynamic activation registration token
          const computedToken = Math.floor(100000 + Math.random() * 900000).toString();
          const newUser = dbService.addUser({
            email: email,
            name: name,
            role: roleSelection,
            password: password,
            emailVerified: false, // Starts as false until token is keyed in
            isActive: true
          });

          setVerificationPendingUser(newUser);
          setVerificationPendingCode(computedToken);
          setVerificationPendingMsg(`Your safe Explorer account was initiated. A 6-digit verification security token has been wired to the email coordinate: ${email}`);
          window.dispatchEvent(new CustomEvent('app-toast', { detail: `✉️ Activation token sent to ${email}!` }));
        } else {
          // Login
          const dbState = dbService.get();
          let existingUser = dbState.users.find(u => u.email.toLowerCase() === email.toLowerCase());

          if (!existingUser) {
            // Auto register a new user if trying to connect
            const computedToken = Math.floor(100000 + Math.random() * 900000).toString();
            existingUser = dbService.addUser({
              email: email,
              name: name || email.split('@')[0],
              role: roleSelection,
              password: password,
              emailVerified: false,
              isActive: true
            });
            setVerificationPendingUser(existingUser);
            setVerificationPendingCode(computedToken);
            setVerificationPendingMsg(`Auto-profile registration triggered. Activation token dispatched to email: ${email}`);
            window.dispatchEvent(new CustomEvent('app-toast', { detail: `✉️ Verification token routed!` }));
            setAuthLoading(false);
            return;
          }

          if (existingUser.isActive === false) {
            setAuthError("This user account is currently set to Inactive. Please contact the platform administrators.");
            setAuthLoading(false);
            return;
          }

          // Protect access to unverified emails
          if (!existingUser.emailVerified) {
            const computedToken = Math.floor(100000 + Math.random() * 900000).toString();
            setVerificationPendingUser(existingUser);
            setVerificationPendingCode(computedToken);
            setVerificationPendingMsg(`Profile verification required before entry. Secure token sent again to: ${existingUser.email}`);
            window.dispatchEvent(new CustomEvent('app-toast', { detail: `✉️ Resent Token to ${existingUser.email}` }));
            setAuthLoading(false);
            return;
          }

          onConfirm(existingUser, `Welcome to the Local Sandbox, ${existingUser.name}! 🎉`);
        }
      } catch (e: any) {
        console.error("Sandbox auth error:", e);
        setAuthError(e.message || "Sandbox authentication failed.");
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    try {
      if (authMode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Update profile with name
        await updateProfile(firebaseUser, { displayName: name });

        // Send email verification
        try {
          await sendEmailVerification(firebaseUser);
        } catch (vErr) {
          console.error("Verification email failed to send:", vErr);
        }

        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: name,
          role: roleSelection,
          emailVerified: false,
          isActive: true
        };

        // Persist user in mock DB
        dbService.addUser({
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          password: password,
          emailVerified: false,
          isActive: true
        });

        const computedToken = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationPendingUser(newUser);
        setVerificationPendingCode(computedToken);
        setVerificationPendingMsg(`A secure activation token has been dispatched to your Firebase account email: ${email}`);
        window.dispatchEvent(new CustomEvent('app-toast', { detail: `✉️ Token sent to ${email}!` }));
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Sync with mock DB
        const dbState = dbService.get();
        const existingUser = dbState.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser && existingUser.isActive === false) {
          setAuthError("This user account is currently set to Inactive. Please contact the platform administrators.");
          setAuthLoading(false);
          return;
        }

        if (!firebaseUser.emailVerified) {
          const computedToken = Math.floor(100000 + Math.random() * 900000).toString();
          const targetUserForVerification = existingUser || {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName || email.split('@')[0],
            role: UserRole.TOURIST,
            emailVerified: false,
            isActive: true
          };
          setVerificationPendingUser(targetUserForVerification);
          setVerificationPendingCode(computedToken);
          setVerificationPendingMsg(`Verify your sign-in details. Secure connection token delivered to: ${firebaseUser.email}`);
          setAuthLoading(false);
          return;
        }

        const loggedUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || (existingUser?.name) || email.split('@')[0],
          role: existingUser?.role || UserRole.TOURIST,
          emailVerified: true,
          isActive: existingUser?.isActive ?? true
        };

        // Update verification status in DB if needed
        if (existingUser && !existingUser.emailVerified) {
          dbService.updateUser(existingUser.id, { emailVerified: true });
        } else if (!existingUser) {
          // If user exists in Firebase but not in our mock DB (e.g. from scratch)
          dbService.addUser({
            email: loggedUser.email,
            name: loggedUser.name,
            role: loggedUser.role,
            emailVerified: true,
            isActive: true
          });
        }

        onConfirm(loggedUser, `Welcome back, ${loggedUser.name}! 🎉`);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError(error.message || "An error occurred during authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!details || !bookingData) return;
    
    let data: any = null;
    if (bookingData.category === 'hotel') data = HOTELS.find(h => h.id === bookingData.id);
    if (bookingData.category === 'experience') data = EXPERIENCES.find(e => e.id === bookingData.id);
    if (bookingData.category === 'destination') data = DESTINATIONS.find(d => d.id === bookingData.id);
    if (bookingData.category === 'transport') data = TRANSPORT_OPTIONS.find(t => t.id === bookingData.id);
    if (bookingData.category === 'event') data = EVENTS.find(ev => ev.id === bookingData.id);
    
    if (!data) return;

    // Format: YYYYMMDDTHHMMSSZ (UTC) - for simplicity using local time in this demo
    const cleanDate = details.date.replace(/-/g, '');
    const startTimeStr = details.time ? `${cleanDate}T${details.time.replace(':', '')}00` : `${cleanDate}T090000`;
    // End time 2 hours later
    const endHour = details.time ? (parseInt(details.time.split(':')[0]) + 2).toString().padStart(2, '0') : '11';
    const endTimeStr = details.time ? `${cleanDate}T${endHour}${details.time.split(':')[1]}00` : `${cleanDate}T110000`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${startTimeStr}`,
      `DTEND:${endTimeStr}`,
      `SUMMARY:Explore Rwanda - ${data.name}`,
      `DESCRIPTION:Booking ID: ${details.bookingId}\\nParty Size: ${details.partySize}\\nLocation: ${data.location}\\nNotes: ${details.notes || 'N/A'}`,
      `LOCATION:${data.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `RW-Booking-${details.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReportPDF = () => {
    if (!details || !bookingData) return;
    
    let data: any = null;
    if (bookingData.category === 'hotel') data = HOTELS.find(h => h.id === bookingData.id);
    if (bookingData.category === 'experience') data = EXPERIENCES.find(e => e.id === bookingData.id);
    if (bookingData.category === 'destination') data = DESTINATIONS.find(d => d.id === bookingData.id);
    if (bookingData.category === 'transport') data = TRANSPORT_OPTIONS.find(t => t.id === bookingData.id);
    if (bookingData.category === 'event') data = EVENTS.find(ev => ev.id === bookingData.id);
    
    if (!data) return;

    const parsePrice = (priceStr: string | number | undefined) => {
      if (typeof priceStr === 'number') return priceStr;
      if (!priceStr || priceStr === 'Free' || priceStr === 'Varies') return 0;
      return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    };

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
<< /Length 500 >>
stream
BT
/F1 18 Tf
50 780 Td
(OFFICIAL RWANDAHUB TRAVEL HUB REPORT & ACCESS PASS) Tj
/F1 12 Tf
0 -40 Td
(=======================================================) Tj
0 -25 Td
(Traveler Name: ${details.travelerName || user?.name || 'Authorized Guest'}) Tj
0 -25 Td
(Destination / Experience: ${data.name}) Tj
0 -25 Td
(Departure/Activity Date: ${details.date}) Tj
0 -25 Td
(Location / Where to Travel: ${data.location}) Tj
0 -25 Td
(Booking ID / Reference Code: ${details.bookingId}) Tj
0 -25 Td
(Party Group Size: ${details.partySize}) Tj
0 -25 Td
(Assigned Seat / Slot: ${details.seat || 'General Access'}) Tj
0 -25 Td
(Invoiced Price: USD ${parsePrice(data.price)}) Tj
0 -25 Td
(Payment Mechanism: ${details.paymentMethod}) Tj
0 -25 Td
(Verification Authority: ${user?.emailVerified ? 'ESTABLISHED' : 'TEMPORARY'}) Tj
0 -25 Td
(Report Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}) Tj
0 -40 Td
(SECURITY INSTRUCTIONS & FLIGHT PROTOCOL:) Tj
/F1 9 Tf
0 -20 Td
(1. Present this printed document or digital QR token at the check-in gate.) Tj
0 -15 Td
(2. Bring a valid national passport or biometric ID matching traveler name.) Tj
0 -15 Td
(3. Arrive strictly 45 minutes prior to departure times for safety briefings.) Tj
0 -30 Td
(Thank you for choosing Explore Rwanda Hub. Your adventure is secured under active escrow.) Tj
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
700
%%EOF`;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RwandaHub_Report_${details.bookingId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    window.dispatchEvent(new CustomEvent('app-toast', { detail: `📄 Travel report and documents generated for ${details.travelerName || 'Guest'}` }));
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
      setBookingLoading(false);
    }, 300);
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>, data: any) => {
    e.preventDefault();
    setBookingLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const travelerName = (formData.get('travelerName') as string) || user?.name || 'Guest Traveler';
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const partySize = formData.get('partySize') as string;
    const notes = formData.get('notes') as string;
    const momoNumber = formData.get('momoNumber') as string;
    const momoProvider = formData.get('momoProvider') as string;
    const cardNumber = formData.get('cardNumber') as string;
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
      phone,
      travelerName,
      price: parsePrice(data.price),
      insurance,
      date,
      time,
      partySize,
      seat: selectedSeat || undefined,
      notes,
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : momoProvider || 'MTN MoMo',
      momoNumber,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString()
    };

    setDetails({ 
      email, 
      phone,
      date, 
      time,
      partySize, 
      seat: selectedSeat || undefined,
      bookingId, 
      notes, 
      insurance,
      travelerName,
      paymentMethod: paymentMethod === 'card' 
        ? `Visa/Mastercard (•••• ${cardNumber?.slice(-4) || '4242'})` 
        : `${momoProvider || 'Mobile Money'} (${momoNumber})`
    });

    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      onCreateBooking(newBooking);
      setPaymentStep('confirmed');
      setBookingLoading(false);
      
      // Simulate email/SMS sending
      setEmailStatus('sending');
      setTimeout(() => setEmailStatus('sent'), 1500);
    }, 2500);
  };

  const renderAuth = () => (
    <div className="glass rounded-[3rem] w-full max-w-4xl mx-auto border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Side Image */}
      <div className="hidden md:block w-1/2 relative bg-forest-900 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1000" 
          alt="Rwanda Landscape" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-br from-forest-950/80 via-forest-900/40 to-transparent" />
        <div className="absolute inset-0 p-12 flex flex-col justify-end pointer-events-none">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-12 h-1 bg-gold-500 mb-6 rounded-full" />
            <h4 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
              Begin Your <br /> 
              <span className="text-gold-400">Rwandan Legacy</span>
            </h4>
            <p className="text-sm text-white/40 font-medium italic max-w-xs">
              "To travel is to discover that everyone is wrong about other countries."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Auth Content */}
      <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center bg-forest-900/50 backdrop-blur-xl">
        <div className="absolute top-8 right-8 flex items-center gap-2">
          <button 
            onClick={() => {/* Mock minimize effect */}} 
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/20 hover:text-white/60 active:scale-90"
            title="Minimize"
          >
            <Minus size={18}/>
          </button>
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-white/20 hover:text-red-400 active:scale-90"
            title="Cancel"
          >
            <X size={20}/>
          </button>
        </div>

        <div className="max-w-sm mx-auto w-full">
          {verificationPendingUser ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-left"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  <ShieldCheck size={12} className="text-emerald-500 animate-pulse" /> Verify Your Email
                </span>
                <h3 className="font-display text-2xl font-black mt-4 text-white">Security Verification</h3>
                <p className="text-xs text-white/50 leading-relaxed mt-2 italic">
                  "Before any other person accesses, verification ensures that messages successfully sync to your real communication address."
                </p>
              </div>

              {/* Security Banner / Email Token Push Simulator */}
              <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs space-y-2 select-text">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                  <Mail size={12} /> Secure Account Protection
                </div>
                <p className="text-[11px] text-white/70 italic leading-snug">
                  {verificationPendingMsg}
                </p>
                <div className="p-2.5 bg-forest-950/40 rounded-xl border border-white/5 flex items-center justify-between font-mono text-[11px] mt-1.5">
                  <span className="text-white/40 uppercase text-[9px]">Simulated Log Token:</span>
                  <span className="font-sans font-black tracking-widest text-gold-300 bg-gold-400/10 px-2 py-0.5 rounded border border-gold-500/20">{verificationPendingCode}</span>
                </div>
              </div>

              {/* Enter token form */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">6-Digit Email Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="------"
                  value={enteredVerificationCode}
                  onChange={(e) => setEnteredVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center text-xl font-mono font-black tracking-[0.5em] text-white placeholder-white/10 focus:outline-none focus:border-gold-500 transition-all focus:ring-1 focus:ring-gold-500/30"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400 font-bold bg-red-400/5 p-3 rounded-xl border border-red-500/10 text-center uppercase tracking-wide">
                  {authError}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (enteredVerificationCode === verificationPendingCode) {
                      // Mark verified!
                      dbService.updateUser(verificationPendingUser.id, { emailVerified: true });
                      const updatedUser = { ...verificationPendingUser, emailVerified: true };
                      onConfirm(updatedUser, `Security Token Accepted! Account successfully verified and protected. 🎉`);
                      setVerificationPendingUser(null);
                      setVerificationPendingCode('');
                      setEnteredVerificationCode('');
                    } else {
                      setAuthError("Incorrect verification token. Please double check the log token.");
                      setTimeout(() => setAuthError(null), 4000);
                    }
                  }}
                  className="w-full py-4.5 bg-linear-to-r from-emerald-500 to-emerald-400 text-forest-950 font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all text-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={14} /> Confirm & Activate Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset
                    setVerificationPendingUser(null);
                    setVerificationPendingCode('');
                    setEnteredVerificationCode('');
                    setAuthError(null);
                  }}
                  className="w-full py-4 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-[0.2em] rounded-2xl transition-all text-[10px]"
                >
                  Return to Signup / Signin
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h3 className="font-display text-3xl font-bold mb-2">Welcome Back</h3>
              <p className="text-sm text-white/30 mb-8 font-medium italic tracking-wide">"Every journey starts with a signature."</p>
            

            <div className="flex gap-1 mb-10 bg-white/5 rounded-2xl p-1.5 border border-white/5">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] rounded-xl transition-all ${authMode === 'login' ? 'bg-gold-500 text-forest-900 shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                SIGN IN
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] rounded-xl transition-all ${authMode === 'register' ? 'bg-gold-500 text-forest-900 shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                REGISTER
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center uppercase tracking-widest flex flex-col gap-2"
                >
                  <span>{authError}</span>
                  {authError.includes("verify") && (
                    <button 
                      type="button"
                      onClick={async () => {
                        if (auth.currentUser) {
                          await sendEmailVerification(auth.currentUser);
                          setAuthError("A new verification link has been sent to your email.");
                        }
                      }}
                      className="text-gold-400 hover:text-gold-300 underline mt-1"
                    >
                      Resend Verification Link
                    </button>
                  )}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                      <input name="name" type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all" />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Email</label>
                    <input name="email" type="email" required placeholder="explorer@world.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                    <input name="password" type="password" required placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all" />
                  </div>
                  {authMode === 'register' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Confirm Password</label>
                      <input name="confirmPassword" type="password" required placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all" />
                    </motion.div>
                  )}
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Identity Access</label>
                      <select 
                        value={roleSelection}
                        onChange={(e) => setRoleSelection(e.target.value as UserRole)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs text-white focus:outline-none focus:border-gold-400/50 appearance-none font-bold"
                      >
                        <option value={UserRole.TOURIST} className="bg-forest-900 text-sm py-2">Standard Explorer</option>
                        <option value={UserRole.ADMIN} className="bg-forest-900 text-sm py-2">Platform Administrator</option>
                        <option value={UserRole.OPERATOR} className="bg-forest-900 text-sm py-2">Business Partner</option>
                        <option value={UserRole.EDITOR} className="bg-forest-900 text-sm py-2">Content Editor</option>
                        <option value={UserRole.MODERATOR} className="bg-forest-900 text-sm py-2">Community Moderator</option>
                      </select>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="pt-4 flex flex-col gap-4">
                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full py-5 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-gold-500/30 transition-all text-[11px] active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                >
                  {authLoading ? 'ESTABLISHING CONNECTION...' : (authMode === 'login' ? 'SIGN IN — SECURE' : 'REGISTER & VERIFY')}
                </button>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">OR</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <button 
                  type="button"
                  onClick={handleClose}
                  className="w-full py-4 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-[0.2em] rounded-2xl transition-all text-[10px]"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </motion.div>
        )}
        </div>
      </div>
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

    const itemImage = data.gallery?.[0] || data.image || "https://images.unsplash.com/photo-1542137722061-efd1cbdf156c?auto=format&fit=crop&q=80&w=1000";
    const isImageOnLeft = ['hotel', 'destination', 'experience', 'event'].includes(bookingData.category);

    return (
      <div className={`glass rounded-[3rem] w-full max-w-4xl mx-auto border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col md:flex-row ${!isImageOnLeft ? 'md:flex-row-reverse' : ''} max-h-[90vh]`}>
        {/* Side Image */}
        <div className="md:w-1/2 h-48 md:h-auto relative overflow-hidden bg-forest-900 shrink-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0, x: isImageOnLeft ? -20 : 20 }}
            animate={{ scale: 1, opacity: 0.6, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={itemImage} 
            alt={data.name} 
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-br from-forest-950/80 via-forest-900/40 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-12 h-1 bg-gold-500 mb-6 rounded-full" />
              <div className="text-5xl mb-4 drop-shadow-2xl">{data.emoji}</div>
              <h4 className="font-display text-3xl font-bold text-white mb-2 leading-tight uppercase tracking-tight">
                {data.name}
              </h4>
              <div className="flex items-center gap-2 text-[10px] font-black text-gold-500 uppercase tracking-widest">
                <MapPin size={14} />
                {data.location}
              </div>
              {bookingData.category === 'event' && data.date && (
                <div className="mt-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  Scheduled: {data.date}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center bg-forest-900/50 backdrop-blur-xl overflow-y-auto custom-scrollbar">
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <button 
              onClick={() => {/* Mock minimize effect */}} 
              className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/20 hover:text-white/60 active:scale-90"
              title="Minimize"
            >
              <Minus size={18}/>
            </button>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-white/20 hover:text-red-400 active:scale-90"
              title="Cancel"
            >
              <X size={20}/>
            </button>
          </div>

          <div className="max-w-sm mx-auto w-full py-4">
            <motion.div
              initial={{ x: isImageOnLeft ? 20 : -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h3 className="font-display text-2xl font-bold mb-2">Secure Booking</h3>
              <p className="text-sm text-white/30 mb-8 font-medium italic">"Reserve your place in the heart of Africa."</p>

              <form onSubmit={(e) => handleBookingSubmit(e, data)} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Traveler Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      name="travelerName" 
                      type="text" 
                      required 
                      defaultValue={user?.name || ''}
                      placeholder="Jane Doe" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all font-bold" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Traveler Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        name="email" 
                        type="email" 
                        required 
                        defaultValue={user?.email || ''}
                        placeholder="your@email.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all font-bold" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Traveler Phone</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        name="phone" 
                        type="tel" 
                        required 
                        placeholder="+250 78X XXX XXX" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 transition-all font-bold font-mono" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Journey Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input name="date" type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50 transition-all font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">
                      {(bookingData.category === 'transport' || bookingData.category === 'event') ? 'Passengers' : 'Party Size'}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <select name="partySize" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50 appearance-none font-bold">
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50 transition-all font-mono font-bold" 
                      />
                    </div>
                  </motion.div>
                )}

                {bookingData.category === 'transport' && data.name.includes('Flight') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 ml-1">Select Your Seat</label>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="grid grid-cols-4 gap-2">
                        {['A', 'B', 'C', 'D'].map((row) => (
                          <React.Fragment key={row}>
                            {[1, 2, 3, 4, 5].slice(0, 4).map((num) => {
                              const seatId = `${row}${num}`;
                              const isSelected = selectedSeat === seatId;
                              const isTaken = ['A2', 'C4', 'B1'].includes(seatId);
                              
                              return (
                                <button
                                  key={seatId}
                                  type="button"
                                  disabled={isTaken}
                                  onClick={() => setSelectedSeat(isSelected ? null : seatId)}
                                  className={`
                                    aspect-square rounded-lg flex items-center justify-center text-[9px] font-black transition-all
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
                    </div>
                    {selectedSeat && (
                      <div className="mt-4 p-4 bg-gold-500/10 border border-gold-500/20 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">Selected Seat:</span>
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
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                    >
                      <CreditCard size={20} />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">Credit Card</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === 'momo' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                    >
                      <Smartphone size={20} />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">Mobile Money</span>
                    </button>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5 ml-1">Cardholder Name</label>
                        <input 
                          name="cardName" 
                          type="text" 
                          placeholder="Jean-Luc Rukundo" 
                          required 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-400/50 font-bold" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5 ml-1">Card Number</label>
                        <input 
                          name="cardNumber" 
                          type="text" 
                          maxLength={19}
                          placeholder="4000 1234 5678 9010" 
                          required 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-400/50 font-mono font-bold" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5 ml-1">Expiration</label>
                          <input 
                            name="cardExpiry" 
                            type="text" 
                            placeholder="MM/YY" 
                            maxLength={5}
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-400/50 font-mono font-bold" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5 ml-1">CVC Code</label>
                          <input 
                            name="cardCVV" 
                            type="password" 
                            maxLength={3}
                            placeholder="•••" 
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-400/50 font-mono font-bold" 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'momo' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5 ml-1">Network Provider</label>
                          <select 
                            name="momoProvider" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-gold-400/50 font-bold"
                          >
                            <option className="bg-forest-900" value="MTN MoMo">MTN MoMo 🟡</option>
                            <option className="bg-forest-900" value="Airtel Money">Airtel Money 🔴</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5 ml-1">Account Number</label>
                          <input 
                            name="momoNumber" 
                            type="tel" 
                            placeholder="078 XXX XXXX" 
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs font-mono text-white focus:outline-none focus:border-gold-400/50" 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Special Requests (Optional)</label>
                  <textarea 
                    name="notes"
                    placeholder="Dietary requirements, pickup address, etc..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-[11px] text-white focus:outline-none focus:border-gold-400/50 resize-none h-20 placeholder:italic transition-all shadow-inner"
                  ></textarea>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <button 
                    type="submit" 
                    disabled={bookingLoading}
                    className="w-full py-5 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-gold-500/30 transition-all text-[11px] active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                  >
                    {bookingLoading ? 'INITIATING BOOKING...' : `COMPLETE BOOKING — ${data.price}`}
                  </button>
                  <button 
                    type="button"
                    onClick={handleClose}
                    className="w-full py-4 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-[0.2em] rounded-2xl transition-all text-[10px]"
                  >
                    DISCARD
                  </button>
                  <p className="text-center text-[9px] text-white/10 font-bold uppercase tracking-[0.25em] pt-2">Secure 256-bit Encrypted Transaction</p>
                </div>
              </form>
            </motion.div>
          </div>
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
                    { label: 'Traveler Phone', value: details.phone || 'N/A', icon: Smartphone, color: 'text-gold-400 font-mono' },
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
                <button 
                  onClick={handleDownloadReportPDF}
                  className="w-full py-4 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 font-bold rounded-2xl transition-all text-sm active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Download Travel Report & Pass
                </button>
                <button 
                  onClick={handleAddToCalendar}
                  className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold rounded-2xl transition-all text-sm active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Add to Calendar
                </button>
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
                    <div className="flex justify-between"><span className="text-forest-400 text-xs">Guest Email:</span> <span className="font-bold font-mono text-[11px]">{details.email}</span></div>
                    {details.phone && <div className="flex justify-between"><span className="text-forest-400 text-xs">Guest Phone:</span> <span className="font-bold font-mono text-[11px]">{details.phone}</span></div>}
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

  const renderHotelDetails = () => {
    const hotel = HOTELS.find(h => h.id === hotelId);
    if (!hotel) return null;

    return (
      <div className="glass rounded-[3rem] p-0 w-full max-w-4xl mx-auto border border-white/15 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        <button onClick={handleClose} className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white z-50"><X size={20}/></button>
        
        {/* Gallery / Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-forest-800">
           {hotel.gallery && hotel.gallery.length > 0 ? (
             <img 
               src={hotel.gallery[0]} 
               alt={hotel.name} 
               className="w-full h-full object-cover" 
               loading="lazy"
               referrerPolicy="no-referrer"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-6xl">{hotel.emoji}</div>
           )}
           <div className="absolute inset-0 bg-linear-to-t from-forest-900 via-transparent to-transparent" />
           <div className="absolute bottom-8 left-8">
             <div className="px-3 py-1 glass rounded-lg text-[10px] font-bold text-gold-300 uppercase tracking-widest border border-gold-500/20 mb-3 inline-block">
               {hotel.cat}
             </div>
             <h2 className="font-display text-4xl font-bold text-white mb-2">{hotel.name}</h2>
             <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
               <MapPin size={14} className="text-gold-400" />
               {hotel.location}
             </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar flex flex-col gap-8">
          <div>
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">About this stay</h4>
            <p className="text-sm text-white/60 leading-relaxed italic">
              Experience the pinnacle of hospitality at {hotel.name}. Nestled in {hotel.location}, 
              this retreat offers {hotel.rooms} bespoke rooms and exclusive access to the surrounding natural wonders.
            </p>
          </div>

          <div>
             <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Prime Amenities</h4>
             <div className="grid grid-cols-2 gap-3">
               {hotel.amenities.map(amenity => (
                 <div key={amenity} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-white/70">
                    <CheckCircle size={14} className="text-gold-500" />
                    {amenity}
                 </div>
               ))}
             </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Guest Reviews</h4>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-gold-400 fill-gold-400" />
                <span className="text-lg font-bold text-white">{hotel.rating}</span>
                <span className="text-[10px] text-white/30 font-bold">({hotel.reviews?.length || 0} reviews)</span>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6 mb-10">
               {hotel.reviews && hotel.reviews.length > 0 ? (
                 hotel.reviews.map(review => (
                   <div key={review.id} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold ring-1 ring-gold-500/30">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{review.userName}</div>
                            <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < review.rating ? "text-gold-400 fill-gold-400" : "text-white/10"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed italic">"{review.comment}"</p>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10 glass rounded-3xl border border-white/5">
                   <Star size={32} className="text-white/5 mx-auto mb-4" />
                   <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">No reviews yet. Be the first!</p>
                 </div>
               )}
            </div>

            {/* Leave Review Form */}
            <div className="p-6 rounded-3xl bg-gold-500/5 border border-gold-500/10">
              {user ? (
                <>
                  <h5 className="text-xs font-bold text-gold-400 mb-4 uppercase tracking-widest">Share Your Experience</h5>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const comment = formData.get('comment') as string;
                    const rating = parseInt(formData.get('rating') as string);
                    
                    dbService.addHotelReview(hotel.id, {
                      userId: user.id,
                      userName: user.name,
                      rating,
                      comment,
                      date: new Date().toISOString().split('T')[0]
                    });
                    
                    e.currentTarget.reset();
                  }} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Rating</label>
                        <select name="rating" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50 appearance-none font-bold">
                          <option value="5" className="bg-forest-900">5 - Exceptional</option>
                          <option value="4" className="bg-forest-900">4 - Great</option>
                          <option value="3" className="bg-forest-900">3 - Average</option>
                          <option value="2" className="bg-forest-900">2 - Poor</option>
                          <option value="1" className="bg-forest-900">1 - Terrible</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Comment</label>
                      <textarea name="comment" required placeholder="Write your thoughts..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500/50 resize-none h-24" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-gold-500 text-forest-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20">
                      Publish Review
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-4">Please sign in to leave a review</p>
                  <button 
                    onClick={() => onOpenAuth?.()}
                    className="px-6 py-2 border border-gold-500/30 rounded-xl text-[10px] font-black text-gold-400 uppercase tracking-widest hover:bg-gold-500/10 transition-all"
                  >
                    Authenticate
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 mt-auto pt-6 bg-forest-900/80 backdrop-blur-md">
            <button 
              onClick={() => onBookFromDetails?.(hotel.id)}
              className="w-full py-5 bg-linear-to-r from-gold-400 to-gold-600 text-forest-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-gold-500/30 transition-all text-sm active:scale-95 uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
            >
              Secure This Stay — From ${hotel.price}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (type === 'auth') return renderAuth();
    if (type === 'hotel-details') return renderHotelDetails();
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
