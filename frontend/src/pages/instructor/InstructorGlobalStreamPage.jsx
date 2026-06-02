import React from 'react';
import { Link } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';

const streamActivity = [
  { id: 1, course: 'Advanced React 2024', author: 'Alice Johnson', type: 'comment', time: '10 mins ago', content: 'Will the live sessions be recorded? I might have a conflict on Wednesdays.' },
  { id: 2, course: 'Data Structures', author: 'Bob Smith', type: 'question', time: '1 hr ago', content: 'Could you clarify the difference between a Hash Map and a Regular Object in JS?' },
  { id: 3, course: 'Advanced React 2024', author: 'You', type: 'announcement', time: 'Yesterday', content: 'Welcome to the course! Please review the syllabus in the first module before our first live session tomorrow.' },
];

const InstructorGlobalStreamPage = () => {
  return (
    <InstructorLayout title="Global Stream">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Global Stream</h2>
            <p className="text-slate-500 text-sm mt-1">Recent activity and discussions across all your active courses.</p>
          </div>
          <button onClick={() => alert('Opening Announcement Editor modal...')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 text-sm">
             <span className="material-symbols-outlined text-[18px]">campaign</span>
             New Announcement
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {streamActivity.map((activity) => (
             <Card key={activity.id} className="p-5 hover:border-amber-500/30 transition-colors" hover={false}>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-white/10 pb-3">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] uppercase tracking-wider font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {activity.course}
                     </span>
                   </div>
                   <Link to={`/instructor/course/1/stream`} className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-1">
                     View in Course <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                   </Link>
                </div>

                <div className="flex items-center gap-3 mb-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${activity.author === 'You' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                      {activity.author.charAt(0)}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {activity.author}
                      </p>
                      <p className="text-[11px] text-slate-500">{activity.time}</p>
                   </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 ml-11">{activity.content}</p>

                {activity.author !== 'You' && (
                  <div className="ml-11 mt-4">
                    <div className="flex gap-2">
                       <input
                         type="text"
                         placeholder="Reply directly..."
                         className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                       />
                       <button onClick={() => alert('Replying to thread...')} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold px-4 py-2 rounded-xl transition-all">
                         Reply
                       </button>
                    </div>
                  </div>
                )}
             </Card>
          ))}

          {streamActivity.length === 0 && (
             <div className="text-center py-12 text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
                <p>No recent activity across your courses.</p>
             </div>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorGlobalStreamPage;