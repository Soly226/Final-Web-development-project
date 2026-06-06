import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient, { getFileUrl } from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';

const InstructorAssignmentPanel = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);

  // Selected Data
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionsRoster, setSubmissionsRoster] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradingRow, setGradingRow] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({ courseId: '', title: '', description: '', deadline: '', totalMarks: '' });
  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });

  const sidebarLinks = [
    { label: 'Dashboard', to: '/instructor', icon: 'dashboard' },
    { label: 'Create Course', to: '/instructor/create', icon: 'add_circle' },
    { label: 'Analytics', to: '/instructor/analytics', icon: 'analytics' },
    { label: 'Assignments', to: '/instructor/assignments', icon: 'assignment' },
    { label: 'Roster', to: '/instructor/roster', icon: 'group' }
  ];

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/instructor/assignments');
      setAssignments(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch assignments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await apiClient.get('/api/instructor/courses');
      setCourses(res.data || []);
    } catch (err) {
      console.error('Failed to load courses', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const handleToggleStatus = async (asgId) => {
    try {
      const res = await apiClient.put(`/api/instructor/assignments/${asgId}/status`);
      showToast(res.data.message || 'Status updated.', 'success');
      fetchAssignments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status.', 'error');
    }
  };

  const handleViewSubmissions = async (asg) => {
    setSelectedAssignment(asg);
    setSubmissionsModalOpen(true);
    setLoadingSubmissions(true);
    try {
      const res = await apiClient.get(`/api/instructor/assignments/${asg._id}/submissions`);
      setSubmissionsRoster(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load submissions.', 'error');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/instructor/assignments', {
        course_id: createForm.courseId,
        title: createForm.title,
        description: createForm.description,
        deadline: createForm.deadline,
        total_marks: Number(createForm.totalMarks)
      });
      showToast('Assignment created successfully!', 'success');
      setCreateModalOpen(false);
      setCreateForm({ courseId: '', title: '', description: '', deadline: '', totalMarks: '' });
      fetchAssignments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create assignment.', 'error');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/api/instructor/submissions/${gradingRow.submission_id}/grade`, {
        grade: Number(gradeForm.grade),
        feedback: gradeForm.feedback
      });
      showToast('Grade submitted successfully!', 'success');
      setGradingModalOpen(false);
      const res = await apiClient.get(`/api/instructor/assignments/${selectedAssignment._id}/submissions`);
      setSubmissionsRoster(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit grade.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200">
      <Topbar title="Instructor Assignments" />
      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Assignments</h2>
                <p className="text-xs text-slate-450 dark:text-slate-550 mt-1">Create and manage your course assignment workloads.</p>
              </div>
              <Button onClick={() => setCreateModalOpen(true)} className="text-xs font-bold px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-755 text-white flex items-center gap-1.5 shadow-md">
                + Create assignment
              </Button>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 font-bold text-sm">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3 animate-pulse"></div>
                <div>Fetching assignments database...</div>
              </div>
            ) : (
              <Card className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left border-collapse">
                    <thead className="bg-slate-100/80 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-550 dark:text-slate-400">
                      <tr>
                        <th className="px-5 py-4 font-bold uppercase tracking-wider">Assignment</th>
                        <th className="px-5 py-4 font-bold uppercase tracking-wider">Course</th>
                        <th className="px-5 py-4 font-bold uppercase tracking-wider">Due Date</th>
                        <th className="px-5 py-4 font-bold uppercase tracking-wider">Submissions</th>
                        <th className="px-5 py-4 font-bold uppercase tracking-wider">Status</th>
                        <th className="px-5 py-4 text-right font-bold uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                      {assignments.map((assignment) => {
                        const isOpen = assignment.status === 'Open';
                        return (
                          <tr key={assignment._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-5 py-4">
                              <p className="text-sm font-extrabold text-slate-900 dark:text-white">{assignment.title}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 max-w-xs">{assignment.description}</p>
                            </td>
                            <td className="px-5 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                              {assignment.course_id?.course_code} - {assignment.course_id?.course_name}
                            </td>
                            <td className="px-5 py-4 text-xs font-semibold text-slate-550 dark:text-slate-400">
                              {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'TBD'}
                            </td>
                            <td className="px-5 py-4 text-xs font-bold text-slate-700 dark:text-slate-350">
                              {assignment.submittedCount ?? 0} / {assignment.totalStudentsCount ?? 0}
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => handleToggleStatus(assignment._id)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                                  isOpen
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'bg-slate-150 text-slate-650 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                              >
                                {assignment.status || 'Open'}
                              </button>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Button variant="secondary" className="py-1.5 px-3.5 text-xs font-bold border border-slate-200 dark:border-slate-800" onClick={() => handleViewSubmissions(assignment)}>
                                View submissions
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Modal: Create Assignment */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-black">Create Assignment</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 material-symbols-outlined text-lg">close</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase">Select Course</label>
                <select required value={createForm.courseId} onChange={(e) => setCreateForm({ ...createForm, courseId: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100">
                  <option value="">-- Select Course --</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.course_code} - {c.course_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase">Title</label>
                <input type="text" required value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase">Description</label>
                <textarea required rows="3" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase">Due Date</label>
                  <input type="datetime-local" required value={createForm.deadline} onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase">Total Marks</label>
                  <input type="number" required value={createForm.totalMarks} onChange={(e) => setCreateForm({ ...createForm, totalMarks: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-slate-100" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)} className="text-xs py-2 px-4">Cancel</Button>
                <Button type="submit" className="text-xs py-2 px-4 bg-indigo-650 hover:bg-indigo-755 text-white">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Submissions Roster */}
      {submissionsModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-4xl w-full animate-slide-up max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-black">Submissions: {selectedAssignment.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Enrolled students and their submission status.</p>
              </div>
              <button onClick={() => setSubmissionsModalOpen(false)} className="text-slate-400 hover:text-slate-600 material-symbols-outlined text-lg">close</button>
            </div>
            <div className="flex-1 overflow-y-auto mt-4 pr-1">
              {loadingSubmissions ? (
                <div className="py-12 text-center text-slate-400 font-bold text-sm">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3 animate-pulse"></div>
                  <div>Loading roster...</div>
                </div>
              ) : submissionsRoster.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-black">
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Student ID</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">File</th>
                        <th className="py-2.5 px-3">Grade</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {submissionsRoster.map((row) => (
                        <tr key={row.student_id._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="py-3 px-3">
                            <p className="font-extrabold text-slate-900 dark:text-white">{row.student_id.full_name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{row.student_id.email}</p>
                          </td>
                          <td className="py-3 px-3">{row.student_id.student_id}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              row.status === 'Submitted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-450'
                            }`}>{row.status}</span>
                          </td>
                          <td className="py-3 px-3">
                            {row.status === 'Submitted' && row.uploaded_file ? (
                              <a href={getFileUrl(row.uploaded_file)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-600 font-bold">
                                <span className="material-symbols-outlined text-[16px]">download</span> Download File
                              </a>
                            ) : <span className="text-slate-400 dark:text-slate-650">-</span>}
                          </td>
                          <td className="py-3 px-3">
                            {row.status === 'Submitted' ? (
                              row.grade !== null && row.grade !== undefined 
                                ? <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{row.grade} / {selectedAssignment.total_marks}</span>
                                : <span className="text-amber-500 dark:text-amber-400 italic">Pending Grading</span>
                            ) : <span className="text-slate-400 dark:text-slate-650">-</span>}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {row.status === 'Submitted' && (
                              <Button
                                variant="primary"
                                className="py-1 px-3.5 text-[10px] font-extrabold shadow-sm text-white bg-indigo-650 hover:bg-indigo-755 border border-transparent"
                                onClick={() => {
                                  setGradingRow(row);
                                  setGradeForm({ grade: row.grade ?? '', feedback: row.feedback ?? '' });
                                  setGradingModalOpen(true);
                                }}
                              >
                                Grade Submission
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-center py-8 text-slate-400 dark:text-slate-550 italic">No enrolled students found.</p>}
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-150 dark:border-slate-800 mt-4">
              <Button variant="secondary" className="text-xs py-2 px-4" onClick={() => setSubmissionsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Grade Submission Form */}
      {gradingModalOpen && gradingRow && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-black">Grade Submission</h3>
              <button onClick={() => setGradingModalOpen(false)} className="text-slate-400 hover:text-slate-600 material-symbols-outlined text-lg">close</button>
            </div>
            <form onSubmit={handleGradeSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-1 uppercase">Score (Max {selectedAssignment.total_marks})</label>
                <input type="number" required min="0" max={selectedAssignment.total_marks} value={gradeForm.grade} onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-105 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-1 uppercase">Feedback</label>
                <textarea rows="3" value={gradeForm.feedback} onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-105 focus:outline-none focus:border-indigo-500" placeholder="Feedback..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" className="text-xs py-1.5 px-3" onClick={() => setGradingModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="text-xs py-1.5 px-3 bg-indigo-650 hover:bg-indigo-755 text-white">Submit Grade</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssignmentPanel;
