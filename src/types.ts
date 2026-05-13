export enum UserRole {
  TOURIST = 'tourist',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  EDITOR = 'editor',
  MODERATOR = 'moderator'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  businessName?: string;
  bio?: string;
}

export interface Booking {
  id: string;
  itemId: number;
  itemType: 'destination' | 'hotel' | 'experience' | 'transport' | 'event';
  itemName: string;
  itemEmoji: string;
  email: string;
  date: string;
  time?: string;
  partySize: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  paymentMethod?: string;
  momoNumber?: string;
  seat?: string;
  insurance?: {
    selected: boolean;
    type: string;
    price: number;
  };
  createdAt: string;
  notes?: string;
}

export interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

export interface Destination {
  id: number;
  name: string;
  cat: 'all' | 'parks' | 'lakes' | 'culture' | 'adventure' | 'hidden';
  emoji: string;
  location: string;
  rating: number;
  price: string;
  desc: string;
  best: string;
  fee: string;
  gallery?: string[];
}

export interface Experience {
  id: number;
  name: string;
  emoji: string;
  price: number;
  duration: string;
  group: string;
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
}

export interface Hotel {
  id: number;
  name: string;
  cat: 'all' | 'luxury' | 'eco' | 'budget';
  emoji: string;
  location: string;
  price: number;
  rating: number;
  rooms: number;
  amenities: string[];
}

export interface Phrase {
  en: string;
  rw: string;
  fr: string;
  sw: string;
}

export interface MapPoint {
  id: string;
  title: string;
  emoji: string;
  category: 'city' | 'park' | 'lake' | 'culture';
  desc: string;
  pop: string;
  altitude: string;
  coordinates: { cx: number; cy: number };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string; // 'all' for broadcasts
  content: string;
  timestamp: string;
  read: boolean;
  type: 'direct' | 'broadcast' | 'support';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export interface DashboardProps {
  activeTab: string;
  user: User;
  bookings: Booking[];
}
