import React from 'react';
import Button from '../../components/ui/Button';

const HODAssignInstructor = ({
  isOpen,
  onClose,
  selectedCourse,
  instructors,
  handleCourseAssign
}) => {
  if (!isOpen || !selectedCourse) return null;

  const assignedIds = selectedCourse.assigned_instructors?.map(i => i._id || i) || [];
  const unassignedInstructors = instructors.filter(inst => !assignedIds.includes(inst._id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Assign Course Instructor</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Select a doctor to teach <span className="font-extrabold text-indigo-500">{selectedCourse.course_code}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 material-symbols-outlined text-lg"
          >
            close
          </button>
        </div>

        <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
          {unassignedInstructors.length > 0 ? (
            unassignedInstructors.map(inst => (
              <div
                key={inst._id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/45 hover:bg-indigo-500/5 rounded-xl border border-slate-200 dark:border-slate-800/85 cursor-pointer"
                onClick={() => handleCourseAssign(inst._id)}
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-650 font-bold text-xs">
                    {inst.full_name ? inst.full_name.charAt(0) : 'D'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{inst.full_name}</p>
                    <p className="text-[10px] text-slate-450">{inst.email}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-indigo-500 text-sm">add_circle</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-center text-slate-400 py-4 italic">All doctors are already assigned to this course.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HODAssignInstructor;