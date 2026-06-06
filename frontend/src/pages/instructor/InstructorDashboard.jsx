import React, { useState, useEffect } from 'react';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../../lib/apiClient';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const [coursesRes, assignmentsRes] = await Promise.all([
          apiClient.get('/api/instructor/courses'),
          apiClient.get('/api/instructor/assignments')
        ]);
        setCourses(coursesRes.data || []);
        setAssignments(assignmentsRes.data || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled_students?.length || 0), 0);
  const pendingAssignments = assignments.filter(a => a.status === 'Open');

  return (
    <InstructorLayout title="Dashboard">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white shadow-xl shadow-amber-500/20">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">{greeting}</p>
              <h2 className="text-2xl font-extrabold tracking-tight">Prof. {user?.name || 'Instructor'}</h2>
              <p className="text-white/80 text-sm mt-1.5">You have <span className="text-white font-bold">{pendingAssignments.length} active assignments</span> waiting to be managed.</p>
            </div>
            <div className="flex-shrink-0 bg-white/15 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-sm text-center">
               <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Total Students</p>
               <p className="text-3xl font-extrabold text-white">{totalStudents}</p>
            </div>
          </div>
          <div className="relative z-10 mt-4 flex gap-3">
             <Link to="/instructor/create" className="bg-white text-orange-600 text-sm font-bold px-4 py-2 rounded-xl shadow-md hover:bg-white/90 transition-colors">
               + Create New Course
             </Link>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-20 font-bold text-slate-450 dark:text-slate-500">
            Loading your dashboard details...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-rose-500 font-bold">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: 'library_books', label: 'Active Courses', value: courses.length.toString(), color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { icon: 'groups', label: 'Total Students', value: totalStudents.toString(), color: 'text-blue-500', bg: 'bg-blue-500/10' },
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
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map((c, idx) => {
                    const colors = [
                      'from-amber-500 to-orange-500',
                      'from-emerald-500 to-cyan-500',
                      'from-blue-500 to-indigo-500',
                      'from-purple-500 to-pink-500'
                    ];
                    const icons = ['code', 'account_tree', 'menu_book', 'science'];
                    const color = colors[idx % colors.length];
                    const icon = icons[idx % icons.length];
                    return (
                      <Link key={c._id} to={`/instructor/course/${c._id}`} className="group block">
                        <Card className="flex flex-col gap-3 p-4 h-full" hover={false}>
                          <div className="flex items-start gap-3">
                            <div className={twMerge('w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform', color)}>
                              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight truncate group-hover:text-amber-500 transition-colors">{c.course_name}</p>
                              <p className="text-slate-500 text-[11px] mt-0.5">{c.course_code} • {c.credit_hours} Credits</p>
                              <p className="text-slate-450 dark:text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-wider">{c.enrolled_students?.length || 0} Students Enrolled</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-450 dark:text-slate-500 italic">No assigned courses found.</div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Active Assignments</h2>
                <Link to="/instructor/assignments" className="text-xs font-bold text-amber-500 hover:text-orange-500 transition-colors">View All →</Link>
              </div>
              {pendingAssignments.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {pendingAssignments.slice(0, 3).map((asg) => (
                    <Link key={asg._id} to="/instructor/assignments" className="block w-full text-left focus:outline-none">
                      <div className="glass flex items-center gap-4 p-4 rounded-2xl border border-white/20 dark:border-white/10 group hover:border-amber-500/30 transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-amber-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_return</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">{asg.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{asg.course_id?.course_name || 'Course'} • Deadline: {new Date(asg.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-slate-400 font-semibold">{asg.submittedCount} / {asg.totalStudentsCount || 0} Submissions</p>
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md mt-1 inline-block">Grade List</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-450 dark:text-slate-500 italic">No active assignments found.</div>
              )}
            </section>
          </>
        )}
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;