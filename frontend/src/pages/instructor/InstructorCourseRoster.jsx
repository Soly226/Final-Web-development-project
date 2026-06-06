import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/ui/Skeleton';

export default function InstructorCourseRoster() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollIdentifier, setEnrollIdentifier] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const sidebarLinks = [
    { label: '← Courses', to: '/instructor', icon: 'arrow_back' },
    { label: 'Lectures', to: `/instructor/course/${id}/lectures`, matchPrefix: `/instructor/course/${id}/lectures`, icon: 'play_lesson' },
    { label: 'Stream', to: `/instructor/course/${id}/stream`, matchPrefix: `/instructor/course/${id}/stream`, icon: 'dynamic_feed' },
    { label: 'Assignments', to: '/instructor/assignments', matchPrefix: '/instructor/assignments', icon: 'assignment' },
    { label: 'Students', to: `/instructor/course/${id}/students`, matchPrefix: `/instructor/course/${id}/students`, icon: 'groups' }
  ];

  const fetchRoster = async () => {
    try {
      const res = await apiClient.get(`/api/courses/${id}/students`, {
        params: { search: searchQuery }
      });
      // The API returns { success: true, data: { students: [...] } }
      setStudents(res.data.data.students || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch student roster.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoster();
    }, 300); // debounce API call slightly for search inputs
    return () => clearTimeout(timer);
  }, [id, searchQuery]);

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!enrollIdentifier.trim()) {
      showToast('Please enter an email or student ID.', 'error');
      return;
    }
    try {
      setEnrollLoading(true);
      const res = await apiClient.post(`/api/courses/${id}/students`, {
        identifier: enrollIdentifier.trim()
      });
      showToast(res.data.message || 'Student enrolled successfully!', 'success');
      setIsEnrollModalOpen(false);
      setEnrollIdentifier('');
      fetchRoster();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to enroll student.', 'error');
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleOpenRemoveConfirm = (student) => {
    setStudentToRemove(student);
    setIsConfirmRemoveOpen(true);
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;
    try {
      setRemoveLoading(true);
      const res = await apiClient.delete(`/api/courses/${id}/students/${studentToRemove._id}`);
      showToast(res.data.message || 'Student removed successfully.', 'success');
      setIsConfirmRemoveOpen(false);
      setStudentToRemove(null);
      fetchRoster();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove student.', 'error');
    } finally {
      setRemoveLoading(false);
    }
  };

  const handleMessageRedirect = (student) => {
    navigate(`/messages?to=${student._id}&role=Student&name=${encodeURIComponent(student.full_name)}`);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Topbar title="Inside Course" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Course Roster
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  Manage student enrollments and view student profiles.
                </p>
              </div>
              <Button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-center transition-all"
              >
                + Enroll Student
              </Button>
            </div>

            {/* Search Filter Bar */}
            <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative w-full max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input
                  type="text"
                  placeholder="Search by student name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              {!loading && (
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0">
                  Total: {students.length}
                </span>
              )}
            </div>

            {/* Roster Grid / List */}
            <Card className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {loading ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-5 flex items-center gap-4">
                      <Skeleton className="size-11 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3 rounded-full" />
                        <Skeleton className="h-3 w-1/4 rounded-full" />
                      </div>
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <span className="material-symbols-outlined text-slate-400 text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>groups</span>
                  <p className="text-slate-800 dark:text-white font-bold text-sm">No students enrolled</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Use the enroll button to add students to this course.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((student) => (
                    <div key={student._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all group">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {student.profileImage ? (
                          <img
                            src={student.profileImage}
                            alt={student.full_name}
                            className="size-11 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                          />
                        ) : (
                          <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                            {student.initials || student.full_name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                            {student.full_name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs font-bold text-slate-450 dark:text-slate-500">
                            <span>ID: {student.student_id}</span>
                            <span>·</span>
                            <span>{student.email}</span>
                            <span>·</span>
                            <span className="text-primary/95">{student.department || 'General'}</span>
                          </div>
                          {student.joinedAt && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                              Enrolled: {new Date(student.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleMessageRedirect(student)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm"
                          title="Message student"
                        >
                          <span className="material-symbols-outlined text-sm">mail</span>
                          Message
                        </button>
                        <button
                          onClick={() => handleOpenRemoveConfirm(student)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-xs font-bold transition-all shadow-sm border border-red-500/20"
                          title="Remove student"
                        >
                          <span className="material-symbols-outlined text-sm">person_remove</span>
                          Unenroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>
        </main>
      </div>

      {/* Enroll Student Dialog Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Enroll Student</h3>
              <button 
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 material-symbols-outlined text-lg"
              >
                close
              </button>
            </div>
            <form onSubmit={handleEnrollStudent} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Student Email or Student ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. student@example.com or 2024-8891"
                  value={enrollIdentifier}
                  onChange={(e) => setEnrollIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                  disabled={enrollLoading}
                  autoFocus
                />
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold mt-1.5">
                  Type the exact email or student ID to register them into this course.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 border border-slate-205 dark:border-slate-800 text-slate-650 dark:text-slate-400 font-extrabold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                  disabled={enrollLoading}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={enrollLoading}
                  className="bg-primary text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-primary-dark transition-all flex items-center gap-1.5"
                >
                  {enrollLoading ? 'Enrolling...' : 'Enroll Student'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Remove Student Modal */}
      {isConfirmRemoveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center animate-slide-up">
            <span className="material-symbols-outlined text-red-500 text-4xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Unenroll Student?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2 px-1">
              Are you sure you want to remove <span className="font-extrabold text-slate-900 dark:text-white">{studentToRemove?.full_name}</span> from this course?
            </p>
            <p className="text-[10px] text-red-500 font-bold mt-1 bg-red-500/5 py-1 rounded-lg">
              This will delete their enrollment record!
            </p>

            <div className="flex items-center justify-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setIsConfirmRemoveOpen(false)}
                className="px-4 py-2 border border-slate-205 dark:border-slate-800 text-slate-650 dark:text-slate-400 font-extrabold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                disabled={removeLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveStudent}
                className="px-4 py-2 bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-sm hover:bg-red-650 transition-all"
                disabled={removeLoading}
              >
                {removeLoading ? 'Removing...' : 'Yes, Unenroll'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
