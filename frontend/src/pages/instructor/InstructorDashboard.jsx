import React from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const activeCourses = [
  { id: 'c1', title: 'Advanced React 2024', students: 124, rating: 4.8, status: 'Active', color: 'from-amber-500 to-orange-500', icon: 'code' },
  { id: 'c2', title: 'Data Structures & Algorithms', students: 89, rating: 4.6, status: 'Active', color: 'from-emerald-500 to-cyan-500', icon: 'account_tree' },
];

const recentSubmissions = [
  { id: 1, student: 'Alice Johnson', course: 'Advanced React 2024', assignment: 'API Integration Lab', time: '10 mins ago' },
  { id: 2, student: 'Bob Smith', course: 'Data Structures', assignment: 'Linked List Implementation', time: '1 hour ago' },
  { id: 3, student: 'Charlie Brown', course: 'Advanced React 2024', assignment: 'Component Design', time: '2 hours ago' },
];

const InstructorDashboard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const sidebarLinks = [
    { label: 'Dashboard', to: '/instructor', icon: 'dashboard' },
    { label: 'Create Course', to: '/instructor/create', icon: 'add_circle' },
    { label: 'Analytics', to: '/instructor/analytics', icon: 'analytics' },
    { label: 'Assignments', to: '/instructor/assignments', icon: 'assignment' },
    { label: 'Roster', to: '/instructor/roster', icon: 'group' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Topbar title="Instructor Dashboard" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white shadow-xl shadow-amber-500/20">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">{greeting}</p>
              <h2 className="text-2xl font-extrabold tracking-tight">Prof. {user?.name || 'Instructor'}</h2>
              <p className="text-white/80 text-sm mt-1.5">You have <span className="text-white font-bold">12 assignments</span> waiting to be graded.</p>
            </div>
            <div className="flex-shrink-0 bg-white/15 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-sm text-center">
               <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Total Students</p>
               <p className="text-3xl font-extrabold text-white">213</p>
            </div>
          </div>
          <div className="relative z-10 mt-4 flex gap-3">
             <Link to="/instructor/create" className="bg-white text-orange-600 text-sm font-bold px-4 py-2 rounded-xl shadow-md hover:bg-white/90 transition-colors">
               + Create New Course
             </Link>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'library_books', label: 'Active Courses', value: '2', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: 'groups', label: 'Total Students', value: '213', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { icon: 'star', label: 'Avg Rating', value: '4.7', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          ].map((stat) => (
            <Card key={stat.label} className="flex flex-col items-center gap-2 py-4 text-center" hover={false}>
              <div className={twMerge('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <span className={twMerge('material-symbols-outlined text-xl', stat.color)} style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </Card>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Your Active Courses</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeCourses.map((c) => (
              <Link key={c.id} to={`/instructor/course/${c.id}`} className="group block">
                <Card className="flex flex-col gap-3 p-4 h-full" hover={false}>
                  <div className="flex items-start gap-3">
                    <div className={twMerge('w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform', c.color)}>
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight truncate group-hover:text-amber-500 transition-colors">{c.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{c.students} Students • {c.rating} ⭐</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

         <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Recent Submissions</h2>
            <Link to="/instructor/assignments" className="text-xs font-bold text-amber-500 hover:text-orange-500 transition-colors">View All →</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentSubmissions.map((sub, i) => (
              <Link key={i} to="/instructor/assignments" className="block w-full text-left focus:outline-none">
                <div className="glass flex items-center gap-4 p-4 rounded-2xl border border-white/20 dark:border-white/10 group hover:border-amber-500/30 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_return</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">{sub.assignment}</p>
                    <p className="text-[11px] text-slate-500 truncate">{sub.student} • {sub.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-semibold">{sub.time}</p>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md mt-1 inline-block">Grade</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  </div>
</div>
  );
};

export default InstructorDashboard;