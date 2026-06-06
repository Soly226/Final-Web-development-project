import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import CourseTabNav from '../../components/course/CourseTabNav';
import apiClient, { getFileUrl } from '../../lib/apiClient';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

export default function InsideCourseLectures() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseRes, lecturesRes] = await Promise.all([
        apiClient.get(`/api/courses/${id}`),
        apiClient.get(`/api/student/courses/${id}/lectures`),
      ]);
      setCourse(courseRes.data);
      setLectures(lecturesRes.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch course details.', 'error');
      // Fallback
      setCourse({ course_name: 'Web Development', course_code: 'CS-402' });
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

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
                <p className="text-sm text-slate-550 dark:text-slate-400 font-semibold mt-0.5">
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

        {/* Lectures Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lectures & Materials</h3>
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
          ) : lectures.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">play_lesson</span>
              <p className="text-slate-800 dark:text-white font-bold">No lectures uploaded</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">There are no lectures or slides uploaded for this course yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {lectures.map((lecture) => {
                const isPdf = lecture.file_url?.endsWith('.pdf') || lecture.file_type === 'pdf';
                const isMp4 = lecture.file_url?.endsWith('.mp4') || lecture.file_type === 'mp4';

                return (
                  <div
                    key={lecture._id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPdf ? 'bg-rose-500/10 text-rose-500' : isMp4 ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {isPdf ? 'picture_as_pdf' : isMp4 ? 'video_library' : 'link'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm truncate">
                          {lecture.title}
                        </h4>
                        <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 font-semibold">
                          {isPdf ? 'PDF Document' : isMp4 ? 'Video File (MP4)' : 'External Link'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      {lecture.file_url && (
                        <a
                          href={getFileUrl(lecture.file_url)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isMp4 ? 'play_circle' : 'download'}
                          </span>
                          {isMp4 ? 'Watch' : isPdf ? 'Download' : 'Open Link'}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
