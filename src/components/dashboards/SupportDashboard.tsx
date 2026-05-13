import React, { useState, useEffect } from 'react';
import { 
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
  Activity
} from 'lucide-react';
import { DashboardProps, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface Alert {
  id: string;
  type: string;
  subject: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  description: string;
  status: 'Pending' | 'Reviewing' | 'Resolved';
}

export default function SupportDashboard({ activeTab, user, bookings }: DashboardProps) {
  const isAdmin = user.role === UserRole.ADMIN;
  const [currentImage, setCurrentImage] = useState(0);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
  
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 'AL-101', type: 'Security Breach', subject: 'IP Block #192.168.1.1', priority: 'Critical', timestamp: '2m ago', description: 'Repeated failed login attempts detected on administrative endpoint.', status: 'Pending' },
    { id: 'AL-102', type: 'Suspicious Listing', subject: 'Mount Karisimbi Luxury Tents', priority: 'High', timestamp: '15m ago', description: 'Listing reported for fraudulent image usage by 3 different users.', status: 'Reviewing' },
    { id: 'AL-103', type: 'Payment Dispute', subject: 'Booking #RW-9042', priority: 'High', timestamp: '1h ago', description: 'Credit card chargeback initiated for confirmed booking.', status: 'Pending' },
    { id: 'AL-104', type: 'Offensive Review', subject: 'Experience ID #2045', priority: 'Medium', timestamp: '3h ago', description: 'Automated filter flagged potentially harmful language in a review.', status: 'Pending' },
    { id: 'AL-105', type: 'Fake Profile', subject: 'User @traveler_99', priority: 'Low', timestamp: '5h ago', description: 'Profile flagged for redundant contact information across multiple accounts.', status: 'Resolved' },
  ]);

  const images = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', // Calm waters
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80', // Serene mountains
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80' // Quiet forest
  ];

  const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.priority === filter);

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500 text-white animate-pulse';
      case 'High': return 'bg-red-500/10 text-red-500';
      case 'Medium': return 'bg-gold-500/10 text-gold-500';
      default: return 'bg-emerald-500/10 text-emerald-500';
    }
  };

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
            onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 10000)}
            className="absolute inset-0"
          >
            <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {isAdmin && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 ml-4">
            <Shield className="text-red-500" size={20} />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Master Security Override Active</span>
          </div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-400 transition-all">Emergency Lockdown</button>
        </div>
      )}

      {/* Hero Alert Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Unresolved Alerts', value: alerts.filter(a => a.status !== 'Resolved').length, icon: Bell, color: 'text-red-400' },
          { label: 'Critical Tasks', value: alerts.filter(a => a.priority === 'Critical').length, icon: ShieldAlert, color: 'text-orange-400' },
          { label: 'System Health', value: '99.8%', icon: Activity, color: 'text-emerald-400' },
          { label: 'Response Time', value: '1.2m', icon: Clock, color: 'text-blue-400' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Alert Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-display text-2xl font-bold text-white flex items-center gap-3">
              <ShieldAlert className="text-orange-500" size={24} /> Incident Flow
            </h3>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              {['All', 'Critical', 'High', 'Medium'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
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
                  className={`glass rounded-[2.5rem] p-6 border border-white/5 group hover:border-white/20 transition-all ${alert.status === 'Resolved' ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${getPriorityColor(alert.priority)} bg-opacity-20`}>
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          {alert.subject}
                          {alert.status === 'Resolved' && <CheckCircle2 size={14} className="text-emerald-500" />}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">
                          <span>{alert.type}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span>ID: {alert.id}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${getPriorityColor(alert.priority)}`}>
                      {alert.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-white/50 leading-relaxed max-w-2xl mb-6 italic">
                    "{alert.description}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                      {alert.status !== 'Resolved' && (
                        <button 
                          onClick={() => resolveAlert(alert.id)}
                          className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          <CheckCircle2 size={14} /> Mark Resolved
                        </button>
                      )}
                      <button className="flex items-center gap-2 bg-white/5 text-white/40 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                        <MessageSquare size={14} /> Open Thread
                      </button>
                    </div>
                    <button 
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-white/10 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="text-emerald-500" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-white">All Channels Clear</h4>
                  <p className="text-sm text-white/30 italic">"No active incidents match your current filter."</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className="glass rounded-[2.5rem] p-8 border border-white/5">
            <h4 className="text-sm font-black text-white/20 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={14} /> System Health
            </h4>
            <div className="space-y-6">
              {[
                { label: 'API Latency', value: '42ms', status: 'Optimal', color: 'bg-emerald-500' },
                { label: 'DB Connections', value: '184', status: 'Stable', color: 'bg-emerald-500' },
                { label: 'Asset Server', value: 'Failed', status: 'Maintenance', color: 'bg-red-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-white/30">{item.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">{item.value}</p>
                    <div className={`h-1 w-8 ${item.color} rounded-full ml-auto mt-1`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border border-white/5 bg-radial-at-t from-red-500/5 to-transparent">
             <h4 className="text-sm font-black text-white/20 uppercase tracking-widest mb-4 flex items-center gap-2">
              <LifeBuoy size={14} /> Support Queue
            </h4>
            <p className="text-[11px] text-white/40 italic leading-relaxed mb-6">
              "We have 4 active moderators online. Estimated response time for new Low-Priority tickets is <span className="text-gold-500">12 minutes</span>."
            </p>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:bg-white/10 hover:text-white transition-all">
              Broadcast Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
