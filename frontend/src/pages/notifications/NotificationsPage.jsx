import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';
import StudentLayout from '../../layouts/StudentLayout';
import InstructorLayout from '../../layouts/InstructorLayout';
import HODLayout from '../../layouts/HODLayout';

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

const TYPE_CONFIG = {
  grade:        { icon: 'school', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  assignment:   { icon: 'assignment', color: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
  announcement: { icon: 'campaign', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  message:      { icon: 'chat', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
};

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

const FILTERS = [
  { key: 'all', label: 'All', icon: 'notifications' },
  { key: 'unread', label: 'Unread', icon: 'notifications_active' },
  { key: 'grade', label: 'Grades', icon: 'school' },
  { key: 'assignment', label: 'Assignments', icon: 'assignment' },
  { key: 'announcement', label: 'Announcements', icon: 'campaign' },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/api/notifications');
      setNotifications(res.data);
    } catch {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await apiClient.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silently fail
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await apiClient.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silently fail
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // silently fail
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  // Group notifications by day
  const today = new Date();
  const todayStr = today.toDateString();
  const yesterdayStr = new Date(today - 86400000).toDateString();

  const grouped = filtered.reduce((acc, n) => {
    const d = new Date(n.createdAt).toDateString();
    const label = d === todayStr ? 'Today' : d === yesterdayStr ? 'Yesterday' : new Date(n.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});

  const content = (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-2">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50 text-xs"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            {markingAll ? 'Marking…' : 'Mark all as read'}
          </button>
        )}
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────── */}
      <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-5 gap-1 overflow-x-auto scrollbar-none">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            id={`notif-filter-${filter.key}`}
            onClick={() => setActiveFilter(filter.key)}
            className={twMerge(
              'flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200',
              activeFilter === filter.key
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span className={twMerge(
              'material-symbols-outlined text-base',
              activeFilter === filter.key ? 'text-primary' : ''
            )}>
              {filter.icon}
            </span>
            <span>{filter.label}</span>
            {filter.key === 'unread' && unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-rose-500 text-white ml-1">
                {unreadCount}
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
              onClick={fetchNotifications}
              className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent px-5 py-2.5 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {!error && loading && <LoadingSkeleton />}

        {/* List */}
        {!error && !loading && (
          <>
            {filtered.length === 0 ? (
              <EmptyState
                icon={activeFilter === 'unread' ? 'notifications_off' : 'notifications'}
                title="No notifications"
                subtitle={
                  activeFilter === 'unread'
                    ? "You're all caught up! No unread notifications."
                    : `You have no notifications in the ${activeFilter} category.`
                }
              />
            ) : (
              <div className="p-3 space-y-4">
                {Object.entries(grouped).map(([dateLabel, items]) => (
                  <div key={dateLabel} className="space-y-2">
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 py-1 mt-3 first:mt-0">
                      {dateLabel}
                    </div>
                    {items.map((n) => {
                      const cfg = TYPE_CONFIG[n.type] || {
                        icon: 'notifications',
                        color: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
                      };
                      return (
                        <div
                          key={n._id}
                          id={`notification-item-${n._id}`}
                          onClick={() => !n.read && handleMarkRead(n._id)}
                          className={twMerge(
                            'group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer',
                            !n.read
                              ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                              : 'bg-white/3 border-white/5 hover:bg-white/7 hover:border-white/15'
                          )}
                        >
                          {/* Unread indicator */}
                          {!n.read && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
                          )}

                          {/* Icon */}
                          <div className={twMerge('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border', cfg.color)}>
                            <span className="material-symbols-outlined text-lg">{cfg.icon}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <p className={twMerge('text-sm truncate', !n.read ? 'font-black text-white' : 'font-bold text-slate-200')}>
                                {n.title || 'Notification'}
                              </p>
                              <span className="text-[10px] text-slate-500 font-semibold">{formatDate(n.createdAt)}</span>
                            </div>
                            {n.message && (
                              <p className={twMerge('text-xs mt-1 leading-relaxed', !n.read ? 'text-slate-300 font-medium' : 'text-slate-400 font-normal')}>
                                {n.message}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button
                              id={`delete-notif-${n._id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(n._id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                              title="Dismiss"
                            >
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-primary block group-hover:hidden" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (user?.role === 'student') {
    return <StudentLayout title="Notifications">{content}</StudentLayout>;
  }
  if (user?.role === 'instructor') {
    return <InstructorLayout title="Notifications">{content}</InstructorLayout>;
  }
  if (user?.role === 'head_of_department') {
    return <HODLayout title="Notifications">{content}</HODLayout>;
  }
  return <div className="p-4">{content}</div>;
}
