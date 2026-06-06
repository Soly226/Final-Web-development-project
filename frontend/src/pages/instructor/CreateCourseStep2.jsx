import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';

const CreateCourseStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const step1Data = location.state || {};

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    maxStudents: '',
    language: 'English',
    coverImageFileName: ''
  });

  const sidebarLinks = [
    { label: 'My Courses', to: '/instructor', icon: 'menu_book' },
    { label: 'Analytics', to: '/instructor/analytics', matchPrefix: '/instructor/analytics', icon: 'analytics' },
    { label: 'Assignments', to: '/instructor/assignments', matchPrefix: '/instructor/assignments', icon: 'assignment' }
  ];

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      coverImageFileName: file ? file.name : ''
    }));
  };

  const handleBack = () => {
    navigate('/instructor/create', { state: { ...step1Data } });
  };

  const handleCreateCourse = async () => {
    if (!step1Data.title) {
      showToast('Course basic information is missing. Please go back to step 1.', 'warning');
      return;
    }

    try {
      await apiClient.post('/api/instructor/courses', {
        title: step1Data.title,
        description: step1Data.description || ''
      });
      showToast('Course created successfully!', 'success');
      navigate('/instructor');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create course.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Topbar title="Create New Course" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                1. Basic info
              </div>
              <div className="text-slate-300">&gt;</div>
              <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold">
                2. Schedule
              </div>
            </div>

            <Card className="p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="start-date"
                  label="Start date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange('startDate')}
                />
                <Input
                  id="end-date"
                  label="End date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange('endDate')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="max-students"
                  label="Max students"
                  type="number"
                  value={formData.maxStudents}
                  onChange={handleChange('maxStudents')}
                />

                <div className="space-y-1.5">
                  <label htmlFor="language" className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                    Language
                  </label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={handleChange('language')}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  >
                    <option>English</option>
                    <option>Arabic</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cover-image" className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Cover image
                </label>
                <label
                  htmlFor="cover-image"
                  className="w-full min-h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 flex items-center justify-center p-4 text-center text-slate-500 dark:text-slate-400 cursor-pointer hover:border-primary/60 hover:text-primary transition-colors"
                >
                  + Drag &amp; drop or click to upload (PNG / JPG - max 5MB)
                </label>
                <input
                  id="cover-image"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
                {formData.coverImageFileName && (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Selected file: {formData.coverImageFileName}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="secondary" onClick={handleBack}>
                  &larr; Back
                </Button>
                <Button onClick={handleCreateCourse}>Create course</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateCourseStep2;
