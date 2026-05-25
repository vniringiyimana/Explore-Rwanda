import { Destination, Experience, Hotel, Booking, User, UserRole, Message } from '../types';
import { DESTINATIONS, HOTELS, EXPERIENCES, TRANSPORT_OPTIONS, EVENTS } from '../constants';

const DB_KEY = 'rwanda_hub_db';

interface DbState {
  users: User[];
  bookings: Booking[];
  destinations: Destination[];
  hotels: Hotel[];
  experiences: Experience[];
  events: any[];
  transport: any[];
  messages: Message[];
}

const initialState: DbState = {
  users: [
    { id: '1', email: 'vedasteniringiyimana12@gmail.com', name: 'Master Admin', role: UserRole.ADMIN, password: 'password123', emailVerified: true, isActive: true },
    { id: '2', email: 'tourist@gmail.com', name: 'John Doe', role: UserRole.TOURIST, password: 'password123', emailVerified: false, isActive: true },
    { id: '3', email: 'moderator@rwandahub.com', name: 'Alice Smith', role: UserRole.MODERATOR, password: 'password123', emailVerified: true, isActive: true },
    { id: '4', email: 'partner@kigalihotels.rw', name: 'Emmanuel R.', role: UserRole.OPERATOR, businessName: 'Kigali Heights', password: 'password123', emailVerified: true, isActive: true },
    { id: '5', email: 'editor@explore.rw', name: 'Clarisse U.', role: UserRole.EDITOR, password: 'password123', emailVerified: false, isActive: true },
    { id: '6', email: 'serena@rwanda.com', name: 'Serena Booking Mgr', role: UserRole.OPERATOR, businessName: 'Kigali Serena', password: 'password123', emailVerified: true, isActive: true },
  ],
  bookings: [
    {
      id: 'mock-1',
      itemId: 1,
      itemType: 'destination',
      itemName: 'Akagera National Park',
      itemEmoji: '🦁',
      email: 'tourist@gmail.com',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      status: 'confirmed',
      partySize: '2 People',
      price: 150,
      paymentMethod: 'momo',
      momoNumber: '0788123456',
      notes: 'Please arrange for airport pickup if possible.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-pend-1',
      itemId: 3,
      itemType: 'experience',
      itemName: 'Kigali Cultural Tour',
      itemEmoji: '🇷🇼',
      email: 'alex.k@traveler.org',
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
      status: 'pending',
      partySize: '4 People',
      price: 340,
      paymentMethod: 'momo',
      momoNumber: '0789998887',
      notes: 'Looking forward to visiting the Genocide Memorial and local art galleries.',
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 'mock-pend-2',
      itemId: 2,
      itemType: 'hotel',
      itemName: 'Lakeside Eco Lodge',
      itemEmoji: '🏡',
      email: 'elena.rodriguez@gmail.com',
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // In 3 days
      status: 'pending',
      partySize: '1 Person',
      price: 220,
      paymentMethod: 'Credit Card',
      notes: 'Requesting a late check-in if possible, around 8 PM.',
      createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
  ],
  destinations: DESTINATIONS,
  hotels: HOTELS,
  experiences: EXPERIENCES,
  events: EVENTS,
  transport: TRANSPORT_OPTIONS,
  messages: [
    { 
      id: 'm1', 
      senderId: '1', 
      senderName: 'System Admin', 
      receiverId: 'all', 
      content: 'Welcome to the new Partner Communication Center! You can now message support directly.', 
      timestamp: new Date().toISOString(), 
      read: false, 
      type: 'broadcast' 
    }
  ],
};

export const dbService = {
  get: (): DbState => {
    const saved = localStorage.getItem(DB_KEY);
    if (!saved) {
      localStorage.setItem(DB_KEY, JSON.stringify(initialState));
      return initialState;
    }
    return JSON.parse(saved);
  },

  save: (state: DbState) => {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('db-update'));
  },

  // Users
  addUser: (user: Omit<User, 'id'>) => {
    const state = dbService.get();
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    state.users.push(newUser);
    dbService.save(state);
    return newUser;
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const state = dbService.get();
    state.users = state.users.map(u => u.id === id ? { ...u, ...updates } : u);
    dbService.save(state);
  },
  deleteUser: (id: string) => {
    const state = dbService.get();
    state.users = state.users.filter(u => u.id !== id);
    dbService.save(state);
  },

  // Destinations
  addDestination: (dest: Omit<Destination, 'id'>) => {
    const state = dbService.get();
    const newDest = { ...dest, id: state.destinations.length + 1 };
    state.destinations.push(newDest as Destination);
    dbService.save(state);
  },
  updateDestination: (id: number, updates: Partial<Destination>) => {
    const state = dbService.get();
    state.destinations = state.destinations.map(d => d.id === id ? { ...d, ...updates } : d);
    dbService.save(state);
  },
  deleteDestination: (id: number) => {
    const state = dbService.get();
    state.destinations = state.destinations.filter(d => d.id !== id);
    dbService.save(state);
  },

  // Hotels
  addHotel: (hotel: Omit<Hotel, 'id'>) => {
    const state = dbService.get();
    const newHotel = { ...hotel, id: state.hotels.length + 1 };
    state.hotels.push(newHotel as Hotel);
    dbService.save(state);
  },
  updateHotel: (id: number, updates: Partial<Hotel>) => {
    const state = dbService.get();
    state.hotels = state.hotels.map(h => h.id === id ? { ...h, ...updates } : h);
    dbService.save(state);
  },
  deleteHotel: (id: number) => {
    const state = dbService.get();
    state.hotels = state.hotels.filter(h => h.id !== id);
    dbService.save(state);
  },

  addHotelReview: (hotelId: number, review: any) => {
    const state = dbService.get();
    state.hotels = state.hotels.map(h => {
      if (h.id === hotelId) {
        const reviews = h.reviews || [];
        return { ...h, reviews: [...reviews, { ...review, id: `r-${Date.now()}` }] };
      }
      return h;
    });
    dbService.save(state);
  },

  // Events
  addEvent: (event: any) => {
    const state = dbService.get();
    const newEvent = { ...event, id: state.events.length + 3000 };
    state.events.push(newEvent);
    dbService.save(state);
  },
  updateEvent: (id: number, updates: any) => {
    const state = dbService.get();
    state.events = state.events.map(e => e.id === id ? { ...e, ...updates } : e);
    dbService.save(state);
  },
  deleteEvent: (id: number) => {
    const state = dbService.get();
    state.events = state.events.filter(e => e.id !== id);
    dbService.save(state);
  },

  // Bookings
  addBooking: (booking: Omit<Booking, 'id'>) => {
    const state = dbService.get();
    const newBooking = { ...booking, id: `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}` };
    state.bookings.push(newBooking);
    dbService.save(state);
    return newBooking;
  },
  updateBooking: (id: string, updates: Partial<Booking>) => {
    const state = dbService.get();
    state.bookings = state.bookings.map(b => b.id === id ? { ...b, ...updates } : b);
    dbService.save(state);
  },
  deleteBooking: (id: string) => {
    const state = dbService.get();
    state.bookings = state.bookings.filter(b => b.id !== id);
    dbService.save(state);
  },

  // Messages
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const state = dbService.get();
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };
    state.messages.push(newMessage);
    dbService.save(state);
    return newMessage;
  },
  editMessage: (messageId: string, newContent: string) => {
    const state = dbService.get();
    state.messages = state.messages.map(m => m.id === messageId ? { ...m, content: newContent } : m);
    dbService.save(state);
  },
  deleteMessage: (messageId: string) => {
    const state = dbService.get();
    state.messages = state.messages.filter(m => m.id !== messageId);
    dbService.save(state);
  },
  deleteMessages: (messageIds: string[]) => {
    const state = dbService.get();
    state.messages = state.messages.filter(m => !messageIds.includes(m.id));
    dbService.save(state);
  },
  bulkReply: (receiverIds: string[], content: string, senderId: string, senderName: string, type: 'direct' | 'support' = 'direct') => {
    const state = dbService.get();
    const newMessages: Message[] = receiverIds.map(receiverId => ({
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      senderName,
      receiverId,
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false
    }));
    state.messages.push(...newMessages);
    dbService.save(state);
    return newMessages;
  },
  markRead: (messageId: string) => {
    const state = dbService.get();
    state.messages = state.messages.map(m => m.id === messageId ? { ...m, read: true } : m);
    dbService.save(state);
  },
  getMessagesForUser: (userId: string) => {
    const state = dbService.get();
    return state.messages.filter(m => m.receiverId === userId || m.senderId === userId || m.receiverId === 'all');
  },

  resendVerification: async (email: string) => {
    // Simulate backend call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Verification email sent to: ${email}`);
        resolve({ status: 'ok', msg: `A new verification link has been dispatched to ${email}.` });
      }, 1500);
    });
  }
};
