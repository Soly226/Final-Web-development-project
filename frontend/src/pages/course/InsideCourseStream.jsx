import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import CourseTabNav from '../../components/course/CourseTabNav';
import apiClient from '../../lib/apiClient';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

export default function InsideCourseStream() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCourseData = async () => {
    try {
      const [courseRes, postsRes] = await Promise.all([
        apiClient.get(`/api/courses/${id}`),
        apiClient.get(`/api/student/courses/${id}/stream`),
      ]);
      setCourse(courseRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch course details.', 'error');
      // Fallback
      setCourse({ course_name: 'Web Development', course_code: 'CS-402', instructor: 'Dr. Ahmed Khalifa' });
      setPosts([
        { _id: '1', senderName: 'Prof. Michael Chen', senderModel: 'Instructor', createdAt: '2026-06-01T10:00:00.000Z', content: 'Welcome to the course! Please review the syllabus in the first module before our first live session tomorrow.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await apiClient.post(`/api/student/courses/${id}/stream`, {
        content: postContent,
      });
      setPosts((prev) => [data, ...prev]);
      setPostContent('');
      showToast('Post shared to stream!', 'success');
    } catch (err) {
      showToast('Failed to create post. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Create Post Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/60 shadow-sm">
          <form onSubmit={handlePostSubmit} className="space-y-3">
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 focus:ring-2 focus:ring-primary/45 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all resize-none"
              rows={3}
              placeholder="Share something with your class..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !postContent.trim()}
                className="px-5 py-2 bg-primary hover:bg-accent disabled:opacity-55 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                {submitting ? 'Posting...' : 'Post to Stream'}
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </form>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Class Feed</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 space-y-3">
                  <div className="flex gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-1/4 rounded-full" />
                      <Skeleton className="h-3 w-1/6 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">forum</span>
              <p className="text-slate-800 dark:text-white font-bold text-sm">No activity in the stream yet</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Be the first to share something with the class!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm">
                        {post.senderName?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">{post.senderName}</p>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            post.senderModel === 'Instructor'
                              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {post.senderModel}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1 whitespace-pre-wrap">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </StudentLayout>
  );
}
