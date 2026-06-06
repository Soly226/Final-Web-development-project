import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';

export default function InstructorRosterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarLinks = [
    { label: 'Dashboard', to: '/instructor', icon: 'dashboard' },
    { label: 'Create Course', to: '/instructor/create', icon: 'add_circle' },
    { label: 'Analytics', to: '/instructor/analytics', icon: 'analytics' },
    { label: 'Assignments', to: '/instructor/assignments', icon: 'assignment' },
    { label: 'Roster', to: '/instructor/roster', icon: 'group' }
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/instructor/courses');
      setCourses(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load courses for roster view.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200">
      <Topbar title="Course Rosters" />
      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Course Student Rosters</h2>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                Select one of your courses below to view, enroll, message, or manage its enrolled student roster.
              </p>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-450 dark:text-slate-500 font-bold text-sm">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <div>Fetching assigned courses...</div>
              </div>
            ) : courses.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">menu_book</span>
                <p className="font-bold">No Assigned Courses Found</p>
                <p className="text-xs mt-1 text-slate-450">You must be assigned to courses to view student rosters.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card
                    key={course._id}
                    className="p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800/80 group hover:border-primary/20 bg-white dark:bg-slate-900/50"
                    hover={true}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {course.course_code}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2 leading-tight group-hover:text-primary transition-colors truncate">
                            {course.course_name}
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/40 dark:border-slate-700/45 shrink-0">
                          {course.credit_hours} Credits
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {course.description || 'No description provided for this course.'}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        <span>{course.enrolled_students?.length || 0} Students Enrolled</span>
                      </div>
                    </div>

                    <div className="pt-5 flex justify-end">
                      <Button
                        onClick={() => navigate(`/instructor/course/${course._id}/students`)}
                        className="text-xs font-bold px-4 py-2 bg-primary hover:bg-accent text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>Manage Roster</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
