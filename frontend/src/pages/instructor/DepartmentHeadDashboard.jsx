import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import HODLayout from '../../layouts/HODLayout';

// Import modular HOD view components
import HODDashboard from '../hod/HODDashboard';
import HODCourseList from '../hod/HODCourseList';
import HODAssignInstructor from '../hod/HODAssignInstructor';
import HODInstructorList from '../hod/HODInstructorList';
import HODProfilePage from '../hod/HODProfilePage';

const DepartmentHeadDashboard = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => setSearchParams({ tab });

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [courseAssignModalOpen, setCourseAssignModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    courseId: '',
    instructorId: '',
    year: 'Freshman',
    specialization: 'Software Engineering'
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const deptName = user?.department || 'Computer Science';

  // Fetch HOD workspace data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, instructorsRes, tasksRes] = await Promise.all([
        apiClient.get('/api/instructor/department/courses'),
        apiClient.get('/api/instructor/department/instructors'),
        apiClient.get('/api/instructor/department/tasks')
      ]);
      setCourses(coursesRes.data);
      setInstructors(instructorsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load department workspace details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Course instructor assignments
  const handleCourseAssign = async (instructorId) => {
    if (!selectedCourse) return;
    try {
      const res = await apiClient.post(`/api/instructor/department/courses/${selectedCourse._id}/assign`, {
        instructorId
      });
      showToast(res.data.message || 'Instructor assigned successfully!', 'success');
      setCourseAssignModalOpen(false);
      setSelectedCourse(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign instructor.', 'error');
    }
  };

  const handleCourseRemove = (courseId, instructorId) => {
    triggerConfirm(
      'Unassign Instructor',
      'Are you sure you want to unassign this doctor/instructor from the course?',
      async () => {
        try {
          const res = await apiClient.post(`/api/instructor/department/courses/${courseId}/remove`, {
            instructorId
          });
          showToast(res.data.message || 'Instructor unassigned successfully.', 'success');
          fetchData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to remove instructor.', 'error');
        }
      }
    );
  };

  // HOD Teaching Task Handlers
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const { courseId, instructorId, year, specialization } = taskForm;
    if (!courseId || !instructorId) {
      showToast('Please select both a course and an instructor/doctor.', 'warning');
      return;
    }
    try {
      const res = await apiClient.post('/api/instructor/department/tasks', {
        courseId,
        instructorId,
        year,
        specialization
      });
      showToast(res.data.message || 'Teaching task registered successfully!', 'success');
      setTaskModalOpen(false);
      setTaskForm({ courseId: '', instructorId: '', year: 'Freshman', specialization: 'Software Engineering' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign teaching task.', 'error');
    }
  };

  const handleTaskDelete = (taskId) => {
    triggerConfirm(
      'Remove Teaching Task',
      'Are you sure you want to remove this teaching task assignment?',
      async () => {
        try {
          const res = await apiClient.delete(`/api/instructor/department/tasks/${taskId}`);
          showToast(res.data.message || 'Teaching task removed successfully.', 'success');
          fetchData();
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to remove teaching task.', 'error');
        }
      }
    );
  };

  // Quick stats calculations
  const totalCourses = courses.length;
  const totalInstructors = instructors.length;
  const totalStudents = instructors.reduce((sum, inst) => sum + (inst.workload?.totalStudents || 0), 0);
  const totalTasks = tasks.length;

  return (
    <HODLayout title="Department Head Portal">
      {loading ? (
        <div className="py-20 text-center text-slate-450 dark:text-slate-500 font-bold text-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
          <div>Loading workspace details...</div>
        </div>
      ) : activeTab === 'overview' ? (
        <HODDashboard
          deptName={deptName}
          courses={courses}
          instructors={instructors}
          tasks={tasks}
          totalCourses={totalCourses}
          totalInstructors={totalInstructors}
          totalStudents={totalStudents}
          totalTasks={totalTasks}
          setActiveTab={setActiveTab}
        />
      ) : activeTab === 'course' ? (
        <HODCourseList
          courses={courses}
          handleCourseRemove={handleCourseRemove}
          setSelectedCourse={setSelectedCourse}
          setCourseAssignModalOpen={setCourseAssignModalOpen}
        />
      ) : activeTab === 'teaching' ? (
              /* TAB 3: TEACHING TASKS */
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Specialized Teaching Tasks</h3>
                    <p className="text-xs text-slate-450 dark:text-slate-500">Track and assign courses to doctors specifying course year and doctor specialization.</p>
                  </div>
                  <Button
                    id="assign-task-btn"
                    variant="primary"
                    className="text-xs font-extrabold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-650/20"
                    onClick={() => setTaskModalOpen(true)}
                  >
                    <span className="material-symbols-outlined text-[18px]">add_task</span>
                    Assign Teaching Task
                  </Button>
                </div>

                <Card className="p-6">
                  {tasks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="pb-3">Course</th>
                            <th className="pb-3">Doctor</th>
                            <th className="pb-3 text-center">Year Level</th>
                            <th className="pb-3 text-center">Doctor Specialization</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task) => (
                            <tr key={task._id} className="border-b border-slate-100 dark:border-slate-850 text-slate-650 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                              <td className="py-3 font-bold">{task.course_code} - {task.course_name}</td>
                              <td className="py-3">{task.doctor_name}</td>
                              <td className="py-3 text-center">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                  {task.year}
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-450 border border-slate-200/40 dark:border-slate-800/40">
                                  {task.specialization}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleTaskDelete(task._id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                  title="Remove Teaching Task"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16 space-y-3">
                      <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700">task</span>
                      <p className="text-sm font-bold text-slate-400 dark:text-slate-500 italic">No specialized teaching tasks assigned yet.</p>
                      <Button variant="secondary" className="text-xs font-bold py-2 px-3.5 rounded-xl" onClick={() => setTaskModalOpen(true)}>
                        Create First Task
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            ) : activeTab === 'instructor' ? (
              <HODInstructorList instructors={instructors} />
            ) : activeTab === 'profile' ? (
              <HODProfilePage onProfileUpdate={fetchData} />
            ) : null}

      {/* Modal: Course Instructor Assignment */}
      <HODAssignInstructor
        isOpen={courseAssignModalOpen}
        onClose={() => {
          setCourseAssignModalOpen(false);
          setSelectedCourse(null);
        }}
        selectedCourse={selectedCourse}
        instructors={instructors}
        handleCourseAssign={handleCourseAssign}
      />

      {/* Modal: Specialized Teaching Task Form */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Assign Specialized Teaching Task</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Specify teaching year level and doctor specialization criteria.</p>
              </div>
              <button
                onClick={() => setTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 material-symbols-outlined text-lg"
              >
                close
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="mt-4 space-y-4">
              {/* Select Course */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Select Course
                </label>
                <select
                  required
                  value={taskForm.courseId}
                  onChange={(e) => setTaskForm({ ...taskForm, courseId: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">{c.course_code} - {c.course_name}</option>
                  ))}
                </select>
              </div>

              {/* Select Instructor / Doctor */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Select Doctor / Instructor
                </label>
                <select
                  required
                  value={taskForm.instructorId}
                  onChange={(e) => setTaskForm({ ...taskForm, instructorId: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">-- Choose Doctor --</option>
                  {instructors.map(inst => (
                    <option key={inst._id} value={inst._id} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">{inst.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Select Year Level */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Year Level
                </label>
                <select
                  required
                  value={taskForm.year}
                  onChange={(e) => setTaskForm({ ...taskForm, year: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Freshman" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Freshman</option>
                  <option value="Sophomore" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Sophomore</option>
                  <option value="Junior" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Junior</option>
                  <option value="Senior" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Senior</option>
                </select>
              </div>

              {/* Select Doctor Specialization */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Doctor Specialization
                </label>
                <select
                  required
                  value={taskForm.specialization}
                  onChange={(e) => setTaskForm({ ...taskForm, specialization: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="AI" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">AI</option>
                  <option value="Cybersecurity" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Cybersecurity</option>
                  <option value="Software Engineering" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Software Engineering</option>
                  <option value="Data Science" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">Data Science</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="text-xs py-2 px-4"
                  onClick={() => setTaskModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  id="submit-task-btn"
                  type="submit"
                  variant="primary"
                  className="text-xs py-2 px-4 shadow-md bg-indigo-650 hover:bg-indigo-750 text-white"
                >
                  Assign Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Confirmation Dialog */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-slide-up">
            <div className="flex items-center gap-3 text-rose-500 mb-3">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-5">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                className="text-xs py-2 px-3.5"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              >
                Cancel
              </Button>
              <Button
                id="confirm-action-btn"
                variant="primary"
                className="text-xs py-2 px-3.5 bg-rose-600 hover:bg-rose-750 text-white"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </HODLayout>
  );
};

export default DepartmentHeadDashboard;
