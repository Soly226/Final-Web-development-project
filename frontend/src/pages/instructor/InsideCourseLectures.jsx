import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient, { getFileUrl } from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';

const InsideCourseLectures = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    type: 'pdf', // 'pdf', 'mp4', 'link'
    fileUrl: '',
    linkUrl: ''
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    lectureId: null,
    title: ''
  });

  const sidebarLinks = [
    { label: '← Courses', to: '/instructor', icon: 'arrow_back' },
    { label: 'Lectures', to: `/instructor/course/${id}/lectures`, matchPrefix: `/instructor/course/${id}/lectures`, icon: 'play_lesson' },
    { label: 'Stream', to: `/instructor/course/${id}/stream`, matchPrefix: `/instructor/course/${id}/stream`, icon: 'dynamic_feed' },
    { label: 'Assignments', to: '/instructor/assignments', matchPrefix: '/instructor/assignments', icon: 'assignment' },
    { label: 'Students', to: `/instructor/course/${id}/students`, matchPrefix: `/instructor/course/${id}/students`, icon: 'groups' }
  ];

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/instructor/courses/${id}/materials`);
      setLectures(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load course lectures.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [id]);

  // Handle file uploads
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await apiClient.post('/api/instructor/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((prev) => ({ ...prev, fileUrl: res.data.fileUrl }));
      showToast('File uploaded successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'File upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Lecture title is required.', 'warning');
      return;
    }

    const finalFileUrl = form.type === 'link' ? form.linkUrl : form.fileUrl;
    if (!finalFileUrl) {
      showToast(form.type === 'link' ? 'Please provide a link URL.' : 'Please upload a lecture file.', 'warning');
      return;
    }

    try {
      setSaving(true);
      await apiClient.post(`/api/instructor/courses/${id}/materials`, {
        title: form.title,
        file_url: finalFileUrl,
        file_type: form.type
      });
      showToast('Lecture added successfully!', 'success');
      setAddModalOpen(false);
      setForm({ title: '', type: 'pdf', fileUrl: '', linkUrl: '' });
      fetchLectures();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add lecture.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const triggerDelete = (lecture) => {
    setConfirmModal({
      isOpen: true,
      lectureId: lecture._id,
      title: lecture.title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete(`/api/instructor/materials/${confirmModal.lectureId}`);
      showToast('Lecture deleted successfully.', 'success');
      setConfirmModal({ isOpen: false, lectureId: null, title: '' });
      fetchLectures();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete lecture.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200">
      <Topbar title="Inside Course" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Lectures</h2>
                <p className="text-xs text-slate-450 dark:text-slate-550 mt-1">Manage weekly lecture materials, slides, and videos.</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setAddModalOpen(true)}
                className="text-xs font-bold px-4 py-2.5 rounded-xl shadow-md bg-indigo-650 hover:bg-indigo-755 text-white flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">play_lesson</span>
                + Add lecture
              </Button>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 dark:text-slate-500 font-bold text-sm">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                <div>Fetching lectures stream...</div>
              </div>
            ) : (
              <Card className="p-0 overflow-hidden">
                {lectures.length > 0 ? (
                  <div className="divide-y divide-slate-150 dark:divide-slate-800">
                    {lectures.map((lecture) => {
                      const isPdf = lecture.file_url?.endsWith('.pdf') || lecture.file_type === 'pdf';
                      const isMp4 = lecture.file_url?.endsWith('.mp4') || lecture.file_type === 'mp4';

                      return (
                        <div key={lecture._id} className="px-4 md:px-5 py-4 flex items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isPdf ? 'bg-rose-500/10 text-rose-500' : isMp4 ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                          }`}>
                            <span className="material-symbols-outlined text-[20px]">
                              {isPdf ? 'picture_as_pdf' : isMp4 ? 'video_library' : 'link'}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">
                              {lecture.title}
                            </p>
                            <p className="text-xs text-slate-450 mt-0.5">
                              {isPdf ? 'PDF Document' : isMp4 ? 'Video File (MP4)' : 'External Link'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {lecture.file_url && (
                              <a
                                href={getFileUrl(lecture.file_url)}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-450 hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
                                title="View Material"
                              >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </a>
                            )}
                            <button
                              onClick={() => triggerDelete(lecture)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                              title="Delete Lecture"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-3">
                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700">play_lesson</span>
                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 italic">No lectures uploaded for this course yet.</p>
                    <Button variant="secondary" className="text-xs font-bold py-2 px-3.5 rounded-xl" onClick={() => setAddModalOpen(true)}>
                      Add First Lecture
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Modal: Add Lecture Form */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-black">Add New Lecture</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Register a course syllabus weekly lecture material.</p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 material-symbols-outlined text-lg"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAddLecture} className="mt-4 space-y-4">
              {/* Lecture Title */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Lecture Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Variables"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Material Type Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Material Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value, fileUrl: '', linkUrl: '' })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="pdf" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-white">PDF Document</option>
                  <option value="mp4" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-white">Video (MP4)</option>
                  <option value="link" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-white">External Link / URL</option>
                </select>
              </div>

              {/* File Upload or Link Field */}
              {form.type === 'link' ? (
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Link URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/lecture-notes"
                    value={form.linkUrl}
                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Upload Lecture File
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      required={!form.fileUrl}
                      accept={form.type === 'pdf' ? '.pdf' : '.mp4'}
                      onChange={handleFileUpload}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                    {uploading && (
                      <p className="text-[10px] text-indigo-500 font-bold animate-pulse">Uploading file to server, please wait...</p>
                    )}
                    {form.fileUrl && (
                      <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        File uploaded successfully!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-150 dark:border-slate-800 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="text-xs py-2 px-4"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || uploading}
                  variant="primary"
                  className="text-xs py-2 px-4 shadow-md bg-indigo-650 hover:bg-indigo-755 text-white disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Lecture'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Delete Confirmation Dialog */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-slide-up">
            <div className="flex items-center gap-3 text-rose-500 mb-3">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Delete Lecture</h3>
            </div>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-5">
              Are you sure you want to delete <span className="font-extrabold text-rose-500">"{confirmModal.title}"</span>? This action is permanent.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                className="text-xs py-2 px-3.5"
                onClick={() => setConfirmModal({ isOpen: false, lectureId: null, title: '' })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="text-xs py-2 px-3.5 bg-rose-600 hover:bg-rose-750 text-white"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsideCourseLectures;
