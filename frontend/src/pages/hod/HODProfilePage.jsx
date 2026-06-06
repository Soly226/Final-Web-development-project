import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useSettings } from '../../context/SettingsContext';

const HODProfilePage = ({ onProfileUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { t, theme, setTheme, language, setLanguage } = useSettings();

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    department: 'Computer Science',
    bio: '',
    office_hours: '',
    office_location: '',
    phone: ''
  });

  // Fetch the profile when mounting
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/instructor/department/profile');
      setProfile({
        full_name: res.data.full_name || '',
        email: res.data.email || '',
        department: res.data.department || 'Computer Science',
        bio: res.data.bio || '',
        office_hours: res.data.office_hours || '',
        office_location: res.data.office_location || '',
        phone: res.data.phone || ''
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load profile details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiClient.put('/api/instructor/department/profile', {
        full_name: profile.full_name,
        bio: profile.bio,
        office_hours: profile.office_hours,
        office_location: profile.office_location,
        phone: profile.phone
      });
      showToast(res.data.message || 'Profile updated successfully!', 'success');
      
      // Update parent component profile info (so name in header changes dynamically)
      if (onProfileUpdate) {
        onProfileUpdate(res.data.user);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-450 dark:text-slate-500 font-bold text-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        <div>Loading profile details...</div>
      </div>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="border-b border-slate-150 dark:border-slate-800 pb-4 mb-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">{t('profileSettings')}</h3>
        <p className="text-xs text-slate-450 dark:text-slate-500">Update your contact details, office information, and department bio.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Department (Read-only)
            </label>
            <input
              type="text"
              disabled
              value={profile.department}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Office Hours
            </label>
            <input
              type="text"
              value={profile.office_hours}
              onChange={(e) => setProfile({ ...profile, office_hours: e.target.value })}
              placeholder="e.g. Mon/Wed 2:00 PM - 4:00 PM"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Office Location
            </label>
            <input
              type="text"
              value={profile.office_location}
              onChange={(e) => setProfile({ ...profile, office_location: e.target.value })}
              placeholder="e.g. Building C, Room 402"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* App Preferences */}
        <div className="border-t border-slate-150 dark:border-slate-800 pt-5 mt-5">
          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            {t('appPreferences')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Theme Preferences */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('theme')}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20'
                      : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">light_mode</span>
                  {t('lightMode')}
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    theme === 'dark'
                      ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20'
                      : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">dark_mode</span>
                  {t('darkMode')}
                </button>
              </div>
            </div>

            {/* Language Preferences */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('language')}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    language === 'en'
                      ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20'
                      : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">language</span>
                  {t('english')}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    language === 'ar'
                      ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20'
                      : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">language</span>
                  {t('arabic')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Biography / Department Vision
          </label>
          <textarea
            rows="4"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell us about yourself or your department direction..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="text-xs font-bold py-2.5 px-5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl shadow-lg shadow-indigo-650/20"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HODProfilePage;