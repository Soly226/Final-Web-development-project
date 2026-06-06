import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import apiClient from '../lib/apiClient';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function StudentDashboard() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, assignmentsRes] = await Promise.all([
        apiClient.get('/api/student/enrolled-courses'),
        apiClient.get('/api/student/assignments'),
      ]);
      setCourses(coursesRes.data || []);
      setAssignments(assignmentsRes.data || []);
    } catch (err) {
      showToast('Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const gradients = [
    'from-indigo-500 to-violet-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
  ];

  // Limit to first 3 items for a clean dashboard summary
  const displayedCourses = courses.slice(0, 3);
  const pendingAssignments = assignments
    .filter((a) => a.submission?.status === 'Not Submitted')
    .slice(0, 3);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <StudentLayout title="Dashboard">
      <header className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back! 👋</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here is a quick overview of your courses and upcoming tasks.</p>
      </header>

      {/* Active Courses Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Active Courses</h3>
          <Link to="/my-courses" className="text-sm font-bold text-primary hover:underline">
            View all
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-5 w-2/3 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
              </div>
            ))}
          </div>
        ) : displayedCourses.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">school</span>
            <p className="text-slate-850 dark:text-white font-bold text-sm">No active courses</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">You are not enrolled in any classes yet.</p>
            <Link to="/course-registration" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Go to Course Registration
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedCourses.map((course, idx) => {
              const gradient = gradients[idx % gradients.length];
              const instructors = course.assigned_instructors?.map(i => i.full_name).join(', ') || 'Staff';

              return (
                <div
                  key={course._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/60 overflow-hidden shadow-sm group hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className={`h-32 bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-white text-5xl opacity-35">menu_book</span>
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {course.course_code}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm line-clamp-1">
                        {course.course_name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{instructors}</p>
                    </div>
                    <Link to={`/student/course/${course._id}/stream`} className="block w-full text-center py-2.5 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-colors text-xs shadow-md shadow-primary/10">
                      Go to Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Assignments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Pending Tasks</h3>
          <Link to="/assignments" className="text-sm font-bold text-primary hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3 rounded-full" />
                  <Skeleton className="h-3 w-1/4 rounded-full" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : pendingAssignments.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">done_all</span>
            <p className="text-slate-850 dark:text-white font-bold text-sm">No pending assignments</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">All caught up! Excellent work.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingAssignments.map((assignment) => (
              <Link
                key={assignment._id}
                to={`/assignment/${assignment._id}`}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer group"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm">
                    {assignment.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{assignment.course?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Due: {formatDate(assignment.deadline)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Due Soon
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </StudentLayout>
  );
}
