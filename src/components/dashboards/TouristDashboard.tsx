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
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardProps, UserRole } from '../../types';
import { generateItinerary } from '../../services/geminiService';
import Markdown from 'react-markdown';

export default function TouristDashboard({ activeTab, bookings, user }: DashboardProps) {
  const isAdmin = user.role === UserRole.ADMIN;
  const [prompt, setPrompt] = useState('');
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState([
    { id: 'T-102', name: 'Summer in the Virungas', duration: '5 Days', people: 2, status: 'Active', progress: 40, emoji: '🌋' },
    { id: 'T-105', name: 'Kivu Lakeshore Escape', duration: '3 Days', people: 4, status: 'Upcoming', progress: 0, emoji: '🌊' },
  ]);

  const [managedBookings, setManagedBookings] = useState(bookings);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

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
        className="glass rounded-[3rem] p-8 border border-white/10 w-full max-w-lg relative z-10"
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
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-gold-500 text-forest-900 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-gold-500/20">Update Ticket</button>
            <button type="button" onClick={() => setEditingBooking(null)} className="flex-1 bg-white/5 text-white/40 py-4 rounded-2xl font-bold text-sm">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );

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

  const travelPatterns = [
    { label: 'Adventure', icon: '🌋', items: ['5-day Gorilla Trekking', 'Nyungwe Canopy & Nature', 'Volcanoes Hiking Safari'] },
    { label: 'Relaxation', icon: '🌊', items: ['Lake Kivu Weekend Escape', 'Kigali Spa & Luxury Retreat', 'Twin Lakes Serenity'] },
    { label: 'Culture', icon: '🏛️', items: ['Nyanza King\'s Palace Tour', 'Kigali Art & History Walk', 'Rural Village Experience'] },
    { label: 'Wildlife', icon: '🐘', items: ['Akagera Big Five Safari', 'Bird Watching in Bugesera', 'Primate Adventure'] }
  ];

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

  if (activeTab === 'planner') {
    return renderPlanner();
  }

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

  const renderTickets = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-display font-bold text-white">Digital Tickets</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input type="text" placeholder="Search tickets..." className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managedBookings.map((booking, idx) => (
          <div key={idx} className="glass rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Ticket size={100} />
            </div>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">{booking.itemEmoji}</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{booking.itemName}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{booking.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display font-bold text-gold-400">${booking.price}</p>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter">Paid Full</p>
                </div>
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
                  <button className="px-4 py-2 bg-gold-500 text-forest-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">View QR</button>
                  <button 
                    onClick={() => handleCancelBooking(booking.id)}
                    className="px-4 py-2 bg-white/5 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-red-400 hover:bg-red-400/5 transition-all"
                  >Cancel</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {managedBookings.length === 0 && (
          <div className="col-span-full glass rounded-[2rem] p-12 border border-white/5 text-center">
            <Ticket size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-sm text-white/30 italic animate-pulse">Your ticket wallet is empty.</p>
          </div>
        )}
      </div>
    </div>
  );

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

  const renderAssistance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-display font-bold text-white">Help & Assistance</h2>
        <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Support Live</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: MessageSquare, title: 'Live Chat', desc: 'Speak with a travel ranger instantly.', action: 'Start Chat' },
          { icon: LifeBuoy, title: 'Emergency', desc: 'Police, Hospital, and SOS contacts.', action: 'View Contacts' },
          { icon: FileText, title: 'Guides', desc: 'Cultural etiquette and travel laws.', action: 'Read More' },
          { icon: ShieldCheck, title: 'Insurance', desc: 'Manage your travel protection.', action: 'Details' },
        ].map((item, i) => (
          <div key={i} className="glass rounded-[2rem] p-8 border border-white/5 group hover:border-gold-500/20 transition-all cursor-pointer">
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
         <button className="bg-gold-500 text-forest-900 px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-gold-500/20 hover:scale-105 transition-all">Open Support Ticket</button>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Account Profile</h3>
            <p className="text-xs text-white/30">Update your traveler details and bio.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gold-400/10 flex items-center justify-center text-gold-400 font-bold border-2 border-dashed border-gold-400/20">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-[1.2rem]" /> : user.name[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-1">Traveler Avatar</p>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">Change photo</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                  <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50" />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input type="email" value="traveler@example.com" disabled className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white/30" />
               </div>
            </div>

            <div>
               <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ml-1">Travel Bio</label>
               <textarea rows={3} placeholder={user.bio || "Describe your travel style..."} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 resize-none" />
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
               { icon: Bell, title: 'Push Notifications', desc: 'Booking updates and chat alerts.', active: true },
               { icon: Globe, title: 'Language Preferences', desc: 'App interface language.', value: 'English (US)' },
               { icon: Languages, title: 'Currency', desc: 'Display prices in your currency.', value: 'USD ($)' },
               { icon: ShieldCheck, title: 'Privacy Mode', desc: 'Hide your profile from forums.', active: false },
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
                     <button className={`w-12 h-6 rounded-full relative transition-all ${opt.active ? 'bg-gold-500' : 'bg-white/10'}`}>
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
        <button className="bg-gold-500 text-forest-900 px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-gold-500/20 active:scale-95">
          Secure Preferences
        </button>
      </div>
    </div>
  );

  if (activeTab === 'planner') {
    return renderPlanner();
  }

  if (activeTab === 'trips') {
    return renderTrips();
  }

  if (activeTab === 'bookings') {
    return renderTickets();
  }

  if (activeTab === 'wishlist') {
    return renderWishlist();
  }

  if (activeTab === 'reviews') {
    return renderCommunity();
  }

  if (activeTab === 'payments') {
    return renderPayments();
  }

  if (activeTab === 'support') {
    return renderAssistance();
  }

  if (activeTab === 'settings') {
    return renderPreferences();
  }

  if (activeTab === 'overview') {
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
              <h3 className="font-display text-xl font-bold text-white">Active Bookings</h3>
              <button className="text-[10px] font-black text-gold-500 uppercase tracking-widest">View All</button>
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
              <button className="text-[10px] font-black text-gold-500 uppercase tracking-widest text-[#D4AF37]">Manage</button>
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

  return (
    <div className="relative">
      <AnimatePresence>
        {isAddingTrip && renderTripModal(null, true)}
        {editingTrip && renderTripModal(editingTrip)}
        {editingBooking && renderBookingModal(editingBooking)}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-50">
        <Compass size={48} className="text-gold-500 mb-6 animate-spin-slow" />
        <h3 className="text-xl font-bold text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h3>
        <p className="text-sm text-white/40 italic">"Our rangers are mapping this section for your convenience."</p>
      </div>
    </div>
  );
}
