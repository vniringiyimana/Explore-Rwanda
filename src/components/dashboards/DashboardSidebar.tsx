import React from 'react';
import { 
  BarChart3, 
  TrendingUp,
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
  LifeBuoy,
  ChevronUp,
  ChevronDown,
  UserPlus,
  Check
} from 'lucide-react';
import { UserRole } from '../../types';
import { MASTER_EMAIL } from '../../constants';
import { dbService } from '../../services/db';

interface SidebarProps {
  role: UserRole;
  userEmail?: string;
  emailVerified?: boolean;
  viewRole: UserRole;
  onViewRoleChange: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName: string;
}

export default function DashboardSidebar({ role, userEmail, emailVerified, viewRole, onViewRoleChange, activeTab, setActiveTab, onLogout, userName }: SidebarProps) {
  const isMaster = userEmail?.toLowerCase() === MASTER_EMAIL.toLowerCase();
  
  const [showSwitchProfiles, setShowSwitchProfiles] = React.useState(false);
  const registeredUsers = dbService.get()?.users || [];

  const getNavItems = () => {
    switch (viewRole) {
      case UserRole.ADMIN:
        return [
          { id: 'overview', label: 'Admin Desk', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics Hub', icon: TrendingUp },
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
          { id: 'activities', label: 'Activity & Goals', icon: BarChart3 },
          { id: 'trips', label: 'My Trips', icon: MapPin },
          { id: 'bookings', label: 'My Tickets', icon: Ticket },
          { id: 'wishlist', label: 'Saved', icon: Heart },
          { id: 'planner', label: 'AI Pilot', icon: Sparkles },
          { id: 'reviews', label: 'Community', icon: MessageSquare },
          { id: 'payments', label: 'Billing', icon: CreditCard },
          { id: 'support', label: 'Help & Support', icon: LifeBuoy },
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

      <div className="mb-8 px-2 bg-white/[0.02] border border-white/5 p-4 rounded-2xl relative">
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
        <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.15em] mb-3">Role Sandbox Switcher</p>
        <div className="space-y-1">
          {[
            { id: UserRole.ADMIN, label: '🛡️ Admin Desk' },
            { id: UserRole.OPERATOR, label: '💼 Partner Hub' },
            { id: UserRole.TOURIST, label: '🌍 Tourist View' },
            { id: UserRole.EDITOR, label: '✍️ Content Editor' },
            { id: UserRole.MODERATOR, label: '⚖️ Support Moderator' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => onViewRoleChange(v.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                viewRole === v.id 
                  ? 'bg-gold-500 text-forest-950 shadow-md shadow-gold-500/10' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

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

      <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
        {/* Dynamic Multi-Login Switcher Section */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setShowSwitchProfiles(!showSwitchProfiles)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all select-none text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Active Account</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-gold-400 truncate max-w-[120px]">{userName}</span>
                {emailVerified ? (
                  <span 
                    className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-emerald-500/25 border border-emerald-500/30 text-[7px] font-sans font-black uppercase text-emerald-400 rounded-md tracking-wider"
                    title="Verified Email: Syncing to valid inbox confirmed"
                  >
                    <Check size={8} strokeWidth={3} className="text-emerald-400" /> Verified
                  </span>
                ) : (
                  <span 
                    className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-amber-500/15 border border-amber-500/20 text-[7px] font-sans font-black uppercase text-amber-400 rounded-md tracking-wider animate-pulse"
                    title="Unverified Email: Token verification pending"
                  >
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider mt-0.5">{role}</p>
            </div>
            {showSwitchProfiles ? <ChevronUp size={16} className="text-white/40 shrink-0 ml-2" /> : <ChevronDown size={16} className="text-white/40 shrink-0 ml-2" />}
          </button>

          {showSwitchProfiles && (
            <div className="mt-2 p-2 bg-forest-900 border border-white/5 rounded-2xl shadow-xl space-y-1 max-h-[180px] overflow-y-auto">
              <div className="px-2 py-1.5 text-[10px] font-black text-white/30 uppercase tracking-widest">
                Switch Sessions
              </div>
              {registeredUsers.map((u) => {
                const isActive = u.email.toLowerCase() === userEmail?.toLowerCase();
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      if (!isActive) {
                        window.dispatchEvent(new CustomEvent('switch-user', { detail: { userId: u.id } }));
                      }
                      setShowSwitchProfiles(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-gold-500/10 text-gold-400 font-bold' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold truncate max-w-[100px]">{u.name}</span>
                        {u.emailVerified ? (
                          <span 
                            className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-emerald-500/25 border border-emerald-500/30 text-[6px] font-sans font-black uppercase text-emerald-400 rounded-md tracking-wider"
                            title="Verified Email"
                          >
                            <Check size={6} strokeWidth={3} className="text-emerald-400" />
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-amber-500/15 border border-amber-500/20 text-[6px] font-sans font-black uppercase text-amber-400 rounded-md tracking-wider"
                            title="Unverified Email"
                          >
                            !
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-white/30 truncate">{u.email}</p>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
              <div className="border-t border-white/5 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-auth'));
                    setShowSwitchProfiles(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-gold-500 hover:text-forest-900 transition-all"
                >
                  <UserPlus size={14} />
                  Add New Access
                </button>
              </div>
            </div>
          )}
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
