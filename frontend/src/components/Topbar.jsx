import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';

const Topbar = ({ title = 'EduCore LMS' }) => {
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const fetchUnreadCounts = async () => {
    try {
      const [notifRes, msgRes] = await Promise.all([
        apiClient.get('/api/notifications'),
        apiClient.get('/api/messages')
      ]);
      const unreadNotifs = (notifRes.data || []).filter(n => !n.read).length;
      const unreadMsgs = (msgRes.data || []).filter(m => !m.read).length;
      setUnreadNotifications(unreadNotifs);
      setUnreadMessages(unreadMsgs);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
      const interval = setInterval(fetchUnreadCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <header className="h-[72px] px-4 md:px-6 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">school</span>
        <h1 className="text-sm md:text-base font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Notifications Link */}
        <Link
          to="/notifications"
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadNotifications}
            </span>
          )}
        </Link>

        {/* Messages Link */}
        <Link
          to="/messages"
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">mail</span>
          {unreadMessages > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadMessages}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
