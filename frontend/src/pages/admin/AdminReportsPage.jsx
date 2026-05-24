import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { twMerge } from 'tailwind-merge';

const StatBox = ({ label, value, icon, borderLeftColor }) => (
  <Card className="p-4 border-l-4 transition-all hover:-translate-y-0.5 border-white/5" style={{ borderLeftColor }}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      </div>
      <span className="material-symbols-outlined text-xl" style={{ color: borderLeftColor }}>{icon}</span>
    </div>
  </Card>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto glass rounded-2xl border border-rose-500/20 bg-rose-500/5 mt-8 animate-slide-up">
    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-3xl">error_outline</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connection Error</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} className="gap-2 px-6 shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-sm">refresh</span>
        Retry Connection
      </Button>
    )}
  </div>
);

const ReportsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="space-y-6">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  </div>
);

const AdminReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get('http://localhost:5000/api/admin/reports', config);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load advanced reports. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchReports();
  }, [user, fetchReports]);

  if (loading) {
    return (
      <AdminLayout title="Strategic Reports">
        <div className="p-5 max-w-6xl mx-auto">
          <ReportsSkeleton />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Strategic Reports">
        <div className="p-5 max-w-6xl mx-auto">
          <ErrorState message={error} onRetry={fetchReports} />
        </div>
      </AdminLayout>
    );
  }

  const { totalEnrollments, completionRate, averageGrade, instructorCount, trends, popularCourses } = reportData;
  const maxTrendCount = trends.reduce((max, t) => t.count > max ? t.count : max, 0) || 1;

  return (
    <AdminLayout title="Strategic Reports">
      <div className="p-5 max-w-6xl mx-auto space-y-6">
        
        {/* Date Selector Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-1">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">System Performance</h2>
            <p className="text-sm text-slate-500 font-medium">
              Live statistics from the database. Last generated: <span className="text-slate-900 dark:text-white font-bold">{new Date().toLocaleDateString()}</span>
            </p>
          </div>
          <Button variant="secondary" className="gap-2 px-6" onClick={fetchReports}>
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh Data
          </Button>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Total Enrollments" value={totalEnrollments.toLocaleString()} icon="groups" borderLeftColor="#6366f1" />
          <StatBox label="Completion Rate" value={`${completionRate}%`} icon="task_alt" borderLeftColor="#10b981" />
          <StatBox label="Average Grade" value={averageGrade} icon="grade" borderLeftColor="#f59e0b" />
          <StatBox label="Instructors" value={instructorCount.toLocaleString()} icon="person" borderLeftColor="#3b82f6" />
        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Growth Chart */}
          <Card className="lg:col-span-2 p-6 overflow-visible border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Enrollment Trends</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Active enrollments grouped by semester</p>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/40"></span>
                <span className="w-3 h-3 rounded-full bg-primary"></span>
              </div>
            </div>
            
            {trends.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-400 italic text-sm">
                No semester enrollment trends found.
              </div>
            ) : (
              <div className="h-64 flex items-end justify-between gap-4 px-4 pb-2">
                {trends.map((t, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div 
                      className={twMerge(
                        "w-full rounded-t-xl transition-all duration-500 group-hover:brightness-125",
                        i === trends.length - 1 ? "bg-gradient-to-t from-primary to-accent shadow-lg shadow-primary/30" : "bg-primary/20"
                      )} 
                      style={{ height: `${(t.count / maxTrendCount) * 80 + 20}%` }}
                    ></div>
                    <span className={twMerge("text-[9px] font-black uppercase tracking-widest text-center truncate w-full", i === trends.length - 1 ? "text-primary" : "text-slate-400")}>
                      {t.semester}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 -mt-2">
                      {t.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Side Panels */}
          <div className="space-y-6">
            <Card className="p-6 border-white/5">
              <h3 className="font-bold text-sm tracking-tight mb-4 text-slate-900 dark:text-white">Popular Modules</h3>
              {popularCourses.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic text-xs">
                  No course enrollment data.
                </div>
              ) : (
                <div className="space-y-4">
                  {popularCourses.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-primary">
                          <span className="material-symbols-outlined text-md">terminal</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{item.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">{item.code}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500">
                        {item.count} students
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Button className="w-full py-5 text-md shadow-primary/30 gap-3" onClick={() => window.print()}>
              <span className="material-symbols-outlined">download</span>
              Generate PDF Report
            </Button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
