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
  Image as ImageIcon,
  Edit2,
  Trash2,
  CornerUpLeft,
  X,
  Check,
  CheckSquare,
  Square,
  Mail,
  ShieldAlert,
  Copy,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Lock,
  LockOpen,
  MessageSquare
} from 'lucide-react';
import { dbService } from '../../services/db';
import { User as UserType, Message, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CommunicationCenterProps {
  currentUser: UserType;
}

const SYNC_EMAIL = "vedasteniringiyimana2005@gmail.com";

export default function CommunicationCenter({ currentUser }: CommunicationCenterProps) {
  // Database messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [view, setView] = useState<'chat' | 'broadcast' | 'support'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  // Custom Feature States: Editing, Deleting, and Reply
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  // Message Multiselect for Bulk Deletion and operations ("delete as many/others")
  const [multiselectMode, setMultiselectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  // Contact Multiselect for Bulk Messaging ("reply as many/others")
  const [bulkContactMode, setBulkContactMode] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [bulkMessageText, setBulkMessageText] = useState('');
  const [showBulkComposeModal, setShowBulkComposeModal] = useState(false);

  // Email Token Verification UI Mock Sandbox Safeguard (Requested feature)
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Active verified default, can request code
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // User Management States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);

  // Form inputs for Add User
  const [addUserName, setAddUserName] = useState('');
  const [addUserEmail, setAddUserEmail] = useState('');
  const [addUserRole, setAddUserRole] = useState<UserRole>(UserRole.TOURIST);
  const [addUserBusiness, setAddUserBusiness] = useState('');
  const [addUserVerified, setAddUserVerified] = useState(true);

  // Form inputs for Edit User
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>(UserRole.TOURIST);
  const [editUserBusiness, setEditUserBusiness] = useState('');
  const [editUserVerified, setEditUserVerified] = useState(false);

  // Advanced Search parameters
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchHasAttachments, setSearchHasAttachments] = useState(false);

  // New message attachment state
  const [pendingAttachments, setPendingAttachments] = useState<string[]>([]);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);

  // Handler to delete a user/contact
  const handleDeleteUser = (userId: string) => {
    dbService.deleteUser(userId);
    if (activeConversation === userId) {
      setActiveConversation(null);
    }
    notify('User contact permanently deleted from records');
    loadContent(); // Refresh local list
  };

  // Handler to open and initialize edit modal
  const handleOpenEditUser = (user: any) => {
    setUserToEdit(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role as UserRole);
    setEditUserBusiness(user.businessName || '');
    setEditUserVerified(user.emailVerified ?? false);
    setShowEditUserModal(true);
  };

  // Submit edit user form
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    dbService.updateUser(userToEdit.id, {
      name: editUserName,
      email: editUserEmail,
      role: editUserRole,
      emailVerified: editUserVerified,
      businessName: editUserRole === UserRole.OPERATOR ? editUserBusiness : undefined
    });

    notify(`Successfully updated profile details for ${editUserName}`);
    setShowEditUserModal(false);
    setUserToEdit(null);
    loadContent(); // Refresh local list
  };

  // Submit add user form
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserName.trim() || !addUserEmail.trim()) {
      notify('Please specify both descriptive name and communication email');
      return;
    }

    const newUser = dbService.addUser({
      name: addUserName,
      email: addUserEmail,
      role: addUserRole,
      password: 'password123', // Default credential
      emailVerified: addUserVerified,
      isActive: true,
      businessName: addUserRole === UserRole.OPERATOR ? addUserBusiness : undefined
    });

    notify(`Created new operational profile for "${addUserName}" (${addUserVerified ? "Direct Sync Verified" : "Verification Token Routing Pending"})!`);
    
    // Clear form
    setAddUserName('');
    setAddUserEmail('');
    setAddUserRole(UserRole.TOURIST);
    setAddUserBusiness('');
    setAddUserVerified(true);
    setShowAddUserModal(false);

    // Swap to active conversation with the newly created contact
    setActiveConversation(newUser.id);
    setView('chat');
    loadContent(); // Reload conversations list
  };

  const notify = (msg: string) => {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
  };

  // Main system loading effect
  const loadContent = () => {
    const allMsgs = dbService.getMessagesForUser(currentUser.id);
    setMessages(allMsgs);

    const state = dbService.get();
    // Gather all partners/users
    const usersList = state.users.filter(u => u.id !== currentUser.id);
    
    const convs = usersList.map(p => {
      const partnerMsgs = allMsgs.filter(m => m.senderId === p.id || m.receiverId === p.id);
      const lastMsg = partnerMsgs[partnerMsgs.length - 1];
      const supportMsgs = partnerMsgs.filter(m => m.type === 'support');
      
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role,
        lastMessage: lastMsg?.content || 'No messages yet',
        timestamp: lastMsg?.timestamp || null,
        unread: partnerMsgs.filter(m => !m.read && m.receiverId === currentUser.id).length,
        hasSupport: supportMsgs.length > 0,
        emailVerified: p.emailVerified
      };
    });
    setConversations(convs);
  };

  useEffect(() => {
    loadContent();
    window.addEventListener('db-update', loadContent);
    return () => window.removeEventListener('db-update', loadContent);
  }, [currentUser.id, isAdmin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeConversation, view]);

  // Handle single message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && pendingAttachments.length === 0) return;

    const finalContent = replyingToMessage
      ? `↪️ Replying: "${replyingToMessage.content.substring(0, 30)}..."\n\n${newMessage}`
      : newMessage;

    const payload: any = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: finalContent || `[Simulated attachment transmission]`,
      type: view === 'support' ? 'support' : 'direct',
    };

    if (replyingToMessage) {
      payload.parentMessageId = replyingToMessage.id;
      payload.replyToContent = replyingToMessage.content;
    }

    if (pendingAttachments.length > 0) {
      payload.hasAttachment = true;
      payload.attachments = [...pendingAttachments];
    }

    const stateUsers = dbService.get().users;
    let recipientEmail = SYNC_EMAIL;

    if (activeConversation) {
      const targetUser = stateUsers.find(u => u.id === activeConversation);
      if (targetUser) {
        recipientEmail = targetUser.email;
        payload.receiverEmail = targetUser.email;
      }
    } else if (!isAdmin) {
      const adminUser = stateUsers.find(u => u.id === '1');
      if (adminUser) {
        recipientEmail = adminUser.email;
        payload.receiverEmail = adminUser.email;
      }
    }

    if (view === 'broadcast' && isAdmin) {
      dbService.sendMessage({
        ...payload,
        receiverId: 'all',
        type: 'broadcast'
      });
      notify(`Community alert broadcasted & duplicated to list email: ${SYNC_EMAIL}`);
    } else if (activeConversation) {
      dbService.sendMessage({
        ...payload,
        receiverId: activeConversation
      });
      notify(`Message sent! Copy delivered to valid email address: ${recipientEmail}`);
    } else if (!isAdmin) {
      // Partner messaging admin
      dbService.sendMessage({
        ...payload,
        receiverId: '1', // Admin ID
      });
      notify(`Inquiry received at desk. Recipient notified at: ${recipientEmail}`);
    }

    setNewMessage('');
    setReplyingToMessage(null);
    setPendingAttachments([]);
    setShowAttachmentDropdown(false);
  };

  // Action: Single delete
  const handleDeleteMessage = (id: string) => {
    dbService.deleteMessage(id);
    setSelectedMessageIds(prev => prev.filter(mId => mId !== id));
    notify('Selected message reference pulled down from sync files');
  };

  // Action: Bulk Delete ("as many")
  const handleBulkDelete = () => {
    if (selectedMessageIds.length === 0) return;
    dbService.deleteMessages(selectedMessageIds);
    notify(`Permanently purged ${selectedMessageIds.length} messages from records`);
    setSelectedMessageIds([]);
    setMultiselectMode(false);
  };

  // Action: Edit Message ("edit")
  const handleSaveEdit = (id: string) => {
    if (!editingContent.trim()) return;
    dbService.editMessage(id, editingContent);
    setEditingMessageId(null);
    setEditingContent('');
    notify('Message updated successfully and resent to sync feed');
  };

  // Action: Send to many selected (Bulk Reply / Compose to Many)
  const handleSendBulkMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContactIds.length === 0 || !bulkMessageText.trim()) {
      notify('Please select at least one contact and type your message');
      return;
    }

    dbService.bulkReply(
      selectedContactIds,
      bulkMessageText,
      currentUser.id,
      currentUser.name,
      view === 'support' ? 'support' : 'direct'
    );

    notify(`Dispatched bulk thread message to ${selectedContactIds.length} partners. Copy: ${SYNC_EMAIL}`);
    setBulkMessageText('');
    setSelectedContactIds([]);
    setBulkContactMode(false);
    setShowBulkComposeModal(false);
  };

  // Security Verification generation
  const handleGenerateSecurityToken = () => {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedToken(token);
    notify(`🔑 Verification token generated and dispatched to ${SYNC_EMAIL}!`);
    console.log(`[SECURE TOKEN UI]: Generated verification token: ${token} for synchronization control.`);
  };

  const verifyToken = () => {
    if (enteredCode === generatedToken) {
      setIsEmailVerified(true);
      notify(`✅ Secure session activated! System logs fully synced with ${SYNC_EMAIL}`);
      setShowSecurityModal(false);
      setEnteredCode('');
      setGeneratedToken(null);
    } else {
      notify('❌ Invalid token. Please check your admin panel command console records or request again');
    }
  };

  const [filterType, setFilterType] = useState<'all' | 'unread' | 'support' | 'archived'>('all');
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  const toggleArchive = (id: string) => {
    setArchivedIds(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'unread') return matchesSearch && c.unread > 0 && !archivedIds.includes(c.id);
    if (filterType === 'support') return matchesSearch && c.hasSupport && !archivedIds.includes(c.id);
    if (filterType === 'archived') return matchesSearch && archivedIds.includes(c.id);
    return matchesSearch && !archivedIds.includes(c.id);
  });

  const activeMessages = messages.filter(m => {
    if (view === 'broadcast') return m.type === 'broadcast';
    if (isAdmin) {
      const basicFilter = (m.senderId === activeConversation || m.receiverId === activeConversation) && m.type !== 'broadcast';
      if (view === 'support') return basicFilter && m.type === 'support';
      return basicFilter;
    } else {
      return (m.senderId === currentUser.id || m.receiverId === currentUser.id) && m.type !== 'broadcast';
    }
  });

  const filteredMessages = activeMessages.filter(m => {
    // Advanced Filters check first
    if (searchStartDate) {
      const msgDateStr = m.timestamp.split('T')[0]; // YYYY-MM-DD
      if (msgDateStr < searchStartDate) return false;
    }
    if (searchEndDate) {
      const msgDateStr = m.timestamp.split('T')[0]; // YYYY-MM-DD
      if (msgDateStr > searchEndDate) return false;
    }
    if (searchHasAttachments) {
      if (!m.hasAttachment) return false;
    }

    if (!messageSearchQuery.trim()) return true;
    const q = messageSearchQuery.toLowerCase();
    
    // Check message content
    const matchContent = m.content.toLowerCase().includes(q);
    
    // Check sender name
    const matchSender = m.senderName.toLowerCase().includes(q);
    
    // Check date (e.g., matching timestamp formatted components)
    const dateObj = new Date(m.timestamp);
    
    // Options for localized formatted date
    const formattedDate = dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).toLowerCase();

    // Alternate formatting, like "05/25/2026" or "25/05/2026" depending on locale
    const simpleDate = dateObj.toLocaleDateString().toLowerCase();
    
    // Day of week
    const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'long' }).toLowerCase();

    // Time matching (e.g., "11:55" or "11:55 PM")
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();

    const matchDate = formattedDate.includes(q) || 
                      simpleDate.includes(q) || 
                      weekday.includes(q) || 
                      formattedTime.includes(q) ||
                      m.timestamp.toLowerCase().includes(q);
    
    return matchContent || matchSender || matchDate;
  });

  // Toggle contacts in multi-login setup
  const toggleContactSelect = (contactId: string) => {
    setSelectedContactIds(prev => prev.includes(contactId) ? prev.filter(i => i !== contactId) : [...prev, contactId]);
  };

  // Toggle messaging selection for bulk deleting / batching
  const toggleMessageSelect = (msgId: string) => {
    setSelectedMessageIds(prev => prev.includes(msgId) ? prev.filter(i => i !== msgId) : [...prev, msgId]);
  };

  return (
    <div className="CommunicationCenter space-y-6" id="communication-center-root">
      {/* 📧 Global Sync & Security Notification Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-3 px-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 rounded-2xl bg-emerald-400/10 text-emerald-400">
              <Mail size={18} />
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">Email Routing Safeguard Active</span>
              <span className="text-[9px] font-mono bg-emerald-400 text-forest-950 font-black px-1.5 py-0.5 rounded uppercase">live-sync</span>
            </div>
            <p className="text-[11px] text-white/50 italic mt-0.5">
              All messages generated or written are safely mirrored to: <span className="text-emerald-300 font-bold underline font-mono">{SYNC_EMAIL}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSecurityModal(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            isEmailVerified 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
          }`}
        >
          {isEmailVerified ? <Lock size={12} /> : <LockOpen size={12} />}
          Verification UI Panel
        </button>
      </div>

      <div className="flex glass rounded-[2.5rem] border border-white/5 overflow-hidden h-[70vh] animate-in fade-in duration-500 relative">
        {/* Sidebar - Contacts / Members */}
        {isAdmin && (
          <div className="w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/20">Operational</span>
                  <h3 className="font-display font-bold text-white text-md">Communications</h3>
                </div>
                
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(true)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-forest-900 text-emerald-400 border border-emerald-500/20 transition-all flex items-center justify-center gap-1 shrink-0"
                    title="Add New User Contact"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={() => {
                      setBulkContactMode(!bulkContactMode);
                      setView('chat');
                      setActiveConversation(null);
                      setSelectedContactIds([]);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                      bulkContactMode 
                        ? 'bg-amber-500 text-forest-950 border-amber-400' 
                        : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                    }`}
                    title="Send single message to multiple partners"
                  >
                    Reply Many
                  </button>
                  <button 
                    onClick={() => { setView('broadcast'); setBulkContactMode(false); setActiveConversation(null); }}
                    className={`p-2 rounded-xl transition-all ${view === 'broadcast' ? 'bg-gold-500 text-forest-900 shadow-lg shadow-gold-500/20' : 'bg-white/5 text-white/40 hover:text-white'}`}
                    title="Broadcast of One to All"
                  >
                    <Megaphone size={14} />
                  </button>
                </div>
              </div>

              {!bulkContactMode && (
                <div className="flex gap-1 p-0.5 bg-white/5 rounded-xl border border-white/5">
                  {(['all', 'unread', 'support', 'archived'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === f ? 'bg-gold-500 text-forest-900 shadow-sm' : 'text-white/30 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={13} />
                <input 
                  type="text" 
                  placeholder={bulkContactMode ? "Filter contacts..." : "Search dialogues..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            {/* Bulk Contact Selection Alert Bar */}
            {bulkContactMode && (
              <div className="px-5 py-2.5 bg-amber-500/10 border-y border-amber-500/20 flex justify-between items-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  {selectedContactIds.length} Chosen
                </span>
                {selectedContactIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowBulkComposeModal(true)}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-forest-950 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Compose Bulk
                  </button>
                )}
              </div>
            )}

            {/* Conversation/Contact Grid feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
              {filteredConversations.length === 0 ? (
                <p className="text-center text-xs text-white/20 italic mt-8 font-sans">No matching records found</p>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedContactIds.includes(conv.id);
                  return (
                    <div key={conv.id} className="relative group p-0.5">
                      <div className="flex items-center gap-2">
                        {bulkContactMode && (
                          <button
                            type="button"
                            onClick={() => toggleContactSelect(conv.id)}
                            className="p-2 ml-1 text-white/30 hover:text-white transition-all shrink-0"
                          >
                            {isSelected ? <CheckSquare size={18} className="text-amber-400" /> : <Square size={18} />}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (bulkContactMode) {
                              toggleContactSelect(conv.id);
                            } else {
                              setActiveConversation(conv.id);
                              setView(filterType === 'support' ? 'support' : 'chat');
                            }
                          }}
                          className={`flex-1 p-3.5 rounded-[1.75rem] flex items-center gap-3 transition-all text-left ${
                            activeConversation === conv.id && (view === 'chat' || view === 'support') 
                              ? 'bg-gold-500/10 border border-gold-500/20' 
                              : isSelected 
                              ? 'bg-amber-500/5 border border-amber-500/10' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                            <User size={16} className="text-white/30" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-xs font-bold text-white truncate block">{conv.name}</span>
                                {conv.emailVerified ? (
                                  <span 
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-[8px] text-emerald-400 rounded font-sans font-black uppercase tracking-wider shrink-0" 
                                    title="Verified Email: Syncing to valid inbox confirmed"
                                  >
                                    <Check size={8} className="text-emerald-400 shrink-0" strokeWidth={3.5} /> Verified Email
                                  </span>
                                ) : (
                                  <span 
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[8px] text-amber-400 rounded font-sans font-black uppercase tracking-wider shrink-0" 
                                    title="Unverified Email: Token verification pending"
                                  >
                                    Pending
                                  </span>
                                )}
                              </div>
                              <span className="text-[8px] text-white/20 shrink-0">
                                {conv.timestamp ? new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest">{conv.role}</p>
                            <p className="text-[10px] text-white/40 truncate italic mt-0.5">{conv.lastMessage}</p>
                          </div>
                          {conv.unread > 0 && !bulkContactMode && (
                            <div className="w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-[8px] font-black text-forest-950">{conv.unread}</span>
                            </div>
                          )}
                        </button>
                      </div>

                      {!bulkContactMode && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-forest-950/95 border border-white/10 p-1 rounded-2xl shadow-lg z-20 transition-all">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(conv)}
                            className="p-1.5 hover:bg-white/10 rounded-xl text-white/50 hover:text-emerald-400 transition-all"
                            title="Edit User Info"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete user ${conv.name}? This removes their profile from the system database.`)) {
                                handleDeleteUser(conv.id);
                              }
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-xl text-white/50 hover:text-red-400 transition-all"
                            title="Delete User Contact"
                          >
                            <Trash2 size={11} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => toggleArchive(conv.id)}
                            className="p-1.5 hover:bg-white/10 rounded-xl text-white/50 hover:text-gold-400 transition-all"
                            title={archivedIds.includes(conv.id) ? "Unarchive Dialog" : "Archive Dialog"}
                          >
                            <Paperclip size={11} className={archivedIds.includes(conv.id) ? "rotate-45 text-gold-400" : ""} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Messaging Board Frame */}
        <div className="flex-1 flex flex-col relative">
          {/* Active Chat Header */}
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-3">
              {isAdmin && (view === 'chat' || view === 'support') && activeConversation ? (() => {
                const activeConvUser = conversations.find(c => c.id === activeConversation);
                return (
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${view === 'support' ? 'bg-red-500/10 text-red-400' : 'bg-gold-500/10 text-gold-400'}`}>
                      <User size={16} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs font-bold text-white">
                          {activeConvUser?.name || "Adventure Partner"}
                        </h4>
                        {activeConvUser?.emailVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-[8px] text-emerald-400 rounded-full font-sans font-black uppercase tracking-wider" title="Sync confirmed to their verified email inbox">
                            <Check size={8} strokeWidth={3} className="text-emerald-400" /> Synced to: {activeConvUser?.email}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/25 text-[8px] text-amber-400 rounded-full font-sans font-black uppercase tracking-wider animate-pulse" title="Security token verification is pending for this user email">
                            Unverified Email: {activeConvUser?.email}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block leading-none mt-1">
                        {view === 'support' ? 'Support Channel' : 'Protected Dialogue Session'}
                      </span>
                    </div>
                  </div>
                );
              })() : view === 'broadcast' ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                    <Megaphone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Hub Broadcast Dispatch</h4>
                    <span className="text-[9px] font-black text-gold-400/40 uppercase tracking-widest block leading-none mt-0.5">
                      {isAdmin ? 'Deliver alerts directly of one to many' : 'Operational Announcements'}
                    </span>
                  </div>
                </div>
              ) : !isAdmin ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                    <Shield size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Secure Admin desk</h4>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block leading-none mt-0.5">Direct encrypted bridge</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 opacity-30 select-none">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">No dialog selected</h4>
                  </div>
                </div>
              )}
            </div>

            {/* Selection modes toolbar */}
            <div className="flex items-center gap-2">
              {/* Message Search Bar */}
              {(activeMessages.length > 0 || messageSearchQuery || searchStartDate || searchEndDate || searchHasAttachments) && (
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={13} />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={messageSearchQuery}
                      onChange={(e) => setMessageSearchQuery(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500/50 w-32 sm:w-44 transition-all"
                    />
                    {messageSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setMessageSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        title="Clear text search"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Has Attachments Quick Toggle Button */}
                  <button
                    type="button"
                    id="has-attachments-toggle-btn"
                    onClick={() => {
                      setSearchHasAttachments(!searchHasAttachments);
                      if (!searchHasAttachments) {
                        window.dispatchEvent(new CustomEvent('app-toast', { detail: '📎 Filtered to show messages with attachments only' }));
                      } else {
                        window.dispatchEvent(new CustomEvent('app-toast', { detail: '📎 Attachment filter cleared' }));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all border flex items-center justify-center gap-1.5 shrink-0 ${
                      searchHasAttachments
                        ? 'bg-gold-500 text-forest-950 border-gold-400 font-bold shadow-md shadow-gold-500/10'
                        : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                    title={searchHasAttachments ? "Showing attachments only" : "Filter by attachments"}
                  >
                    <Paperclip size={11} className={searchHasAttachments ? 'stroke-[2.5px]' : ''} />
                    <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
                      Has Attachments
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className={`p-1.5 rounded-xl transition-all border flex items-center justify-center gap-1 shrink-0 ${
                      showAdvancedSearch || searchStartDate || searchEndDate || searchHasAttachments
                        ? 'bg-gold-500 text-forest-950 border-gold-400 font-bold'
                        : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                    title="Advanced Discovery Filters (By Date, Attachments)"
                  >
                    <Filter size={11.5} />
                    <span className="text-[9px] font-black uppercase tracking-wider hidden md:inline">
                      {showAdvancedSearch ? 'Hide' : 'Filters'}
                    </span>
                    {(searchStartDate || searchEndDate || searchHasAttachments) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block border border-forest-950 animate-pulse" />
                    )}
                  </button>
                </div>
              )}

              {activeMessages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMultiselectMode(!multiselectMode);
                    setSelectedMessageIds([]);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                    multiselectMode 
                      ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                      : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                  }`}
                >
                  {multiselectMode ? "Exit Select" : "Select Messages"}
                </button>
              )}
              <div className="p-1 rounded-full text-white/20">
                <MoreVertical size={16} />
              </div>
            </div>
          </div>

          {/* Advanced Search Options Panel */}
          <AnimatePresence>
            {showAdvancedSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-forest-900/40 border-b border-white/5 backdrop-blur-md"
              >
                <div className="p-5 flex flex-col md:flex-row gap-4 items-end justify-between">
                  <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                    {/* Start Date */}
                    <div className="space-y-1 flex-1 sm:flex-initial min-w-[120px]">
                      <label className="block text-[9px] font-black uppercase text-gold-400 tracking-widest leading-none mb-1">
                        📅 Start Date
                      </label>
                      <input
                        type="date"
                        value={searchStartDate}
                        onChange={(e) => setSearchStartDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1 flex-1 sm:flex-initial min-w-[120px]">
                      <label className="block text-[9px] font-black uppercase text-gold-400 tracking-widest leading-none mb-1">
                        📅 End Date
                      </label>
                      <input
                        type="date"
                        value={searchEndDate}
                        onChange={(e) => setSearchEndDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
                      />
                    </div>

                    {/* Has Attachments toggle button */}
                    <button
                      type="button"
                      onClick={() => setSearchHasAttachments(!searchHasAttachments)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all border self-end ${
                        searchHasAttachments
                          ? 'bg-gold-500/10 text-gold-300 border-gold-500/30'
                          : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Paperclip size={12} className={searchHasAttachments ? 'text-gold-400' : ''} />
                      <span className="text-[10px] font-black uppercase tracking-wider font-sans">
                        With Attachments Only
                      </span>
                    </button>
                  </div>

                  {/* Reset Filters action */}
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    {(searchStartDate || searchEndDate || searchHasAttachments || messageSearchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchStartDate('');
                          setSearchEndDate('');
                          setSearchHasAttachments(false);
                          setMessageSearchQuery('');
                          notify('All search and date filters reset to defaults');
                        }}
                        className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/20 transition-all font-sans"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Selection Message options bar (Delete Many / Others) */}
          {multiselectMode && selectedMessageIds.length > 0 && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="px-6 py-3 bg-red-950/40 border-b border-red-900/40 flex justify-between items-center z-10"
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare size={14} className="text-red-400" />
                <span className="text-xs text-red-200">
                  <span className="font-mono font-bold font-black">{selectedMessageIds.length}</span> messages specified for clearing action
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMessageIds([])}
                  className="px-3 py-1.5 bg-white/5 text-white/60 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-all shadow-md shadow-red-500/10"
                >
                  <Trash2 size={11} /> Delete Chosen Many
                </button>
              </div>
            </motion.div>
          )}

          {/* Message Streams view feed */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-forest-950/20 relative"
          >
            {activeMessages.length > 0 ? (
              filteredMessages.length > 0 ? (
                filteredMessages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUser.id;
                  const isEditing = editingMessageId === msg.id;
                  const isSelected = selectedMessageIds.includes(msg.id);

                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 280, 
                        damping: 24, 
                        mass: 0.9 
                      }}
                      layout="position"
                      className={`flex items-start gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Multiselect Checkbox overlay */}
                      {multiselectMode && (
                        <button
                          type="button"
                          onClick={() => toggleMessageSelect(msg.id)}
                          className="self-center p-2 text-white/30 hover:text-white transition-all scale-105 shrink-0"
                        >
                          {isSelected ? <CheckSquare size={16} className="text-red-400" /> : <Square size={16} />}
                        </button>
                      )}

                      <div className="max-w-[70%] group relative">
                        {/* Quoted quotation header block */}
                        {msg.replyToContent && (
                          <div className="mx-4 mb-1 p-2 bg-white/[0.03] border border-white/5 border-b-none text-[10px] text-white/40 italic rounded-t-xl max-w-[90%] flex items-center gap-1.5">
                            <CornerUpLeft size={10} className="text-gold-400" />
                            <span className="truncate">Quoted: "{msg.replyToContent}"</span>
                          </div>
                        )}

                        <div className={`p-4 rounded-[2rem] border relative ${
                          isMe 
                            ? 'bg-gold-500 text-forest-900 border-gold-400 rounded-tr-none' 
                            : msg.type === 'support' 
                            ? 'bg-red-500/10 text-white border-red-500/20 rounded-tl-none' 
                            : 'bg-white/5 text-white border-white/10 rounded-tl-none'
                        }`}>
                          
                          {/* Message body text / edit state input */}
                          {isEditing ? (
                            <div className="space-y-2 py-1">
                              <textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-inherit focus:outline-none"
                                rows={2}
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingMessageId(null)}
                                  className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-white/10"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(msg.id)}
                                  className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-forest-900 text-gold-400"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              
                              {/* Attachments rendering block */}
                              {msg.hasAttachment && msg.attachments && msg.attachments.length > 0 && (
                                <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5 select-none">
                                  {msg.attachments.map((file, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => {
                                        notify(`Simulated download: "${file}" saved to offline folder.`);
                                      }}
                                      className={`px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold flex items-center gap-1 border transition-all ${
                                        isMe 
                                          ? 'bg-forest-950/20 text-forest-950 border-forest-950/20 hover:bg-forest-950/45' 
                                          : 'bg-white/5 text-gold-300 border-white/5 hover:bg-white/10'
                                      }`}
                                      title="Download attachment file"
                                    >
                                      <Paperclip size={9} />
                                      {file}
                                    </button>
                                  ))}
                                </div>
                              )}
                              
                              {/* Forwarded email indicator if exists */}
                              {isMe && msg.receiverEmail && (
                                <div className={`text-[8px] font-black uppercase tracking-wider flex items-center gap-1 mt-1 leading-none font-sans ${
                                  isMe ? 'text-forest-900/50' : 'text-white/30'
                                }`}>
                                  <Mail size={9} /> Delivered to email: {msg.receiverEmail}
                                </div>
                              )}
                            </div>
                          )}

                          <div className={`flex items-center gap-2 mt-2 ${isMe ? 'text-forest-900/60' : 'text-white/30'}`}>
                            {msg.type === 'support' && !isMe && <Shield size={10} className="text-red-500" />}
                            <span className="text-[8px] font-black uppercase tracking-widest font-mono">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck size={11} className="opacity-50" />}
                          </div>

                          {/* Interactive Message actions button frame (Edit, Delete, Reply) */}
                          {!isEditing && !multiselectMode && (
                            <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 bg-forest-950 border border-white/10 rounded-xl px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-all z-20 ${
                              isMe ? '-left-24' : '-right-24'
                            }`}>
                              {/* Reply as one */}
                              <button
                                type="button"
                                onClick={() => setReplyingToMessage(msg)}
                                className="p-1.5 text-white/50 hover:text-gold-400 rounded-lg transition-all"
                                title="Reply / Quote Reference"
                              >
                                <CornerUpLeft size={12} />
                              </button>
                              {/* Edit content */}
                              {isMe && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMessageId(msg.id);
                                    setEditingContent(msg.content);
                                  }}
                                  className="p-1.5 text-white/50 hover:text-emerald-400 rounded-lg transition-all"
                                  title="Edit Message Content"
                                >
                                  <Edit2 size={12} />
                                </button>
                              )}
                              {/* Delete specific */}
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1.5 text-white/50 hover:text-red-400 rounded-lg transition-all"
                                title="Purge record"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {!isMe && (
                          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-4 mt-1 block">
                            {msg.senderName}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40 select-none text-center p-8">
                  <Search size={40} className="mb-4 text-white/30" />
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white">No Matching Messages</h5>
                  <p className="text-[10px] text-white/40 italic max-w-xs mt-1">
                    Your search query "{messageSearchQuery}" did not return any records matching content, sender name, or date.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMessageSearchQuery('')}
                    className="mt-4 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-white/10"
                  >
                    Clear Filter
                  </button>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-25 select-none text-center p-8">
                <Megaphone size={40} className="mb-4 text-white/40 -rotate-12" />
                <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white">No synchronized messages</h5>
                <p className="text-[10px] text-white/40 italic max-w-xs mt-1">All conversations started here are fully mirrored and indexed on {SYNC_EMAIL}.</p>
              </div>
            )}
          </div>

          {/* Quote helper strip above send field */}
          {replyingToMessage && !multiselectMode && (
            <div className="px-6 py-2.5 bg-gold-500/10 border-t border-gold-500/20 flex justify-between items-center text-xs text-gold-400">
              <span className="flex items-center gap-1.5 italic font-medium">
                <CornerUpLeft size={12} /> Replying to: "{replyingToMessage.content.substring(0, 45)}..."
              </span>
              <button 
                onClick={() => setReplyingToMessage(null)} 
                className="p-1 hover:bg-white/5 rounded-full text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Standard Input compose panel */}
          <div className="p-5 pt-1.5 border-t border-white/5 bg-white/[0.005]">
            {(!isAdmin || activeConversation || view === 'broadcast') ? (
              <div className="space-y-3">
                {/* Quick template suggestions */}
                {view !== 'broadcast' && (
                  <div className="flex flex-wrap items-center gap-1.5 pb-1 select-none">
                    <span className="text-[9px] font-black uppercase text-white/30 tracking-widest mr-1.5 font-mono flex items-center gap-1">
                      <Sparkles size={10} className="text-gold-400 animate-pulse" /> Quick replies:
                    </span>
                    {[
                      { label: '👋 Welcome', text: 'Karibu! Welcome to Rwanda Hub support desk. How may we assist with your travel or booking arrangements today?' },
                      { label: '📅 Reviewing', text: 'We are currently reviewing your booking records with our operators and will get back to you shortly.' },
                      { label: '✅ Verified', text: 'Your Mobile Money transaction has been successfully verified! Enjoy your experience.' },
                      { label: '📞 Callback', text: 'Our support agent will place a call to your registered phone number in a few minutes to resolve this.' }
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewMessage(tpl.text)}
                        className="bg-white/5 hover:bg-gold-500/20 hover:text-gold-400 text-white/60 px-2.5 py-1 rounded-full text-[9px] font-bold border border-white/5 hover:border-gold-500/25 transition-all uppercase tracking-wide cursor-pointer"
                        title="Click to insert template"
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                )}
                {/* Horizontal Pending Attachments Strips */}
                {pendingAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-white/[0.02] border border-white/5 rounded-2xl">
                    {pendingAttachments.map((f, i) => (
                      <span key={i} className="pl-2 px-1 py-0.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] font-mono font-bold rounded-lg flex items-center gap-1 shadow-sm">
                        <Paperclip size={9} />
                        {f}
                        <button
                          type="button"
                          onClick={() => setPendingAttachments(prev => prev.filter(x => x !== f))}
                          className="p-0.5 hover:bg-white/10 rounded-full text-white/50 hover:text-red-400 transition-colors"
                          title="Remove attachment"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="relative">
                  <div className="flex gap-4 p-2.5 bg-white/5 border border-white/10 rounded-[2.25rem] focus-within:border-gold-500/50 transition-all items-center relative">
                    <button 
                      type="button" 
                      onClick={() => setShowAttachmentDropdown(!showAttachmentDropdown)}
                      className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
                        showAttachmentDropdown || pendingAttachments.length > 0
                          ? 'bg-gold-500 text-forest-900 animate-pulse'
                          : 'text-white/20 hover:text-white hover:bg-white/5'
                      }`}
                      title="Attach Simulated Documents"
                    >
                      <Paperclip size={18} />
                    </button>
                    <input 
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={
                        view === 'broadcast' 
                          ? `Publish broadcast (Sync: ${SYNC_EMAIL})` 
                          : replyingToMessage 
                          ? "Enter your specific reply..." 
                          : `Write secure message... (Sync active with ${SYNC_EMAIL})`
                      }
                      className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-white/20"
                    />
                    <button 
                      type="submit"
                      className="py-2.5 px-4 bg-gold-500 hover:bg-gold-400 text-forest-900 rounded-full font-black text-[10px] uppercase tracking-wider transition-all shadow-md shadow-gold-500/10 flex items-center gap-1 shrink-0"
                    >
                      <Send size={12} /> Send Sync
                    </button>

                    {/* Preset Attachment Dropdown Panel */}
                    <AnimatePresence>
                      {showAttachmentDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-16 left-2 z-50 bg-forest-900 border border-white/10 rounded-2xl shadow-xl p-3 w-64 space-y-2 text-left"
                        >
                          <div className="flex justify-between items-center pb-1 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase text-gold-400 tracking-wider">Select Rwanda files to attach</span>
                            <button 
                              type="button" 
                              onClick={() => setShowAttachmentDropdown(false)}
                              className="text-white/40 hover:text-white"
                            >
                              <X size={11} />
                            </button>
                          </div>
                          <div className="space-y-1">
                            {[
                              { label: '🎫 Gorilla Trekking Permit', file: 'Rwanda_Gorilla_Trekking_Permit.pdf' },
                              { label: '🗺️ Kigali Interactive Map', file: 'Kigali_Tourist_Interactive_Map.png' },
                              { label: '🏨 Serena Resort Voucher', file: 'Kigali_Serena_Hotel_Voucher.pdf' },
                              { label: '🧾 Momo Payment Slip', file: 'MOMO_Pay_Receipt_9882.png' },
                              { label: '🦒 Akagera Safari Itinerary', file: 'Akagera_Safari_Itinerary_Detailed.pdf' },
                            ].map((item, idx) => {
                              const isAttached = pendingAttachments.includes(item.file);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    if (isAttached) {
                                      setPendingAttachments(prev => prev.filter(x => x !== item.file));
                                    } else {
                                      setPendingAttachments(prev => [...prev, item.file]);
                                      notify(`Attached preview file: ${item.file}`);
                                    }
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] flex items-center justify-between transition-all ${
                                    isAttached 
                                      ? 'bg-gold-500/25 text-gold-300 font-bold border border-gold-500/30' 
                                      : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
                                  }`}
                                >
                                  <span className="truncate">{item.label}</span>
                                  {isAttached ? <Check size={10} className="text-gold-400" /> : <Plus size={10} />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                <p className="text-xs text-white/30 font-bold uppercase tracking-widest italic">
                  Select an operational contact to sync or compose dispatch
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: Admin Compose Bulk Reply ("reply many") */}
      <AnimatePresence>
        {showBulkComposeModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkComposeModal(false)}
              className="absolute inset-0 bg-forest-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-forest-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden relative shadow-2xl p-7 space-y-5"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-0.5">Bulk Response System</span>
                  <h4 className="text-lg font-display font-black text-white">Compose dispatch to {selectedContactIds.length} partners</h4>
                </div>
                <button 
                  onClick={() => setShowBulkComposeModal(false)} 
                  className="p-1.5 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Selected partners name tag list */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white/5 rounded-xl border border-white/5">
                {selectedContactIds.map(cId => {
                  const target = conversations.find(c => c.id === cId);
                  return (
                    <span key={cId} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold rounded-lg uppercase tracking-wide flex items-center gap-1">
                      {target?.name || cId}
                      <button type="button" onClick={() => toggleContactSelect(cId)} className="hover:text-red-400">
                        <X size={11} />
                      </button>
                    </span>
                  );
                })}
              </div>

              <form onSubmit={handleSendBulkMessage} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Response Content</label>
                  <textarea
                    value={bulkMessageText}
                    onChange={(e) => setBulkMessageText(e.target.value)}
                    placeholder="Type dispatch content. Copies will be delivered independently to each chosen session..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowBulkComposeModal(false)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-forest-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Send size={13} /> Dispatch to ({selectedContactIds.length}) Users
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Secure Verification Token Sandbox (Requested UI) */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-forest-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-forest-900 border border-white/15 rounded-[2.5rem] w-full max-w-sm overflow-hidden relative shadow-2xl p-6.5 text-center space-y-6"
            >
              <div className="flex justify-end">
                <button onClick={() => setShowSecurityModal(false)} className="text-white/30 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/20 shadow-inner">
                  <Lock size={20} />
                </div>
                <h4 className="text-md font-display font-black text-white">Verification UI Gateway</h4>
                <p className="text-[11px] text-white/50 italic leading-relaxed">
                  Authenticate or manage session level synchronization with <span className="font-bold block text-emerald-300">{SYNC_EMAIL}</span>
                </p>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-left space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-white/40 uppercase tracking-widest">Active State:</span>
                  <span className="flex items-center gap-1 font-black uppercase tracking-wider text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-white/40 uppercase tracking-widest">Secure Handshake:</span>
                  <span className="font-mono text-white/70">SSL/TLS AES-256</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGenerateSecurityToken}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-forest-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={13} className="animate-spin-slow" /> Request New Access Token
                </button>

                {generatedToken && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3 animate-in fade-in duration-300 text-left">
                    <div className="text-[9px] font-black uppercase text-white/40 tracking-widest block">
                      Admin sandbox (Simulated e-mail payload received):
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <span className="text-xs text-white/30 italic">From HQ: Secure code is</span>
                      <span className="text-sm font-mono font-black text-emerald-300 tracking-widest">{generatedToken}</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/40 tracking-widest pl-0.5">Enter Token</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={enteredCode}
                          onChange={(e) => setEnteredCode(e.target.value)}
                          placeholder="e.g. 123456"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono text-center focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={verifyToken}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-forest-950 text-xs font-bold rounded-xl transition-all"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Create User Contact Dialog */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddUserModal(false)}
              className="absolute inset-0 bg-forest-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-forest-900 border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl p-7 space-y-5"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">Directory Hub</span>
                  <h4 className="text-lg font-display font-black text-white">Add New User Profile</h4>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(false)} 
                  className="p-1.5 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddUserSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    value={addUserName}
                    onChange={(e) => setAddUserName(e.target.value)}
                    placeholder="e.g. Marie Louise"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1 font-sans">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Email Address</label>
                  <input
                    type="email"
                    value={addUserEmail}
                    onChange={(e) => setAddUserEmail(e.target.value)}
                    placeholder="e.g. louise@gmail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">User Role</label>
                    <select
                      value={addUserRole}
                      onChange={(e) => setAddUserRole(e.target.value as UserRole)}
                      className="w-full bg-forest-950 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                    >
                      <option value={UserRole.TOURIST}>Tourist</option>
                      <option value={UserRole.OPERATOR}>Partner Operator</option>
                      <option value={UserRole.MODERATOR}>Moderator</option>
                      <option value={UserRole.EDITOR}>Editor</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </div>

                  {addUserRole === UserRole.OPERATOR && (
                    <div className="space-y-1 font-sans">
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Business Name</label>
                      <input
                        type="text"
                        value={addUserBusiness}
                        onChange={(e) => setAddUserBusiness(e.target.value)}
                        placeholder="e.g. Akagera Tours"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Email Verification State Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 font-sans">
                  <div>
                    <span className="text-[10px] font-black text-white uppercase block tracking-wider">Authorize Email Syncing</span>
                    <span className="text-[9px] text-white/30 block leading-tight mt-0.5">Will initialize profile as Checked/Verified directly.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddUserVerified(!addUserVerified)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 ${
                      addUserVerified ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        addUserVerified ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/5 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-forest-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Check size={13} /> Add Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Edit User Contact Dialog */}
      <AnimatePresence>
        {showEditUserModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowEditUserModal(false);
                setUserToEdit(null);
              }}
              className="absolute inset-0 bg-forest-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-forest-900 border border-white/15 rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl p-7 space-y-5"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5">Directory Hub</span>
                  <h4 className="text-lg font-display font-black text-white">Edit User Profile</h4>
                </div>
                <button 
                  onClick={() => {
                    setShowEditUserModal(false);
                    setUserToEdit(null);
                  }} 
                  className="p-1.5 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditUserSubmit} className="space-y-4 text-left">
                <div className="space-y-1 font-sans">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1 font-sans">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Email Address</label>
                  <input
                    type="email"
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 font-sans">
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">User Role</label>
                    <select
                      value={editUserRole}
                      onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                      className="w-full bg-forest-950 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                    >
                      <option value={UserRole.TOURIST}>Tourist</option>
                      <option value={UserRole.OPERATOR}>Partner Operator</option>
                      <option value={UserRole.MODERATOR}>Moderator</option>
                      <option value={UserRole.EDITOR}>Editor</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </div>

                  {editUserRole === UserRole.OPERATOR && (
                    <div className="space-y-1 font-sans">
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Business Name</label>
                      <input
                        type="text"
                        value={editUserBusiness}
                        onChange={(e) => setEditUserBusiness(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Email Verification State Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 font-sans">
                  <div>
                    <span className="text-[10px] font-black text-white uppercase block tracking-wider">Authorize Email Syncing</span>
                    <span className="text-[9px] text-white/30 block leading-tight mt-0.5">Toggle profile verification check direct sync.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditUserVerified(!editUserVerified)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 ${
                      editUserVerified ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        editUserVerified ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/5 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditUserModal(false);
                      setUserToEdit(null);
                    }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-forest-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <Check size={13} /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
