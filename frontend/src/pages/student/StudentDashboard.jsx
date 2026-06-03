import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

const enrolledCourses = [
  { id: 1, title: 'Advanced React 2024', instructor: 'Prof. Michael Chen', progress: 72, color: 'from-primary to-accent', icon: 'code', tag: 'In Progress' },
  { id: 2, title: 'Data Structures & Algorithms', instructor: 'Dr. Layla Hassan', progress: 45, color: 'from-emerald-500 to-cyan-500', icon: 'account_tree', tag: 'In Progress' },
  { id: 3, title: 'Machine Learning Fundamentals', instructor: 'Prof. Ahmed Sayed', progress: 10, color: 'from-orange-500 to-rose-500', icon: 'psychology', tag: 'New' },
];

const upcomingTasks = [
  { id: 1, type: 'assignment', title: 'API Integration Lab', course: 'Advanced React 2024', due: 'Today, 11:59 PM', urgent: true, icon: 'assignment' },
  { id: 2, type: 'quiz', title: 'Midterm Quiz #2', course: 'Data Structures', due: 'Tomorrow, 9:00 AM', urgent: true, icon: 'quiz' },
  { id: 3, type: 'lecture', title: 'State Management — Live Lecture', course: 'Advanced React 2024', due: 'Wed, 2:00 PM', urgent: false, icon: 'live_tv' },
  { id: 4, type: 'assignment', title: 'Linear Regression Report', course: 'Machine Learning', due: 'Fri, 11:59 PM', urgent: false, icon: 'assignment' },
];

const recentGrades = [
  { course: 'Advanced React', assignment: 'Component Design Lab', grade: 92, max: 100, icon: 'code' },
  { course: 'Data Structures', assignment: 'Linked List Implementation', grade: 78, max: 100, icon: 'account_tree' },
  { course: 'Machine Learning', assignment: 'Intro Quiz', grade: 85, max: 100, icon: 'psychology' },
];

const getGradeColor = (pct) => {
  if (pct >= 90) return 'text-emerald-500';
  if (pct >= 75) return 'text-primary';
  if (pct >= 60) return 'text-amber-500';
  return 'text-rose-500';
};

const CourseProgressCard = ({ course }) => (
  <Link to={`/student/course/${course.id}/lectures`} className="group block">
    <Card className="flex flex-col gap-3 p-4 h-full" hover={false}>
      <div className="flex items-start gap-3">
        <div className={twMerge('w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform', course.color)}>
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{course.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight truncate group-hover:text-primary transition-colors">{course.title}</p>
          <p className="text-slate-500 text-[11px] mt-0.5 truncate">{course.instructor}</p>
        </div>
        <span className={twMerge(
          'flex-shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full',
          course.tag === 'New' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-primary/10 text-primary'
        )}>{course.tag}</span>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-slate-500 font-semibold">Progress</span>
          <span className="text-[11px] font-black text-primary">{course.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={twMerge('h-full rounded-full bg-gradient-to-r transition-all duration-700', course.color)}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </Card>
  </Link>
);

const TaskItem = ({ task }) => (
  <Link to={`/student/assignments/${task.id}`} className="group flex items-center gap-3.5 p-3.5 glass rounded-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all cursor-pointer">
    <div className={twMerge(
      'w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center',
      task.urgent ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'
    )}>
      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{task.icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{task.title}</p>
      <p className="text-[11px] text-slate-500 truncate mt-0.5">{task.course}</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className={twMerge('text-[11px] font-bold', task.urgent ? 'text-rose-500' : 'text-slate-500')}>{task.due}</p>
      {task.urgent && <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider">Urgent</span>}
    </div>
  </Link>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const overallGPA = 3.6;

  return (
    <StudentLayout title="Student Hub">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">

        {/* ── Hero Welcome Banner ── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-6 text-white shadow-xl shadow-primary/20">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">{greeting} 👋</p>
              <h2 className="text-2xl font-extrabold tracking-tight">{user?.name || 'Student'}</h2>
              <p className="text-white/70 text-sm mt-1.5">You have <span className="text-white font-bold">3 tasks</span> due this week. Keep it up!</p>
            </div>
            <div className="flex-shrink-0 text-center bg-white/15 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-sm">
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">GPA</p>
              <p className="text-3xl font-extrabold text-white">{overallGPA}</p>
              <p className="text-[10px] text-white/60 font-semibold">/ 4.0</p>
            </div>
          </div>
          {/* Streak */}
          <div className="relative z-10 mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 w-fit border border-white/20">
            <span className="material-symbols-outlined text-amber-300 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <span className="text-white text-sm font-bold">7-Day Streak</span>
            <span className="text-white/60 text-xs">· Keep it going!</span>
          </div>
        </section>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'menu_book', label: 'Enrolled', value: '3', color: 'text-primary', bg: 'bg-primary/10' },
            { icon: 'assignment_turned_in', label: 'Submitted', value: '18', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { icon: 'pending_actions', label: 'Pending', value: '4', color: 'text-amber-500', bg: 'bg-amber-500/10' },
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

        {/* ── My Courses ── */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">My Courses</h2>
            <Link to="/student/courses" className="text-xs font-bold text-primary hover:text-accent transition-colors">See All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((c) => <CourseProgressCard key={c.id} course={c} />)}
          </div>
        </section>

        {/* ── Upcoming Tasks & Recent Grades ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Upcoming Tasks</h2>
              <Link to="/student/calendar" className="text-xs font-bold text-primary hover:text-accent transition-colors">Calendar →</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {upcomingTasks.map((t) => <TaskItem key={t.id} task={t} />)}
            </div>
          </section>

          {/* Recent Grades */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Recent Grades</h2>
              <Link to="/student/grades" className="text-xs font-bold text-primary hover:text-accent transition-colors">All Grades →</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {recentGrades.map((g, i) => (
                <div key={i} className="glass flex items-center gap-4 p-4 rounded-2xl border border-white/20 dark:border-white/10 group hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{g.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{g.assignment}</p>
                    <p className="text-[11px] text-slate-500 truncate">{g.course}</p>
                  </div>
                  <div className="text-right">
                    <p className={twMerge('text-lg font-extrabold', getGradeColor((g.grade / g.max) * 100))}>
                      {g.grade}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">/ {g.max}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
