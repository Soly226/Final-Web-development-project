import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import axios from '../../lib/apiClient';
import { twMerge } from 'tailwind-merge';

const API_BASE = '/api';

// ─── Toast ─────────────────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={twMerge(
        'fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl animate-slide-up',
        type === 'success'
          ? 'bg-emerald-500/90 border-emerald-400/30 text-white'
          : 'bg-rose-500/90 border-rose-400/30 text-white'
      )}
    >
      <span className="material-symbols-outlined text-xl">
        {type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};

// ─── Skeleton ───────────────────────────────────────────────────────────────

const Skeleton = () => (
  <AdminLayout title="Course Administration">
    <div className="p-5 max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>
    </div>
  </AdminLayout>
);

// ─── Confirm Delete Modal ───────────────────────────────────────────────────

const ConfirmModal = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-rose-500/10 to-orange-500/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-rose-500">warning</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading} className="gap-2">
            {loading ? (
              <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Deleting…</>
            ) : (
              <><span className="material-symbols-outlined text-sm">delete</span> Delete</>
            )}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Create / Edit Course Modal ─────────────────────────────────────────────

const CourseFormModal = ({ course, onClose, onSuccess, authHeaders }) => {
  const isEdit = !!course;
  const [form, setForm] = useState({
    course_id: course?.course_id || '',
    course_code: course?.course_code || '',
    course_name: course?.course_name || '',
    description: course?.description || '',
    credit_hours: course?.credit_hours || 3,
    department: course?.department || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        const { data } = await axios.put(
          `${API_BASE}/courses/${course._id}`,
          {
            course_name: form.course_name,
            description: form.description,
            credit_hours: Number(form.credit_hours),
            department: form.department,
          },
          authHeaders
        );
        onSuccess(data, 'updated');
      } else {
        if (!form.course_id.trim() || !form.course_code.trim()) {
          setError('Course ID and Course Code are required.');
          setSaving(false);
          return;
        }
        const { data } = await axios.post(
          `${API_BASE}/courses`,
          { ...form, credit_hours: Number(form.credit_hours) },
          authHeaders
        );
        onSuccess(data, 'created');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} course.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-primary/10 to-accent/10 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">{isEdit ? 'edit' : 'add_circle'}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEdit ? 'Edit Course' : 'Create New Course'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Course ID"
                id="course-id"
                placeholder="e.g. CRS-201"
                value={form.course_id}
                onChange={e => handleChange('course_id', e.target.value)}
                required
              />
              <Input
                label="Course Code"
                id="course-code"
                placeholder="e.g. CS201"
                value={form.course_code}
                onChange={e => handleChange('course_code', e.target.value)}
                required
              />
            </div>
          )}

          <Input
            label="Course Name"
            id="course-name"
            placeholder="e.g. Data Structures"
            value={form.course_name}
            onChange={e => handleChange('course_name', e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Course description..."
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Credit Hours"
              id="credit-hours"
              type="number"
              min={1}
              max={6}
              value={form.credit_hours}
              onChange={e => handleChange('credit_hours', e.target.value)}
              required
            />
            <Input
              label="Department"
              id="department"
              placeholder="e.g. Computer Science"
              value={form.department}
              onChange={e => handleChange('department', e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" className="gap-2" disabled={saving}>
              {saving ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> {isEdit ? 'Saving…' : 'Creating…'}</>
              ) : (
                <><span className="material-symbols-outlined text-sm">{isEdit ? 'save' : 'add'}</span> {isEdit ? 'Save Changes' : 'Create Course'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Prerequisite Connector Modal ───────────────────────────────────────────

const PrerequisiteModal = ({ course, allCourses, onClose, onSuccess, authHeaders }) => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Filter out the current course and the already-set prerequisite
  const availableCourses = allCourses.filter(c =>
    c._id !== course._id && c._id !== course.prerequisite_course_id
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    setSaving(true);
    setError('');
    try {
      await axios.post(
        `${API_BASE}/courses/${course._id}/prerequisites`,
        { required_course_id: selectedCourseId },
        authHeaders
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set prerequisite.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500">link</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Set Prerequisite</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select a course that must be completed before students can enroll in <strong className="text-slate-900 dark:text-white">{course.course_name}</strong>.
          </p>
          {course.prerequisite_course_id && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <span className="material-symbols-outlined text-base">info</span>
              This course already has a prerequisite set. Adding a new one will replace it.
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">Required Course</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">— Select a course —</option>
              {availableCourses.map(c => (
                <option key={c._id} value={c._id}>{c.course_code} — {c.course_name}</option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" className="gap-2" disabled={saving}>
              {saving ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Setting…</>
              ) : (
                <><span className="material-symbols-outlined text-sm">link</span> Set Prerequisite</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Assign Instructor Modal ────────────────────────────────────────────────

const AssignInstructorModal = ({ course, onClose, onSuccess, authHeaders }) => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/admin/users/instructors`, authHeaders);
        setInstructors(data);
        setFilteredInstructors(data);
      } catch {
        setError('Failed to load instructors.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredInstructors(
      instructors.filter(i =>
        i.full_name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q)
      )
    );
  }, [search, instructors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    setError('');
    try {
      await axios.post(
        `${API_BASE}/courses/${course._id}/assign-instructor`,
        { instructor_id: selectedId },
        authHeaders
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign instructor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-500">person_add</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assign Instructor</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <Input
            label="Search Instructors"
            id="instructor-search"
            placeholder="Type a name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<span className="material-symbols-outlined text-lg">search</span>}
          />
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              Loading instructors…
            </div>
          ) : filteredInstructors.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No instructors found.</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin">
              {filteredInstructors.map(inst => (
                <label
                  key={inst._id}
                  className={twMerge(
                    'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                    selectedId === inst._id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 dark:border-white/10 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <input
                    type="radio"
                    name="instructor"
                    value={inst._id}
                    checked={selectedId === inst._id}
                    onChange={() => setSelectedId(inst._id)}
                    className="accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{inst.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{inst.email}</p>
                  </div>
                  {course.assigned_instructors?.some(ai => (ai._id || ai) === inst._id) && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Assigned</span>
                  )}
                </label>
              ))}
            </div>
          )}
          {error && (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" className="gap-2" disabled={saving || !selectedId}>
              {saving ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Assigning…</>
              ) : (
                <><span className="material-symbols-outlined text-sm">person_add</span> Assign</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Enroll Student Modal ───────────────────────────────────────────────────

const EnrollStudentModal = ({ course, onClose, onSuccess, authHeaders }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/admin/users/students`, authHeaders);
        setStudents(data);
        setFilteredStudents(data);
      } catch {
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredStudents(
      students.filter(s =>
        s.full_name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.student_id?.toLowerCase().includes(q)
      )
    );
  }, [search, students]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !semester.trim()) return;
    setSaving(true);
    setError('');
    try {
      await axios.post(
        `${API_BASE}/courses/${course._id}/enroll`,
        { student_id: selectedId, semester: semester.trim() },
        authHeaders
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll student.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-500">school</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enroll Student</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <Input
            label="Search Students"
            id="student-search"
            placeholder="Type a name, email, or student ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<span className="material-symbols-outlined text-lg">search</span>}
          />
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              Loading students…
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No students found.</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin">
              {filteredStudents.map(stu => (
                <label
                  key={stu._id}
                  className={twMerge(
                    'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                    selectedId === stu._id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 dark:border-white/10 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <input
                    type="radio"
                    name="student"
                    value={stu._id}
                    checked={selectedId === stu._id}
                    onChange={() => setSelectedId(stu._id)}
                    className="accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{stu.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{stu.email} {stu.student_id && `• ${stu.student_id}`}</p>
                  </div>
                  {course.enrolled_students?.some(es => (es._id || es) === stu._id) && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Enrolled</span>
                  )}
                </label>
              ))}
            </div>
          )}

          <Input
            label="Semester"
            id="semester"
            placeholder="e.g. Fall 2026"
            value={semester}
            onChange={e => setSemester(e.target.value)}
            required
          />

          {error && (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">
              {error === 'Prerequisite not met' ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">block</span>
                  This student has not completed the prerequisite course and cannot be enrolled.
                </span>
              ) : error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" className="gap-2" disabled={saving || !selectedId || !semester.trim()}>
              {saving ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Enrolling…</>
              ) : (
                <><span className="material-symbols-outlined text-sm">how_to_reg</span> Enroll Student</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Course Detail Drawer ───────────────────────────────────────────────────

const CourseDetailDrawer = ({
  course,
  allCourses,
  onClose,
  onEdit,
  onDelete,
  onSetPrerequisite,
  onAssignInstructor,
  onEnrollStudent,
}) => {
  const prerequisiteCourse = allCourses.find(c => c._id === course.prerequisite_course_id);

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl border-l border-slate-200 dark:border-white/10 animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-[0.15em] mb-1">{course.course_code}</p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{course.course_name}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Department</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{course.department}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Credit Hours</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{course.credit_hours}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Students</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{course.enrolled_students?.length || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Instructors</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{course.assigned_instructors?.length || 0}</p>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{course.description}</p>
            </div>
          )}

          {/* Prerequisite */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-lg">link</span>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">Prerequisite</p>
              </div>
              <button
                onClick={onSetPrerequisite}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                {prerequisiteCourse ? 'Change' : 'Set'}
              </button>
            </div>
            {prerequisiteCourse ? (
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {prerequisiteCourse.course_code} — {prerequisiteCourse.course_name}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">No prerequisite set</p>
            )}
          </div>

          {/* Assigned Instructors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500 text-lg">groups</span>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Instructors</p>
              </div>
              <button
                onClick={onAssignInstructor}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                Assign
              </button>
            </div>
            {course.assigned_instructors?.length > 0 ? (
              <div className="space-y-2">
                {course.assigned_instructors.map(inst => (
                  <div key={inst._id || inst} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-500 text-sm">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{inst.full_name || 'Instructor'}</p>
                      <p className="text-xs text-slate-500">{inst.email || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No instructors assigned yet.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <Button className="w-full gap-2" onClick={onEnrollStudent}>
              <span className="material-symbols-outlined text-sm">school</span>
              Enroll Student
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="gap-2" onClick={onEdit}>
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Course
              </Button>
              <Button variant="danger" className="gap-2" onClick={onDelete}>
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Course Card ────────────────────────────────────────────────────────────

const CourseCard = ({ course, allCourses, onClick }) => {
  const prerequisiteCourse = allCourses.find(c => c._id === course.prerequisite_course_id);

  return (
    <Card
      className="cursor-pointer group transition-all duration-300 hover:ring-2 hover:ring-primary/30 p-0 overflow-hidden"
      onClick={onClick}
    >
      {/* Top Gradient Stripe */}
      <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{course.course_code}</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">{course.course_name}</h3>
          </div>
          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">
            arrow_forward
          </span>
        </div>

        {/* Department + Credits */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-xs">apartment</span>
            {course.department}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-xs">schedule</span>
            {course.credit_hours} Credits
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm text-emerald-500">groups</span>
            <span className="font-bold">{course.enrolled_students?.length || 0}</span> students
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm text-blue-500">person</span>
            <span className="font-bold">{course.assigned_instructors?.length || 0}</span> instructors
          </div>
        </div>

        {/* Prerequisite Badge */}
        {prerequisiteCourse && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-xs">link</span>
            Requires: {prerequisiteCourse.course_code}
          </div>
        )}
      </div>
    </Card>
  );
};

// ─── MAIN PAGE ────────────────────────────────══════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto glass rounded-2xl border border-rose-500/20 bg-rose-500/5 mt-8">
    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-3xl">error_outline</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connection Error</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} className="gap-2 px-6 shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-sm">refresh</span>
        Retry Connection
      </Button>
    )}
  </div>
);

const CourseManagementPage = () => {
  const { user } = useAuth();
  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  // ── State ─────────────────────────────────────────────────────────────────
  const [courses, setCourses]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [search, setSearch]                 = useState('');
  const [toast, setToast]                   = useState(null);

  // Modal toggles
  const [showCreateModal, setShowCreateModal]       = useState(false);
  const [editCourse, setEditCourse]                 = useState(null);
  const [detailCourse, setDetailCourse]             = useState(null);
  const [deleteCourse, setDeleteCourse]             = useState(null);
  const [prereqCourse, setPrereqCourse]             = useState(null);
  const [assignCourse, setAssignCourse]             = useState(null);
  const [enrollCourse, setEnrollCourse]             = useState(null);
  const [deleting, setDeleting]                     = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast(null), []);

  // ── Fetch courses ─────────────────────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/courses`, authHeaders);
      setCourses(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError('Failed to fetch courses. Please verify that the backend is active.');
      showToast('Failed to load courses.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCourses();
  }, [user, fetchCourses]);

  // ── Refresh helper (refetches + updates detail drawer if open) ────────────
  const refreshCourses = useCallback(async () => {
    const { data } = await axios.get(`${API_BASE}/courses`, authHeaders);
    const coursesArray = Array.isArray(data) ? data : (data.data || []);
    setCourses(coursesArray);
    // If the detail drawer is open, update it with fresh data
    if (detailCourse) {
      const updated = coursesArray.find(c => c._id === detailCourse._id);
      if (updated) setDetailCourse(updated);
    }
  }, [user, detailCourse]);

  // ── Delete handler ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteCourse) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/courses/${deleteCourse._id}`, authHeaders);
      showToast(`"${deleteCourse.course_name}" deleted successfully.`);
      setDeleteCourse(null);
      setDetailCourse(null);
      await refreshCourses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete course.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── Create / Edit success handler ─────────────────────────────────────────
  const handleFormSuccess = async (savedCourse, action) => {
    showToast(`Course "${savedCourse.course_name}" ${action} successfully!`);
    await refreshCourses();
  };

  // ── Prerequisite / Assign / Enroll success handlers ───────────────────────
  const handlePrerequisiteSuccess = async () => {
    showToast('Prerequisite updated successfully!');
    await refreshCourses();
  };

  const handleAssignSuccess = async () => {
    showToast('Instructor assigned successfully!');
    await refreshCourses();
  };

  const handleEnrollSuccess = async () => {
    showToast('Student enrolled successfully!');
    await refreshCourses();
  };

  // ── Filter courses ────────────────────────────────────────────────────────
  const filteredCourses = courses.filter(c => {
    const q = search.toLowerCase();
    return (
      c.course_name?.toLowerCase().includes(q) ||
      c.course_code?.toLowerCase().includes(q) ||
      c.department?.toLowerCase().includes(q)
    );
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled_students?.length || 0), 0);
  const totalInstructors = new Set(courses.flatMap(c => (c.assigned_instructors || []).map(i => i._id || i))).size;
  const departments = new Set(courses.map(c => c.department)).size;

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <AdminLayout title="Course Administration">
        <div className="p-5 max-w-6xl mx-auto">
          <ErrorState message={error} onRetry={fetchCourses} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Course Administration">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* Modals */}
      {showCreateModal && (
        <CourseFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleFormSuccess}
          authHeaders={authHeaders}
        />
      )}
      {editCourse && (
        <CourseFormModal
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSuccess={handleFormSuccess}
          authHeaders={authHeaders}
        />
      )}
      {deleteCourse && (
        <ConfirmModal
          title="Delete Course"
          message={`Are you sure you want to delete "${deleteCourse.course_name}"? This will also remove all associated prerequisites. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteCourse(null)}
          loading={deleting}
        />
      )}
      {prereqCourse && (
        <PrerequisiteModal
          course={prereqCourse}
          allCourses={courses}
          onClose={() => setPrereqCourse(null)}
          onSuccess={handlePrerequisiteSuccess}
          authHeaders={authHeaders}
        />
      )}
      {assignCourse && (
        <AssignInstructorModal
          course={assignCourse}
          onClose={() => setAssignCourse(null)}
          onSuccess={handleAssignSuccess}
          authHeaders={authHeaders}
        />
      )}
      {enrollCourse && (
        <EnrollStudentModal
          course={enrollCourse}
          onClose={() => setEnrollCourse(null)}
          onSuccess={handleEnrollSuccess}
          authHeaders={authHeaders}
        />
      )}

      {/* Detail Drawer */}
      {detailCourse && (
        <CourseDetailDrawer
          course={detailCourse}
          allCourses={courses}
          onClose={() => setDetailCourse(null)}
          onEdit={() => { setEditCourse(detailCourse); }}
          onDelete={() => { setDeleteCourse(detailCourse); }}
          onSetPrerequisite={() => { setPrereqCourse(detailCourse); }}
          onAssignInstructor={() => { setAssignCourse(detailCourse); }}
          onEnrollStudent={() => { setEnrollCourse(detailCourse); }}
        />
      )}

      <div className="p-5 max-w-6xl mx-auto space-y-6">

        {/* ── Stats Banner ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'menu_book', label: 'Total Courses', value: courses.length, color: 'text-primary' },
            { icon: 'groups', label: 'Total Students', value: totalStudents, color: 'text-emerald-500' },
            { icon: 'person', label: 'Instructors', value: totalInstructors, color: 'text-blue-500' },
            { icon: 'apartment', label: 'Departments', value: departments, color: 'text-amber-500' },
          ].map(stat => (
            <Card key={stat.label} hover={false} className="p-4 flex items-center gap-4">
              <div className={twMerge('p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800', stat.color)}>
                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Search + Create ─────────────────────────────────────────────── */}
        <Card hover={false} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              id="course-search"
              placeholder="Search courses by name, code, or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<span className="material-symbols-outlined text-lg">search</span>}
            />
          </div>
          <Button className="w-full md:w-auto gap-2 whitespace-nowrap" onClick={() => setShowCreateModal(true)}>
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Create Course
          </Button>
        </Card>

        {/* ── Course Grid ─────────────────────────────────────────────────── */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                allCourses={courses}
                onClick={() => setDetailCourse(course)}
              />
            ))}
          </div>
        ) : (
          <Card hover={false} className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">
              {search ? 'search_off' : 'menu_book'}
            </span>
            <p className="text-slate-500 font-semibold">
              {search ? 'No courses match your search.' : 'No courses in the catalog yet.'}
            </p>
            {!search && (
              <p className="text-xs text-slate-400 mt-1">
                Create your first course using the button above.
              </p>
            )}
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default CourseManagementPage;
