import React, { useState } from 'react';
import { 
  Lock, 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  Settings, 
  Plus, 
  MessageSquare, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Filter, 
  BarChart3, 
  Download, 
  XCircle, 
  Package, 
  Sliders, 
  ArrowUpRight, 
  ChevronDown, 
  X,
  CreditCard,
  Smartphone,
  Check,
  Percent,
  RefreshCw
} from 'lucide-react';
import { DashboardProps, UserRole, Booking } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { dbService } from '../../services/db';
import CommunicationCenter from './CommunicationCenter';

interface BusinessListing {
  id: string;
  name: string;
  location: string;
  price: number;
  status: 'Active' | 'Inactive' | 'Pending' | 'Draft';
  img: string;
  category: 'Hotel' | 'Tour' | 'Experience';
  availableSlots: number;
  description: string;
}

export default function PartnerDashboard({ activeTab, user, bookings, onTabChange }: DashboardProps) {
  // Check authorization
  if (user.role !== UserRole.OPERATOR) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 glass rounded-[3rem] border border-gold-500/20">
        <Lock size={48} className="text-gold-500 mb-6" />
        <h2 className="text-2xl font-display font-bold text-white mb-4">Partner Only Access</h2>
        <p className="text-white/40 max-w-sm italic">
          "The Partner Core Hub is reserved for registered service providers, tour guides, and hotel hosts. Contact support for partner access."
        </p>
      </div>
    );
  }

  // Active listings local state for interactive inventory CRUD
  const [listings, setListings] = useState<BusinessListing[]>([
    { 
      id: 'list-1', 
      name: 'Gorilla Trekking Golden Package', 
      location: 'Musanze, Volcanoes National Park', 
      price: 1500, 
      status: 'Active', 
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80', 
      category: 'Tour',
      availableSlots: 12,
      description: 'Once-in-a-lifetime mountain gorilla trekking expedition guided by seasoned conservation rangers. Includes park permit and trackers.'
    },
    { 
      id: 'list-2', 
      name: 'Lakeside Premium Eco Lodge Suite', 
      location: 'Gisenyi, Lake Kivu', 
      price: 220, 
      status: 'Active', 
      img: 'https://images.unsplash.com/photo-1542113300-474be6f89073?auto=format&fit=crop&q=80', 
      category: 'Hotel',
      availableSlots: 5,
      description: 'Secluded solar-powered cabin with pristine panoramic views of Lake Kivu. Local farm-to-table breakfast and kayaks included.'
    },
    { 
      id: 'list-3', 
      name: 'Kigali Art & Historical Cultural Tour', 
      location: 'Kigali City Center', 
      price: 85, 
      status: 'Active', 
      img: 'https://images.unsplash.com/photo-1540206276207-3f2439c50400?auto=format&fit=crop&q=80', 
      category: 'Experience',
      availableSlots: 20,
      description: 'Immersive exploration of Kigalis thriving modern art studios, local craft markets, historical archives, and custom espresso tastings.'
    },
  ]);

  // Inventory forms states
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [isEditingListing, setIsEditingListing] = useState<BusinessListing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item inputs
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'Hotel' | 'Tour' | 'Experience'>('Tour');
  const [newSlots, setNewSlots] = useState('10');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('https://images.unsplash.com/photo-1544124499-58ed34b79148?auto=format&fit=crop&q=80');

  // Review states with reply features
  const [reviews, setReviews] = useState([
    { id: 'rev-1', guest: 'Sarah Jenkins', rating: 5, date: '2 days ago', text: 'The Gorilla trek exceeded every high expectation I had! Exceptionally managed.', reply: 'Thank you Sarah, we love guiding you!' },
    { id: 'rev-2', guest: 'Marcus Tournier', rating: 4, date: '5 days ago', text: 'Stunning eco-lodge suite with great design. Breakfast service was slightly delayed, but highly recommended.', reply: '' },
    { id: 'rev-3', guest: 'Elena Rodriguez', rating: 5, date: '1 week ago', text: 'Remarkable hospitality. True cultural immersion.', reply: '' }
  ]);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Selected booking in approval workflow
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Listings crud functions
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) {
      showToast('⚠️ Please fill out required fields');
      return;
    }
    const created: BusinessListing = {
      id: `list-${Date.now()}`,
      name: newName,
      location: newLocation || 'Rwanda',
      price: parseFloat(newPrice) || 50,
      status: 'Active',
      img: newImg || 'https://images.unsplash.com/photo-1544124499-58ed34b79148?auto=format&fit=crop&q=80',
      category: newCategory,
      availableSlots: parseInt(newSlots) || 10,
      description: newDesc || 'No description provided.'
    };
    setListings([created, ...listings]);
    setIsAddingListing(false);
    showToast(`🎉 Listing "${created.name}" created successfully!`);
    
    // Reset forms
    setNewName('');
    setNewLocation('');
    setNewPrice('');
    setNewSlots('10');
    setNewDesc('');
  };

  const handleUpdateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingListing) return;
    
    setListings(listings.map(item => item.id === isEditingListing.id ? isEditingListing : item));
    setIsEditingListing(null);
    showToast(`✍️ Listing details updated successfully!`);
  };

  const handleDeleteListing = (id: string, name: string) => {
    if (confirm(`Are you sure you want to retire listing "${name}"?`)) {
      setListings(listings.filter(i => i.id !== id));
      showToast(`🗑️ Removed listing: ${name}`);
    }
  };

  const toggleListingStatus = (id: string) => {
    setListings(listings.map(item => {
      if (item.id === id) {
        const nextStatus: BusinessListing['status'] = item.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Listing is now set to ${nextStatus.toUpperCase()}`);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  // Booking approval methods
  const handleApproveBooking = (bookingId: string) => {
    dbService.updateBooking(bookingId, { status: 'confirmed' });
    showToast(`✅ Booking ${bookingId} has been Approved and Confirmed!`);
  };

  const handleDeclineBooking = (bookingId: string) => {
    if (confirm(`Are you sure you want to decline booking request ${bookingId}?`)) {
      dbService.updateBooking(bookingId, { status: 'cancelled' });
      showToast(`❌ Booking ${bookingId} has been Declined and Cancelled.`);
    }
  };

  // Review reply compiler
  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, reply: replyText } : r));
    setReplyText('');
    setActiveReplyId(null);
    showToast('💬 Your response to the customer has been posted.');
  };

  // Calculations for dynamic partner statistics
  const partnerBookings = bookings; // In a larger system we would filter by operator items
  const pendingRequests = partnerBookings.filter(b => b.status === 'pending');
  const confirmedRequests = partnerBookings.filter(b => b.status === 'confirmed');
  const cancelledRequests = partnerBookings.filter(b => b.status === 'cancelled');

  // Financial compilation
  const totalRevenue = confirmedRequests.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalPotentialRevenue = totalRevenue + pendingRequests.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const approvalRate = partnerBookings.length > 0
    ? Math.round((confirmedRequests.length / (partnerBookings.length - cancelledRequests.length || 1)) * 100)
    : 100;

  // Selected booking logic in detail workflow
  const focusedBookingId = selectedBookingId || (pendingRequests.length > 0 ? pendingRequests[0].id : partnerBookings[0]?.id);
  const selectedBookingDetails = partnerBookings.find(b => b.id === focusedBookingId);

  // Render Core Overview Dashboard Section
  const renderOverview = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Metric bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass rounded-[2rem] p-6 border border-white/5 bg-linear-to-b from-white/[0.02] to-transparent shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gold-500/10 rounded-2xl text-gold-400">
                <DollarSign size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ArrowUpRight size={10} /> +14%
              </span>
            </div>
            <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Total Confirmed Revenue</p>
            <h3 className="text-3xl font-display font-black text-white">${totalRevenue.toLocaleString()}</h3>
            <p className="text-[10px] text-white/40 mt-1 italic">Potential: ${totalPotentialRevenue.toLocaleString()} with queue</p>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-white/5 bg-linear-to-b from-white/[0.02] to-transparent shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold text-gold-400 bg-gold-500/10 px-1.5 py-0.5 rounded-md animate-pulse">
                ACTION REQUIRED
              </span>
            </div>
            <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Approval Queue</p>
            <h3 className="text-3xl font-display font-black text-white">{pendingRequests.length}</h3>
            <p className="text-[10px] text-white/40 mt-1">Pending host approval decisions</p>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-white/5 bg-linear-to-b from-white/[0.02] to-transparent shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <Percent size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold text-accent text-white/30">Ratio</span>
            </div>
            <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Acceptance Score</p>
            <h3 className="text-3xl font-display font-black text-white">{approvalRate}%</h3>
            <p className="text-[10px] text-white/40 mt-1">High score boosts organic display rank</p>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-white/5 bg-linear-to-b from-white/[0.02] to-transparent shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400">
                <Package size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-md">
                CRM
              </span>
            </div>
            <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.25em] mb-1">Live Host Inventory</p>
            <h3 className="text-3xl font-display font-black text-white">{listings.length} Services</h3>
            <p className="text-[10px] text-white/40 mt-1">{listings.filter(l => l.status === 'Active').length} currently active on Rwanda Hub</p>
          </div>
        </div>

        {/* Core details workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Custom SVG Earnings Trends & Visualizer */}
          <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-display text-lg font-bold text-white">Earnings & Booking Volume Trends</h4>
                <p className="text-xs text-white/30">Local currency conversions calculated live</p>
              </div>
              <div className="flex gap-2">
                <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-white font-bold uppercase tracking-widest focus:outline-none">
                  <option className="bg-forest-950 text-white">Last 3 Months</option>
                  <option className="bg-forest-950 text-white">This Year</option>
                </select>
              </div>
            </div>

            {/* Simulated Modern Vector Area Chart using custom SVG */}
            <div className="h-48 w-full relative mt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DFB253" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#DFB253" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid guidelines */}
                <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                
                {/* SVG Area */}
                <path 
                  d="M 0 130 C 50 120, 100 110, 150 90 C 200 70, 250 110, 300 60 C 350 10, 400 30, 450 40 L 500 20 L 500 150 L 0 150 Z" 
                  fill="url(#gradient-area)" 
                />
                
                {/* SVG Path line */}
                <path 
                  d="M 0 130 C 50 120, 100 110, 150 90 C 200 70, 250 110, 300 60 C 350 10, 400 30, 450 40 L 500 20" 
                  fill="none" 
                  stroke="#DFB253" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />

                {/* Pulsing interactive nodes */}
                <circle cx="300" cy="60" r="5" fill="#DFB253" stroke="rgba(223, 178, 83, 0.4)" strokeWidth="6" className="animate-pulse" />
                <circle cx="500" cy="20" r="5" fill="#DFB253" stroke="rgba(223, 178, 83, 0.4)" strokeWidth="6" />
              </svg>
              
              {/* Timeline labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] font-mono text-white/30 uppercase tracking-widest pt-2">
                <span>March 2026</span>
                <span>April 2026</span>
                <span>May 2026 (Active)</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-6">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                  <span className="text-[10px] font-black uppercase text-white/50">Tours Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-white/50">Lodge Bookings</span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 italic">Payouts completed on the 1st of every calendar month</p>
            </div>
          </div>

          {/* Quick Approvals Action Box */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-display text-sm font-black text-white uppercase tracking-[0.1em]">Approval Quicklist</h4>
              <button 
                onClick={() => onTabChange?.('bookings')}
                className="text-gold-400 text-[9px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Workflow Mode <ChevronRight size={10} />
              </button>
            </div>

            <div className="glass rounded-[2rem] p-6 border border-white/5 flex-1 flex flex-col justify-between">
              <div className="space-y-4 max-h-[280px] overflow-y-auto custom-scrollbar">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((b, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setSelectedBookingId(b.id);
                        onTabChange?.('bookings');
                      }}
                      className="flex gap-3 p-3 bg-white/3 hover:bg-white/5 border border-white/5 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0 text-white/40 group-hover:bg-gold-500 group-hover:text-forest-900 transition-colors">
                        <Clock size={14} className="group-hover:animate-spin" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-xs font-bold text-white truncate pr-1">{b.itemName}</p>
                          <span className="text-[8px] font-mono text-gold-400 font-bold bg-gold-400/15 px-1.5 py-0.5 rounded-md">${b.price}</span>
                        </div>
                        <p className="text-[9px] text-white/40 mt-0.5">{b.email.split('@')[0]} • {b.partySize}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle size={32} className="mx-auto text-green-500/20 mb-3" />
                    <p className="text-xs text-white/30 italic">No pending requests! All cleared.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 mt-4">
                <button 
                  onClick={() => onTabChange?.('bookings')}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded-xl transition-all"
                >
                  Enter Booking Terminal ({pendingRequests.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Partner trust policy banner */}
        <div className="p-6 rounded-[2rem] bg-gold-500/5 border border-gold-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-3 items-center">
            <ShieldCheck className="text-gold-500 shrink-0" size={24} />
            <div>
              <p className="text-xs font-bold text-white">Rwanda Hub Partner Fair Use Policy Enforced</p>
              <p className="text-[10px] text-white/30">Hosts must approve or reject pending requests within 24 hours of notification to maintain organic visibility score.</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('settings')}
            className="px-4 py-2 bg-white/5 text-white/60 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5"
          >
            Review Terms
          </button>
        </div>
      </div>
    );
  };

  // Render Service listings / Inventory CRUD
  const renderListings = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Rwanda Hub Local Service Inventory</h2>
            <p className="text-xs text-white/30 mt-1">Manage, modify prices, and check slot allocations of listed offerings</p>
          </div>
          <button 
            onClick={() => setIsAddingListing(true)}
            className="flex items-center gap-2 bg-gold-500 text-forest-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/15 cursor-pointer"
          >
            <Plus size={14} /> New Travel Package
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(l => (
            <div key={l.id} className="glass rounded-[2rem] overflow-hidden border border-white/5 group hover:border-gold-500/20 transition-all flex flex-col">
              <div className="h-44 relative overflow-hidden bg-forest-950">
                <img src={l.img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={l.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Visual labels */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <button 
                    onClick={() => {
                      setIsEditingListing(item => item?.id === l.id ? null : l);
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-gold-400 hover:border-gold-500/20 transition-all"
                    title="Edit Item details"
                  >
                    <Edit size={12} />
                  </button>
                  <button 
                    onClick={() => handleDeleteListing(l.id, l.name)}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/20 transition-all"
                    title="Retire Item"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-2.5 py-0.5 bg-gold-500 text-forest-950 rounded-lg text-[8px] font-mono font-black uppercase tracking-widest">{l.category}</span>
                  <span className="px-2 py-0.5 bg-black/50 backdrop-blur-xs rounded-lg text-[8px] font-semibold text-white/80">{l.availableSlots} Slots Available</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-base font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-1">{l.name}</h4>
                  </div>
                  <p className="text-[10px] text-white/40 line-clamp-2 italic mb-4">"{l.description}"</p>
                  
                  <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-bold tracking-wider mb-5">
                    <MapPin size={11} className="text-gold-500" /> {l.location}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest block">Unit Base Price</span>
                    <span className="text-sm font-black text-gold-400 font-mono">${l.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleListingStatus(l.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                        l.status === 'Active' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                          : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${l.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                      {l.status}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Pending Booking Approvals & Workflow Section
  const renderBookingsApprovalTab = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Booking Approval Terminal</h2>
            <p className="text-xs text-white/30 mt-1">Accept or decline incoming ticket orders and accommodations</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <span className="px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest text-[#DFB253]">Pending Queue ({pendingRequests.length})</span>
          </div>
        </div>

        {/* Splitscreen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Incoming requests lists column */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em] px-1">Reservation Request Line</h4>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {partnerBookings.map((b) => (
                <div 
                  key={b.id} 
                  onClick={() => setSelectedBookingId(b.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    b.id === focusedBookingId 
                      ? 'bg-gold-500/10 border-gold-500/30' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{b.itemEmoji || '🏷️'}</span>
                      <h5 className="text-xs font-bold text-white truncate max-w-[140px]">{b.itemName}</h5>
                    </div>
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      b.status === 'pending' 
                        ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' 
                        : b.status === 'confirmed' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/10'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>{b.email.split('@')[0]} ({b.partySize})</span>
                    <span className="text-gold-400 font-bold">${b.price}</span>
                  </div>

                  <div className="text-[9px] text-white/20 mt-2 font-mono flex justify-between">
                    <span>Date: {b.date}</span>
                    <span>ID: {b.id.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & verification workflow pane */}
          <div className="lg:col-span-7">
            <h4 className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em] px-1 mb-4">Detailed Request Review</h4>
            
            {selectedBookingDetails ? (
              <div className="glass rounded-[2.5rem] p-8 border border-white/5 bg-linear-to-b from-white/[0.02] to-transparent space-y-6">
                
                {/* Header overview */}
                <div className="flex justify-between items-start border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gold-500/15 flex items-center justify-center text-3xl">
                      {selectedBookingDetails.itemEmoji || '🗺️'}
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-bold text-gold-500 uppercase tracking-widest bg-gold-400/5 px-2 py-0.5 rounded border border-gold-500/10">Type: {selectedBookingDetails.itemType.toUpperCase()}</span>
                      <h3 className="text-lg font-bold text-white mt-1">{selectedBookingDetails.itemName}</h3>
                      <p className="text-xs text-white/40 font-mono mt-0.5">Booking UUID: {selectedBookingDetails.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block">Customer Order Value</span>
                    <span className="text-2xl font-black text-gold-400">${selectedBookingDetails.price}</span>
                  </div>
                </div>

                {/* Traveler profiles & metrics */}
                <div className="grid grid-cols-2 gap-6 bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block mb-1">Traveler Account Pin</span>
                    <p className="text-xs font-bold text-white truncate">{selectedBookingDetails.email}</p>
                    <span className="text-[9px] text-white/40 font-mono">{selectedBookingDetails.phone || 'No Phone Registered'}</span>
                  </div>

                  <div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block mb-1">Group Party Size</span>
                    <p className="text-xs font-bold text-white">{selectedBookingDetails.partySize}</p>
                    <span className="text-[9px] text-white/40">Includes local conservation fees</span>
                  </div>
                </div>

                {/* Additional workflow details */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs py-2 border-b border-white/5">
                    <span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">Scheduled Journey Date</span>
                    <span className="text-white font-mono font-bold">{selectedBookingDetails.date}</span>
                  </div>

                  {selectedBookingDetails.time && (
                    <div className="flex justify-between text-xs py-2 border-b border-white/5">
                      <span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">Requested Hour Slot</span>
                      <span className="text-white font-mono font-bold">{selectedBookingDetails.time}</span>
                    </div>
                  )}

                  {selectedBookingDetails.seat && (
                    <div className="flex justify-between text-xs py-2 border-b border-white/5">
                      <span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">Allocated Seat Code</span>
                      <span className="text-white font-mono font-bold uppercase tracking-widest">{selectedBookingDetails.seat}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs py-2 border-b border-white/5">
                    <span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">Payment Settlement Method</span>
                    {selectedBookingDetails.paymentMethod ? (
                      <span className="text-gold-400 font-bold flex items-center gap-1.5 bg-gold-400/5 px-2 py-0.5 rounded-lg border border-gold-500/10">
                        {selectedBookingDetails.paymentMethod.toLowerCase().includes('momo') || selectedBookingDetails.paymentMethod.toLowerCase().includes('mobile') ? (
                          <>
                            <Smartphone size={10} />
                            MTN MoMo Mobile Money ({selectedBookingDetails.momoNumber || 'Verified'})
                          </>
                        ) : (
                          <>
                            <CreditCard size={10} />
                            {selectedBookingDetails.paymentMethod}
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-white/30 italic">No Payment Spec</span>
                    )}
                  </div>

                  {selectedBookingDetails.insurance?.selected && (
                    <div className="flex justify-between text-xs py-2 border-b border-white/5">
                      <span className="text-white/40 uppercase text-[9px] font-bold tracking-wider">Traveler Protection Scheme</span>
                      <span className="text-green-400 font-bold font-mono tracking-wider flex items-center gap-1">
                        ✓ SECURED INSURED ({selectedBookingDetails.insurance.type.toUpperCase()})
                      </span>
                    </div>
                  )}
                </div>

                {/* Special directions or client comments */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-inner">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.25em] block mb-1.5">Special Traveler Requests & Messages</span>
                  {selectedBookingDetails.notes ? (
                    <p className="text-xs text-white/70 leading-relaxed italic border-l-2 border-gold-500/20 pl-3 py-0.5">
                      "{selectedBookingDetails.notes}"
                    </p>
                  ) : (
                    <span className="text-xs text-white/20 italic block pl-1">No special requests specified.</span>
                  )}
                </div>

                {/* Interactive workflow decisions */}
                <div className="pt-6 border-t border-white/5 flex gap-4">
                  {selectedBookingDetails.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleDeclineBooking(selectedBookingDetails.id)}
                        className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer text-center"
                      >
                        Decline Reservation
                      </button>
                      <button 
                        onClick={() => handleApproveBooking(selectedBookingDetails.id)}
                        className="flex-[2] py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-xl shadow-gold-500/10 text-center"
                      >
                        Approve & Confirm Ticket
                      </button>
                    </>
                  ) : (
                    <div className="w-full p-4 bg-white/3 rounded-2xl border border-white/5 text-center">
                      <p className="text-xs text-white/50 font-bold">
                        This booking status is set to{' '}
                        <span className={`uppercase tracking-widest font-mono ${selectedBookingDetails.status === 'confirmed' ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedBookingDetails.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="glass rounded-[2.5rem] p-12 text-center border border-white/5 opacity-50">
                <Clock size={40} className="mx-auto text-white/10 mb-4" />
                <p className="text-sm text-white/30 italic">Select a booking to view its verification details and initiate approval workflow</p>
              </div>
            )}
            
          </div>

        </div>
      </div>
    );
  };

  // Availability calendar controller view
  const renderCalendarTab = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Dynamic Availability Calendar</h2>
            <p className="text-xs text-white/30 mt-1">Check daily host reservations and update live slots</p>
          </div>
          <button className="bg-gold-500 text-forest-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Override Slots</button>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.2em]">{day}</div>
          ))}
          {Array.from({ length: 31 }).map((_, i) => {
            const hasBooking = i === 1 || i === 2 || i === 14;
            return (
              <div key={i} className={`glass aspect-[1.1] rounded-2xl border border-white/5 p-3 flex flex-col justify-between hover:border-gold-500/20 transition-all cursor-pointer ${i % 7 === 5 || i % 7 === 6 ? 'bg-white/3' : ''}`}>
                <span className="text-[10px] font-bold text-white/30">{i + 1}</span>
                {hasBooking && (
                  <div className="flex items-center gap-1.5 bg-gold-400/10 border border-gold-500/10 px-1 py-0.5 rounded text-[8px] text-gold-400 font-bold uppercase truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    Trip Res
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Multi-tenant rating & reviews respond list
  const renderReviewsTab = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Guest Feedback & Reputation</h2>
            <p className="text-xs text-white/30 mt-1">Reply to review comments to build trust with future customers</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/5">
            <Star className="text-gold-500 fill-gold-500" size={14} />
            <span className="text-sm font-bold text-white">4.92 / 5</span>
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest ml-1">Legacy score</span>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="glass rounded-[2rem] p-6 border border-white/8 bg-linear-to-b from-white/[0.01] to-transparent">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/60">
                    {rev.guest[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{rev.guest}</h5>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} size={8} className={si < rev.rating ? 'text-gold-500 fill-gold-500' : 'text-white/10'} />
                      ))}
                      <span className="text-[9px] text-white/20 ml-2">{rev.date}</span>
                    </div>
                  </div>
                </div>
                {!rev.reply && activeReplyId !== rev.id && (
                  <button 
                    onClick={() => {
                      setActiveReplyId(rev.id);
                      setReplyText('');
                    }}
                    className="text-[9px] font-black text-gold-500 font-mono uppercase tracking-widest px-3 py-1.5 bg-gold-500/10 border border-gold-500/10 rounded-lg hover:bg-gold-500 hover:text-forest-900 transition-all cursor-pointer"
                  >
                    Respond
                  </button>
                )}
              </div>

              <p className="text-xs text-white/60 leading-relaxed italic mb-4">"{rev.text}"</p>

              {rev.reply && (
                <div className="pl-4 border-l-2 border-gold-500/30 bg-white/[0.01] py-2">
                  <span className="text-[9px] font-black text-gold-500 uppercase tracking-widest">Your Response</span>
                  <p className="text-[11px] text-white/40 leading-relaxed mt-0.5 italic">"{rev.reply}"</p>
                </div>
              )}

              {activeReplyId === rev.id && (
                <div className="mt-4 p-4 border border-white/5 bg-white/3 rounded-xl space-y-3">
                  <textarea 
                    rows={3} 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a supportive, authentic reply to this guest..."
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setActiveReplyId(null)} className="px-3 py-1 text-[9px] uppercase font-black text-white/40 tracking-widest hover:text-white">Cancel</button>
                    <button 
                      onClick={() => handleSubmitReply(rev.id)} 
                      className="px-4 py-1.5 text-[9px] uppercase font-black bg-gold-500 text-forest-900 rounded-lg cursor-pointer hover:bg-gold-400"
                    >
                      Post Response
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Earnings settlement tab view
  const renderPaymentsTab = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2rem] glass border border-white/5 bg-gradient-to-br from-gold-500/5 to-transparent">
            <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-widest">Withdrawable Volume</span>
            <h3 className="text-3xl font-display font-black text-white mt-1">${(totalRevenue * 0.95).toFixed(2)}</h3>
            <p className="text-[10px] text-white/40 mt-1">Reflects 5% standard hub escrow service fees</p>
            <button 
              onClick={() => showToast('🏦 Withdrawal pipeline dispatched. Settlement expected in 24 hours.')}
              className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 rounded-xl font-black text-[10px] uppercase tracking-widest mt-6 transition-all"
            >
              Push Payout To Bank/MoMo
            </button>
          </div>

          <div className="p-8 rounded-[2rem] glass border border-white/5 bg-gradient-to-br from-white/[0.012] to-transparent">
            <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-widest">Escrow Reserved</span>
            <h3 className="text-3xl font-display font-black text-white mt-1">${(totalRevenue * 0.05).toFixed(2)}</h3>
            <p className="text-[10px] text-white/40 mt-1">Safeguards disputes & dynamic returns</p>
            <button className="w-full py-3 bg-white/5 text-white/40 rounded-xl font-black text-[10px] uppercase tracking-widest mt-6 cursor-not-allowed">
              In Escrow
            </button>
          </div>

          <div className="p-8 rounded-[2rem] glass border border-white/5 bg-gradient-to-br from-white/[0.012] to-transparent">
            <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-widest">Total Earned Gross</span>
            <h3 className="text-3xl font-display font-black text-white mt-1">${totalRevenue.toFixed(2)}</h3>
            <p className="text-[10px] text-white/40 mt-1">All verified client settlements compiled</p>
            <button 
              onClick={() => showToast('📈 Dynamic income reports downloaded successfully.')}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest mt-6 transition-all"
            >
              Export Financial Audits
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Marketing tools simulation
  const renderPromotionsTab = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Partner Growth Marketing</h2>
            <p className="text-xs text-white/30 mt-1">Propel your services to the front page of the Rwanda Hub exploration cards</p>
          </div>
          <button 
            onClick={() => showToast('🚀 High exposure campaign has been initialized.')}
            className="px-5 py-2.5 bg-gold-500 text-forest-950 rounded-xl font-bold text-xs hover:bg-gold-400 transition-all cursor-pointer"
          >
            Launch Prime Exposure
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-[2rem] p-6 border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center">
              <Sliders size={20} />
            </div>
            <h4 className="text-white font-bold text-base">Flash Promotion Deals</h4>
            <p className="text-xs text-white/40 leading-relaxed">Provide 10% limited-time checkout markdowns to complete unallocated dates.</p>
            <button onClick={() => showToast('Flash Promotion activated!')} className="text-gold-400 font-mono font-black uppercase text-[10px] tracking-widest hover:underline pt-2 inline-block">Execute Tool</button>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <h4 className="text-white font-bold text-base">Prime Boost Exposure</h4>
            <p className="text-xs text-white/40 leading-relaxed">Increases target list search weight by 2.2x for the next 48 high-volume booking hours.</p>
            <button onClick={() => showToast('Exposure Booster initiated!')} className="text-indigo-400 font-mono font-black uppercase text-[10px] tracking-widest hover:underline pt-2 inline-block">Activate Boost</button>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Users size={20} />
            </div>
            <h4 className="text-white font-bold text-base">Corporate / Group Bundles</h4>
            <p className="text-xs text-white/40 leading-relaxed">Offer customized billing adjustments and dynamic invoicing options for teams of 6 or more.</p>
            <button onClick={() => showToast('Group Booking Bundle enabled!')} className="text-pink-400 font-mono font-black uppercase text-[10px] tracking-widest hover:underline pt-2 inline-block">Enable Bundles</button>
          </div>
        </div>
      </div>
    );
  };

  // Dynamic Profile configuration
  const renderSettingsTab = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white">Host Business Identity</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 ml-1">Company Host Name</label>
                <input 
                  type="text" 
                  defaultValue={user.businessName || user.name} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white uppercase font-mono font-bold tracking-wider focus:outline-none focus:border-gold-500" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 ml-1">Support Contact Email</label>
                <input 
                  type="email" 
                  disabled
                  value={user.email} 
                  className="w-full bg-white/3 border border-white/5 rounded-xl px-5 py-3 text-xs text-white/30 cursor-not-allowed uppercase font-mono tracking-wider" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 ml-1">Core Professional License ID</label>
                <input 
                  type="text" 
                  placeholder="RDB-L-2026-99" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs text-white tracking-widest font-mono focus:outline-none focus:border-gold-500" 
                />
              </div>
            </div>

            <button 
              onClick={() => showToast('✍️ Partner Profile specifications synchronized successfully.')}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 rounded-xl font-bold text-xs uppercase cursor-pointer"
            >
              Update Registration Params
            </button>
          </div>

          <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white">Safety System Alerts</h3>
            
            <div className="space-y-4">
              {[
                { label: 'Instant SMS Booking Pings', desc: 'Secure direct transmission to partner mobile lines', active: true },
                { label: 'Escrow Transaction Alerts', desc: 'Notify instantly when guest funds complete clearing protocol', active: true },
                { label: 'Chat Direct-To-Client Messenger', desc: 'Accept direct questions from travelers before checkout completed', active: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/3 rounded-xl border border-white/5">
                  <div className="pr-4">
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{item.desc}</p>
                  </div>
                  <div className={`w-10 h-6.5 rounded-full p-0.5 cursor-pointer transition-colors ${item.active ? 'bg-gold-500' : 'bg-white/10'}`}>
                    <div className={`w-5.5 h-5.5 rounded-full bg-white transition-transform ${item.active ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Active Tab layout mapping controller node
  const getContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'listings':
        return renderListings();
      case 'bookings':
        return renderBookingsApprovalTab();
      case 'calendar':
        return renderCalendarTab();
      case 'reviews':
        return renderReviewsTab();
      case 'payments':
        return renderPaymentsTab();
      case 'promotions':
        return renderPromotionsTab();
      case 'settings':
        return renderSettingsTab();
      case 'messages':
        return <CommunicationCenter currentUser={user} />;
      default:
        return renderOverview();
    }
  };

  return (
    <>
      <div className="relative">
        {getContent()}
      </div>

      {/* Slide-over Form Overlays & Modals */}
      <AnimatePresence>
        {isAddingListing && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingListing(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl glass rounded-[2.5rem] border border-white/10 p-8 overflow-hidden z-20"
            >
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Initiate New Service Offering</h3>
                  <p className="text-xs text-white/30 italic">Step 1: Listing Particulars & Allotment</p>
                </div>
                <button 
                  onClick={() => setIsAddingListing(false)} 
                  className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Package / Service Title</label>
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Luxury Kivu Catamaran Cruise" 
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Category Select</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none"
                    >
                      <option value="Tour">TOUR EXPERIENCE</option>
                      <option value="Hotel">ACCOMMODATION</option>
                      <option value="Experience">LOCAL CULTURE EXPERIENCE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Base Price Point ($USD)</label>
                    <input 
                      type="number" 
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="120" 
                      className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Initial Slots/Capacity</label>
                    <input 
                      type="number" 
                      required
                      value={newSlots}
                      onChange={(e) => setNewSlots(e.target.value)}
                      placeholder="e.g., 20" 
                      className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Location Details</label>
                    <input 
                      type="text" 
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Gisenyi, Lake Kivu" 
                      className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Service Banner (Unsplash Image URL)</label>
                  <input 
                    type="text" 
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                    placeholder="https://..." 
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white text-left text-white/50 focus:outline-none focus:border-gold-500 font-mono" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Authentic Traveler Description</label>
                  <textarea 
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Provide accurate, humble specifications of what the guest receives, inclusions, and difficulty parameters..."
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white resize-none focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingListing(false)} 
                    className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Cancel Draft
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gold-500/15"
                  >
                    Deploy live listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Listing Modal Overlay */}
      <AnimatePresence>
        {isEditingListing && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingListing(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl glass rounded-[2.5rem] border border-white/10 p-8 overflow-hidden z-20"
            >
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Modify Service Specs</h3>
                  <p className="text-xs text-white/30 italic">Target: {isEditingListing.name}</p>
                </div>
                <button 
                  onClick={() => setIsEditingListing(null)} 
                  className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateListing} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Service Title</label>
                  <input 
                    type="text" 
                    required
                    value={isEditingListing.name}
                    onChange={(e) => setIsEditingListing({ ...isEditingListing, name: e.target.value })}
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Base Price point ($USD)</label>
                    <input 
                      type="number" 
                      required
                      value={isEditingListing.price}
                      onChange={(e) => setIsEditingListing({ ...isEditingListing, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Available Allocated Slots</label>
                    <input 
                      type="number" 
                      required
                      value={isEditingListing.availableSlots}
                      onChange={(e) => setIsEditingListing({ ...isEditingListing, availableSlots: parseInt(e.target.value) || 0 })}
                      className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500 font-mono" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Location Details</label>
                  <input 
                    type="text" 
                    value={isEditingListing.location}
                    onChange={(e) => setIsEditingListing({ ...isEditingListing, location: e.target.value })}
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Service Banner Link</label>
                  <input 
                    type="text" 
                    value={isEditingListing.img}
                    onChange={(e) => setIsEditingListing({ ...isEditingListing, img: e.target.value })}
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white/50 focus:outline-none focus:border-gold-500 font-mono" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/45 uppercase tracking-widest mb-1.5 ml-1">Public Description</label>
                  <textarea 
                    rows={3}
                    value={isEditingListing.description}
                    onChange={(e) => setIsEditingListing({ ...isEditingListing, description: e.target.value })}
                    className="w-full bg-forest-950 border border-white/10 rounded-xl px-5 py-3 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingListing(null)} 
                    className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Cancel Changes
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gold-500/15"
                  >
                    Save Specifications
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Local Toast Layer */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[300] px-8 py-4 glass rounded-[2rem] border border-gold-500/30 text-gold-300 font-bold text-xs shadow-2xl flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
