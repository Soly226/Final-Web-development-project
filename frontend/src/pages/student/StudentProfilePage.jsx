import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { twMerge } from 'tailwind-merge';

const badges = [
  { icon: 'local_fire_department', label: '7-Day Streak', color: 'from-orange-400 to-red-500', earned: true },
  { icon: 'grade', label: 'Honor Roll', color: 'from-amber-400 to-yellow-500', earned: true },
  { icon: 'rocket_launch', label: 'Fast Learner', color: 'from-primary to-accent', earned: true },
  { icon: 'groups', label: 'Collaborator', color: 'from-emerald-500 to-cyan-500', earned: false },
  { icon: 'workspace_premium', label: 'Top Performer', color: 'from-violet-500 to-purple-600', earned: false },
  { icon: 'verified', label: 'Certified Pro', color: 'from-rose-500 to-pink-500', earned: false },
];

const enrolledCourses = [
  { id: 1, title: 'Advanced React 2024', instructor: 'Prof. Michael Chen', progress: 72, color: 'from-primary to-accent', icon: 'code', grade: 'B+' },
  { id: 2, title: 'Data Structures & Algorithms', instructor: 'Dr. Layla Hassan', progress: 45, color: 'from-emerald-500 to-cyan-500', icon: 'account_tree', grade: 'C+' },
  { id: 3, title: 'Machine Learning Fundamentals', instructor: 'Prof. Ahmed Sayed', progress: 10, color: 'from-orange-500 to-rose-500', icon: 'psychology', grade: 'B' },
];

const activityLog = [
  { icon: 'grade', color: 'bg-emerald-500', text: 'Assignment "Component Design Lab" graded — 92/100', time: '2h ago' },
  { icon: 'menu_book', color: 'bg-primary', text: 'Completed Lesson: "Hooks Deep Dive" in Advanced React', time: '5h ago' },
  { icon: 'assignment_turned_in', color: 'bg-cyan-500', text: 'Submitted "Router Integration"', time: 'Yesterday' },
  { icon: 'local_fire_department', color: 'bg-orange-500', text: 'Earned 7-Day Streak Badge', time: '2 days ago' },
];

const StudentProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Mock Student');
  const [bio, setBio] = useState('Computer Science student passionate about building great software and learning cutting-edge technologies.');
  const [major, setMajor] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const gpa = 3.6;

  return (
    <StudentLayout title="My Profile">
      <div className="p-5 flex flex-col gap-5 max-w-3xl mx-auto">

        {/* Profile Hero Card */}
        <Card className="p-0 overflow-hidden" hover={false}>
          {/* Banner */}
          <div className="relative h-28 bg-gradient-to-br from-primary via-accent to-cyan-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all border border-white/30"
            >
              <span className="material-symbols-outlined text-base">{isEditing ? 'close' : 'edit'}</span>
            </button>
          </div>

          <div className="px-5 pb-5">
            {/* Avatar */}
            <div className="relative z-10 -mt-10 mb-3 flex items-end justify-between">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent border-4 border-white dark:border-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                {name?.charAt(0) || 'S'}
              </div>
              {isEditing && (
                <Button onClick={() => setIsEditing(false)} className="py-2 px-4 text-xs">
                  <span className="material-symbols-outlined text-base mr-1">save</span>
                  Save Changes
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1">Display Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-slate-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1">Major</label>
                    <input value={major} onChange={e => setMajor(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1">Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white">
                      {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{name}</h2>
                <p className="text-primary text-sm font-semibold">{major} · {year}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">{bio}</p>
              </>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'GPA', value: gpa.toFixed(1), sub: '/ 4.0', color: 'text-primary' },
                { label: 'Courses', value: '5', sub: 'enrolled', color: 'text-emerald-500' },
                { label: 'Streak', value: '7', sub: 'days', color: 'text-orange-500' },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl py-3 text-center">
                  <p className={twMerge('text-xl font-extrabold', s.color)}>{s.value}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                  <p className="text-[10px] text-slate-400">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Badges */}
        <section>
          <h3 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight mb-3 px-1">Achievements</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {badges.map((b) => (
              <div key={b.label} className={twMerge('flex flex-col items-center gap-2 p-3 glass rounded-2xl border transition-all', b.earned ? 'border-white/20 dark:border-white/10' : 'opacity-40 border-dashed border-slate-300 dark:border-slate-700')}>
                <div className={twMerge('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', b.earned ? b.color : 'from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700')}>
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">{b.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enrolled Courses */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Enrolled Courses</h3>
            <Link to="/student/courses" className="text-xs font-bold text-primary hover:text-accent transition-colors">View All →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {enrolledCourses.map((c) => (
              <Link key={c.id} to={`/student/course/${c.id}/grades`} className="group glass flex items-center gap-3 p-3.5 rounded-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all">
                <div className={twMerge('w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', c.color)}>
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-32">
                      <div className={twMerge('h-full rounded-full bg-gradient-to-r', c.color)} style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{c.progress}%</span>
                  </div>
                </div>
                <span className="text-sm font-black text-primary bg-primary/10 rounded-lg px-2 py-1 flex-shrink-0">{c.grade}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h3 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight mb-3 px-1">Recent Activity</h3>
          <div className="flex flex-col gap-2.5">
            {activityLog.map((a, i) => (
              <div key={i} className="glass flex items-center gap-3 p-3.5 rounded-2xl border border-white/20 dark:border-white/10">
                <div className={twMerge('w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-white shadow-sm', a.color)}>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                </div>
                <p className="flex-1 text-sm text-slate-700 dark:text-slate-300 leading-snug">{a.text}</p>
                <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Account Actions */}
        <section className="flex flex-col gap-2">
          {[
            { icon: 'lock', label: 'Change Password', color: 'text-slate-600 dark:text-slate-400' },
            { icon: 'notifications', label: 'Notification Preferences', color: 'text-slate-600 dark:text-slate-400' },
            { icon: 'help', label: 'Help & Support', color: 'text-slate-600 dark:text-slate-400' },
          ].map((item) => (
            <button key={item.label} className="group glass flex items-center gap-3 p-4 rounded-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all text-left w-full">
              <span className={twMerge('material-symbols-outlined text-xl', item.color)}>{item.icon}</span>
              <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{item.label}</span>
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">chevron_right</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all text-left w-full"
          >
            <span className="material-symbols-outlined text-xl text-rose-500">logout</span>
            <span className="flex-1 text-sm font-semibold text-rose-500">Sign Out</span>
          </button>
        </section>

      </div>
    </StudentLayout>
  );
};

export default StudentProfilePage;
