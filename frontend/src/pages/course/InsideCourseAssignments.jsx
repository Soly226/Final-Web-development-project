import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import CourseTabNav from '../../components/course/CourseTabNav';
import apiClient from '../../lib/apiClient';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

export default function InsideCourseAssignments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourseData = async () => {
    try {
      const [courseRes, assignmentsRes] = await Promise.all([
        apiClient.get(`/api/courses/${id}`),
        apiClient.get(`/api/student/courses/${id}/assignments`),
      ]);
      setCourse(courseRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch course details.', 'error');
      setCourse({ course_name: 'Web Development', course_code: 'CS-402' });
      setAssignments([
        { _id: '1', title: 'HW1 - Responsive Grid System', deadline: '2026-06-15T23:59:00.000Z', total_marks: 100, submission: { status: 'Not Submitted' } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <StudentLayout title="Course Details">
      <div className="flex flex-col gap-6">
        
        {/* Course Header Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            {loading ? (
              <div className="space-y-1">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {course?.course_name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  {course?.course_code}
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => navigate('/my-courses')}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition-all text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Courses
          </button>
        </div>

        {/* Tab Navigation */}
        <CourseTabNav courseId={id} />

        {/* Assignments Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Assignments</h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-1/3 rounded-full" />
                      <Skeleton className="h-3 w-1/4 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">assignment</span>
              <p className="text-slate-800 dark:text-white font-bold">No assignments found</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">There are no assignments posted for this course yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all group"
                >
                  <div className="flex gap-4 items-start">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">assignment</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                        Due: {formatDate(assignment.deadline)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      assignment.submission?.status === 'Graded'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : assignment.submission?.status === 'Submitted'
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {assignment.submission?.status || 'Not Submitted'}
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {assignment.submission?.grade !== undefined ? `${assignment.submission.grade}/${assignment.total_marks}` : `-/${assignment.total_marks}`}
                    </span>
                    <Link
                      to={`/assignment/${assignment._id}`}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      View
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
