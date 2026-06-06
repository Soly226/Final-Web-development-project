import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';
import { useSettings } from '../context/SettingsContext';

export default function StudentLayout({ children, title }) {
  const { logout, user } = useAuth();
  const { t } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

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
      // fail silently
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
      // Poll every 30 seconds for new messages/notifications
      const interval = setInterval(fetchUnreadCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Sidebar navigation items
  const sidebarItems = [
    { icon: 'dashboard', label: t('dashboard'), path: '/dashboard', active: location.pathname === '/dashboard' || location.pathname === '/student' },
    { icon: 'menu_book', label: t('myCourses'), path: '/my-courses', active: location.pathname.startsWith('/my-courses') || location.pathname.includes('/student/course/') },
    { icon: 'assignment', label: t('assignments'), path: '/assignments', active: location.pathname === '/assignments' || location.pathname.startsWith('/assignment/') },
    { icon: 'school', label: t('grades'), path: '/grades', active: location.pathname === '/grades' },
    { icon: 'calendar_today', label: t('calendar'), path: '/calendar', active: location.pathname === '/calendar' },
    { icon: 'chat_bubble', label: t('messages'), path: '/messages', active: location.pathname === '/messages', count: unreadMessages },
    { icon: 'notifications', label: t('notifications'), path: '/notifications', active: location.pathname === '/notifications', count: unreadNotifications },
    { icon: 'person', label: t('profile'), path: '/student/profile', active: location.pathname === '/student/profile' },
  ];

  // Mobile Bottom Navigation items (5 core tabs)
  const mobileNavItems = [
    { icon: 'home', label: t('home'), path: '/dashboard', active: location.pathname === '/dashboard' || location.pathname === '/student' },
    { icon: 'menu_book', label: t('courses'), path: '/my-courses', active: location.pathname.startsWith('/my-courses') || location.pathname.includes('/student/course/') },
    { icon: 'assignment', label: t('assignments'), path: '/assignments', active: location.pathname === '/assignments' || location.pathname.startsWith('/assignment/') },
    { icon: 'chat_bubble', label: t('messages'), path: '/messages', active: location.pathname === '/messages', count: unreadMessages },
    { icon: 'person', label: t('profile'), path: '/student/profile', active: location.pathname === '/student/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display transition-colors duration-300">
      {/* Decorative Blur Blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/5 dark:bg-accent/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:scale-105">school</span>
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                EduCore <span className="text-primary font-black">LMS</span>
              </h1>
            </Link>
            {title && (
              <>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hidden sm:block">
                  {title}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Button (header shortcut for desktop/mobile) */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* Messages Button */}
            <Link
              to="/messages"
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined">mail</span>
              {unreadMessages > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadMessages}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Profile Avatar Widget */}
            <div className="flex items-center gap-3">
              <Link to="/student/profile" className="flex items-center gap-2 group cursor-pointer">
                <img
                  alt="Profile"
                  className="h-9 w-9 rounded-xl border-2 border-primary/20 group-hover:border-primary object-cover transition-colors"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsinCZXifC8bD5DkcJVByMvNkDZ13jct1z8mtxckZ2rmhsxqpt8Ha3urOhFt4PK1EDqK-io2eB7ym3wO3zLoCYOJBEeykfIZ2vCw9VJsj6Poozl3SqwIWnk6pPAHv-8cFrEOcMe2tbEj24S7Rh0hQ98O5z2hozz0bUydQPm93gvbEfmb1UNJWCji45mVYDKsqjZJhQtR6H6nAMi3Ywu36vh4BnZsAd48A5ifFj1sXy8kBCemlpNpBQwsqphvGgtuDuYEUtVM_gGHY"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden md:block group-hover:text-primary transition-colors">
                  {user?.name || 'Student'}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all flex items-center justify-center"
                title="Logout"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Structural Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        
        {/* Permanent Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-1">
          <nav className="flex flex-col gap-1.5 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">{t('navigation')}</p>
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={twMerge(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group',
                  item.active
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <span className={twMerge(
                  'material-symbols-outlined text-[20px] transition-transform duration-200',
                  !item.active && 'text-slate-400 group-hover:text-primary group-hover:scale-105',
                  item.active && 'font-variation-fill'
                )}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={twMerge(
                    'ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full',
                    item.active ? 'bg-white text-primary' : 'bg-primary text-white'
                  )}>
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile / Tablet Devices */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 lg:hidden">
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/40 dark:border-slate-800/40 rounded-2xl px-6 py-2.5 shadow-2xl">
          <div className="flex items-center justify-between">
            {mobileNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={twMerge(
                  'flex flex-col items-center gap-1 transition-all duration-300 relative',
                  item.active ? 'text-primary scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-primary'
                )}
              >
                <div className={twMerge(
                  'p-1.5 rounded-xl transition-colors relative flex items-center justify-center',
                  item.active && 'bg-primary/10 text-primary'
                )}>
                  <span className={twMerge(
                    'material-symbols-outlined text-[22px]',
                    item.active && 'font-variation-fill'
                  )}>
                    {item.icon}
                  </span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold tracking-wider">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
