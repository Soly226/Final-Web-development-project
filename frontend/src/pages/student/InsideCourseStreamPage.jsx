import React from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';

const streamPosts = [
  { id: 1, author: 'Prof. Michael Chen', role: 'Instructor', time: '10 mins ago', content: 'Welcome to the course! Please review the syllabus in the first module before our first live session tomorrow.', likes: 12, comments: 3 },
  { id: 2, author: 'Alice Johnson', role: 'Student', time: '1 hr ago', content: 'Will the live sessions be recorded? I might have a conflict on Wednesdays.', likes: 2, comments: 1 },
];

const InsideCourseStreamPage = () => {
  const { id } = useParams();

  return (
    <StudentLayout title="Course Stream">
      <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
        
        {/* Course Header Bar */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
           <div className="flex items-center gap-4">
              <Link to="/student" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                 <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <div>
                 <h2 className="text-lg font-bold text-slate-900 dark:text-white">Advanced React 2024</h2>
                 <p className="text-xs text-slate-500 underline decoration-primary/30">Course Stream</p>
              </div>
           </div>
           <div className="flex gap-2">
             <Link to={`/student/course/${id}/lectures`} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">Lectures</Link>
             <div className="px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-xl flex items-center justify-center">Stream</div>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 overflow-x-auto scrollbar-hide">
          <Link to={`/student/course/${id}/lectures`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">play_circle</span>Lectures
          </Link>
          <Link to={`/student/course/${id}/stream`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-primary border-b-2 border-primary">
            <span className="material-symbols-outlined text-base">forum</span>Stream
          </Link>
          <Link to={`/student/course/${id}/assignments`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">assignment</span>Assignments
          </Link>
          <Link to={`/student/course/${id}/grades`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">grade</span>Grades
          </Link>
        </div>

        {/* Share Something */}
        <Card className="p-4" hover={false}>
           <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold flex-shrink-0">
                 S
              </div>
              <div className="flex-1">
                 <textarea 
                   rows="2"
                   className="w-full bg-transparent border-none resize-none text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-0 placeholder:text-slate-400"
                   placeholder="Share something with your class..."
                 ></textarea>
                 <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-white/10">
                    <div className="flex gap-1">
                       <button onClick={() => alert("Opening file picker...")} className="p-2 text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-primary/10">
                          <span className="material-symbols-outlined text-[20px]">attach_file</span>
                       </button>
                    </div>
                    <button onClick={() => alert("Posting to stream...")} className="bg-primary hover:bg-accent text-white font-bold py-1.5 px-5 rounded-lg text-sm transition-all shadow-sm shadow-primary/20 active:scale-95">
                      Post
                    </button>
                 </div>
              </div>
           </div>
        </Card>

        {/* Stream Posts */}
        <div className="flex flex-col gap-4">
          {streamPosts.map(post => (
             <Card key={post.id} className="p-5" hover={false}>
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${post.role === 'Instructor' ? 'bg-gradient-to-br from-primary to-accent' : 'bg-slate-300 dark:bg-slate-700'}`}>
                         {post.author.charAt(0)}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                           {post.author}
                           {post.role === 'Instructor' && <span className="text-[9px] bg-primary/10 text-primary uppercase px-1.5 py-0.5 rounded-sm tracking-widest leading-none font-black font-sans">Instructor</span>}
                         </p>
                         <p className="text-[11px] text-slate-500">{post.time}</p>
                      </div>
                   </div>
                   <button onClick={() => alert("Opening post options...")} className="text-slate-400 hover:text-slate-600 transition-colors">
                     <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                   </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-white/10">
                   <button onClick={() => alert("You liked this post.")} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                     <span className="material-symbols-outlined text-[18px]">thumb_up</span> {post.likes}
                   </button>
                   <button onClick={() => alert("Opening comment thread...")} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                     <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span> {post.comments} Class comments
                   </button>
                </div>
             </Card>
          ))}
        </div>

      </div>
    </StudentLayout>
  );
};

export default InsideCourseStreamPage;
