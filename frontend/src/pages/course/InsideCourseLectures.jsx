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

  const fetchLecturesData = async () => {
    try {
      const [courseRes, lecturesRes] = await Promise.all([
        apiClient.get(`/api/courses/${id}`),
        apiClient.get(`/api/student/courses/${id}/lectures`),
      ]);
      setCourse(courseRes.data);
      setLectures(lecturesRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch course lectures.', 'error');
      setCourse({ course_name: 'Web Development', course_code: 'CS-402' });
      setLectures([
        { _id: '1', title: 'Week 1 - HTML Fundamentals', file_url: '#', upload_date: '2026-06-01T10:00:00.000Z' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturesData();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

        {/* Lectures List */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Uploaded Lectures & Materials</h3>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-40 rounded-full" />
                      <Skeleton className="h-3 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">play_lesson</span>
              <p className="text-slate-800 dark:text-white font-bold">No lectures uploaded yet</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Lectures and class slides will show up here once posted by instructors.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary size-10 flex items-center justify-center rounded-xl">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-extrabold group-hover:text-primary transition-colors">
                        {lecture.title}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-0.5">
                        Uploaded on {formatDate(lecture.upload_date)}
                      </p>
                    </div>
                  </div>
                  
                  <a
                    href={getFileUrl(lecture.file_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                    title="Download Material"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </StudentLayout>
  );
}
