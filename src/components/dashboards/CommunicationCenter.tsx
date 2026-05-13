import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  MoreVertical, 
  User, 
  Plus, 
  Megaphone, 
  Shield, 
  CheckCheck,
  Clock,
  ArrowLeft,
  Filter,
  Paperclip,
  Image as ImageIcon
} from 'lucide-react';
import { dbService } from '../../services/db';
import { User as UserType, Message, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CommunicationCenterProps {
  currentUser: UserType;
}

export default function CommunicationCenter({ currentUser }: CommunicationCenterProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'chat' | 'broadcast'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  useEffect(() => {
    const loadContent = () => {
      const allMsgs = dbService.getMessagesForUser(currentUser.id);
      setMessages(allMsgs);

      if (isAdmin) {
        // Group messages by partner for admin
        const state = dbService.get();
        const partners = state.users.filter(u => u.role === UserRole.OPERATOR || u.role === UserRole.EDITOR);
        
        const convs = partners.map(p => {
          const partnerMsgs = allMsgs.filter(m => m.senderId === p.id || m.receiverId === p.id);
          const lastMsg = partnerMsgs[partnerMsgs.length - 1];
          return {
            id: p.id,
            name: p.name,
            role: p.role,
            lastMessage: lastMsg?.content || 'No messages yet',
            timestamp: lastMsg?.timestamp || null,
            unread: partnerMsgs.filter(m => !m.read && m.receiverId === currentUser.id).length
          };
        });
        setConversations(convs);
      }
    };

    loadContent();
    window.addEventListener('db-update', loadContent);
    return () => window.removeEventListener('db-update', loadContent);
  }, [currentUser.id, isAdmin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (view === 'broadcast' && isAdmin) {
      dbService.sendMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: 'all',
        content: newMessage,
        type: 'broadcast'
      });
    } else if (activeConversation) {
      dbService.sendMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: activeConversation,
        content: newMessage,
        type: 'direct'
      });
    } else if (!isAdmin) {
      // Partner messaging admin
      dbService.sendMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: '1', // Admin ID
        content: newMessage,
        type: 'direct'
      });
    }

    setNewMessage('');
  };

  const [filterType, setFilterType] = useState<'all' | 'unread' | 'archived'>('all');
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  const toggleArchive = (id: string) => {
    setArchivedIds(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'unread') return matchesSearch && c.unread > 0 && !archivedIds.includes(c.id);
    if (filterType === 'archived') return matchesSearch && archivedIds.includes(c.id);
    return matchesSearch && !archivedIds.includes(c.id);
  });

  const activeMessages = messages.filter(m => {
    if (view === 'broadcast') return m.type === 'broadcast';
    if (isAdmin) {
      return (m.senderId === activeConversation || m.receiverId === activeConversation) && m.type !== 'broadcast';
    } else {
      return (m.senderId === currentUser.id || m.receiverId === currentUser.id) && m.type !== 'broadcast';
    }
  });

  return (
    <div className="flex glass rounded-[2.5rem] border border-white/5 overflow-hidden h-[75vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar - Only for Admin */}
      {isAdmin && (
        <div className="w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white">Partners</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setView('broadcast')}
                  className={`p-2 rounded-xl transition-all ${view === 'broadcast' ? 'bg-gold-500 text-forest-900' : 'bg-white/5 text-white/40 hover:text-white'}`}
                  title="Broadcast"
                >
                  <Megaphone size={16} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              {(['all', 'unread', 'archived'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`flex-1 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === f ? 'bg-gold-500 text-forest-900' : 'text-white/30 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              <input 
                type="text" 
                placeholder="Search dialogue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => {
                    setActiveConversation(conv.id);
                    setView('chat');
                  }}
                  className={`w-full p-4 rounded-[2rem] flex items-center gap-4 transition-all group mb-1 ${activeConversation === conv.id && view === 'chat' ? 'bg-gold-500/10 border border-gold-500/20' : 'hover:bg-white/5'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                     <User size={20} className="text-white/20" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-sm font-bold text-white truncate">{conv.name}</span>
                      <span className="text-[9px] text-white/20">{conv.timestamp ? new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <p className="text-[10px] text-white/30 truncate uppercase tracking-widest">{conv.role}</p>
                    <p className="text-[11px] text-white/40 truncate italic mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-[9px] font-black text-forest-900">{conv.unread}</span>
                    </div>
                  )}
                </button>
                <button 
                  onClick={() => toggleArchive(conv.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-white/10 rounded-xl text-white hover:bg-gold-500 hover:text-forest-900 transition-all z-10"
                  title={archivedIds.includes(conv.id) ? "Unarchive" : "Archive"}
                >
                  <Paperclip size={14} className={archivedIds.includes(conv.id) ? "rotate-45" : ""} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-4">
             {isAdmin && view === 'chat' && activeConversation ? (
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{conversations.find(c => c.id === activeConversation)?.name}</h4>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Partner</span>
                  </div>
               </div>
             ) : view === 'broadcast' ? (
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <Megaphone size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Global Broadcast</h4>
                    <span className="text-[10px] font-black text-gold-500/40 uppercase tracking-widest">{isAdmin ? 'Send to all partners' : 'Latest updates'}</span>
                  </div>
               </div>
             ) : !isAdmin ? (
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Admin Support</h4>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Direct Link to HQ</span>
                  </div>
               </div>
             ) : (
               <div className="flex items-center gap-4 opacity-30">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Select a contact</h4>
                  </div>
               </div>
             )}
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/20 hover:text-white">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
        >
          {activeMessages.length > 0 ? activeMessages.map((msg, i) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] group`}>
                  <div className={`p-4 rounded-[2rem] border ${isMe ? 'bg-gold-500 text-forest-900 border-gold-400 rounded-tr-none' : 'bg-white/5 text-white border-white/10 rounded-tl-none'}`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                    <div className={`flex items-center gap-2 mt-2 ${isMe ? 'text-forest-900/60' : 'text-white/30'}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <CheckCheck size={12} className="opacity-40" />}
                    </div>
                  </div>
                  {!isMe && (
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4 mt-1 block">
                      {msg.senderName}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          }) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 select-none">
              <Megaphone size={64} className="mb-6 -rotate-12" />
              <p className="text-sm font-black uppercase tracking-[0.3em]">Channel Silent</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2">
          {(!isAdmin || activeConversation || view === 'broadcast') ? (
            <form onSubmit={handleSendMessage} className="relative">
              <div className="flex gap-4 p-2 bg-white/5 border border-white/10 rounded-[2.5rem] focus-within:border-gold-500/50 transition-all items-center">
                <button type="button" className="p-3 text-white/20 hover:text-white transition-colors">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={view === 'broadcast' ? "Draft community broadcast..." : "Secure message to HQ..."}
                  className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-white/10"
                />
                <button 
                  type="submit"
                  className="p-3 bg-gold-500 text-forest-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold-500/20"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 glass rounded-3xl border border-white/5 text-center">
               <p className="text-xs text-white/20 font-black uppercase tracking-widest italic">Select a partner to initiate dialogue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
