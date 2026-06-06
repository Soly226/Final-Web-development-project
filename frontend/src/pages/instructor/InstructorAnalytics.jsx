import React from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

const InstructorAnalytics = () => {
  const { user } = useAuth();
  const sidebarLinks = [
    { label: 'Dashboard', to: '/instructor', icon: 'dashboard' },
    { label: 'Create Course', to: '/instructor/create', icon: 'add_circle' },
    { label: 'Analytics', to: '/instructor/analytics', icon: 'analytics' },
    { label: 'Assignments', to: '/instructor/assignments', icon: 'assignment' },
    { label: 'Roster', to: '/instructor/roster', icon: 'group' }
  ];

  const weeklyActivity = [
    { day: 'Mon', height: '60%' },
    { day: 'Tue', height: '80%' },
    { day: 'Wed', height: '45%' },
    { day: 'Thu', height: '72%' },
    { day: 'Fri', height: '68%' },
    { day: 'Sat', height: '40%' },
    { day: 'Sun', height: '52%' }
  ];

  const completionByCourse = [
    { course: 'Intro to Web Dev', completion: 82 },
    { course: 'Advanced CSS', completion: 65 },
    { course: 'React Basics', completion: 48 }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Topbar title="Instructor Analytics" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total students</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">142</p>
              </Card>
              <Card className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg completion</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">68%</p>
              </Card>
              <Card className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg grade</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">B+</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Weekly activity</h3>
              <div className="h-64 flex items-end justify-between gap-3 md:gap-5">
                {weeklyActivity.map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-end overflow-hidden">
                      <div
                        className="w-full bg-primary rounded-xl"
                        style={{ height: item.height }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Completion by course</h3>
              <div className="space-y-4">
                {completionByCourse.map((item) => (
                  <div key={item.course} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.course}</p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.completion}%</p>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${item.completion}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
