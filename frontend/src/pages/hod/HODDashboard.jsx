import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const HODDashboard = ({
  deptName,
  courses,
  instructors,
  tasks,
  totalCourses,
  totalInstructors,
  totalStudents,
  totalTasks,
  setActiveTab
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Branding Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-850 p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-200">Department Head Control Center</span>
            <h2 className="text-3xl font-black tracking-tight mt-1">{deptName} Department</h2>
            <p className="text-indigo-100 text-sm mt-1.5 opacity-90">Supervise department teaching streams, course workloads, and doctor tasks assignments.</p>
          </div>
          
          {/* Stats Widgets */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-sm text-center min-w-[70px]">
              <p className="text-white/70 text-[9px] font-black uppercase tracking-widest">Courses</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalCourses}</p>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-sm text-center min-w-[70px]">
              <p className="text-white/70 text-[9px] font-black uppercase tracking-widest">Doctors</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalInstructors}</p>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-sm text-center min-w-[70px]">
              <p className="text-white/70 text-[9px] font-black uppercase tracking-widest">Students</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalStudents}</p>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-sm text-center min-w-[70px]">
              <p className="text-white/70 text-[9px] font-black uppercase tracking-widest">Tasks</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalTasks}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions Panel */}
        <Card className="p-6">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">Quick Operations</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="py-3 px-4 text-xs font-bold rounded-xl flex flex-col items-center gap-2 hover:bg-indigo-550/5 dark:hover:bg-slate-800"
              onClick={() => setActiveTab('course')}
            >
              <span className="material-symbols-outlined text-lg text-indigo-500">app_registration</span>
              Course Assignments
            </Button>
            <Button
              variant="secondary"
              className="py-3 px-4 text-xs font-bold rounded-xl flex flex-col items-center gap-2 hover:bg-indigo-550/5 dark:hover:bg-slate-800"
              onClick={() => setActiveTab('teaching')}
            >
              <span className="material-symbols-outlined text-lg text-violet-500">assignment_turned_in</span>
              Teaching Tasks
            </Button>
            <Button
              variant="secondary"
              className="py-3 px-4 text-xs font-bold rounded-xl flex flex-col items-center gap-2 hover:bg-indigo-550/5 dark:hover:bg-slate-800"
              onClick={() => setActiveTab('instructor')}
            >
              <span className="material-symbols-outlined text-lg text-emerald-500">group_work</span>
              Instructor Workloads
            </Button>
            <Button
              variant="secondary"
              className="py-3 px-4 text-xs font-bold rounded-xl flex flex-col items-center gap-2 hover:bg-indigo-550/5 dark:hover:bg-slate-800"
              onClick={() => setActiveTab('profile')}
            >
              <span className="material-symbols-outlined text-lg text-amber-500">person</span>
              Profile Settings
            </Button>
          </div>
        </Card>

        {/* Recent Tasks list */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Recent Teaching Tasks</h3>
            <button
              onClick={() => setActiveTab('teaching')}
              className="text-xs font-bold text-indigo-650 hover:text-indigo-750 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View All
            </button>
          </div>

          {tasks && tasks.length > 0 ? (
            <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
              {tasks.slice(0, 4).map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                  <div>
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-200">
                      {task.course_code} - {task.course_name}
                    </p>
                    <p className="text-[10px] text-slate-450 mt-0.5">Assigned to {task.doctor_name}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-550/15">
                    {task.year}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 italic text-xs text-slate-450">
              No specialized teaching tasks registered.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HODDashboard;