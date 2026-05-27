import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Map, 
  TrendingUp, 
  LifeBuoy, 
  FileText, 
  ShieldCheck, 
  Layers, 
  LayoutDashboard, 
  Sparkles, 
  Ticket, 
  Activity, 
  Calendar,
  CreditCard,
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../../types';

interface TourProps {
  onSwitchRole: (role: UserRole) => void;
  onGoToTab: (tab: string) => void;
  activeRole?: UserRole;
  userEmail?: string;
}

export default function DashboardVisualTour({ onSwitchRole, onGoToTab, activeRole, userEmail }: TourProps) {
  const dashboards = [
    {
      role: UserRole.ADMIN,
      title: "🛡️ Administrative Desk",
      colorClass: "from-amber-500/15 to-yellow-500/5 border-amber-500/20 text-amber-400",
      accentBg: "bg-amber-500/10",
      accentText: "text-amber-400",
      btnClass: "bg-amber-500 hover:bg-amber-400 text-forest-950",
      desc: "Platform intelligence desk for governance, verification audits, financial analytics, and system administration.",
      keyStats: [
        { label: "Active Nodes", value: "12 Online", color: "text-emerald-400" },
        { label: "Daily Volume", value: "$4.8k MoMo", color: "text-white" },
        { label: "Alert Latency", value: "<15ms", color: "text-amber-400" }
      ],
      modules: ["Revenue Telemetry", "Unified Booking Ledger", "System Verification", "Automation Push-Queues"],
      // CSS Schematic Visual representation of the layout
      schematic: (
        <div className="w-full h-32 bg-forest-950/80 rounded-2xl border border-white/5 p-3 flex flex-col gap-2 font-sans relative overflow-hidden">
          {/* Header row */}
          <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[7px] uppercase font-bold text-white/50 tracking-wider">ADMIN CORE v2.9</span>
            </div>
            <div className="flex gap-1">
              <span className="w-8 h-2.5 rounded-sm bg-amber-400/25 border border-amber-400/20 text-[6px] text-amber-300 flex items-center justify-center font-mono">STABLE</span>
            </div>
          </div>
          {/* Content bodies: Column grid */}
          <div className="grid grid-cols-3 gap-1.5 flex-1">
            {/* Main graph card */}
            <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-lg p-1.5 flex flex-col justify-between">
              <span className="text-[6px] text-white/40 block">Revenue stream tracker</span>
              <div className="flex items-end gap-1 h-8 px-1 pb-1">
                <div className="h-4 w-1.5 bg-amber-400/20 rounded-xs" />
                <div className="h-6 w-1.5 bg-amber-400/30 rounded-xs" />
                <div className="h-5 w-1.5 bg-amber-400/40 rounded-xs" />
                <div className="h-8 w-1.5 bg-amber-400/80 rounded-xs animate-pulse" />
                <div className="h-7 w-1.5 bg-amber-400 rounded-xs" />
              </div>
            </div>
            {/* Mini actions panel */}
            <div className="bg-amber-400/5 border border-amber-400/10 rounded-lg p-1.5 flex flex-col justify-between text-[6px]">
              <div>
                <span className="text-amber-400 font-bold block leading-none">QUEUE</span>
                <span className="text-[5px] text-white/30 block mt-0.5">3 pending notifications</span>
              </div>
              <div className="h-3 w-full bg-amber-400/20 text-amber-300 font-bold uppercase rounded-sm flex items-center justify-center tracking-wide font-mono scale-90">
                TRIGGER
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      role: UserRole.OPERATOR,
      title: "💼 Partner Business Hub",
      colorClass: "from-emerald-500/15 to-teal-500/5 border-emerald-500/20 text-emerald-400",
      accentBg: "bg-emerald-500/10",
      accentText: "text-emerald-400",
      btnClass: "bg-emerald-500 hover:bg-emerald-400 text-forest-950",
      desc: "Merchant business space for lodgings, transport companies, boutique stays, and park guiding operators.",
      keyStats: [
        { label: "Bookings Month", value: "148 Tickets", color: "text-white" },
        { label: "Reputation Index", value: "4.95 Stars", color: "text-emerald-400" },
        { label: "Calendar Load", value: "82% Capacity", color: "text-white" }
      ],
      modules: ["Availability Grids", "Client Communication Feed", "Listing Customization", "Review Analysis"],
      schematic: (
        <div className="w-full h-32 bg-forest-950/80 rounded-2xl border border-white/5 p-3 flex flex-col gap-2 font-sans relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
            <span className="text-[7px] uppercase font-bold text-white/50 tracking-wider">KIGALI HEIGHTS LODGING</span>
            <span className="text-[6px] font-mono text-emerald-400 font-black">ACTIVE SYNC</span>
          </div>
          {/* Calendar grid-like schematic */}
          <div className="grid grid-cols-4 gap-1.5 flex-1">
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-1.5 col-span-3 flex flex-col justify-between">
              <span className="text-[6px] text-white/40 block">Guest Availability Manifest</span>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className={`h-2.5 rounded-xs flex items-center justify-center text-[5.5px] ${i % 3 === 0 ? 'bg-emerald-500/40 text-emerald-100 font-bold border border-emerald-500/15' : 'bg-white/5 text-white/30'}`} />
                ))}
              </div>
            </div>
            {/* Quick overview */}
            <div className="bg-white/[0.01] border border-white/5 rounded-lg p-1.5 flex flex-col justify-between">
              <span className="text-[5.5px] text-white/30 block">OCCUPANCY</span>
              <span className="text-sm font-bold text-white leading-none">82%</span>
              <span className="text-[5px] text-emerald-400 block leading-none">+3% trend</span>
            </div>
          </div>
        </div>
      )
    },
    {
      role: UserRole.EDITOR,
      title: "✍️ Content Story Desk",
      colorClass: "from-sky-500/15 to-blue-500/5 border-sky-500/20 text-sky-400",
      accentBg: "bg-sky-500/10",
      accentText: "text-sky-400",
      btnClass: "bg-sky-500 hover:bg-sky-400 text-forest-950",
      desc: "Editorial and media staging deck for curated Rwandan story banking, SEO trends, and dynamic visual publishing assets.",
      keyStats: [
        { label: "Draft Stories", value: "3 Ready", color: "text-white" },
        { label: "Visual Gallery", value: "48 HD Pixels", color: "text-sky-400" },
        { label: "SEO Keyword Hits", value: "1.2k Core", color: "text-white" }
      ],
      modules: ["Rwandan Story Bank", "High-Contrast Galleries", "SEO Keywords", "Approval Staging"],
      schematic: (
        <div className="w-full h-32 bg-forest-950/80 rounded-2xl border border-white/5 p-3 flex flex-col gap-2 font-sans relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
            <span className="text-[7px] uppercase font-bold text-white/50 tracking-wider">TRAVEL STORY BANK</span>
            <span className="w-2 h-2 rounded-full bg-sky-400" />
          </div>
          {/* Grid list mock */}
          <div className="grid grid-cols-2 gap-1.5 flex-1">
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-1.5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-1 right-1 px-1 py-0.25 bg-blue-500/20 text-blue-300 text-[5px] rounded-xs">SEO</div>
              <span className="text-[8px] font-bold text-white leading-tight block">Trekking Volcanoes Guide</span>
              <span className="text-[6px] text-white/40 block mt-1">Status: Ready to Stage</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-1.5 flex flex-col justify-between relative">
              <span className="text-[8px] font-bold text-white leading-tight block">Intore Folk Dancing</span>
              <div className="h-1 w-full bg-sky-400/40 rounded-full mt-2" />
            </div>
          </div>
        </div>
      )
    },
    {
      role: UserRole.MODERATOR,
      title: "⚖️ Trust & Safety Board",
      colorClass: "from-red-500/15 to-orange-500/5 border-red-500/20 text-red-400",
      accentBg: "bg-red-500/10",
      accentText: "text-red-400",
      btnClass: "bg-red-500 hover:bg-red-400 text-white",
      desc: "Emergency management desk for dispute settlement, client distress calls, security logs, and refund reviews.",
      keyStats: [
        { label: "Active Escalations", value: "0 Cleared", color: "text-emerald-400" },
        { label: "Rescue Standby", value: "24/7 Hot", color: "text-red-400" },
        { label: "Pending Disputes", value: "1 In-review", color: "text-white" }
      ],
      modules: ["Emergency Safety Pipeline", "MoMo Escrow Dispute Ledger", "Escorted Support Rooms", "Logs Audit"],
      schematic: (
        <div className="w-full h-32 bg-forest-950/80 rounded-2xl border border-white/5 p-3 flex flex-col gap-2 font-sans relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
            <span className="text-[7px] uppercase font-bold text-red-400 tracking-wider">🚨 CRISIS CONTROL FEED</span>
            <span className="text-[5.5px] font-mono py-0.5 px-1 bg-red-500/10 text-red-400 rounded-xs border border-red-500/20">LIVE BEACON</span>
          </div>
          {/* Ticket queue */}
          <div className="space-y-1 flex-1">
            <div className="p-1 px-1.5 bg-red-500/5 border border-red-500/15 rounded-lg flex justify-between items-center text-[6px]">
              <div>
                <span className="text-white font-bold block leading-none">Safari Weather Lockout</span>
                <span className="text-white/30 block mt-0.5">Assigned to: Operator KGL</span>
              </div>
              <span className="font-mono text-red-400 font-bold bg-red-400/20 px-1 rounded-sm">ESCALATED</span>
            </div>
            <div className="p-1 px-1.5 bg-white/[0.01] border border-white/5 rounded-lg flex justify-between items-center text-[6px]">
              <div>
                <span className="text-white/60 font-medium block leading-none">Translation Guide Outage</span>
                <span className="text-white/30 block mt-0.5">Status: Resolved offline</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-400/10 px-1 rounded-sm">RESOLVED</span>
            </div>
          </div>
        </div>
      )
    },
    {
      role: UserRole.TOURIST,
      title: "🌍 Tourist Adventure Portal",
      colorClass: "from-indigo-500/15 to-violet-500/5 border-indigo-500/20 text-indigo-400",
      accentBg: "bg-indigo-500/10",
      accentText: "text-indigo-400",
      btnClass: "bg-indigo-500 hover:bg-indigo-400 text-white",
      desc: "Universal traveler workspace featuring real-time itinerary booking, Google Maps integration, smart AI planning, and mobile passes.",
      keyStats: [
        { label: "Booked Itineraries", value: "3 Tickets", color: "text-white" },
        { label: "Eco Offset Target", value: "-14kg CO₂", color: "text-indigo-400" },
        { label: "AI Tokens Loaded", value: "9,500 gas", color: "text-white" }
      ],
      modules: ["Interactive Map Guides", "Traveler Ticket Ledger", "Gemini AI Itinerary Planner", "Kinyarwanda Transcripts"],
      schematic: (
        <div className="w-full h-32 bg-forest-950/80 rounded-2xl border border-white/5 p-3 flex flex-col gap-2 font-sans relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
            <span className="text-[7px] uppercase font-bold text-white/50 tracking-wider">EXPLORER WELCOME</span>
            <span className="text-[6.5px] font-mono text-indigo-400 font-black">AI ONLINE</span>
          </div>
          {/* Ticket passes preview */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-1.5 flex flex-col justify-between">
              <span className="text-[5.5px] text-white/40 block">YOUR PASSES</span>
              <div className="h-5 bg-indigo-500/10 border border-indigo-500/20 text-[6px] text-indigo-300 font-bold uppercase rounded-sm flex items-center justify-center gap-1">
                <Ticket size={8} /> Pass Verified
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-1.5 flex flex-col justify-between">
              <span className="text-[5.5px] text-white/40 block">CARBON OFFSET</span>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 leading-none">
                🌱 -14kg
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Introduction Card Banner */}
      <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-forest-950 to-forest-900 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={12} /> Interactive Workspace Map
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight leading-none">
            Welcome to the <span className="gold-gradient-text">Rwanda Hub</span> Explorer Tour
          </h2>
          <p className="text-sm text-white/60 leading-relaxed font-sans max-w-2xl">
            This workspace aggregates 5 specialized real-time dashboards running on a unified modular architecture. 
            Browse their core interface schematics and switch perspectives instantaneously using the sandbox controls below.
          </p>
        </div>
      </div>

      {/* Grid of Dashboard Preview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dash, idx) => {
          const isActive = dash.role === activeRole;
          return (
            <motion.div
              key={dash.role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`p-6 bg-gradient-to-b ${dash.colorClass} border rounded-[2rem] flex flex-col justify-between space-y-5 duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 transition-all ${
                isActive ? 'border-gold-400/80 ring-2 ring-gold-400/20 shadow-lg shadow-gold-500/5' : ''
              }`}
            >
              {/* Title & Badge */}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gold-400/15 border border-gold-400/30 text-[7px] font-mono font-black text-gold-400 leading-none uppercase tracking-[0.1em] animate-pulse">
                        ⭐ Active Profile Role
                      </span>
                    )}
                    <h3 className="text-lg font-display font-bold text-white tracking-tight">{dash.title}</h3>
                  </div>
                  <span className={`text-[8.5px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${dash.accentBg} ${dash.accentText} border border-white/5 shrink-0`}>
                    {dash.role}
                  </span>
                </div>
                <p className="text-xs text-white/65 leading-relaxed font-sans mt-1">
                  {dash.desc}
                </p>
              </div>

              {/* Layout Schematic render */}
              <div className="py-1">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/30 block mb-1.5">Interactive CSS Scaffold Blueprint</span>
                {dash.schematic}
              </div>

              {/* Core Modules Sub-lists */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/30 block">Configured Handlers</span>
                <div className="flex flex-wrap gap-1">
                  {dash.modules.map((mod) => (
                    <span key={mod} className="text-[8px] px-2 py-0.75 bg-white/5 text-white/70 rounded-md border border-white/[0.03]">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Stats rows */}
              <div className="grid grid-cols-3 border-t border-white/5 pt-4 gap-1">
                {dash.keyStats.map((st) => (
                  <div key={st.label} className="text-center font-sans">
                    <span className="text-[7.5px] text-white/40 block uppercase tracking-wider leading-none font-bold">{st.label}</span>
                    <span className={`text-[11px] font-bold mt-1 block leading-none ${st.color}`}>{st.value}</span>
                  </div>
                ))}
              </div>

              {/* Switch role button */}
              <button
                onClick={() => {
                  if (!isActive) {
                    onSwitchRole(dash.role);
                  }
                  onGoToTab('overview');
                }}
                className={`w-full py-3.5 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95 ${
                  isActive ? 'bg-gold-500 hover:bg-gold-400 text-forest-950 shadow-gold-500/10' : dash.btnClass
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle size={12} /> Enter Active Dashboard
                  </>
                ) : (
                  <>
                    <Eye size={12} /> Engage {dash.role.toUpperCase()} Hub
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
