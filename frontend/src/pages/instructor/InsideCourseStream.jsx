import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../lib/apiClient';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

const InsideCourseStream = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sidebarLinks = [
    { label: '← Courses', to: '/instructor', icon: 'arrow_back' },
    { label: 'Lectures', to: `/instructor/course/${id}/lectures`, matchPrefix: `/instructor/course/${id}/lectures`, icon: 'play_lesson' },
    { label: 'Stream', to: `/instructor/course/${id}/stream`, matchPrefix: `/instructor/course/${id}/stream`, icon: 'dynamic_feed' },
    { label: 'Assignments', to: '/instructor/assignments', matchPrefix: '/instructor/assignments', icon: 'assignment' },
    { label: 'Students', to: `/instructor/course/${id}/students`, matchPrefix: `/instructor/course/${id}/students`, icon: 'groups' }
  ];

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseRes, postsRes] = await Promise.all([
        apiClient.get(`/api/courses/${id}`),
        apiClient.get(`/api/instructor/courses/${id}/stream`),
      ]);
      setCourse(courseRes.data);
      setPosts(postsRes.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load stream details.', 'error');
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
      const { data } = await apiClient.post(`/api/instructor/courses/${id}/stream`, {
        content: postContent,
      });
      setPosts((prev) => [data, ...prev]);
      setPostContent('');
      showToast('Announced to course stream!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post message.', 'error');
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200">
      <Topbar title="Course Stream" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Course Header Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="size-14 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 overflow-hidden flex-shrink-0">
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
                onClick={() => navigate('/instructor')}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition-all text-slate-650 dark:text-slate-400 bg-white dark:bg-slate-950"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Dashboard
              </button>
            </div>

            {/* Create Post Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/60 shadow-sm">
              <form onSubmit={handlePostSubmit} className="space-y-3">
                <textarea
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 focus:ring-2 focus:ring-indigo-500/45 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-450 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Share a course update or syllabus notice with your class..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting || !postContent.trim()}
                    className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-755 disabled:opacity-55 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    {submitting ? 'Announcing...' : 'Announce to Stream'}
                    <span className="material-symbols-outlined text-sm">send</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Class Feed Announcements</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 space-y-3 animate-pulse">
                      <div className="flex gap-3">
                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/4" />
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-1/6" />
                        </div>
                      </div>
                      <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">forum</span>
                  <p className="text-slate-800 dark:text-white font-bold text-sm">No activity in the stream yet</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Share an announcement or update to start the discussion.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-extrabold text-sm">
                            {post.senderName?.charAt(0) || 'I'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-extrabold text-slate-900 dark:text-white">{post.senderName}</p>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                post.senderModel === 'Instructor'
                                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                                  : 'bg-slate-105 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {post.senderModel}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-750 dark:text-slate-300 leading-relaxed pl-1 whitespace-pre-wrap">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default InsideCourseStream;
