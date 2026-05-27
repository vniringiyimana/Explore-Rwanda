import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import DashboardSidebar from './DashboardSidebar';
import TouristDashboard from './TouristDashboard';
import AdminDashboard from './AdminDashboard';
import PartnerDashboard from './PartnerDashboard';
import ContentDashboard from './ContentDashboard';
import SupportDashboard from './SupportDashboard';
import DashboardVisualTour from './DashboardVisualTour';
import VoiceSearchButton from '../VoiceSearchButton';
import { motion, AnimatePresence } from 'motion/react';
import { MASTER_EMAIL, ALT_MASTER_EMAIL } from '../../constants';
import { 
  Bell, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  X, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Volume2, 
  CheckCircle,
  Megaphone
} from 'lucide-react';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  bookings: any[];
}

interface BookingReminder {
  id: string;
  bookingTitle: string;
  type: 'Gorilla Trek' | 'Lodge Stay' | 'Flight Booking' | 'Payment Alert';
  timeUntil: string;
  content: string;
  isRead: boolean;
  priority: 'Immediate' | 'Upcoming' | 'Standard';
}

export default function DashboardLayout({ user, onLogout, bookings }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeRole, setActiveRole] = useState<UserRole>(user.role);
  const [showReminders, setShowReminders] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState<string | null>(null);

  // Default booking reminders state
  const [reminders, setReminders] = useState<BookingReminder[]>([
    {
      id: 'REM-301',
      bookingTitle: 'Volcanoes Mt Sabyinyo Trek',
      type: 'Gorilla Trek',
      timeUntil: 'Starts in 14 Hours',
      content: 'Gear check: bring double layer gaiters, rain jacket, and certified physical passes.',
      isRead: false,
      priority: 'Immediate'
    },
    {
      id: 'REM-302',
      bookingTitle: 'Akagera Safari camp check-in',
      type: 'Lodge Stay',
      timeUntil: 'Tomorrow at 12:00 PM',
      content: 'Voucher verified. Private cruiser driver (Jean-Luc) leaving lobby in Kigali at 08:30 AM.',
      isRead: false,
      priority: 'Upcoming'
    },
    {
      id: 'REM-303',
      bookingTitle: 'Kigali Heli-Tour Security Cleared',
      type: 'Flight Booking',
      timeUntil: '2 Days from now',
      content: 'Pre-flight coordinates confirmed. Weight guidelines check completed with zero baggage override.',
      isRead: true,
      priority: 'Standard'
    }
  ]);

  const [customTitle, setCustomTitle] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [customType, setCustomType] = useState<'Gorilla Trek' | 'Lodge Stay' | 'Flight Booking' | 'Payment Alert'>('Gorilla Trek');

  const isMaster = user.email.toLowerCase() === MASTER_EMAIL.toLowerCase() || user.email.toLowerCase() === ALT_MASTER_EMAIL.toLowerCase();

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setActiveTab('overview');
    toast(`Switched active perspective to ${role.toUpperCase()} Hub`);
  };

  const toast = (msg: string) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
  };

  const addCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customMsg.trim()) {
      toast('Please supply reminder title and guidelines.');
      return;
    }

    const newRem: BookingReminder = {
      id: `REM-${Math.floor(Math.random() * 800) + 100}`,
      bookingTitle: customTitle,
      type: customType,
      timeUntil: 'Scheduled Just Now',
      content: customMsg,
      isRead: false,
      priority: 'Immediate'
    };

    setReminders(prev => [newRem, ...prev]);
    setCustomTitle('');
    setCustomMsg('');
    toast(`Autonomous booking reminder "${newRem.bookingTitle}" dispatched to system queue!`);
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast('Reminder purged from synchronization server.');
  };

  const markAllRead = () => {
    setReminders(prev => prev.map(r => ({ ...r, isRead: true })));
    toast('Logged all system alerts as acknowledged.');
  };

  const handleVoiceSearchResult = (queryText: string) => {
    setVoiceQuery(queryText);
    toast(`Voice recognized: "${queryText}". Dispatching AI query filter...`);
    
    // Auto broadcast message
    setTimeout(() => {
      setVoiceQuery(null);
    }, 6000);
  };

  const renderContent = () => {
    if (activeTab === 'tour') {
      return (
        <DashboardVisualTour 
          onSwitchRole={handleRoleChange} 
          onGoToTab={(tab) => setActiveTab(tab)} 
          activeRole={activeRole}
          userEmail={user.email}
        />
      );
    }

    // Pass active voice query down if need be
    const dashboardProps = { 
      activeTab, 
      user: { ...user, role: activeRole }, 
      bookings, 
      onTabChange: setActiveTab,
      voiceSearchQuery: voiceQuery 
    };
    
    // Sandbox Bypass: we allow dynamic switcher to display any dashboard for simulation
    const effectivelyActiveRole = activeRole;

    const isMaster = user.email.toLowerCase() === MASTER_EMAIL.toLowerCase() || user.email.toLowerCase() === ALT_MASTER_EMAIL.toLowerCase();

    if (effectivelyActiveRole !== UserRole.TOURIST && !isMaster) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-forest-950/40 border border-white/5 rounded-[2.5rem] max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 shadow-lg shadow-red-500/5 animate-pulse">
            <AlertCircle size={28} />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">Google Credential Required</h3>
            <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
              To access and explore multi-role workspace dashboards, your authenticated app session email must match your active Google identity coordinate.
            </p>
          </div>

          <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 space-y-3 font-mono text-xs text-left">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-white/40 uppercase font-bold tracking-wider text-[10px]">Active Session Email:</span>
              <span className="text-amber-400 font-bold">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-white/40 uppercase font-bold tracking-wider text-[10px]">Required Google Credential:</span>
              <span className="text-emerald-400 font-bold">{ALT_MASTER_EMAIL}</span>
            </div>
          </div>

          <p className="text-xs text-white/40 italic">
            Please log out or switch user profiles to an account registered with <strong className="text-white">{ALT_MASTER_EMAIL}</strong> to resume.
          </p>
        </div>
      );
    }

    switch (effectivelyActiveRole) {
      case UserRole.ADMIN:
        return <AdminDashboard {...dashboardProps} />;
      case UserRole.OPERATOR:
        return <PartnerDashboard {...dashboardProps} />;
      case UserRole.EDITOR:
        return <ContentDashboard {...dashboardProps} />;
      case UserRole.MODERATOR:
        return <SupportDashboard {...dashboardProps} />;
      default:
        return <TouristDashboard {...dashboardProps} />;
    }
  };

  const unreadCount = reminders.filter(r => !r.isRead).length;

  return (
    <div className="flex h-screen bg-forest-900 overflow-hidden relative">
      <DashboardSidebar 
        role={user.role} 
        userEmail={user.email}
        emailVerified={user.emailVerified}
        viewRole={activeRole}
        onViewRoleChange={handleRoleChange}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        userName={user.name}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-8 pb-4 bg-forest-900/50 backdrop-blur-md z-20 border-b border-white/5">
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] uppercase font-black bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded-md border border-gold-500/20">
                  {activeRole.toUpperCase()} PERSPECTIVE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">DEV RUNTIME</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-white tracking-tight mt-1">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>

            {/* Top Workspace Controls: Voice Search + Notification Bell */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Voice Assistance Indicator */}
              <VoiceSearchButton onSearchResult={handleVoiceSearchResult} />

              {/* Booking Reminders Trigger Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowReminders(!showReminders)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white hover:text-white transition-all cursor-pointer relative active:scale-95"
                  title="Check travel reminders & automated push-queues"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Reminders Dropdown Panel */}
                <AnimatePresence>
                  {showReminders && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-96 bg-forest-950 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl z-[999] overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Megaphone size={16} className="text-gold-400" />
                          <h3 className="font-bold text-sm text-white">Booking Reminders Hub</h3>
                        </div>
                        <div className="flex gap-2">
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllRead} 
                              className="text-[9px] font-black uppercase text-gold-400 hover:text-white cursor-pointer transition-colors"
                            >
                              Silence All
                            </button>
                          )}
                          <button 
                            onClick={() => setShowReminders(false)} 
                            className="text-white/40 hover:text-white cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Reminders List */}
                      <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                        {reminders.length > 0 ? reminders.map((rem) => (
                          <div 
                            key={rem.id} 
                            className={`p-3.5 rounded-xl border relative transition-all ${
                              !rem.isRead 
                                ? 'bg-gold-500/5 border-gold-500/20 shadow-md shadow-gold-500/2' 
                                : 'bg-white/[0.01] border-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`text-[8.5px] font-mono font-bold uppercase rounded-md px-1.5 py-0.5 border ${
                                  rem.type === 'Gorilla Trek' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                  rem.type === 'Lodge Stay' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                  rem.type === 'Flight Booking' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                  'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                  {rem.type}
                                </span>
                                <h4 className="text-xs font-bold text-white mt-1.5 leading-normal">{rem.bookingTitle}</h4>
                              </div>
                              <button 
                                onClick={() => deleteReminder(rem.id)}
                                className="text-white/20 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            
                            <p className="text-[11px] text-white/50 leading-relaxed mt-2 italic">
                              "{rem.content}"
                            </p>

                            <div className="flex items-center gap-1.5 text-[9px] text-white/30 tracking-tight font-black mt-2">
                              <Clock size={10} className="text-gold-400" />
                              <span>{rem.timeUntil}</span>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-6 text-white/20 italic text-xs">
                            "No active booking updates in client pipeline."
                          </div>
                        )}
                      </div>

                      {/* Simulation Controller within container */}
                      <form onSubmit={addCustomReminder} className="border-t border-white/5 pt-4 mt-4 space-y-2 text-xs">
                        <span className="text-[8.5px] font-black uppercase text-white/30 tracking-wider">Trigger Client Push Notification</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={customTitle} 
                            onChange={(e) => setCustomTitle(e.target.value)} 
                            placeholder="Trek name or Lodge stay..." 
                            className="bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-white text-[11px] placeholder-white/20 focus:outline-none focus:border-gold-500/20 font-semibold"
                          />
                          <select
                            value={customType}
                            onChange={(e) => setCustomType(e.target.value as any)}
                            className="bg-forest-950 border border-white/5 rounded-lg px-2 py-1 text-white text-[11px] focus:outline-none"
                          >
                            <option value="Gorilla Trek">🌳 Gorilla Trek</option>
                            <option value="Lodge Stay">🏨 Lodge Stay</option>
                            <option value="Flight Booking">✈️ Helicopter Route</option>
                            <option value="Payment Alert">💳 Payment Escrow</option>
                          </select>
                        </div>
                        <textarea 
                          rows={2}
                          value={customMsg}
                          onChange={(e) => setCustomMsg(e.target.value)}
                          placeholder="Notification summary details (e.g. John assigned as guide)..."
                          className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-white text-[11px] placeholder-white/20 focus:outline-none focus:border-gold-500/20 leading-relaxed font-semibold block"
                        />
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-gold-500 hover:bg-gold-400 text-forest-950 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus size={10} /> Push Autonomous Reminders
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Network Stable</span>
              </div>
            </div>
          </header>
        </div>

        {/* Global Voice recognized active filter overlay feedback banner */}
        {voiceQuery && (
          <div className="mx-8 mt-4 p-4 bg-gold-400/95 text-forest-950 border border-gold-500 rounded-3xl flex items-center justify-between shadow-xl animate-bounce">
            <div className="flex items-center gap-3">
              <Volume2 className="animate-pulse shrink-0" size={20} />
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Voice Assistance Recognized</p>
                <h4 className="text-sm font-black">Applying search filter: "{voiceQuery}"</h4>
              </div>
            </div>
            <button 
              onClick={() => setVoiceQuery(null)} 
              className="p-1 px-2.5 bg-forest-950/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-forest-950/40 text-forest-950 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeRole}-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
