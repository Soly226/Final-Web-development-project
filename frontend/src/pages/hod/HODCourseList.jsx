import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const HODCourseList = ({
  courses,
  handleCourseRemove,
  setSelectedCourse,
  setCourseAssignModalOpen
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {courses.map((course) => (
        <Card key={course._id} className="p-6 flex flex-col justify-between" hover={false}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-600/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {course.course_code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                  {course.course_name}
                </h3>
              </div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {course.credit_hours} Credits
              </span>
            </div>

            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed line-clamp-2">
              {course.description || 'No course description available.'}
            </p>

            <div className="pt-2 border-t border-slate-150 dark:border-slate-800/80">
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Assigned Instructors
              </p>
              {course.assigned_instructors && course.assigned_instructors.length > 0 ? (
                <div className="space-y-2">
                  {course.assigned_instructors.map((inst) => (
                    <div key={inst._id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/45 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800/80">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{inst.full_name}</span>
                      <button
                        onClick={() => handleCourseRemove(course._id, inst._id)}
                        className="text-red-500 text-[10px] font-bold uppercase hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] italic text-slate-450">No instructors assigned yet.</p>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              variant="secondary"
              className="text-xs font-bold py-1.5 px-3 rounded-lg"
              onClick={() => {
                setSelectedCourse(course);
                setCourseAssignModalOpen(true);
              }}
            >
              Assign Doctor
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HODCourseList;