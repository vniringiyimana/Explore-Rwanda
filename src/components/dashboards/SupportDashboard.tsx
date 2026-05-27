import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  MessageSquare, 
  LifeBuoy, 
  AlertCircle, 
  ShieldAlert, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Clock, 
  MoreVertical, 
  Bell, 
  Activity,
  Send,
  HelpCircle,
  AlertTriangle,
  UserCheck,
  RotateCcw,
  Check
} from 'lucide-react';
import { DashboardProps, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { MASTER_EMAIL, ALT_MASTER_EMAIL } from '../../constants';

interface Alert {
  id: string;
  type: string;
  subject: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  description: string;
  status: 'Pending' | 'Reviewing' | 'Resolved';
}

interface Dispute {
  id: string;
  touristName: string;
  businessName: string;
  issue: string;
  claimAmount: number;
  dateFiled: string;
  status: 'Open' | 'In Progress' | 'Refunded' | 'Disputed';
  notes: string[];
}

interface HelpTicket {
  id: string;
  touristName: string;
  topic: string;
  durationOpen: string;
  severity: 'Immediate' | 'Standard';
  messages: { sender: 'tourist' | 'moderator', text: string, time: string }[];
}

export default function SupportDashboard({ activeTab, user, bookings }: DashboardProps) {
  const isMaster = user.email.toLowerCase() === MASTER_EMAIL.toLowerCase() || user.email.toLowerCase() === ALT_MASTER_EMAIL.toLowerCase();

  if (user.role !== UserRole.MODERATOR && !isMaster) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 glass rounded-[3rem] border-red-500/20 shadow-2xl shadow-red-500/5">
        <Lock size={48} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-display font-bold text-white mb-4">Security Clearance Required</h2>
        <p className="text-white/40 max-w-sm italic">
          "The Trust & Safety dashboard is restricted to active moderators. Unauthorized access is monitored by the system audit trail."
        </p>
      </div>
    );
  }

  const isAdmin = isMaster;
  const [currentImage, setCurrentImage] = useState(0);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
  
  // Incidents/Alerts State
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'AL-101', type: 'Security Breach', subject: 'IP Block #192.168.1.1', priority: 'Critical', timestamp: '2m ago', description: 'Repeated failed login attempts detected on administrative endpoint.', status: 'Pending' },
    { id: 'AL-102', type: 'Suspicious Listing', subject: 'Mount Karisimbi Luxury Tents', priority: 'High', timestamp: '15m ago', description: 'Listing reported for fraudulent image usage by 3 different users.', status: 'Reviewing' },
    { id: 'AL-103', type: 'Payment Dispute', subject: 'Booking #RW-9042', priority: 'High', timestamp: '1h ago', description: 'Credit card chargeback initiated for confirmed booking.', status: 'Pending' },
    { id: 'AL-104', type: 'Offensive Review', subject: 'Experience ID #2045', priority: 'Medium', timestamp: '3h ago', description: 'Automated filter flagged potentially harmful language in a review.', status: 'Pending' },
    { id: 'AL-105', type: 'Fake Profile', subject: 'User @traveler_99', priority: 'Low', timestamp: '5h ago', description: 'Profile flagged for redundant contact information across multiple accounts.', status: 'Resolved' },
  ]);

  // Disputes & Refunds State
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 'DISP-401',
      touristName: 'Jane Watson',
      businessName: 'Akagera Safari Lodges',
      issue: 'Safari cancelled due to extreme rain, hotel refused refund',
      claimAmount: 250,
      dateFiled: '1 day ago',
      status: 'Open',
      notes: ['Tourist filed claim arguing weather cancellation clause.']
    },
    {
      id: 'DISP-402',
      touristName: 'Marc Sterling',
      businessName: 'Kigali Heli Tours',
      issue: 'Double charge on visa debit during helicopter booking',
      claimAmount: 510,
      dateFiled: '3 hours ago',
      status: 'In Progress',
      notes: ['Contacted payment proxy to verify merchant duplicate logs.']
    },
    {
      id: 'DISP-403',
      touristName: 'Fiona Gallagher',
      businessName: 'Volcanoes Trekking Guides',
      issue: 'Guide did not show up on schedule; self-navigated Akagera instead',
      claimAmount: 180,
      dateFiled: '2 days ago',
      status: 'Refunded',
      notes: ['Dispute finalized. Refunding tourist 100% split with merchant penalty fee.']
    }
  ]);

  // Selected Dispute for Console Detail
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>('DISP-401');
  const [disputeDecisionNote, setDisputeDecisionNote] = useState('');

  // Rescue HelpTickets State
  const [tickets, setTickets] = useState<HelpTicket[]>([
    {
      id: 'TKT-881',
      touristName: 'Emily Vance',
      topic: 'Lost GPS coordinates on Mount Bisoke trail path',
      durationOpen: '5m ago',
      severity: 'Immediate',
      messages: [
        { sender: 'tourist', text: 'Hello! I branched off the main route near the crater lake and the fog is thick. Can you confirm if my GPS trace looks correct?', time: '13:25' },
        { sender: 'moderator', text: 'Hello Emily. Head Ranger has been notified. Stay stationary at your altitude coordinate. We see your signal near Sector 4.', time: '13:28' },
        { sender: 'tourist', text: 'Perfect. Thank you. I have water and am waiting by the bamboo patch.', time: '13:30' }
      ]
    },
    {
      id: 'TKT-882',
      touristName: 'Derrick Rose',
      topic: 'Missing Rwanda Hub digital boarding passes',
      durationOpen: '30m ago',
      severity: 'Standard',
      messages: [
        { sender: 'tourist', text: 'Hi support team, I booked Volcanoes event passes but they arent showing under my ticket list tab.', time: '13:02' }
      ]
    }
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-881');
  const [chatReply, setChatReply] = useState('');

  // Announcement Broadcast State
  const [activeAnnouncement, setActiveAnnouncement] = useState('');

  const images = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', // Calm waters
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80', // Serene mountains
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80' // Quiet forest
  ];

  const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.priority === filter);

  const notify = (msg: string) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
    notify(`Incident ID ${id} resolved successfully.`);
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    notify(`Incident ID ${id} dismissed from dashboard feed.`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500 text-white animate-pulse';
      case 'High': return 'bg-red-500/10 text-red-500';
      case 'Medium': return 'bg-gold-500/10 text-gold-500';
      default: return 'bg-emerald-500/10 text-emerald-500';
    }
  };

  // Dispatch Official Instruction in Dispute Tab
  const handleDisputeResolutionSubmit = (e: React.FormEvent, statusOverride?: 'Refunded' | 'Disputed' | 'In Progress') => {
    e.preventDefault();
    if (!disputeDecisionNote.trim() && !statusOverride) {
      notify("Please provide written feedback inside the decision notes box.");
      return;
    }

    setDisputes(prev => prev.map(d => {
      if (d.id === selectedDisputeId) {
        const updatedNotes = disputeDecisionNote.trim() 
          ? [...d.notes, `${user.name} posted: ${disputeDecisionNote}`]
          : d.notes;
        return {
          ...d,
          status: statusOverride || 'In Progress',
          notes: updatedNotes
        };
      }
      return d;
    }));

    notify(`Dispute logs modified: set to ${statusOverride || 'Updated'}. Logged audit trail.`);
    setDisputeDecisionNote('');
  };

  // Reply to Emergency rescue ticket
  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatReply.trim()) return;

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            { sender: 'moderator', text: chatReply, time: 'Just now' }
          ]
        };
      }
      return t;
    }));

    notify(`Message successfully sent to Tourist client terminal.`);
    setChatReply('');
  };

  // Platform Broadcast
  const handlePlatformBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAnnouncement.trim()) return;

    notify(`GLOBAL BROADCAST ALERT DISPATCHED: "${activeAnnouncement}"`);
    setActiveAnnouncement('');
  };

  const currentDispute = disputes.find(d => d.id === selectedDisputeId);
  const currentTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[80vh] pt-4">
      {/* Background Slideshow */}
      <div className="absolute inset-0 -top-8 -mx-10 rounded-[4rem] overflow-hidden -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 12000)}
            className="absolute inset-0"
          >
            <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {isAdmin && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 ml-4">
            <Shield className="text-red-500 animate-pulse" size={20} />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Master Security Override Active (Full Clear Access)</span>
          </div>
          <button 
            onClick={() => {
              setAlerts([]);
              notify("Incident database cleared. Local sandbox emergency lockdown skipped.");
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95"
          >
            Instant Alarm Flush
          </button>
        </div>
      )}

      {/* Hero Alert Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Unresolved Alerts', value: alerts.filter(a => a.status !== 'Resolved').length, icon: Bell, color: 'text-red-400' },
          { label: 'Active Disputes', value: disputes.filter(d => d.status !== 'Refunded').length, icon: ShieldAlert, color: 'text-orange-400' },
          { label: 'System Gateway Health', value: '99.9%', icon: Activity, color: 'text-emerald-400' },
          { label: 'Avg Moderation Latency', value: '0.8 min', icon: Clock, color: 'text-blue-400' },
        ].map((stat, idx) => (
          <div key={idx} className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={48} />
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-display font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {(!activeTab || activeTab === 'overview') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Alert Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                <ShieldAlert className="text-orange-500" size={24} /> Incident Flow Feed
              </h3>
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                {['All', 'Critical', 'High', 'Medium'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white/12 text-white' : 'text-white/30 hover:text-white/60'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
                  <motion.div 
                    layout
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`glass rounded-[2.5rem] p-6 border border-white/5 group hover:border-white/20 transition-all ${alert.status === 'Resolved' ? 'opacity-50' : ''} w-full`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-opacity-20 ${
                          alert.priority === 'Critical' ? 'bg-red-500 text-red-400' :
                          alert.priority === 'High' ? 'bg-orange-500 text-orange-400' :
                          'bg-amber-500 text-amber-400'
                        }`}>
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            {alert.subject}
                            {alert.status === 'Resolved' && <CheckCircle2 size={14} className="text-emerald-500" />}
                          </h4>
                          <div className="flex items-center gap-2.5 text-[9px] text-white/30 uppercase font-black tracking-widest mt-1">
                            <span>{alert.type}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span>ID: {alert.id}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                    </div>
                    
                    <p className="text-xs text-white/50 leading-relaxed max-w-2xl mb-6">
                      "{alert.description}"
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-2">
                        {alert.status !== 'Resolved' && (
                          <button 
                            onClick={() => resolveAlert(alert.id)}
                            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                          >
                            <CheckCircle2 size={12} /> Mark Fixed
                          </button>
                        )}
                        <button 
                          onClick={() => notify(`Incident ${alert.id} escalated to engineering ops.`)}
                          className="flex items-center gap-2 bg-white/5 text-white/40 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                        >
                          Send Escalation
                        </button>
                      </div>
                      <button 
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 text-white/15 hover:text-red-500 transition-colors cursor-pointer"
                        title="Dismiss alert log"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="text-emerald-500" size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-white">All Incident Feeds Clean</h4>
                    <p className="text-sm text-white/30 italic">"No trust violations reported on local gateway."</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar System Overview */}
          <div className="space-y-8">
            <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h4 className="text-xs font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-emerald-400 animate-pulse" /> Gateway Latencies
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Authentication Server', value: 'Offline (Sandbox SafeFall)', status: 'Simulated mode' },
                  { label: 'CDN Image Proxy', value: '45ms', status: 'Optimal' },
                  { label: 'Booking Sync Socket', value: 'Synchronized', status: 'Optimal' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-white/30 uppercase font-black tracking-tighter mt-1">
                      <span>{item.value}</span>
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-[2.5rem] p-8 border border-white/5 bg-radial-at-t from-red-500/5 to-transparent space-y-4">
               <h4 className="text-xs font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                <LifeBuoy size={14} className="text-red-400" /> Platform-Wide Alert
              </h4>
              <p className="text-[11px] text-white/40 italic leading-relaxed">
                "Administrators may broadcast urgent maintenance, travel lockdowns, or Akagera volcanic warnings instantaneously into tourist notification feeds."
              </p>
              
              <form onSubmit={handlePlatformBroadcast} className="space-y-2">
                <input 
                  type="text"
                  value={activeAnnouncement}
                  onChange={(e) => setActiveAnnouncement(e.target.value)}
                  placeholder="e.g. Nyungwe canopy trail closing at 5 PM..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/40"
                />
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Broadcast to Screen
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Complaints list (Left 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-orange-400" size={20} /> Escalated Disputes
              </h3>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                Tourist and Partner contract friction log
              </p>
            </div>

            <div className="space-y-3">
              {disputes.map(disp => (
                <div 
                  key={disp.id}
                  onClick={() => setSelectedDisputeId(disp.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedDisputeId === disp.id 
                      ? 'bg-orange-500/10 border-orange-500/40 shadow-lg' 
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono text-orange-400 font-bold bg-orange-400/5 px-2 py-0.5 rounded-md border border-orange-500/20">
                      Claim: ${disp.claimAmount}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      disp.status === 'Refunded' ? 'bg-emerald-500/10 text-emerald-400' :
                      disp.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {disp.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{disp.touristName}</h4>
                  <p className="text-[10px] text-white/30 font-semibold uppercase mt-0.5">Vs. {disp.businessName}</p>
                  
                  <p className="text-xs text-white/50 italic mt-2 line-clamp-2">
                    "{disp.issue}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Console review (Right 7) */}
          <div className="lg:col-span-7">
            {currentDispute ? (
              <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-black block">Dispute Incident Log</span>
                    <h3 className="text-lg font-bold text-white">{currentDispute.id} / Claims Escrow</h3>
                    <p className="text-xs text-orange-400 font-bold mt-1">Claim Worth: ${currentDispute.claimAmount} USD</p>
                  </div>

                  <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-full ${
                    currentDispute.status === 'Refunded' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {currentDispute.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[8px] uppercase font-black text-white/20">Plaintiff (Tourist)</p>
                    <p className="font-bold text-white mt-0.5">{currentDispute.touristName}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase font-black text-white/20">Defendant (Provider)</p>
                    <p className="font-bold text-white mt-0.5">{currentDispute.businessName}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] uppercase font-black text-white/30 tracking-widest">Plaintiff Allegation Body</p>
                  <p className="text-xs text-white/75 italic mt-1.5 leading-relaxed">
                    "{currentDispute.issue}"
                  </p>
                </div>

                {/* Audit notes log trailing */}
                <div className="space-y-3">
                  <p className="text-[9px] uppercase font-black text-white/30 tracking-widest">Audit Decision Logs ({currentDispute.notes.length})</p>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar">
                    {currentDispute.notes.map((note, nIdx) => (
                      <div key={nIdx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/50 leading-relaxed font-semibold">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Console Action Interface */}
                {currentDispute.status !== 'Refunded' ? (
                  <form onSubmit={handleDisputeResolutionSubmit} className="space-y-4 pt-4 border-t border-white/5">
                    <div>
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1">Written Arbiter Decision & Command</label>
                      <textarea 
                        rows={3}
                        value={disputeDecisionNote}
                        onChange={(e) => setDisputeDecisionNote(e.target.value)}
                        placeholder="State official findings to log inside cleared ledger..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-400/30 font-semibold leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button 
                        type="submit"
                        className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95"
                      >
                        Log Note Only
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDisputeResolutionSubmit(e, 'Refunded')}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <UserCheck size={12} /> Force Refund Escrow
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDisputeResolutionSubmit(e, 'Disputed')}
                        className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600 hover:text-white border border-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 animate-pulse"
                      >
                        Disapprove Plaintiff Claim
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-300">
                    <CheckCircle2 size={24} />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest">Ledger Cleared and Refunded</h4>
                      <p className="text-[10px] italic">Refund was dispatched on sandbox transaction block.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass rounded-[2.5rem] p-12 border border-white/5 text-center flex flex-col items-center">
                <HelpCircle size={44} className="text-white/10 mb-4" />
                <p className="text-sm text-white/30 italic">"Select an escalated incident from the left panel to execute resolution queries."</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Tickets (Left 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <LifeBuoy className="text-emerald-400 animate-pulse font-bold" /> Active Rescue Chats
              </h3>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                Urgent traveler assistance & GPS tracers
              </p>
            </div>

            <div className="space-y-3">
              {tickets.map(t => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedTicketId === t.id 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg' 
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-white/40">Open Ticket: {t.id}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      t.severity === 'Immediate' ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {t.severity}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{t.touristName}</h4>
                  <p className="text-xs text-white/60 line-clamp-1 italic">
                    "{t.topic}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Chat Interface (Right 7) */}
          <div className="lg:col-span-7">
            {currentTicket ? (
              <div className="glass rounded-[2.5rem] p-8 border border-white/5 flex flex-col h-[520px] justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4.5 mb-4">
                    <div>
                      <span className="text-[8px] tracking-wider uppercase font-black text-white/30 block">Tourist Terminal Transcript</span>
                      <h3 className="text-base font-bold text-white font-display">{currentTicket.touristName}</h3>
                      <p className="text-xs text-emerald-400 font-bold mt-1 leading-normal italic">
                        Topic: "{currentTicket.topic}"
                      </p>
                    </div>

                    <span className="text-[8.5px] font-mono font-bold uppercase text-white/30">{currentTicket.durationOpen}</span>
                  </div>

                  {/* Message Blocks */}
                  <div className="space-y-3 h-[250px] overflow-y-auto custom-scrollbar pr-2 mb-4">
                    {currentTicket.messages.map((m, mIdx) => (
                      <div 
                        key={mIdx} 
                        className={`flex flex-col max-w-[85%] ${m.sender === 'moderator' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                          m.sender === 'moderator' 
                            ? 'bg-emerald-600 text-white rounded-tr-none' 
                            : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[8px] font-mono text-white/20 mt-1">{m.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendTicketReply} className="flex gap-2.5 items-center border-t border-white/5 pt-4">
                  <input 
                    type="text"
                    value={chatReply}
                    onChange={(e) => setChatReply(e.target.value)}
                    placeholder="Type official reply to emergency thread..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 font-semibold"
                  />
                  <button 
                    type="submit"
                    className="p-3 bg-emerald-500 text-forest-900 rounded-xl hover:bg-emerald-400 cursor-pointer active:scale-95 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Send size={12} /> Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass rounded-[2.5rem] p-12 border border-white/5 text-center flex flex-col items-center">
                <LifeBuoy size={44} className="text-white/10 mb-4 animate-spin duration-3000" />
                <p className="text-sm text-white/30 italic">"Select an open rescue ticket to initialize safe-fall communication."</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
