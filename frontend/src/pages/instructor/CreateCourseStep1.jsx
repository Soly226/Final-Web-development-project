import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const CreateCourseStep1 = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    level: 'Beginner',
    description: ''
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleNextStep = () => {
    if (!formData.title.trim()) {
      showToast('Course title is required and cannot be empty.', 'error');
      return;
    }
    navigate('/instructor/create/step2');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Topbar title="Create New Course" />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold">
                1. Basic info
              </div>
              <div className="text-slate-300">&gt;</div>
              <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                2. Schedule
              </div>
            </div>

            <Card className="p-6 md:p-8 space-y-5">
              <Input
                id="course-title"
                label="Course title"
                placeholder="e.g. Introduction to Web Development"
                value={formData.title}
                onChange={handleChange('title')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="category" className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleChange('category')}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  >
                    <option>Technology</option>
                    <option>Science</option>
                    <option>Business</option>
                    <option>Arts</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="level" className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                    Level
                  </label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={handleChange('level')}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Short description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="What will students learn in this course?"
                  value={formData.description}
                  onChange={handleChange('description')}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-y"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="secondary" onClick={() => navigate('/instructor')}>
                  Cancel
                </Button>
                <Button onClick={handleNextStep}>Next step -&gt;</Button>
              </div>
            </Card>
          </div>
        </main>
    </div>
  );
};

export default CreateCourseStep1;
