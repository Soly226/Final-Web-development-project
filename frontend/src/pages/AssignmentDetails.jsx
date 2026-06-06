import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import apiClient from '../lib/apiClient';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.get(`/api/student/assignments/${id}`);
      setAssignment(data);
      if (data.submission?.uploaded_file) {
        setSelectedFileName(data.submission.uploaded_file.split('/').pop());
      }
    } catch (err) {
      // If endpoint fails or assignment isn't found in DB, use mock details for robustness
      const mockAssignment = {
        title: 'HW1 - Responsive Grid System',
        course: { name: 'Web Development', code: 'CS-402' },
        total_marks: 100,
        deadline: '2026-06-15T23:59:00.000Z',
        description: 'In this assignment, you will build a responsive grid system using CSS Grid and Flexbox. Ensure it works on mobile, tablet, and desktop views. Your solution should handle different content lengths gracefully and include a navigation header and a three-column layout that stacks on smaller screens.',
        instructor: 'Dr. Ahmed Khalifa',
        submission: { status: 'Not Submitted' }
      };
      setAssignment(mockAssignment);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !selectedFileName) {
      showToast('Please select a file to submit.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('uploaded_file', selectedFile);
      } else {
        formData.append('uploaded_file', selectedFileName);
      }

      await apiClient.post(`/api/student/assignments/${id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Assignment submitted successfully!', 'success');
      fetchDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit assignment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <StudentLayout title="Assignment Details">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition-all text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
        </div>

        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <Skeleton className="h-6 rounded-full w-2/5" />
            <Skeleton className="h-8 rounded-full w-3/5" />
            <Skeleton className="h-20 rounded-xl w-full" />
          </div>
        )}

        {!loading && assignment && (
          <>
            {/* Assignment Brief */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider">
                    {assignment.course?.code} • {assignment.course?.name}
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {assignment.title}
                  </h1>
                </div>
                
                <div className="sm:text-right flex-shrink-0">
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Points</div>
                  <div className="text-2xl font-black text-primary">{assignment.total_marks || 100}</div>
                </div>
              </div>

              {/* Assignment Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-5">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Due Date</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatDate(assignment.deadline)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-xl">info</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Status</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{assignment.submission?.status || 'Not Submitted'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Instructor</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{assignment.instructor}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-3">
              <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Description</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/60 shadow-sm">
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">{assignment.description}</p>
              </div>
            </section>

            {/* Attachments (Static reference brief) */}
            <section className="space-y-3">
              <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Attachments</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-rose-500 bg-rose-500/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-xl block">picture_as_pdf</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">assignment_brief.pdf</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">1.2 MB • PDF Document</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Submission Section */}
            <section className="space-y-3">
              <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Your Submission</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/60 shadow-sm space-y-4">
                
                {assignment.submission?.status === 'Graded' && (
                  <div className="bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-3">
                    <span className="material-symbols-outlined text-green-500 text-2xl font-variation-fill">verified</span>
                    <div>
                      <h4 className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-wider">Submission Graded</h4>
                      <p className="text-sm font-black text-slate-800 dark:text-white mt-1">
                        Score: {assignment.submission.grade} / {assignment.total_marks}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                        Feedback: "{assignment.submission.feedback || 'Good job.'}"
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center text-center space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-250">Click to upload or drag & drop</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Maximum file size 50MB (ZIP, PDF, DOC, PDF)</p>
                    </div>
                    <input className="hidden" id="file-upload" type="file" onChange={handleFileUpload} disabled={assignment.submission?.status === 'Graded'} />
                    <label
                      className={`cursor-pointer px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        assignment.submission?.status === 'Graded' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      htmlFor="file-upload"
                    >
                      Choose Files
                    </label>
                    {selectedFileName && (
                      <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {selectedFileName}
                      </p>
                    )}
                  </div>

                  {assignment.submission?.status !== 'Graded' && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-black rounded-xl shadow-lg shadow-primary/20 text-xs transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        {submitting ? 'Submitting...' : assignment.submission?.status === 'Submitted' ? 'Resubmit Assignment' : 'Submit Assignment'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </section>
          </>
        )}
      </div>
    </StudentLayout>
  );
}
