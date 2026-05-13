import React, { useState } from 'react';
import { 
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
  CalendarDays,
  Tag,
  Download,
  XCircle
} from 'lucide-react';
import { DashboardProps, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import CommunicationCenter from './CommunicationCenter';

interface Listing {
  id: string;
  name: string;
  location: string;
  price: string;
  status: 'Active' | 'Pending' | 'Draft';
  img: string;
  category: 'Hotel' | 'Tour' | 'Experience';
}

export default function BusinessDashboard({ activeTab, user, bookings }: DashboardProps) {
  const isAdmin = user.role === UserRole.ADMIN;
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1544124499-58ed34b79148?auto=format&fit=crop&q=80', // Luxury Suite
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80', // Pool Resort
    'https://images.unsplash.com/photo-1590073242678-70ee3fc28e84?auto=format&fit=crop&q=80', // Interior design
  ];

  const [listings, setListings] = useState<Listing[]>([
    { id: '1', name: 'Gorilla Trekking Package', location: 'Musanze', price: '$1500', status: 'Active', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801', category: 'Tour' },
    { id: '2', name: 'Lakeside Eco Lodge', location: 'Gisenyi', price: '$220/night', status: 'Pending', img: 'https://images.unsplash.com/photo-1542113300-474be6f89073', category: 'Hotel' },
    { id: '3', name: 'Kigali Cultural Tour', location: 'Kigali', price: '$85', status: 'Active', img: 'https://images.unsplash.com/photo-1540206276207-3f2439c50400', category: 'Tour' },
  ]);

  const [isAddingListing, setIsAddingListing] = useState(false);

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[80vh] pt-4">
      {/* Background Slideshow */}
      <div className="absolute inset-0 -top-8 -mx-10 rounded-[4rem] overflow-hidden -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            onAnimationComplete={() => setTimeout(() => setCurrentImage((currentImage + 1) % images.length), 8000)}
            className="absolute inset-0"
          >
            <img src={images[currentImage]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-transparent to-forest-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {isAdmin && (
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-[2rem] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 ml-4">
            <ShieldCheck className="text-gold-500" size={20} />
            <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Administrative Mode Active</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gold-500 text-forest-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-400 transition-all">Audit Partners</button>
          </div>
        </div>
      )}

      {/* Metric Header & Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Booking Request', value: bookings.length > 0 ? bookings.length.toString() : '24', sub: 'Last 7 days', icon: Calendar, color: 'text-blue-400' },
            { label: 'Total Revenue', value: '$12,450', sub: 'This month', icon: DollarSign, color: 'text-green-400' },
            { label: 'Avg Rating', value: '4.8', sub: '124 Reviews', icon: Star, color: 'text-gold-400' },
            { label: 'Profile Views', value: '1,205', sub: 'Visibility', icon: TrendingUp, color: 'text-purple-400' },
          ].map((stat, idx) => (
            <div key={idx} className="glass rounded-3xl p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <stat.icon size={18} className={stat.color} />
                <span className="text-[10px] font-bold text-white/10 uppercase tracking-tighter">Live</span>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-display font-bold text-white">{stat.value}</h3>
              <p className="text-[10px] font-bold text-white/30 tracking-tight">{stat.sub}</p>
            </div>
          ))}
        </div>
        <div className="glass rounded-3xl p-6 border border-white/5 bg-gold-500/5">
           <h4 className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <BarChart3 size={14} /> Occupancy
           </h4>
           <div className="space-y-4">
              {[
                { label: 'Hotel Rooms', val: 78 },
                { label: 'Tour Slots', val: 45 },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-white/40">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500" style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
              <button className="w-full py-2 bg-gold-500/10 text-gold-500 text-[9px] font-black uppercase tracking-widest rounded-lg mt-2">Boost Sales</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-display text-xl font-bold text-white">Your Listed Services</h3>
            <button 
              onClick={() => setIsAddingListing(true)}
              className="flex items-center gap-2 bg-gold-500 text-forest-900 px-4 py-2 rounded-xl font-bold text-xs hover:bg-gold-400 transition-all"
            >
              <Plus size={14} /> New Listing
            </button>
          </div>
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="glass rounded-[2rem] p-4 border border-white/5 flex gap-6 group hover:border-white/20 transition-all">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={listing.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white">{listing.name}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${listing.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gold-500/10 text-gold-500'}`}>
                      {listing.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {listing.location}</span>
                    <span className="font-bold text-gold-400">{listing.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-4">
                  {(isAdmin || listing.status === 'Draft') && (
                    <button 
                      onClick={() => deleteListing(listing.id)}
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/20 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/20 hover:text-gold-400">
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-display text-xl font-bold text-white px-2">Pending Requests</h3>
          <div className="glass rounded-[2.5rem] p-6 border border-white/5 space-y-6">
            {bookings.length > 0 ? bookings.slice(0, 4).map((booking, idx) => (
              <div key={idx} className="flex gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-gold-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-xs font-bold text-white truncate">{booking.itemName}</p>
                    <span className="text-[9px] text-white/20 whitespace-nowrap">{booking.date}</span>
                  </div>
                  <p className="text-[10px] text-white/40 tracking-tight">{booking.partySize} Guests • ${booking.price}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Calendar size={32} className="mx-auto text-white/10 mb-3" />
                <p className="text-xs text-white/30 italic">No pending requests</p>
              </div>
            )}
            <button className="w-full py-3 bg-white/5 rounded-2xl text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all">
              Manage All Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Partner Bookings</h2>
        <div className="flex gap-2">
           <button className="glass px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white flex items-center gap-2 border border-white/5">
            <Filter size={12} /> Filter
          </button>
          <button className="glass px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white flex items-center gap-2 border border-white/5">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/3 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Guest</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Listing</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.length > 0 ? bookings.map((b, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-[10px] font-bold text-gold-500">
                      {b.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{b.email.split('@')[0]}</p>
                      <p className="text-[10px] text-white/30">{b.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-white/80">{b.itemName}</td>
                <td className="px-6 py-4 text-xs text-white/40">{b.date}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-tighter">Confirmed</span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gold-400">${b.price}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic text-sm">No partner bookings recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCalendarTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Availability Calendar</h2>
        <div className="flex gap-2">
           <button className="bg-gold-500 text-forest-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Schedules</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">{day}</div>
        ))}
        {Array.from({ length: 31 }).map((_, i) => (
          <div key={i} className={`glass aspect-square rounded-2xl border border-white/5 p-2 flex flex-col justify-between hover:border-gold-500/30 transition-all cursor-pointer ${i % 7 === 5 || i % 7 === 6 ? 'bg-white/3' : ''}`}>
            <span className="text-[10px] font-bold text-white/40">{i + 1}</span>
            {i === 12 || i === 15 ? (
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-lg shadow-gold-500/50 mx-auto" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass rounded-[2.5rem] p-8 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 text-emerald-400">
            <BarChart3 size={20} /> Revenue Trends
          </h3>
          <div className="h-64 flex items-end gap-2 px-4">
             {[30, 45, 25, 60, 80, 55, 90, 75, 40, 65, 85, 100].map((h, i) => (
               <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-lg transition-all hover:bg-emerald-500/40" style={{ height: `${h}%` }} />
             ))}
          </div>
        </div>
        <div className="glass rounded-[2.5rem] p-8 border border-white/5">
           <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 text-gold-400">
            <Star size={20} /> Customer Ratings
          </h3>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-white/40 w-4">{stars}★</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500" style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 1}%` }} />
                </div>
                <span className="text-[10px] font-bold text-white/40">{stars === 5 ? '85%' : stars === 4 ? '12%' : '1%'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReputationTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Trust & Reputation</h2>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/5">
              <Star className="text-gold-500 fill-gold-500" size={16} />
              <span className="text-lg font-bold text-white">4.88</span>
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest ml-2">Legacy Score</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-[2rem] p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6">Rating Distribution</h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map(stars => (
                <div key={stars} className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-white/40 w-4">{stars}★</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500" style={{ width: `${stars === 5 ? 88 : stars === 4 ? 8 : 2}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">{stars === 5 ? '88%' : stars === 4 ? '8%' : '2%'}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass rounded-[2rem] p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4">Top Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {['Punctual', 'Clean', 'Expert Guide', 'Amazing View', 'Highly Recommend', 'Professional'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-white/60 tracking-wider">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4 mb-2">
            {['All Reviews', 'Positive', 'Needs Response', 'Flagged'].map((f, i) => (
              <button key={i} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-gold-500 text-forest-900 shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                {f}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            {[
              { user: 'Sarah J.', rating: 5, date: '2 days ago', msg: 'The Gorilla trek exceeded all expectations! The guides were so professional.', reply: null },
              { user: 'Marcus T.', rating: 4, date: '5 days ago', msg: 'Great view at the lodge, though the breakfast service was a bit slow.', reply: 'Thank you for your feedback Marcus, we are working on it!' },
              { user: 'Elena R.', rating: 5, date: '1 week ago', msg: 'Incredible cultural depth. Best tour we had in Rwanda.', reply: null },
            ].map((rev, i) => (
              <div key={i} className="glass rounded-[2rem] p-6 border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 font-bold">{rev.user[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-white">{rev.user}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} size={8} className={si < rev.rating ? 'text-gold-500 fill-gold-500' : 'text-white/10'} />
                        ))}
                        <span className="text-[9px] text-white/20 ml-2">{rev.date}</span>
                      </div>
                    </div>
                  </div>
                  {!rev.reply && <button className="text-[9px] font-black text-gold-500 uppercase tracking-widest px-3 py-1 bg-gold-500/10 rounded-lg hover:bg-gold-500 hover:text-forest-900 transition-all">Reply</button>}
                </div>
                <p className="text-xs text-white/50 leading-relaxed italic mb-4">"{rev.msg}"</p>
                {rev.reply && (
                  <div className="pl-4 border-l border-gold-500/30">
                    <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1">Your response</p>
                    <p className="text-[11px] text-white/30 italic">"{rev.reply}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPromotionsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Marketing & Campaigns</h2>
          <p className="text-xs text-white/30 mt-1">Boost your visibility and attract more guests.</p>
        </div>
        <button className="bg-gold-500 text-forest-900 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all">
          <Plus size={18} className="inline mr-2" /> Launch New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Tag, title: 'Flash Sales', desc: 'Temporary discounts to fill short-term gaps.', color: 'text-orange-400' },
          { icon: TrendingUp, title: 'Boost Listing', desc: 'Appear at the top of search for 48 hours.', color: 'text-purple-400' },
          { icon: Users, title: 'Group Offers', desc: 'Discounts for bookings of 5+ guests.', color: 'text-blue-400' },
        ].map((type, i) => (
          <div key={i} className="glass rounded-[2rem] p-6 border border-white/5 group hover:border-gold-500/20 transition-all cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${type.color}`}>
              <type.icon size={24} />
            </div>
            <h4 className="text-white font-bold mb-2">{type.title}</h4>
            <p className="text-[11px] text-white/40 leading-relaxed mb-6">{type.desc}</p>
            <button className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-gold-500 transition-colors">Select Tool</button>
          </div>
        ))}
      </div>

      <div className="space-y-6 pt-8">
        <h3 className="font-display font-bold text-white text-xl px-2">Active Campaigns</h3>
        <div className="space-y-4">
          {[
            { name: 'Kigali Art Week Special', status: 'Running', performance: '+24% Clicks', spend: '$14.20 / day', ends: '3 days' },
            { name: 'Early Bird Gorilla Trek', status: 'Paused', performance: '1.2k Views', spend: '$0.00', ends: 'Indefinite' },
          ].map((camp, i) => (
            <div key={i} className="glass rounded-[2.5rem] p-6 border border-white/5 flex flex-wrap items-center gap-8 group hover:border-white/10 transition-all">
              <div className="flex-1 min-w-[200px]">
                <h4 className="text-white font-bold mb-1">{camp.name}</h4>
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${camp.status === 'Running' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{camp.status}</span>
                </div>
              </div>
              <div className="text-left w-32">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Impact</p>
                <p className="text-sm font-bold text-gold-400">{camp.performance}</p>
              </div>
              <div className="text-left w-32">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Budget</p>
                <p className="text-sm font-bold text-white">{camp.spend}</p>
              </div>
              <div className="text-left w-24">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Expires</p>
                <p className="text-sm font-bold text-white/60">{camp.ends}</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Edit size={16} /></button>
                 <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Business Profile</h3>
            <p className="text-xs text-white/30">Your identity within the Rwanda Hub ecosystem.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gold-500/10 flex items-center justify-center border-2 border-dashed border-gold-500/20 text-gold-500">
                <Plus size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-1">Update Logo</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">JPG, PNG up to 2MB</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Business Name</label>
                <input type="text" defaultValue={user.businessName || user.name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">VAT / Tax ID</label>
                <input type="text" placeholder="Optional" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Public Bio</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white resize-none" placeholder="Describe your business to thousands of travelers..." />
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Business Address</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white" placeholder="Kigali, Rwanda" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Notification & Security</h3>
            <p className="text-xs text-white/30">How you interact with the platform.</p>
          </div>

          <div className="space-y-4">
             {[
               { title: 'Email Notifications', desc: 'Get booking alerts and system updates.', active: true },
               { title: 'SMS Integration', desc: 'Secure direct-to-phone traveler messaging.', active: false },
               { title: 'Payout Alerts', desc: 'Instant feedback when funds are cleared.', active: true },
               { title: 'Public Messenger', desc: 'Allow travelers to DM your business profile.', active: true },
             ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-6 glass rounded-3xl border border-white/5">
                   <div>
                     <p className="text-sm font-bold text-white mb-1">{pref.title}</p>
                     <p className="text-[10px] text-white/40">{pref.desc}</p>
                   </div>
                   <button className={`w-12 h-6 rounded-full transition-all relative ${pref.active ? 'bg-gold-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pref.active ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
             ))}

             <div className="pt-4">
                <button className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:underline px-2">Request Account Deletion</button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex pt-12 border-t border-white/5">
        <button className="bg-gold-500 text-forest-900 px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gold-500/20">
          Save Profile Constants
        </button>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'bookings': return renderBookingsTab();
      case 'calendar': return renderCalendarTab();
      case 'listings': 
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold text-white">Service Management</h2>
              <button 
                onClick={() => setIsAddingListing(true)}
                className="flex items-center gap-2 bg-gold-500 text-forest-900 px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold-500/20"
              >
                <Plus size={18} /> Add New Listing
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {listings.map(l => (
                 <div key={l.id} className="glass rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-gold-500/30 transition-all">
                    <div className="h-48 relative overflow-hidden">
                      <img src={l.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="w-8 h-8 rounded-xl glass border-white/10 flex items-center justify-center text-white/60 hover:text-white"><Edit size={14} /></button>
                        <button onClick={() => deleteListing(l.id)} className="w-8 h-8 rounded-xl glass border-white/10 flex items-center justify-center text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest">{l.category}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-white truncate pr-4">{l.name}</h4>
                        <span className="text-sm font-bold text-gold-400">{l.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
                        <MapPin size={12} /> {l.location}
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className={l.status === 'Active' ? 'text-green-500' : 'text-gold-500'} />
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{l.status}</span>
                        </div>
                        <button className="text-[10px] font-black text-gold-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                          View Performance <ChevronRight size={10} />
                        </button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'reviews': return renderReputationTab();
      case 'messages': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <CommunicationCenter currentUser={user} />
        </div>
      );
      case 'promotions': return renderPromotionsTab();
      case 'settings': return renderSettingsTab();
      case 'payments': return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Available Balance', value: '$4,280.50', sub: 'Ready for payout', btn: 'Withdraw' },
              { label: 'Pending Payout', value: '$1,240.00', sub: 'In clearing', btn: 'Track' },
              { label: 'Total Earnings', value: '$24,850.00', sub: 'All-time volume', btn: 'History' },
            ].map((box, i) => (
              <div key={i} className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{box.label}</p>
                <h3 className="text-3xl font-display font-bold text-white mb-2">{box.value}</h3>
                <p className="text-[10px] text-white/40 mb-6">{box.sub}</p>
                <button className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-gold-500 hover:text-forest-900 transition-all">{box.btn}</button>
              </div>
            ))}
          </div>
          <div className="glass rounded-[2rem] p-8 border border-white/5">
             <h3 className="text-lg font-bold text-white mb-6">Payment History</h3>
             <div className="space-y-4">
                {[
                  { date: 'May 20, 2026', type: 'Payout', amount: '$2,500.00', status: 'Completed' },
                  { date: 'May 12, 2026', type: 'Booking #882', amount: '+$850.00', status: 'Settled' },
                  { date: 'May 05, 2026', type: 'Payout', amount: '$3,100.00', status: 'Completed' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/3">
                    <div>
                      <p className="text-sm font-bold text-white">{row.type}</p>
                      <p className="text-[10px] text-white/30">{row.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{row.amount}</p>
                      <p className="text-[9px] font-black text-white/20 uppercase">{row.status}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-50">
            <Settings size={48} className="text-gold-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h3>
            <p className="text-sm text-white/40 italic">"Our business team is optimizing this tool for you."</p>
          </div>
        );
    }
  };

  return (
    <>
      {getContent()}

      {/* New Listing Modal Simulation */}
      <AnimatePresence>
        {isAddingListing && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingListing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl glass rounded-[3rem] border border-white/10 p-10 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-2xl font-display font-bold text-white">Create New Service</h3>
                   <p className="text-xs text-white/30 italic">Step 1: Core Details</p>
                </div>
                <button onClick={() => setIsAddingListing(false)} className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Service Name</label>
                  <input type="text" placeholder="e.g., Luxury Sunset Safari" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-400" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Category</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white appearance-none">
                      <option>Tour</option>
                      <option>Hotel</option>
                      <option>Experience</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Price Point</label>
                    <input type="text" placeholder="$0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white" />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button className="flex-1 py-4 bg-white/10 text-white font-bold rounded-2xl text-sm" onClick={() => setIsAddingListing(false)}>Save Draft</button>
                  <button className="flex-[2] py-4 bg-gold-500 text-forest-900 font-bold rounded-2xl text-sm shadow-xl shadow-gold-500/20" onClick={() => setIsAddingListing(false)}>Submit for Verification</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
