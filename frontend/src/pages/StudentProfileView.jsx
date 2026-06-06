import React, { useState, useEffect } from 'react';
import StudentLayout from '../layouts/StudentLayout';
import apiClient from '../lib/apiClient';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function StudentProfileView() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/api/student/me');
      setProfile(data);
      setUsername(data.username || '');
      setEmail(data.email || '');
      setDepartment(data.department || '');
      setLevel(data.level || '');
    } catch (err) {
      showToast('Failed to load profile data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/api/student/me', {
        username,
        email,
        department,
        level,
      });
      showToast('Profile updated successfully!', 'success');
      setIsEditModalOpen(false);
      fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const badges = [
    { icon: 'military_tech', label: 'Perfect Score', color: 'from-amber-400 to-yellow-500', earned: true },
    { icon: 'schedule', label: 'Calendar Master', color: 'from-blue-400 to-indigo-500', earned: true },
    { icon: 'speed', label: 'Fast Learner', color: 'from-emerald-400 to-teal-500', earned: true },
    { icon: 'groups', label: 'Team Player', color: 'from-purple-400 to-pink-500', earned: false },
    { icon: 'psychology', label: 'Deep Thinker', color: 'from-cyan-400 to-blue-500', earned: false },
    { icon: 'star', label: 'Top Student', color: 'from-rose-400 to-orange-500', earned: false },
  ];

  const activityLog = [
    { icon: 'assignment_turned_in', text: 'Submitted HW1 - Grid System', time: '2 hours ago', color: 'bg-emerald-500' },
    { icon: 'forum', text: 'Posted a question in Web Development stream', time: '1 day ago', color: 'bg-primary' },
    { icon: 'done_all', text: 'Completed quiz: CSS Variables', time: '3 days ago', color: 'bg-indigo-500' },
  ];

  return (
    <StudentLayout title="Student Profile">
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="bg-primary/10 text-primary rounded-full h-24 w-24 border-4 border-primary/20 flex items-center justify-center font-extrabold text-3xl">
                {profile?.initials || (profile?.full_name ? profile.full_name.charAt(0) : 'S')}
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white dark:border-slate-900 h-4.5 w-4.5 rounded-full"></div>
            </div>
            
            {loading ? (
              <div className="space-y-2 text-center sm:text-left">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-4 w-40 rounded-full" />
              </div>
            ) : (
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {profile?.full_name || 'Alex Rivera'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  {profile?.department || 'Computer Science'} • {profile?.level || 'Junior'}
                </p>
                <div className="inline-flex items-center mt-2 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                  Active Student
                </div>
              </div>
            )}
          </div>

          {!loading && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-accent text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-primary/10"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profile
            </button>
          )}
        </div>

        {/* Academic Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black mb-1 uppercase tracking-wider">GPA</p>
            <p className="text-lg font-black text-primary">
              {loading ? <Skeleton className="h-5 w-10 mx-auto rounded-full" /> : (profile?.GPA ? profile.GPA.toFixed(2) : '3.82')}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black mb-1 uppercase tracking-wider">Credits</p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">120/144</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black mb-1 uppercase tracking-wider">Ranking</p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">Top 5%</p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Personal Information</h3>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-500 text-lg">mail</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-500 text-lg">badge</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Username</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile?.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-500 text-lg">id_card</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Student ID</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile?.student_id}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Enrollments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Active Enrollments</h3>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : !profile?.enrolled_courses || profile.enrolled_courses.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">No active enrollments found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.enrolled_courses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">menu_book</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{course.course_name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{course.course_code}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements / Badges Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Achievements</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  b.earned
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20'
                    : 'opacity-40 border-dashed border-slate-300 dark:border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md ${
                    b.earned ? b.color : 'from-slate-300 to-slate-400 dark:from-slate-650 dark:to-slate-750'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {b.icon}
                  </span>
                </div>
                <p className="text-[9px] font-bold text-slate-750 dark:text-slate-300 text-center leading-tight">
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {activityLog.map((act, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/40 dark:bg-slate-950/10 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${act.color}`}>
                  <span className="material-symbols-outlined text-sm">{act.icon}</span>
                </div>
                <p className="flex-1 text-xs font-semibold text-slate-750 dark:text-slate-300 leading-snug">{act.text}</p>
                <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Edit Profile</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/45 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/45 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/45 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase mb-1">Year / Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/45 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-primary hover:bg-accent disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md shadow-primary/10 flex items-center gap-1.5"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
