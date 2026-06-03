import React from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';

const lectures = [
  { id: 1, title: 'Welcome to the Course', duration: '5:30', type: 'video', description: 'Brief introduction to the curriculum.' },
  { id: 2, title: 'Setting up the Environment', duration: '12:45', type: 'video', description: 'Installing necessary tools and extensions.' },
  { id: 3, title: 'Course Syllabus', duration: '2 pages', type: 'document', description: 'Foundational document for the term.' },
];

const InsideCourseLecturesPage = () => {
  const { id } = useParams();

  return (
    <StudentLayout title="Course Lectures">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        
        {/* Course Header Bar */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
           <div className="flex items-center gap-4">
              <Link to="/student" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                 <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <div>
                 <h2 className="text-lg font-bold text-slate-900 dark:text-white">Advanced React 2024</h2>
                 <p className="text-xs text-slate-500 underline decoration-primary/30">Course Content</p>
              </div>
           </div>
           <div className="flex gap-2">
             <div className="px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-xl flex items-center justify-center">Lectures</div>
             <Link to={`/student/course/${id}/stream`} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">Stream</Link>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 overflow-x-auto scrollbar-hide">
          <Link to={`/student/course/${id}/lectures`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-primary border-b-2 border-primary">
            <span className="material-symbols-outlined text-base">play_circle</span>Lectures
          </Link>
          <Link to={`/student/course/${id}/stream`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">forum</span>Stream
          </Link>
          <Link to={`/student/course/${id}/assignments`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">assignment</span>Assignments
          </Link>
          <Link to={`/student/course/${id}/grades`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">grade</span>Grades
          </Link>
        </div>

        <div className="flex justify-between items-center mt-2">
           <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Module 1: Introduction</h3>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">3 Items</span>
        </div>

        <div className="flex flex-col gap-3">
          {lectures.map((lec, index) => (
             <div key={lec.id} className="glass border border-white/20 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:border-primary/30 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                   <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                     {lec.type === 'video' ? 'play_circle' : 'description'}
                   </span>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{index + 1}. {lec.title}</p>
                   <p className="text-[11px] text-slate-500 mt-0.5">{lec.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lec.type}</p>
                   <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                     {lec.duration}
                   </div>
                </div>
             </div>
          ))}
        </div>

      </div>
    </StudentLayout>
  );
};

export default InsideCourseLecturesPage;
