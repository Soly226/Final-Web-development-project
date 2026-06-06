import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import apiClient from '../lib/apiClient';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function MyCoursesGridView() {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await apiClient.get('/api/student/enrolled-courses');
      setCourses(data);
    } catch (err) {
      showToast('Failed to fetch enrolled courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const gradients = [
    'from-indigo-505 to-primary',
    'from-teal-500 to-emerald-600',
    'from-orange-400 to-red-500',
    'from-blue-400 to-cyan-500',
    'from-purple-500 to-pink-500',
  ];

  const icons = ['code', 'psychology', 'palette', 'database', 'terminal'];

  const filteredCourses = courses.filter((course) => {
    const courseName = course.course_name || '';
    const courseCode = course.course_code || '';
    const instructorName = course.assigned_instructors?.map(i => i.full_name).join(' ') || '';
    
    const matchesSearch =
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchTerm.toLowerCase());

    // Mock progress status check for display
    const matchesFilter = true; // Simple filter for dynamic content
    return matchesSearch && matchesFilter;
  });

  return (
    <StudentLayout title="My Courses">
      {/* Page Title and Search/Filter */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Courses
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Access your enrolled courses and view your learning progress.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            <Link
              to="/course-registration"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-accent text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-primary/10 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-sm">add_box</span>
              Register for Courses
            </Link>
            <div className="relative flex-grow md:w-72 w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/45 focus:border-transparent outline-none transition-all text-sm text-slate-900 dark:text-white"
                placeholder="Search your courses"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-6 w-2/3 rounded-full" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">menu_book</span>
          <p className="text-slate-800 dark:text-white font-bold">No enrolled courses found</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">You are not actively enrolled in any courses for this semester.</p>
          <Link
            to="/course-registration"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-accent text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Register for Courses
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            const gradient = gradients[idx % gradients.length];
            const icon = icons[idx % icons.length];
            const instructors = course.assigned_instructors?.map(i => i.full_name).join(', ') || 'Staff';

            return (
              <div
                key={course._id}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                {/* Course Header Image */}
                <div
                  className={`h-36 w-full bg-gradient-to-br ${gradient} flex items-center justify-center relative`}
                >
                  <span className="material-symbols-outlined text-white text-6xl opacity-35">{icon}</span>
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-wider">
                    {course.course_code}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 flex flex-col gap-4 flex-grow justify-between">
                  <div>
                    <h3 className="text-base font-extrabold line-clamp-1 group-hover:text-primary transition-colors text-slate-900 dark:text-white">
                      {course.course_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{instructors}</p>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>Credit Hours: {course.credit_hours} hours</span>
                    </div>
                  </div>

                  <Link to={`/student/course/${course._id}/stream`} className="w-full mt-2 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/10 text-sm">
                    Enter Course
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </StudentLayout>
  );
}
