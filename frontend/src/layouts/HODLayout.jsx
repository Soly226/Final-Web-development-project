import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';
import { useSettings } from '../context/SettingsContext';

const HODLayout = ({ children, title }) => {
  const { user } = useAuth();
  const { t } = useSettings();
  const location = useLocation();
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

  const sidebarLinks = [
    { label: t('overview'), to: '/department-head?tab=overview', icon: 'dashboard' },
    { label: t('courseAssignments'), to: '/department-head?tab=course', icon: 'app_registration' },
    { label: t('teachingTasks'), to: '/department-head?tab=teaching', icon: 'assignment_turned_in' },
    { label: t('instructorWorkloads'), to: '/department-head?tab=instructor', icon: 'group_work' },
    { label: t('profile'), to: '/department-head?tab=profile', icon: 'person' },
    { label: t('inboxMessages'), to: '/messages', icon: 'chat', count: unreadMessages },
    { label: t('notifications'), to: '/notifications', icon: 'notifications', count: unreadNotifications }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200">
      <Topbar title={title || t('deptHeadPortal')} />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HODLayout;
