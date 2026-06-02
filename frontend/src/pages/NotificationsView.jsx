import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const NotificationsView = () => {
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      icon: 'school',
      title: 'New Grade Posted',
      message: 'Instructor Ahmed graded your React Final Project. You scored 94/100.',
      time: '2 mins ago',
      isUnread: true,
      type: 'grade'
    },
    {
      id: 2,
      icon: 'assignment',
      title: 'Assignment Reminder',
      message: 'Submit your \'UI Design Fundamentals\' task by midnight.',
      time: '1 hour ago',
      isUnread: false,
      type: 'assignment'
    },
    {
      id: 3,
      icon: 'campaign',
      title: 'Course Announcement',
      message: 'The live session for Advanced CSS has been rescheduled to Friday at 6 PM.',
      time: '3 hours ago',
      isUnread: true,
      type: 'announcement'
    },
    {
      id: 4,
      icon: 'chat_bubble',
      title: 'New Reply in Forum',
      message: 'Sarah Miller replied to your question in "React Hook Patterns".',
      time: 'Yesterday',
      isUnread: false,
      type: 'forum'
    },
    {
      id: 5,
      icon: 'description',
      title: 'Material Uploaded',
      message: 'New reading material: "The History of Typography" PDF has been added.',
      time: 'Yesterday',
      isUnread: false,
      type: 'material'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return notification.isUnread;
    if (activeTab === 'mentions') return notification.type === 'forum';
    return true;
  });

  const getIconColor = (type) => {
    switch (type) {
      case 'grade':
      case 'announcement':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="relative mx-auto flex h-screen max-w-md flex-col bg-background-light dark:bg-background-dark overflow-hidden">
        {/* Header Section */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between p-4">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold tracking-tight">Notifications</h1>
            <button className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
              Mark all as read
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex px-4 gap-6">
            <button
              className={`border-b-2 pb-3 pt-2 transition-colors ${
                activeTab === 'all' ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <span className={`text-sm font-bold ${activeTab === 'all' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                All
              </span>
            </button>
            <button
              className={`border-b-2 pb-3 pt-2 transition-colors ${
                activeTab === 'unread' ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('unread')}
            >
              <span className={`text-sm font-medium ${activeTab === 'unread' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                Unread
              </span>
            </button>
            <button
              className={`border-b-2 pb-3 pt-2 transition-colors ${
                activeTab === 'mentions' ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('mentions')}
            >
              <span className={`text-sm font-medium ${activeTab === 'mentions' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                Mentions
              </span>
            </button>
          </div>
        </header>

        {/* Notification List */}
        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              {index === 3 && (
                <div className="pt-4 pb-2 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Yesterday
                  </h3>
                </div>
              )}
              <div className={`group relative flex items-start gap-4 rounded-xl p-4 shadow-sm border transition-all ${
                notification.isUnread
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-90'
              }`}>
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${getIconColor(notification.type)}`}>
                  <span className="material-symbols-outlined">{notification.icon}</span>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-bold ${notification.isUnread ? 'text-slate-900 dark:text-slate-100' : 'text-slate-900 dark:text-slate-100'}`}>
                      {notification.title}
                    </p>
                    <span className="text-[11px] font-medium text-slate-400">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                {notification.isUnread && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(80,72,229,0.5)]"></div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </main>

        {/* Bottom Navbar */}
        <nav className="shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pb-6 pt-2">
          <div className="flex items-center justify-between">
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/student">
              <span className="material-symbols-outlined">home</span>
              <span className="text-[10px] font-semibold">Home</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/courses">
              <span className="material-symbols-outlined">book</span>
              <span className="text-[10px] font-semibold">Courses</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/calendar">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="text-[10px] font-semibold">Calendar</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/messages">
              <span className="material-symbols-outlined">chat_bubble</span>
              <span className="text-[10px] font-semibold">Messages</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-primary" to="/notifications">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
              <span className="text-[10px] font-bold">Alerts</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/profile">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px] font-semibold">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NotificationsView;