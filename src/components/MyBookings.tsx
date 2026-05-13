import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, MapPin, Trash2, Edit3, CheckCircle, 
  Clock, AlertCircle, List, Calendar as CalendarIcon,
  ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown,
  History, Plane, Building2, Ticket, DollarSign, SortAsc, SortDesc,
  ShieldCheck, Mail, Trophy, Smartphone, CreditCard, Users
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

export default function MyBookings({ isOpen, onClose, bookings, onCancel, onUpdate, lang }: MyBookingsProps) {
  const t = (key: string) => UI_TRANSLATIONS[key]?.[lang] || UI_TRANSLATIONS[key]?.['en'] || key;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
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
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="font-display text-2xl font-bold">{t('my_bookings')}</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Manage your Rwandan adventures</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-gold-500/40 w-40 lg:w-56 transition-all"
              />
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

                  {/* Sorting */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Sort By</label>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-gold-500/40 appearance-none font-bold"
                      >
                        <option value="date" className="bg-forest-900">Date</option>
                        <option value="price" className="bg-forest-900">Price</option>
                        <option value="name" className="bg-forest-900">Item Name</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Order</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortOrder('asc')}
                          className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 ${sortOrder === 'asc' ? 'bg-gold-500 text-forest-900 border-gold-400' : 'bg-white/5 text-white/40 border-white/10'}`}
                        >
                          <SortAsc size={14} /> <span className="text-[10px] font-bold">ASC</span>
                        </button>
                        <button
                          onClick={() => setSortOrder('desc')}
                          className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 ${sortOrder === 'desc' ? 'bg-gold-500 text-forest-900 border-gold-400' : 'bg-white/5 text-white/40 border-white/10'}`}
                        >
                          <SortDesc size={14} /> <span className="text-[10px] font-bold">DESC</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col justify-end">
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
                className="space-y-4"
            >
                {filteredBookings.map((booking) => (
                <div
                    key={booking.id}
                    className={`glass p-5 rounded-3xl border border-white/5 relative overflow-hidden group transition-all hover:border-gold-500/20 ${booking.status === 'cancelled' ? 'opacity-50 grayscale' : ''}`}
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
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-gold-500" />{booking.date}</span>
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
                              <span className="flex items-center gap-1.5 text-gold-400">
                                {booking.paymentMethod.includes('Mobile') ? <Smartphone size={12} /> : <CreditCard size={12} />}
                                {booking.paymentMethod}
                              </span>
                            )}
                            {booking.insurance?.selected && (
                              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400">
                                <ShieldCheck size={10} /> INSURED
                              </span>
                            )}
                            </div>

                            {booking.notes && (
                              <div className="mb-4 bg-white/5 rounded-xl p-3 border border-white/5">
                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest block mb-1">Special Requests</span>
                                <p className="text-[10px] text-white/50 leading-relaxed italic">"{booking.notes}"</p>
                              </div>
                            )}

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
                        </>
                        )}
                    </div>
                    </div>
                    {booking.status === 'confirmed' && !editingId && (
                    <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                        <CheckCircle size={80} className="text-gold-400" />
                    </div>
                    )}
                </div>
                ))}
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
