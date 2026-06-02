import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';

const CreateCourseStep2 = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([
    { id: 1, title: 'Introduction', type: 'video' },
  ]);

  const addModule = (e) => {
    e.preventDefault();
    setModules([...modules, { id: Date.now(), title: 'New Module', type: 'document' }]);
  };

  const removeModule = (e, idToRemove) => {
    e.preventDefault();
    setModules(modules.filter(mod => mod.id !== idToRemove));
  };

  const handleFinish = (e) => {
    e.preventDefault();
    navigate('/instructor');
  };

  return (
    <InstructorLayout title="Create Course - Step 2">
      <div className="p-5 flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Syllabus & Modules</h2>
          <p className="text-slate-500 text-sm mt-1">Structure your course content by creating modules.</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="w-10 h-1 rounded-full bg-amber-500"></div>
        </div>

        <Card className="p-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Course Modules</h3>
              <button onClick={addModule} className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Module
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {modules.map((mod) => (
                <div key={mod.id} className="glass border border-white/20 dark:border-white/10 rounded-xl p-4 flex items-center gap-4 group">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-500 cursor-move">
                     <span className="material-symbols-outlined text-lg">drag_indicator</span>
                   </div>
                   <div className="flex-1">
                      <input
                        type="text"
                        defaultValue={mod.title}
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-0 p-0"
                      />
                   </div>
                   <div className="flex items-center gap-2">
                      <select defaultValue={mod.type} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none text-slate-900 dark:text-white">
                        <option className="bg-white dark:bg-slate-900" value="video">Video</option>
                        <option className="bg-white dark:bg-slate-900" value="document">Document</option>
                        <option className="bg-white dark:bg-slate-900" value="quiz">Quiz</option>
                      </select>
                      <button onClick={(e) => removeModule(e, mod.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                   </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
              <button onClick={() => navigate('/instructor/create')} className="text-slate-500 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Back
              </button>
              <button onClick={handleFinish} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2">
                Publish Course
                <span className="material-symbols-outlined text-sm">publish</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </InstructorLayout>
  );
};

export default CreateCourseStep2;