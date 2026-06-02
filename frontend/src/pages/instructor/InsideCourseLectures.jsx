import React from 'react';
import { Link, useParams } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';

const lectures = [
  { id: 1, title: 'Welcome to the Course', duration: '5:30', type: 'video' },
  { id: 2, title: 'Setting up the Environment', duration: '12:45', type: 'video' },
  { id: 3, title: 'Course Syllabus', duration: '2 pages', type: 'document' },
];

const InsideCourseLectures = () => {
  const { id } = useParams();

  return (
    <InstructorLayout title="Course Lectures">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
           <div className="flex items-center gap-4">
              <Link to="/instructor" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-amber-500 transition-colors">
                 <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <div>
                 <h2 className="text-lg font-bold text-slate-900 dark:text-white">Advanced React 2024</h2>
                 <p className="text-xs text-slate-500">Manage Content</p>
              </div>
           </div>
           <div className="flex gap-2">
             <Link to={`/instructor/course/${id}/stream`} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-amber-500 transition-colors">Stream</Link>
             <div className="px-4 py-2 text-sm font-bold text-amber-500 bg-amber-500/10 rounded-xl flex items-center justify-center">Lectures</div>
           </div>
        </div>

        <div className="flex justify-between items-center mt-2">
           <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Module 1: Introduction</h3>
           <button onClick={() => alert('Opening file upload dialog...')} className="flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-500/10 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span> Upload
           </button>
        </div>

        <div className="flex flex-col gap-3">
          {lectures.map((lec, index) => (
             <div key={lec.id} className="glass border border-white/20 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:border-amber-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                   <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                     {lec.type === 'video' ? 'play_circle' : 'description'}
                   </span>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">{index + 1}. {lec.title}</p>
                   <p className="text-xs text-slate-500 mt-0.5">{lec.type.charAt(0).toUpperCase() + lec.type.slice(1)} • {lec.duration}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => alert(`Editing lecture: ${lec.title}`)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                     <span className="material-symbols-outlined text-[20px]">edit</span>
                   </button>
                   <button onClick={() => alert(`Deleting lecture: ${lec.title}`)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors">
                     <span className="material-symbols-outlined text-[20px]">delete</span>
                   </button>
                </div>
             </div>
          ))}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InsideCourseLectures;