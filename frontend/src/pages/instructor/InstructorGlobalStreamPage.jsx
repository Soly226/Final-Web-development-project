import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/ui/Skeleton';

const InstructorGlobalStreamPage = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Announcement Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsRes, coursesRes] = await Promise.all([
        apiClient.get('/api/instructor/stream'),
        apiClient.get('/api/instructor/courses')
      ]);
      setPosts(postsRes.data || []);
      setCourses(coursesRes.data || []);
      if (coursesRes.data && coursesRes.data.length > 0) {
        setSelectedCourseId(coursesRes.data[0]._id);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load stream activities.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      showToast('Please select a course.', 'warning');
      return;
    }
    if (!postContent.trim()) {
      showToast('Announcement content cannot be empty.', 'warning');
      return;
    }

    try {
      setPosting(true);
      await apiClient.post(`/api/instructor/courses/${selectedCourseId}/stream`, {
        content: postContent.trim()
      });
      showToast('Announcement published successfully!', 'success');
      setModalOpen(false);
      setPostContent('');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to publish announcement.', 'error');
    } finally {
      setPosting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <InstructorLayout title="Global Stream">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Global Stream</h2>
            <p className="text-slate-500 text-sm mt-1">Recent activity and discussions across all your active courses.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)} 
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 text-sm"
          >
             <span className="material-symbols-outlined text-[18px]">campaign</span>
             New Announcement
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Card key={post._id} className="p-5 hover:border-amber-500/30 transition-colors" hover={false}>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {post.course_id?.course_name || 'Course'} ({post.course_id?.course_code})
                    </span>
                  </div>
                  <Link to={`/instructor/course/${post.course_id?._id}/stream`} className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-1">
                    View in Course <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </Link>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-amber-500 to-orange-500">
                    {post.senderName?.charAt(0) || 'I'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {post.senderName}
                    </p>
                    <p className="text-[11px] text-slate-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 ml-11 whitespace-pre-wrap">{post.content}</p>
              </Card>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">forum</span>
                <p className="text-slate-805 dark:text-white font-bold text-sm">No recent activity across your courses.</p>
                <p className="text-slate-500 text-xs mt-1">Publish a course-wide update to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Announcement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent">
              <div className="flex items-center gap-2 text-amber-500">
                <span className="material-symbols-outlined">campaign</span>
                <h3 className="font-black text-white text-base tracking-tight">New Course Announcement</h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Target Course</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white outline-none"
                >
                  {courses.map(c => (
                    <option key={c._id} value={c._id} className="bg-slate-900 text-white">
                      {c.course_code} - {c.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Announcement Content</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Type your course update, syllabus revision, or announcement details..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setModalOpen(false)}
                  className="text-xs py-2 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={posting || !postContent.trim()}
                  className="text-xs py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
                >
                  {posting ? 'Publishing...' : 'Publish Announcement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
};

export default InstructorGlobalStreamPage;