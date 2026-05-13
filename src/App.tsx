import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import AIPlanner from './components/AIPlanner';
import Experiences from './components/Experiences';
import Hotels from './components/Hotels';
import TravelHub from './components/TravelHub';
import Translate from './components/Translate';
import InteractiveMap from './components/Map';
import Footer from './components/Footer';
import Modals from './components/Modals';
import MyBookings from './components/MyBookings';
import CompanyInfo from './components/CompanyInfo';
import LegalModal from './components/LegalModal';
import { Booking, User, UserRole } from './types';
import DashboardLayout from './components/dashboards/DashboardLayout';
import { dbService } from './services/db';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'auth' | 'booking' | null>(null);
  const [bookingData, setBookingData] = useState<{ category: 'destination' | 'hotel' | 'experience' | 'transport' | 'event', id: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [lang, setLang] = useState(localStorage.getItem('explore-rw-lang') || 'en');
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy'>('terms');
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  
  // Auth & View State
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'dashboard'>('home');

  // DB State synchronization
  const [dbState, setDbState] = useState(dbService.get());

  useEffect(() => {
    const handleUpdate = () => setDbState(dbService.get());
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  useEffect(() => {
    localStorage.setItem('explore-rw-lang', lang);
  }, [lang]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAuth = () => {
    setModalType('auth');
    setModalOpen(true);
  };

  const handleOpenBooking = (category: 'destination' | 'hotel' | 'experience' | 'transport' | 'event', id: number) => {
    setBookingData({ category, id });
    setModalType('booking');
    setModalOpen(true);
  };

  const handleModalConfirm = (authUser: User, msg: string) => {
    setUser(authUser);
    setModalOpen(false);
    showToast(msg);
    if (authUser.role !== UserRole.TOURIST) {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
    showToast('Signed out from your hub.');
  };

  const handleCreateBooking = (booking: Booking) => {
    dbService.addBooking(booking);
    showToast('Booking secured successfully');
  };

  const handleCancelBooking = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      dbService.updateBooking(id, { status: 'cancelled' });
      showToast('Booking cancelled successfully');
    }
  };

  const handleUpdateBooking = (id: string, updates: Partial<Booking>) => {
    dbService.updateBooking(id, updates);
    showToast('Booking updated successfully');
  };

  if (view === 'dashboard' && user) {
    return (
      <div className="bg-forest-900 selection:bg-gold-500/30">
        <DashboardLayout 
          user={user} 
          onLogout={handleLogout} 
          bookings={dbState.bookings} 
        />
        {/* Toast Layer */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-10 left-1/2 z-[200] px-8 py-4 glass rounded-3xl border border-gold-500/30 text-gold-300 font-bold text-sm shadow-2xl flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalOpen && (
             <Modals 
               isOpen={modalOpen} 
               onClose={() => setModalOpen(false)} 
               type={modalType}
               bookingData={bookingData}
               onConfirm={handleModalConfirm}
               onCreateBooking={handleCreateBooking}
               lang={lang}
             />
           )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-gold-500/30">
      <Navbar 
        onOpenAuth={handleOpenAuth} 
        lang={lang} 
        setLang={setLang} 
        onOpenMyBookings={() => setMyBookingsOpen(true)}
        user={user}
        onOpenDashboard={() => setView('dashboard')}
      />
      
      <main>
        <Hero lang={lang} />
        <Destinations data={dbState.destinations} onSelect={(id) => handleOpenBooking('destination', id)} />
        <AIPlanner />
        <Experiences data={dbState.experiences} onBook={(id) => handleOpenBooking('experience', id)} />
        <Hotels data={dbState.hotels} onBook={(id) => handleOpenBooking('hotel', id)} />
        <TravelHub lang={lang} onBook={(id, cat) => handleOpenBooking(cat || 'transport', id)} />
        <CompanyInfo lang={lang} />
        <Translate onToast={showToast} />
        <InteractiveMap />
      </main>

      <Footer onOpenLegal={(type) => {
        setLegalType(type);
        setLegalOpen(true);
      }} />

      {/* Modals Layer */}
      <AnimatePresence>
        {modalOpen && (
          <Modals 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            type={modalType}
            bookingData={bookingData}
            onConfirm={handleModalConfirm}
            onCreateBooking={handleCreateBooking}
            lang={lang}
          />
        )}
      </AnimatePresence>

      <LegalModal 
        isOpen={legalOpen} 
        onClose={() => setLegalOpen(false)} 
        type={legalType} 
        lang={lang} 
      />

      <MyBookings 
        isOpen={myBookingsOpen} 
        onClose={() => setMyBookingsOpen(false)} 
        bookings={dbState.bookings.filter(b => b.email === user?.email)}
        onCancel={handleCancelBooking}
        onUpdate={handleUpdateBooking}
        lang={lang}
      />

      {/* Toast Layer */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[200] px-8 py-4 glass rounded-3xl border border-gold-500/30 text-gold-300 font-bold text-sm shadow-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

