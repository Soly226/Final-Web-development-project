import React, { useState } from 'react';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';

const assignments = [
  { id: 1, title: 'API Integration Lab', course: 'Advanced React 2024', due: 'Today, 11:59 PM', submitted: 18, total: 25, status: 'Active' },
  { id: 2, title: 'Linked List Implementation', course: 'Data Structures', due: 'Tomorrow, 9:00 AM', submitted: 4, total: 30, status: 'Active' },
  { id: 3, title: 'Linear Regression Report', course: 'Machine Learning', due: 'Fri, 11:59 PM', submitted: 0, total: 40, status: 'Scheduled' },
  { id: 4, title: 'Midterm Project', course: 'Advanced React 2024', due: 'Past Due', submitted: 25, total: 25, status: 'Needs Grading' },
];

const InstructorAssignmentPanel = () => {
  const [filter, setFilter] = useState('All');

  return (
    <InstructorLayout title="Assignment Panel">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Assignments Dashboard</h2>
            <p className="text-slate-500 text-sm mt-1">Manage and grade student submissions across your courses.</p>
          </div>
          <button onClick={() => alert('Opening the Assignment Creation window...')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-sm">add_task</span>
            New Assignment
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Active', 'Needs Grading', 'Scheduled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={twMerge(
                'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors',
                filter === tab
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.filter(a => filter === 'All' || a.status === filter).map(assignment => (
             <Card key={assignment.id} className="p-5 flex flex-col gap-4" hover={false}>
               <div className="flex justify-between items-start gap-4">
                 <div className="flex-1 min-w-0">
                    <span className={twMerge(
                      'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2',
                       assignment.status === 'Needs Grading' ? 'bg-rose-500/10 text-rose-500' :
                       assignment.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                    )}>
                      {assignment.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{assignment.title}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{assignment.course}</p>
                 </div>
                 <div className="text-right">
                   <p className={twMerge('text-xs font-bold leading-tight', assignment.due === 'Past Due' ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400')}>{assignment.due}</p>
                   <p className="text-[10px] text-slate-400">Due Date</p>
                 </div>
               </div>

               <div className="mt-2">
                 <div className="flex justify-between items-end mb-1">
                   <p className="text-xs text-slate-500 font-semibold">Submissions</p>
                   <p className="text-sm font-bold text-slate-900 dark:text-white">{assignment.submitted} <span className="text-slate-400">/ {assignment.total}</span></p>
                 </div>
                 <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div
                     className="h-full bg-amber-500 rounded-full transition-all duration-500"
                     style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                   />
                 </div>
               </div>

               <div className="flex gap-2 mt-2">
                 <button onClick={() => alert(`Editing configuration for: ${assignment.title}`)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                   Edit
                 </button>
                 <button onClick={() => alert(`Opening grading portal for: ${assignment.title}`)} className="flex-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold py-2 rounded-xl text-sm hover:bg-amber-500/20 transition-colors">
                   Grade
                 </button>
               </div>
             </Card>
          ))}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorAssignmentPanel;