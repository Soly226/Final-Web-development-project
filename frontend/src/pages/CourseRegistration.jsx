import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import apiClient from '../lib/apiClient';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function CourseRegistration() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('eligible');

  const fetchAvailableCourses = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/api/student/available-courses');
      setCourses(data);
    } catch (err) {
      showToast('Failed to load available courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const handleRegister = async (courseId) => {
    setRegisteringId(courseId);
    try {
      await apiClient.post(`/api/student/register-course/${courseId}`);
      showToast('Successfully registered for the course!', 'success');
      fetchAvailableCourses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const status = course.eligibility.status;
    if (activeFilter === 'eligible') {
      return status === 'eligible';
    } else if (activeFilter === 'ineligible') {
      return status === 'restricted' || status === 'missing_prerequisite';
    } else {
      return status === 'enrolled' || status === 'completed';
    }
  });

  const getStatusBadge = (course) => {
    const { status, reason } = course.eligibility;
    if (status === 'enrolled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-wider">
          <span className="material-symbols-outlined text-xs">check_circle</span>
          Enrolled
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-wider">
          <span className="material-symbols-outlined text-xs">done_all</span>
          Completed
        </span>
      );
    }
    if (status === 'restricted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wider" title={reason}>
          <span className="material-symbols-outlined text-xs">block</span>
          Restricted
        </span>
      );
    }
    if (status === 'missing_prerequisite') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wider" title={reason}>
          <span className="material-symbols-outlined text-xs">lock</span>
          Prereq Required
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wider">
        <span className="material-symbols-outlined text-xs">verified</span>
        Available
      </span>
    );
  };

  return (
    <StudentLayout title="Course Registration">
      <div className="flex flex-col gap-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Register for Upcoming Courses
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Select and register for classes in your curriculum. Department and prerequisite constraints are verified automatically.
            </p>
          </div>
          <button
            onClick={() => navigate('/my-courses')}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition-all text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Courses
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-1 gap-1">
          {[
            { id: 'eligible', label: 'Eligible Courses', icon: 'verified' },
            { id: 'ineligible', label: 'Restricted / Locked', icon: 'lock_person' },
            { id: 'enrolled', label: 'My Enrolled / History', icon: 'history' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeFilter === tab.id
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <Skeleton className="h-6 w-1/3 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">menu_book</span>
            <p className="text-slate-800 dark:text-white font-bold">No courses found</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">There are no courses listed under this filter tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/60 p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider">
                        {course.course_code}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {course.course_name}
                      </h3>
                    </div>
                    {getStatusBadge(course)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description || 'No description available.'}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Department: {course.department || 'All'}</span>
                    <span>{course.credit_hours} Credits</span>
                  </div>
                  
                  {course.prerequisite && (
                    <div className="text-[11px] text-amber-600 dark:text-amber-500 font-bold bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">info</span>
                      Requires: {course.prerequisite.code} — {course.prerequisite.name}
                    </div>
                  )}

                  {course.eligibility.reason && course.eligibility.status !== 'enrolled' && course.eligibility.status !== 'completed' && (
                    <div className="text-[11px] text-rose-600 dark:text-rose-500 font-bold bg-rose-500/5 border border-rose-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {course.eligibility.reason}
                    </div>
                  )}

                  {course.eligibility.status === 'eligible' ? (
                    <button
                      onClick={() => handleRegister(course._id)}
                      disabled={registeringId === course._id}
                      className="w-full mt-1 py-2 bg-primary hover:bg-accent disabled:opacity-60 text-white font-black rounded-xl text-xs transition-all shadow-md shadow-primary/10 active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      {registeringId === course._id ? 'Registering...' : 'Register Course'}
                      <span className="material-symbols-outlined text-xs">add_box</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full mt-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 font-black rounded-xl text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      {course.eligibility.status === 'enrolled' ? 'Already Registered' : course.eligibility.status === 'completed' ? 'Completed' : 'Locked'}
                      <span className="material-symbols-outlined text-xs">lock</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </StudentLayout>
  );
}
