import React, { useState, useEffect } from 'react';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';

const InstructorProfilePage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { t, theme, setTheme, language, setLanguage } = useSettings();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    department: '',
    bio: '',
    officeHours: '',
    officeLocation: '',
    phone: ''
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/instructor/profile');
      setProfile({
        fullName: res.data.full_name || '',
        email: res.data.email || '',
        department: res.data.department || '',
        bio: res.data.bio || '',
        officeHours: res.data.office_hours || '',
        officeLocation: res.data.office_location || '',
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiClient.put('/api/instructor/profile', {
        full_name: profile.fullName,
        bio: profile.bio,
        office_hours: profile.officeHours,
        office_location: profile.officeLocation,
        phone: profile.phone
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <InstructorLayout title={t('profile')}>
        <div className="py-20 text-center text-slate-400 font-bold text-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
          <div>Loading profile...</div>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout title={t('profile')}>
      <div className="p-5 flex flex-col gap-6 max-w-4xl mx-auto">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-white shadow-xl shadow-amber-500/20 text-center">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
               <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-white blur-[100px] rotate-12"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 rounded-2xl bg-white/20 border-4 border-white/30 backdrop-blur-md flex items-center justify-center text-4xl font-extrabold shadow-lg mb-4">
                  {profile.fullName?.charAt(0) || 'I'}
               </div>
               <h2 className="text-3xl font-extrabold tracking-tight">{profile.fullName || 'Prof. Instructor'}</h2>
               <p className="text-white/80 font-semibold uppercase tracking-widest text-xs mt-1 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                 {profile.department || 'Computer Science'} Department
               </p>
            </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-1 flex flex-col gap-6">
              <Card className="p-5" hover={false}>
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">contact_mail</span> Contact Info
                 </h3>
                 <div className="flex flex-col gap-3">
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</p>
                       <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.email}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Office Location</p>
                       <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.officeLocation || 'Not set'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Office Hours</p>
                       <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.officeHours || 'Not set'}</p>
                    </div>
                    {profile.phone && (
                      <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone Number</p>
                         <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.phone}</p>
                      </div>
                    )}
                 </div>
              </Card>

              <Card className="p-5" hover={false}>
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">settings</span> {t('appPreferences')}
                 </h3>
                 <div className="flex flex-col gap-4">
                   {/* Theme Preferences */}
                   <div className="flex flex-col gap-2">
                     <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('theme')}</p>
                     <div className="flex gap-2">
                       <button
                         type="button"
                         onClick={() => setTheme('light')}
                         className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                           theme === 'light'
                             ? 'bg-amber-500 text-white shadow-md'
                             : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800'
                         }`}
                       >
                         <span className="material-symbols-outlined text-sm">light_mode</span>
                         {t('lightMode')}
                       </button>
                       <button
                         type="button"
                         onClick={() => setTheme('dark')}
                         className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                           theme === 'dark'
                             ? 'bg-amber-500 text-white shadow-md'
                             : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800'
                         }`}
                       >
                         <span className="material-symbols-outlined text-sm">dark_mode</span>
                         {t('darkMode')}
                       </button>
                     </div>
                   </div>

                   {/* Language Preferences */}
                   <div className="flex flex-col gap-2">
                     <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('language')}</p>
                     <div className="flex gap-2">
                       <button
                         type="button"
                         onClick={() => setLanguage('en')}
                         className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                           language === 'en'
                             ? 'bg-amber-500 text-white shadow-md'
                             : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800'
                         }`}
                       >
                         <span className="material-symbols-outlined text-sm">language</span>
                         {t('english')}
                       </button>
                       <button
                         type="button"
                         onClick={() => setLanguage('ar')}
                         className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                           language === 'ar'
                             ? 'bg-amber-500 text-white shadow-md'
                             : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800'
                         }`}
                       >
                         <span className="material-symbols-outlined text-sm">language</span>
                         {t('arabic')}
                       </button>
                     </div>
                   </div>
                 </div>
              </Card>

              <Card className="p-5" hover={false}>
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">security</span> Account Status
                 </h3>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                       <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">Active Instructor</p>
                       <p className="text-[10px] text-slate-500">Since Fall 2022</p>
                    </div>
                 </div>
              </Card>

              <button
                onClick={handleLogout}
                className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-rose-500/20 shadow-sm active:scale-95"
              >
                 <span className="material-symbols-outlined text-[20px]">logout</span>
                 Sign Out
              </button>
           </div>

           <div className="md:col-span-2">
              <Card className="p-6" hover={false}>
                 <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Edit Profile Details</h3>

                 <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                          <input
                            type="text"
                            required
                            value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
                          <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Office Location</label>
                          <input
                            type="text"
                            value={profile.officeLocation}
                            onChange={(e) => setProfile({ ...profile, officeLocation: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Office Hours</label>
                          <input
                            type="text"
                            value={profile.officeHours}
                            onChange={(e) => setProfile({ ...profile, officeHours: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                          />
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Bio / Introduction</label>
                      <textarea
                        rows="4"
                        placeholder="Tell your students a bit about your background..."
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-2 flex justify-end">
                       <button disabled={saving} type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          {saving ? 'Saving...' : 'Save Changes'}
                       </button>
                    </div>
                 </form>
              </Card>
           </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorProfilePage;