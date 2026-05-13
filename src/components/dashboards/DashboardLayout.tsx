import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import DashboardSidebar from './DashboardSidebar';
import TouristDashboard from './TouristDashboard';
import AdminDashboard from './AdminDashboard';
import BusinessDashboard from './BusinessDashboard';
import ContentDashboard from './ContentDashboard';
import SupportDashboard from './SupportDashboard';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  bookings: any[];
}

export default function DashboardLayout({ user, onLogout, bookings }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeRole, setActiveRole] = useState<UserRole>(user.role);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setActiveTab('overview');
  };

  const renderContent = () => {
    const dashboardProps = { activeTab, user, bookings };
    switch (activeRole) {
      case UserRole.ADMIN:
        return <AdminDashboard {...dashboardProps} />;
      case UserRole.OPERATOR:
        return <BusinessDashboard {...dashboardProps} />;
      case UserRole.EDITOR:
        return <ContentDashboard {...dashboardProps} />;
      case UserRole.MODERATOR:
        return <SupportDashboard {...dashboardProps} />;
      default:
        return <TouristDashboard {...dashboardProps} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-forest-900 overflow-hidden">
      <DashboardSidebar 
        role={user.role} 
        viewRole={activeRole}
        onViewRoleChange={handleRoleChange}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        userName={user.name}
      />
      
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-white/40 text-sm font-medium italic mt-1">
              "Welcome back, {user.name}. Your journey continues here."
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Network Stable</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
