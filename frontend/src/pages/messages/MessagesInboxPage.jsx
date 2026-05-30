import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../lib/apiClient';
import { twMerge } from 'tailwind-merge';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const AVATAR_COLORS = ['#5048e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const avatarColor = (id = '') =>
  AVATAR_COLORS[(id.charCodeAt(0) + (id.charCodeAt(1) || 0)) % AVATAR_COLORS.length];

// ─── Sub-components ─────────────────────────────────────────────────────────

const Avatar = ({ name, id, size = 10 }) => (
  <div
    className={`w-${size} h-${size} rounded-xl flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0`}
    style={{ background: avatarColor(id) }}
  >
    {getInitials(name)}
  </div>
);

const RoleBadge = ({ role }) => {
  const isInstructor = role === 'Instructor';
  return (
    <span
      className={twMerge(
        'text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md',
        isInstructor
          ? 'bg-violet-500/15 text-violet-400'
          : 'bg-sky-500/15 text-sky-400'
      )}
    >
      {role}
    </span>
  );
};

const AdminBadge = () => (
  <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400">
    Admin
  </span>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-3xl text-slate-500">{icon}</span>
    </div>
    <p className="text-slate-300 font-bold text-base mb-1">{title}</p>
    <p className="text-slate-500 text-sm leading-relaxed">{subtitle}</p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-3 animate-pulse p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-3 p-4 rounded-2xl bg-white/5">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-white/10 rounded-full w-2/5" />
          <div className="h-2.5 bg-white/10 rounded-full w-3/4" />
          <div className="h-2 bg-white/10 rounded-full w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Compose Modal ───────────────────────────────────────────────────────────

const ComposeModal = ({ onClose, onSent }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  const handleSearch = useCallback((value) => {
    setQuery(value);
    setSelectedRecipient(null);
    setDropdownOpen(value.trim().length >= 2);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await apiClient.get(`/api/messages/search-recipients?q=${encodeURIComponent(value.trim())}`);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const selectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setQuery(recipient.full_name);
    setResults([]);
    setDropdownOpen(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRecipient) {
      setError('Please select a recipient from the search results.');
      return;
    }
    if (!content.trim()) {
      setError('Message content cannot be empty.');
      return;
    }

    setSending(true);
    try {
      await apiClient.post('/api/messages', {
        receiverId: selectedRecipient._id,
        receiverModel: selectedRecipient.role,
        subject: subject.trim(),
        content: content.trim(),
      });
      onSent();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">edit_square</span>
            </div>
            <h2 className="font-black text-white text-base tracking-tight">New Message</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-4">
          {/* Recipient Search */}
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              To
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <span className="material-symbols-outlined text-lg">search</span>
              </div>
              <input
                ref={searchRef}
                type="text"
                autoFocus
                placeholder="Search by name (student or instructor)…"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
              {searching && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined animate-spin text-slate-400 text-lg">progress_activity</span>
                </div>
              )}
              {selectedRecipient && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <RoleBadge role={selectedRecipient.role} />
                </div>
              )}
            </div>

            {/* Search Dropdown */}
            {dropdownOpen && results.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
                {results.map((r) => (
                  <button
                    key={r._id}
                    type="button"
                    onClick={() => selectRecipient(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                  >
                    <Avatar name={r.full_name} id={r._id} size={8} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{r.full_name}</p>
                      <p className="text-xs text-slate-400 truncate">{r.email}</p>
                    </div>
                    <RoleBadge role={r.role} />
                  </button>
                ))}
              </div>
            )}

            {dropdownOpen && !searching && results.length === 0 && query.trim().length >= 2 && (
              <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/10 rounded-2xl px-4 py-5 text-center shadow-2xl">
                <span className="material-symbols-outlined text-2xl text-slate-500 block mb-1">person_search</span>
                <p className="text-xs text-slate-400 font-semibold">No students or instructors found for "{query}"</p>
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Subject <span className="normal-case font-normal opacity-60">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Question about Assignment 3"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="Write your message here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none resize-none transition-colors"
            />
            <div className="flex justify-end">
              <span className={twMerge('text-[10px] font-semibold', content.length > 1000 ? 'text-rose-400' : 'text-slate-500')}>
                {content.length} / 1000
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <span className="material-symbols-outlined text-rose-400 text-sm">error</span>
              <p className="text-xs text-rose-400 font-semibold">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 font-bold text-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !selectedRecipient || !content.trim()}
              className="flex items-center gap-2 bg-primary hover:bg-accent disabled:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Sending…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">send</span>
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Message Card ────────────────────────────────────────────────────────────

const MessageCard = ({ msg, type, onMarkRead, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const isSent = type === 'sent';

  const person = isSent ? msg.receiver : msg.sender;
  const personName = person?.full_name || person?.name || 'Unknown';
  const personId = person?._id || '';

  return (
    <div
      className={twMerge(
        'group relative rounded-2xl border transition-all duration-200 cursor-pointer',
        !msg.read && !isSent
          ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
          : 'bg-white/3 border-white/5 hover:bg-white/7 hover:border-white/15'
      )}
      onClick={() => {
        setExpanded(!expanded);
        if (!msg.read && !isSent && onMarkRead) onMarkRead(msg._id);
      }}
    >
      {/* Unread indicator */}
      {!msg.read && !isSent && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
      )}

      <div className="flex items-start gap-3 p-4">
        <Avatar name={personName} id={personId} size={10} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className={twMerge('text-sm truncate', !msg.read && !isSent ? 'font-black text-white' : 'font-bold text-slate-200')}>
              {personName}
            </p>
            <span className="text-[11px] text-slate-500 font-medium flex-shrink-0">{formatDate(msg.createdAt)}</span>
          </div>

          {msg.subject && (
            <p className={twMerge('text-xs mt-0.5 truncate', !msg.read && !isSent ? 'text-slate-300 font-semibold' : 'text-slate-400 font-medium')}>
              {msg.subject}
            </p>
          )}

          <p className={twMerge(
            'text-xs mt-1 leading-relaxed',
            expanded ? 'whitespace-pre-wrap text-slate-300' : 'truncate text-slate-500'
          )}>
            {msg.content}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-1">
          <span className={twMerge(
            'material-symbols-outlined text-base text-slate-600 transition-transform duration-200',
            expanded ? 'rotate-180' : ''
          )}>
            expand_more
          </span>
          {!msg.read && !isSent && (
            <span className="w-2 h-2 rounded-full bg-primary block" />
          )}
        </div>
      </div>

      {/* Expanded actions */}
      {expanded && (
        <div
          className="flex items-center gap-2 px-4 pb-4 pt-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onDelete && onDelete(msg._id)}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Announcement Card ───────────────────────────────────────────────────────

const AnnouncementCard = ({ ann }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="group rounded-2xl border bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-amber-400 text-xl">campaign</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-white truncate">{ann.title}</p>
              <AdminBadge />
            </div>
            <span className="text-[11px] text-slate-500 font-medium flex-shrink-0">{formatDate(ann.createdAt)}</span>
          </div>

          <p className={twMerge(
            'text-xs mt-1 leading-relaxed text-slate-400',
            expanded ? 'whitespace-pre-wrap' : 'truncate'
          )}>
            {ann.content}
          </p>
        </div>

        <span className={twMerge(
          'material-symbols-outlined text-base text-slate-600 flex-shrink-0 transition-transform duration-200',
          expanded ? 'rotate-180' : ''
        )}>
          expand_more
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-3 pt-0">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-500/70 font-semibold">
            <span className="material-symbols-outlined text-xs">lock</span>
            This is a read-only system announcement. Replies are not supported.
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function MessagesInboxPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('inbox');
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Fetch all data ──────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [inboxRes, sentRes, annRes] = await Promise.all([
        apiClient.get('/api/messages'),
        apiClient.get('/api/messages/sent'),
        apiClient.get('/api/announcements'),
      ]);
      setInbox(inboxRes.data || []);
      setSent(sentRes.data || []);
      setAnnouncements(annRes.data || []);
    } catch (err) {
      setError('Failed to load messages. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleMarkRead = useCallback(async (id) => {
    try {
      await apiClient.put(`/api/messages/${id}/read`);
      setInbox((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
    } catch { /* silent */ }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await apiClient.delete(`/api/messages/${id}`);
      setInbox((prev) => prev.filter((m) => m._id !== id));
      setSent((prev) => prev.filter((m) => m._id !== id));
    } catch { /* silent */ }
  }, []);

  // ── Filtered lists ───────────────────────────────────────────────────────
  const filteredInbox = inbox.filter((m) => {
    const name = m.sender?.full_name || m.sender?.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredSent = sent.filter((m) => {
    const name = m.receiver?.full_name || m.receiver?.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredAnnouncements = announcements.filter((a) =>
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = inbox.filter((m) => !m.read).length;

  // ── Tab config ───────────────────────────────────────────────────────────
  const tabs = [
    {
      id: 'inbox',
      label: 'Inbox',
      icon: 'inbox',
      count: unreadCount || null,
      countColor: 'bg-primary text-white',
    },
    {
      id: 'sent',
      label: 'Sent',
      icon: 'send',
      count: sent.length || null,
      countColor: 'bg-white/10 text-slate-400',
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: 'campaign',
      count: announcements.length || null,
      countColor: 'bg-amber-500/20 text-amber-400',
    },
  ];

  const currentList =
    activeTab === 'inbox' ? filteredInbox :
    activeTab === 'sent' ? filteredSent :
    filteredAnnouncements;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-background-dark text-white font-display overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full" />
      </div>

      {/* Compose modal */}
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSent={() => {
            fetchAll();
            setActiveTab('sent');
          }}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 pb-24 pt-6">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Messages</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
                : 'All caught up'}
            </p>
          </div>
          <button
            id="compose-message-btn"
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 bg-primary hover:bg-accent text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-primary/30 transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-sm">edit_square</span>
            Compose
          </button>
        </div>

        {/* ── Search ───────────────────────────────────────────────────── */}
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <span className="material-symbols-outlined text-lg">search</span>
          </div>
          <input
            type="text"
            placeholder="Search messages…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-primary/40 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────────────── */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={twMerge(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <span className={twMerge(
                'material-symbols-outlined text-base',
                activeTab === tab.id && tab.id === 'announcements' ? 'font-variation-fill text-amber-400' : ''
              )}>
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count && (
                <span className={twMerge('text-[10px] px-1.5 py-0.5 rounded-full font-black', tab.countColor)}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-3xl overflow-hidden">
          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl">error_outline</span>
              </div>
              <p className="text-sm font-bold text-slate-300 mb-1">Failed to load</p>
              <p className="text-xs text-slate-500 mb-5">{error}</p>
              <button
                onClick={fetchAll}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent px-5 py-2.5 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {!error && loading && <LoadingSkeleton />}

          {/* Messages list */}
          {!error && !loading && (
            <>
              {currentList.length === 0 ? (
                activeTab === 'inbox' ? (
                  <EmptyState
                    icon="inbox"
                    title="No messages yet"
                    subtitle={searchQuery ? `No results for "${searchQuery}"` : 'When someone sends you a message, it will appear here.'}
                  />
                ) : activeTab === 'sent' ? (
                  <EmptyState
                    icon="send"
                    title="No sent messages"
                    subtitle={searchQuery ? `No results for "${searchQuery}"` : 'Messages you send will appear here.'}
                  />
                ) : (
                  <EmptyState
                    icon="campaign"
                    title="No announcements"
                    subtitle="System announcements from administrators will appear here."
                  />
                )
              ) : (
                <div className="p-3 space-y-2">
                  {activeTab === 'announcements'
                    ? filteredAnnouncements.map((ann) => (
                        <AnnouncementCard key={ann._id} ann={ann} />
                      ))
                    : currentList.map((msg) => (
                        <MessageCard
                          key={msg._id}
                          msg={msg}
                          type={activeTab}
                          onMarkRead={handleMarkRead}
                          onDelete={handleDelete}
                        />
                      ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Stats footer ─────────────────────────────────────────────── */}
        {!loading && !error && (
          <div className="flex items-center justify-center gap-6 mt-5 text-[11px] text-slate-600 font-medium">
            <span>{inbox.length} received</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>{sent.length} sent</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>{announcements.length} announcements</span>
          </div>
        )}
      </div>
    </div>
  );
}
