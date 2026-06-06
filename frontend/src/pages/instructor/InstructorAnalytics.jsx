import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';

const InstructorAnalytics = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalStudents: 0,
    avgCompletion: 100,
    avgGrade: 'N/A',
    weeklyActivity: [],
    completionByCourse: []
  });

  const sidebarLinks = [
    { label: 'Dashboard', to: '/instructor', icon: 'dashboard' },
    { label: 'Create Course', to: '/instructor/create', icon: 'add_circle' },
    { label: 'Analytics', to: '/instructor/analytics', icon: 'analytics' },
    { label: 'Assignments', to: '/instructor/assignments', icon: 'assignment' },
    { label: 'Roster', to: '/instructor/roster', icon: 'group' }
  ];

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/instructor/analytics');
      setData(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load analytics details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200">
      <Topbar title="Instructor Analytics" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {loading ? (
              <div className="py-20 text-center text-slate-450 dark:text-slate-500 font-bold text-sm">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <div>Compiling analytics data...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50" hover={false}>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Total enrolled students</p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{data.totalStudents}</p>
                  </Card>
                  <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50" hover={false}>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Avg submission completion</p>
                    <p className="text-3xl font-extrabold text-indigo-650 dark:text-indigo-400 mt-2">{data.avgCompletion}%</p>
                  </Card>
                  <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50" hover={false}>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Class Average Grade</p>
                    <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{data.avgGrade}</p>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weekly submissions activity chart */}
                  <Card className="p-6 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50" hover={false}>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">Submissions Activity (Last 7 Days)</h3>
                    <div className="h-64 flex items-end justify-between gap-3 md:gap-5">
                      {data.weeklyActivity.map((item) => (
                        <div key={item.day} className="flex-1 flex flex-col items-center gap-3">
                          <div className="w-full h-48 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-end overflow-hidden">
                            <div
                              className="w-full bg-indigo-650 dark:bg-indigo-500 rounded-xl transition-all duration-500"
                              style={{ height: item.height }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Completion by course list */}
                  <Card className="p-6 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50" hover={false}>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">Completion rates by course</h3>
                    <div className="space-y-4">
                      {data.completionByCourse.map((item) => (
                        <div key={item.course} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.course}</p>
                            <p className="text-xs font-black text-indigo-650 dark:text-indigo-400">{item.completion}%</p>
                          </div>
                          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/20">
                            <div
                              className="h-full rounded-full bg-indigo-650 dark:bg-indigo-500 transition-all duration-500"
                              style={{ width: `${item.completion}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
