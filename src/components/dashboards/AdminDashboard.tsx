import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Hotel, 
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Settings as SettingsIcon,
  Download,
  Layout,
  Database,
  Lock,
  Ticket,
  Save,
  X,
  ChevronDown
} from 'lucide-react';

import { DashboardProps, UserRole, User, Destination, Hotel as HotelType, Booking } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import CommunicationCenter from './CommunicationCenter';
import { dbService } from '../../services/db';

export default function AdminDashboard({ activeTab, bookings: initialBookings, user }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbState, setDbState] = useState(dbService.get());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: string, data: any } | null>(null);
  
  const isAdmin = user.role === UserRole.ADMIN;
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setDbState(dbService.get());
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const handleDelete = (type: string, id: any) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    switch (type) {
      case 'user': dbService.deleteUser(id); break;
      case 'destination': dbService.deleteDestination(id); break;
      case 'hotel': dbService.deleteHotel(id); break;
      case 'booking': dbService.deleteBooking(id); break;
      case 'event': dbService.deleteEvent(id); break;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { type, data } = editingItem;
    if (data.id) {
      // Update
      switch (type) {
        case 'user': dbService.updateUser(data.id, data); break;
        case 'destination': dbService.updateDestination(data.id, data); break;
        case 'hotel': dbService.updateHotel(data.id, data); break;
        case 'event': dbService.updateEvent(data.id, data); break;
        case 'booking': dbService.updateBooking(data.id, data); break;
      }
    } else {
      // Add
      switch (type) {
        case 'user': dbService.addUser(data); break;
        case 'destination': dbService.addDestination(data); break;
        case 'hotel': dbService.addHotel(data); break;
        case 'event': dbService.addEvent(data); break;
      }
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const images = [
    'https://images.unsplash.com/photo-1620336655174-32da930514a6?auto=format&fit=crop&q=80', // Kigali Aerial
    'https://images.unsplash.com/photo-1578330132822-01be60c679a6?auto=format&fit=crop&q=80', // Modern Architecture
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80', // Clean streets
  ];

  const stats = [
    { label: 'Total Users', value: dbState.users.length.toLocaleString(), trend: '+12%', icon: Users, color: 'text-blue-400' },
    { label: 'Active Bookings', value: dbState.bookings.filter(b => b.status === 'confirmed').length.toString(), trend: '+5%', icon: Calendar, color: 'text-gold-400' },
    { label: 'Total Revenue', value: `$${dbState.bookings.reduce((acc, b) => acc + b.price, 0).toLocaleString()}`, trend: '+18%', icon: DollarSign, color: 'text-green-400' },
    { label: 'Destinations', value: dbState.destinations.length.toString(), trend: '0%', icon: MapPin, color: 'text-purple-400' },
  ];

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[80vh] pt-4">
      {/* Background Slideshow */}
      <div className="absolute inset-0 -top-8 -mx-10 rounded-[4rem] overflow-hidden -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 8000)}
            className="absolute inset-0"
          >
            <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-white/20'} flex items-center gap-1`}>
                {stat.trend} <ArrowUpRight size={10} />
              </span>
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Admin Quick Actions & Integrity Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/5">
           <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Platform Health</h3>
              <p className="text-xs text-white/30 italic">Real-time system integrity and security metrics</p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">System Stable</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="space-y-6">
                {[
                  { label: 'API Response Time', value: '124ms', status: 'Optimal' },
                  { label: 'Database Load', value: '12%', status: 'Low' },
                  { label: 'Active Sessions', value: '1.2k', status: 'Peaking' },
                ].map((m, i) => (
                  <div key={i} className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white/60">{m.label}</span>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{m.status}</span>
                    </div>
                    <div className="text-lg font-display font-bold text-white">{m.value}</div>
                  </div>
                ))}
             </div>
             <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col justify-between">
                <div>
                   <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Integrity Seal</h4>
                   <p className="text-[11px] text-white/30 leading-relaxed italic mb-6">
                     "All transactions are encrypted with 256-bit signatures. Database backups are synced every 6 hours to global regional clusters."
                   </p>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={32} className="text-gold-500/40" />
                  <div>
                    <p className="text-[10px] font-bold text-white">Version 2.4.0-Stable</p>
                    <p className="text-[9px] text-white/20">Last Scan: 12m ago</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
          <h3 className="font-display text-xl font-bold text-white mb-4">Command Center</h3>
          <div className="grid gap-2">
            {[
              { label: 'Maintenance Mode', icon: Database, color: 'text-gold-500' },
              { label: 'Export Database', icon: Download, color: 'text-blue-500' },
              { label: 'Flush Global Cache', icon: Database, color: 'text-red-500' },
              { label: 'Broadast Update', icon: FileText, color: 'text-emerald-500' },
            ].map((cmd, i) => (
              <button key={i} className="w-full p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <cmd.icon size={16} className={cmd.color} />
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{cmd.label}</span>
                </div>
                <ArrowUpRight size={14} className="text-white/10 group-hover:text-gold-500 transition-colors" />
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-white/5">
             <div className="flex gap-4">
               <button className="flex-1 py-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Emergency Lock</button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Booking Volume</h3>
              <p className="text-xs text-white/30 italic">Real-time platform activity metrics</p>
            </div>
            <select className="bg-white/5 border-none text-[10px] font-black text-white/40 uppercase tracking-widest rounded-xl px-4 py-2">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="h-48 w-full flex items-end gap-3 px-4">
            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 70, 60, 100].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-gold-500/20 group-hover:bg-gold-500/40 transition-all rounded-t-lg relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all pb-2">
                    <span className="text-[9px] font-bold text-gold-400">{h}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 mt-4 text-[9px] font-black text-white/20 uppercase tracking-tighter">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <div key={m} className="text-center">{m}</div>)}
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 border border-white/5">
          <h3 className="font-display text-xl font-bold text-white mb-6">Popular Destinations</h3>
          <div className="space-y-6">
            {[
              { name: 'Volcanoes NP', share: 42, color: 'bg-gold-500' },
              { name: 'Kigali City', share: 28, color: 'bg-blue-500' },
              { name: 'Lake Kivu', share: 18, color: 'bg-cyan-500' },
              { name: 'Akagera Park', share: 12, color: 'bg-green-500' },
            ].map((dest, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/60">{dest.name}</span>
                  <span className="text-white/30">{dest.share}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${dest.color}`} style={{ width: `${dest.share}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
               <AlertTriangle size={20} className="text-orange-500" />
               <div>
                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">System Alert</p>
                 <p className="text-[10px] text-white/60 leading-tight">4 unapproved hotel listings from new operators.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = (headers: string[], rows: any[], type: string, actions: boolean = true) => (
    <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{h}</th>
              ))}
              {actions && <th className="px-6 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.filter(row => {
              const searchString = Object.values(row).join(' ').toLowerCase();
              return searchString.includes(searchQuery.toLowerCase());
            }).map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                {Object.entries(row).map(([key, val]: [string, any], j) => (
                  <td key={j} className="px-6 py-4">
                    {key === 'status' || key === 'active' ? (
                      val ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />
                    ) : key === 'role' ? (
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${val === 'admin' ? 'bg-gold-500 text-forest-900' : 'bg-white/10 text-white/60'}`}>{val}</span>
                    ) : (
                      <span className="text-sm font-bold text-white line-clamp-1">{val.toString()}</span>
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem({ type, data: row });
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/30 hover:text-gold-400"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(type, (row as any).id || (row as any).email)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/30 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const getDefaults = (type: string) => {
    switch (type) {
      case 'user': return { name: '', email: '', role: UserRole.TOURIST };
      case 'destination': return { name: '', cat: 'parks', emoji: '⛰️', location: '', rating: 5, price: '$0', desc: '', best: '', fee: '' };
      case 'hotel': return { name: '', cat: 'luxury', emoji: '🏨', location: '', price: 0, rating: 5, rooms: 0, amenities: [] };
      case 'event': return { name: '', emoji: '🎉', location: '', price: '0', rating: 5, date: '' };
      default: return {};
    }
  };

  const renderHeader = (title: string, icon: React.ReactNode, type: string, count?: string) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-[1.5rem] bg-gold-500/10 text-gold-500 border border-gold-500/20">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">{title}</h2>
          <p className="text-xs text-white/30 font-medium italic">"Managing the heartbeat of Rwanda's tourism."</p>
        </div>
        {count && (
          <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-white/40 border border-white/5">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/50 w-full md:w-64 transition-all"
          />
        </div>
        <button 
          onClick={() => {
            setEditingItem({ type, data: getDefaults(type) });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gold-500 text-forest-900 px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold-500/20"
        >
          <Plus size={18} /> Add New
        </button>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderHeader('User Management', <Users size={24} />, 'user', dbState.users.length.toString())}
          {renderTable(['ID', 'Email', 'Name', 'Role'], dbState.users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })), 'user')}
        </div>
      );
      case 'bookings': 
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderHeader('Global Bookings', <Calendar size={24} />, 'booking', dbState.bookings.length.toString())}
            {renderTable(['ID', 'Item', 'Guest', 'Date', 'Amount', 'Status'], dbState.bookings.map(b => ({
              id: b.id,
              entity: b.itemName,
              guest: b.email,
              date: b.date,
              amount: `$${b.price}`,
              status: b.status
            })), 'booking')}
          </div>
        );
      case 'destinations': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderHeader('Destinations', <MapPin size={24} />, 'destination', dbState.destinations.length.toString())}
          {renderTable(['ID', 'Name', 'Category', 'Location', 'Rating'], dbState.destinations.map(d => ({
            id: d.id,
            name: d.name,
            cat: d.cat,
            loc: d.location,
            rating: d.rating
          })), 'destination')}
        </div>
      );
      case 'hotels': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderHeader('Hotel Inventory', <Hotel size={24} />, 'hotel', dbState.hotels.length.toString())}
          {renderTable(['ID', 'Name', 'Category', 'Price', 'Location'], dbState.hotels.map(h => ({
            id: h.id,
            name: h.name,
            cat: h.cat,
            price: `$${h.price}`,
            loc: h.location
          })), 'hotel')}
        </div>
      );
      case 'events': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderHeader('Events & Campaigns', <Ticket size={24} />, 'event', dbState.events.length.toString())}
          {renderTable(['ID', 'Event Name', 'Location', 'Date', 'Price'], dbState.events.map(e => ({
            id: e.id,
            name: e.name,
            loc: e.location,
            date: e.date,
            price: e.price
          })), 'event')}
        </div>
      );
      case 'payments': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {renderHeader('Revenue & Payouts', <DollarSign size={24} />, 'payment', `$${dbState.bookings.reduce((acc, b) => acc + b.price, 0).toLocaleString()} Total`)}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-[2rem] p-8 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><TrendingUp size={20} className="text-green-500" /> Recent Transactions</h3>
              {renderTable(['Source', 'Amount', 'Date', 'Status'], dbState.bookings.slice(0, 5).map(b => ({
                source: b.paymentMethod || 'Mobile Money',
                amount: `$${b.price}`,
                date: b.date,
                status: b.status === 'confirmed'
              })), 'booking', false)}
            </div>
            <div className="glass rounded-[2rem] p-8 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><ArrowUpRight size={20} className="text-gold-500" /> Revenue Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Destinations', val: dbState.bookings.filter(b => b.itemType === 'destination').reduce((a, b) => a + b.price, 0) },
                  { label: 'Hotels', val: dbState.bookings.filter(b => b.itemType === 'hotel').reduce((a, b) => a + b.price, 0) },
                  { label: 'Experiences', val: dbState.bookings.filter(b => b.itemType === 'experience').reduce((a, b) => a + b.price, 0) },
                  { label: 'Transport', val: dbState.bookings.filter(b => b.itemType === 'transport').reduce((a, b) => a + b.price, 0) },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{item.label}</span>
                    <span className="text-sm font-bold text-gold-400">${item.val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      case 'messages': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <CommunicationCenter currentUser={user} />
        </div>
      );
      case 'reports': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {renderHeader('Security & Reports', <FileText size={24} />, 'report', 'Healthy')}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Security Threats', val: 'Low', icon: Shield, color: 'text-green-500' },
              { label: 'System Uptime', val: '99.9%', icon: Database, color: 'text-blue-500' },
              { label: 'Cloud Resources', val: 'Healthy', icon: Lock, color: 'text-gold-500' },
            ].map((item, idx) => (
              <div key={idx} className="glass rounded-3xl p-8 text-center border border-white/5">
                <item.icon size={32} className={`${item.color} mx-auto mb-4`} />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                <h3 className="text-xl font-bold text-white">{item.val}</h3>
              </div>
            ))}
          </div>
          <div className="glass rounded-[2.5rem] p-8 border border-white/5">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">System Audit Log</h3>
              <button className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                <Download size={14} /> Export Logs
              </button>
             </div>
             {renderTable(['Timestamp', 'Admin', 'Action', 'Impact'], [
               { time: '14:20:05', user: 'Admin_Master', action: 'Update Permissions', impact: 'High' },
               { time: '12:05:12', user: 'Admin_Master', action: 'Delete Trash Post', impact: 'Low' },
               { time: '09:12:44', user: 'Support_Lead', action: 'Flagged User #882', impact: 'Medium' },
             ], 'log', false)}
          </div>
        </div>
      );
      case 'settings': return (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderHeader('System Settings', <SettingsIcon size={24} />, 'system')}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><Layout size={20} className="text-gold-500" /> Platform Configuration</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <span className="text-sm font-bold text-white/60">Maintenance Mode</span>
                    <div className="w-12 h-6 bg-white/5 rounded-full p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white/20 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <span className="text-sm font-bold text-white/60">Auto-Approve Listings</span>
                    <div className="w-12 h-6 bg-gold-500 rounded-full p-1 cursor-pointer flex justify-end">
                      <div className="w-4 h-4 bg-forest-900 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><Database size={20} className="text-blue-500" /> Database & Storage</h3>
                <div className="flex flex-col gap-3">
                  <button className="w-full py-4 glass border-white/5 text-white/60 text-xs font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest">
                    Backup System Data
                  </button>
                  <button className="w-full py-4 glass border-white/5 text-red-400/60 text-xs font-bold rounded-2xl hover:bg-red-400/5 transition-all uppercase tracking-widest">
                    Flush Cache Memory
                  </button>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 border border-white/5">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3"><Lock size={20} className="text-purple-500" /> API Connections</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Google Maps API', status: 'Connected', uptime: '99.9%' },
                    { name: 'Stripe Gateway', status: 'Stable', uptime: '100%' },
                    { name: 'MTN MoMo Gateway', status: 'Stable', uptime: '98.5%' },
                    { name: 'Cloudinary Media', status: 'Connected', uptime: '99.9%' },
                  ].map((api, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/3 rounded-2xl">
                      <div>
                        <h4 className="text-sm font-bold text-white/80">{api.name}</h4>
                        <p className="text-[10px] font-bold text-white/20">{api.uptime} Uptime</p>
                      </div>
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{api.status}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-50">
            <FileText size={48} className="text-gold-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h3>
            <p className="text-sm text-white/40 italic">\"Admin controls are restricted to authorized personnel.\"</p>
          </div>
        );
    }
  };

  return (
    <>
      {getContent()}
      
      {/* Dynamic Entity Modal */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-forest-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-forest-900 border border-white/10 rounded-[3rem] w-full max-w-lg overflow-hidden relative shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                    {editingItem.data.id ? 'Edit' : 'Add'} {editingItem.type}
                  </h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Resource Management Hub</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {Object.keys(editingItem.data).filter(k => k !== 'id').map(key => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {key === 'role' ? (
                      <select 
                        value={editingItem.data[key]}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold-500/50 appearance-none"
                      >
                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role.toUpperCase()}</option>)}
                      </select>
                    ) : typeof editingItem.data[key] === 'boolean' ? (
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <button 
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: !editingItem.data[key] } })}
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${editingItem.data[key] ? 'bg-gold-500' : 'bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${editingItem.data[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm font-bold text-white/60">{editingItem.data[key] ? 'Active' : 'Inactive'}</span>
                      </div>
                    ) : (
                      <input 
                        type="text"
                        value={editingItem.data[key] || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold-500/50"
                      />
                    )}
                  </div>
                ))}
                
                {/* Fallback for empty new item data */}
                {Object.keys(editingItem.data).length === 0 && (
                   <p className="text-xs text-white/30 italic">No fields to edit. Please define schema in entities.</p>
                )}
              </form>

              <div className="p-8 bg-forest-950/50 border-t border-white/5 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-gold-500 text-forest-900 font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Deploy Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
