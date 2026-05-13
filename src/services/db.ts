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
    { id: '1', email: 'admin@rwandahub.com', name: 'System Admin', role: UserRole.ADMIN },
    { id: '2', email: 'tourist@gmail.com', name: 'John Doe', role: UserRole.TOURIST },
    { id: '3', email: 'moderator@rwandahub.com', name: 'Alice Smith', role: UserRole.MODERATOR },
  ],
  bookings: [],
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
  markRead: (messageId: string) => {
    const state = dbService.get();
    state.messages = state.messages.map(m => m.id === messageId ? { ...m, read: true } : m);
    dbService.save(state);
  },
  getMessagesForUser: (userId: string) => {
    const state = dbService.get();
    return state.messages.filter(m => m.receiverId === userId || m.senderId === userId || m.receiverId === 'all');
  }
};
