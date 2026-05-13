import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Hotel, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Sparkles, 
  Ticket, 
  Heart, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare,
  FileText,
  LifeBuoy
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  viewRole: UserRole;
  onViewRoleChange: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName: string;
}

export default function DashboardSidebar({ role, viewRole, onViewRoleChange, activeTab, setActiveTab, onLogout, userName }: SidebarProps) {
  const getNavItems = () => {
    switch (viewRole) {
      case UserRole.ADMIN:
        return [
          { id: 'overview', label: 'Admin Desk', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'bookings', label: 'All Bookings', icon: Calendar },
          { id: 'destinations', label: 'Destinations', icon: MapPin },
          { id: 'hotels', label: 'Hotels', icon: Hotel },
          { id: 'events', label: 'Events', icon: Ticket },
          { id: 'payments', label: 'Revenue', icon: CreditCard },
          { id: 'messages', label: 'Communications', icon: MessageSquare },
          { id: 'reports', label: 'Security', icon: FileText },
          { id: 'settings', label: 'System', icon: Settings },
        ];
      case UserRole.OPERATOR:
        return [
          { id: 'overview', label: 'Business Hub', icon: BarChart3 },
          { id: 'listings', label: 'Listings', icon: MapPin },
          { id: 'bookings', label: 'Partner Bookings', icon: Calendar },
          { id: 'calendar', label: 'Availability', icon: LayoutDashboard },
          { id: 'messages', label: 'Communications', icon: MessageSquare },
          { id: 'reviews', label: 'Reputation', icon: Sparkles },
          { id: 'payments', label: 'Earnings', icon: CreditCard },
          { id: 'promotions', label: 'Marketing', icon: Ticket },
          { id: 'settings', label: 'Profile', icon: Settings },
        ];
      case UserRole.EDITOR:
        return [
          { id: 'overview', label: 'Content Desk', icon: FileText },
          { id: 'blog', label: 'Story Bank', icon: LayoutDashboard },
          { id: 'media', label: 'Visual Assets', icon: BarChart3 },
          { id: 'seo', label: 'Strategy', icon: Sparkles },
        ];
      case UserRole.MODERATOR:
        return [
          { id: 'overview', label: 'Trust & Safety', icon: ShieldCheck },
          { id: 'complaints', label: 'Disputes', icon: MessageSquare },
          { id: 'support', label: 'Rescue Queue', icon: LifeBuoy },
        ];
      default: // TOURIST
        return [
          { id: 'overview', label: 'Tourist View', icon: LayoutDashboard },
          { id: 'trips', label: 'My Trips', icon: MapPin },
          { id: 'bookings', label: 'My Tickets', icon: Ticket },
          { id: 'wishlist', label: 'Saved', icon: Heart },
          { id: 'planner', label: 'AI Pilot', icon: Sparkles },
          { id: 'reviews', label: 'Community', icon: MessageSquare },
          { id: 'payments', label: 'Billing', icon: CreditCard },
          { id: 'support', label: 'Assistance', icon: LifeBuoy },
          { id: 'settings', label: 'Preferences', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-forest-950 border-r border-white/5 h-screen sticky top-0 flex flex-col p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-xl bg-gold-500 flex items-center justify-center font-black text-forest-900 shadow-lg shadow-gold-500/20">R</div>
        <span className="font-display font-bold text-white tracking-widest text-sm uppercase">Rwanda Hub</span>
      </div>

      {role === UserRole.ADMIN && (
        <div className="mb-8 px-2">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">View Perspective</p>
          <div className="space-y-1">
            {[
              { id: UserRole.ADMIN, label: 'Admin' },
              { id: UserRole.OPERATOR, label: 'Partner' },
              { id: UserRole.TOURIST, label: 'Tourist' },
              { id: UserRole.EDITOR, label: 'Editor' },
              { id: UserRole.MODERATOR, label: 'Moderator' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => onViewRoleChange(v.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  viewRole === v.id 
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' 
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {v.label} perspective
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all transition-colors ${
              activeTab === item.id 
                ? 'bg-gold-500 text-forest-900 shadow-xl shadow-gold-500/10' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="px-4 py-3 bg-white/5 rounded-2xl mb-4">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Signed in as</p>
          <p className="text-xs font-bold text-gold-400 truncate">{userName}</p>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{role}</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
