import React from 'react';

const HODInstructorWorkload = ({ instructor }) => {
  if (!instructor) return null;

  const creditLoad = instructor.workload?.totalCredits || 0;
  const courseCount = instructor.workload?.courseCount || 0;
  const totalStudents = instructor.workload?.totalStudents || 0;

  const isOverloaded = creditLoad > 8;
  const isUnderloaded = creditLoad === 0;

  return (
    <div className="flex items-center gap-6 sm:gap-8 shrink-0">
      <div className="text-center min-w-[50px]">
        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">Courses</p>
        <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
          {courseCount}
        </p>
      </div>
      <div className="text-center min-w-[55px]">
        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">Students</p>
        <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
          {totalStudents}
        </p>
      </div>

      <div className="min-w-[120px]">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest mb-1">
          <span className="text-slate-400 dark:text-slate-500">Credits Load</span>
          <span className={isOverloaded ? 'text-rose-500 font-extrabold animate-pulse' : isUnderloaded ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}>
            {creditLoad} Hrs
          </span>
        </div>
        
        <div className="h-2 w-full rounded-full bg-slate-150 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-550 ${
              isOverloaded ? 'bg-rose-500' : isUnderloaded ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min((creditLoad / 12) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HODInstructorWorkload;