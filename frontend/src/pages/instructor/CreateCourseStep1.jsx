import React from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';

const CreateCourseStep1 = () => {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    navigate('/instructor/create/step2');
  };

  return (
    <InstructorLayout title="Create Course - Step 1">
      <div className="p-5 flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Course Details</h2>
          <p className="text-slate-500 text-sm mt-1">Let's start with the basics of your new course.</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-1 rounded-full bg-amber-500"></div>
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleNext} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Introduction to Machine Learning"
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Course Description</label>
              <textarea
                required
                rows="4"
                placeholder="What will students learn in this course?"
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Category</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors">
                  <option className="bg-white dark:bg-slate-900">Computer Science</option>
                  <option className="bg-white dark:bg-slate-900">Data Science</option>
                  <option className="bg-white dark:bg-slate-900">Business</option>
                  <option className="bg-white dark:bg-slate-900">Design</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Level</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors">
                  <option className="bg-white dark:bg-slate-900">Beginner</option>
                  <option className="bg-white dark:bg-slate-900">Intermediate</option>
                  <option className="bg-white dark:bg-slate-900">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Course Thumbnail</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-amber-500 hover:bg-amber-500/5 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Click to upload an image</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2">
                Continue to Syllabus
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        </Card>
      </div>
    </InstructorLayout>
  );
};

export default CreateCourseStep1;