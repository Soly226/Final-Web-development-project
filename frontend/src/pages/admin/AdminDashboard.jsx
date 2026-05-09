import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { twMerge } from 'tailwind-merge';

const StatCard = ({ icon, label, value, trend, trendUp }) => (
  <Card className="flex flex-col gap-1 border-b-2" style={{ borderBottomColor: trendUp ? '#10b981' : '#f43f5e' }}>
    <div className="flex justify-between items-start">
      <div className="bg-primary/10 p-2 rounded-xl">
        <span className="material-symbols-outlined text-primary text-xl">
          {icon}
        </span>
      </div>
      <div className={twMerge(
        "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
        trendUp ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
      )}>
        <span className="material-symbols-outlined text-xs">
          {trendUp ? 'trending_up' : 'trending_down'}
        </span>
        {trend}
      </div>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-3 tracking-wide">{label}</p>
    <p className="text-slate-900 dark:text-white text-2xl font-extrabold tracking-tight">{value}</p>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        
        const [analyticsRes, logsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/analytics', config),
          axios.get('http://localhost:5000/api/admin/logs', config)
        ]);

        setAnalytics(analyticsRes.data);
        
        // Map recent logs
        const mappedLogs = logsRes.data.slice(0, 3).map(log => ({
          icon: log.level === 'error' ? 'warning' : log.level === 'warning' ? 'report_problem' : 'info',
          color: log.level === 'error' ? 'bg-rose-500' : log.level === 'warning' ? 'bg-amber-500' : 'bg-blue-500',
          label: log.source,
          sub: log.message,
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setRecentLogs(mappedLogs);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const stats = [
    { icon: 'group', label: 'TOTAL USERS', value: analytics?.totalUsers || '0', trend: '12.5%', trendUp: true },
    { icon: 'school', label: 'INSTRUCTORS', value: analytics?.instructors || '0', trend: '2.4%', trendUp: true },
    { icon: 'person', label: 'STUDENTS', value: analytics?.students || '0', trend: '5.1%', trendUp: true },
    { icon: 'database', label: 'STORAGE', value: analytics?.systemStorage || '0', trend: '0.0%', trendUp: true },
  ];

  return (
    <AdminLayout title="System Overview">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest animate-pulse">Loading Dashboard...</div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Chart Section */}
            <section>
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-10 -mt-10 rounded-full"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <h2 className="text-slate-900 dark:text-white font-bold tracking-tight">Active User Trends</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Real-time engagement monitoring</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-2 relative z-10">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white text-glow">{analytics?.totalUsers}</p>
                  <div className="text-emerald-500 text-[10px] font-bold flex items-center">
                    <span className="material-symbols-outlined text-xs mr-0.5">add</span> verified users
                  </div>
                </div>

                <div className="h-44 w-full mt-4">
                  <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 400 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 100 Q 50 20 100 80 T 200 60 T 300 120 T 400 40" fill="none" stroke="#6366f1" strokeLinecap="round" strokeWidth="4" className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"></path>
                    <path d="M0 100 Q 50 20 100 80 T 200 60 T 300 120 T 400 40 V 150 H 0 Z" fill="url(#premiumGradient)" opacity="0.15"></path>
                    <defs>
                      <linearGradient id="premiumGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1"></stop>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </Card>
            </section>

            {/* Bottom Section: Actions & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <section className="lg:col-span-1">
                <h2 className="text-slate-900 dark:text-white font-bold mb-4 px-1 text-sm tracking-tight">Quick Controls</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => navigate('/admin/users')} className="flex flex-col items-center gap-3 bg-gradient-to-br from-primary to-accent rounded-2xl p-4 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] active:scale-[0.98] group">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                      <span className="material-symbols-outlined text-2xl">person_add</span>
                    </div>
                    <span className="text-[11px] font-bold tracking-wide">Create User</span>
                  </button>
                  <button onClick={() => navigate('/admin/reports')} className="flex flex-col items-center gap-3 glass rounded-2xl p-4 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all hover:scale-[1.03] active:scale-[0.98] group">
                    <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-primary text-2xl">assessment</span>
                    </div>
                    <span className="text-[11px] font-bold tracking-wide">Analytics</span>
                  </button>
                  <button onClick={() => navigate('/admin/templates')} className="flex flex-col items-center gap-3 glass rounded-2xl p-4 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all hover:scale-[1.03] active:scale-[0.98] group col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <span className="material-symbols-outlined text-primary text-2xl">mail</span>
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] font-bold tracking-wide">System Broadcast</p>
                        <p className="text-[9px] text-slate-500">Notify all users</p>
                      </div>
                    </div>
                  </button>
                </div>
              </section>

              {/* Recent Activity */}
              <section className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Recent Activity</h2>
                  <Button variant="ghost" className="text-[10px] py-1 px-3" onClick={() => navigate('/admin/logs')}>View Full Log</Button>
                </div>
                <div className="flex flex-col gap-3">
                  {recentLogs.length > 0 ? recentLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 glass rounded-2xl group cursor-pointer hover:border-primary/30 transition-all">
                      <div className={twMerge(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:rotate-6",
                        log.color
                      )}>
                        <span className="material-symbols-outlined text-2xl">{log.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{log.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{log.sub}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-[10px] text-slate-400 font-bold">{log.time}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center text-slate-500 glass rounded-2xl border-dashed border-2 border-slate-200">No recent activity</div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
