import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { twMerge } from 'tailwind-merge';

const API_BASE = 'http://localhost:5000/api';

// ─── Reusable sub-components ───────────────────────────────────────────────

const SettingsSection = ({ title, icon, children }) => (
  <Card className="p-0 overflow-hidden border-white/5 transition-all hover:-translate-y-0">
    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </Card>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
    <div className="max-w-[70%]">
      <p className="font-bold text-sm text-slate-900 dark:text-white">{label}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={twMerge(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none',
        checked ? 'bg-primary' : 'bg-slate-600 dark:bg-slate-700'
      )}
    >
      <span
        className={twMerge(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  </div>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={twMerge(
        'fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all animate-fade-in-up',
        type === 'success'
          ? 'bg-emerald-500/90 border-emerald-400/30 text-white'
          : 'bg-rose-500/90 border-rose-400/30 text-white'
      )}
    >
      <span className="material-symbols-outlined text-xl">
        {type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};

// ─── Error State ────────────────────────────────────────────────────────────

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto glass rounded-2xl border border-rose-500/20 bg-rose-500/5 mt-8">
    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-3xl">error_outline</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connection Error</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} className="gap-2 px-6 shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-sm">refresh</span>
        Retry Connection
      </Button>
    )}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────

const SystemSettingsPage = () => {
  const { user } = useAuth();
  const logoInputRef = React.useRef(null);

  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  const [saving,  setSaving]    = useState(false);
  const [toast,   setToast]     = useState(null); // { message, type }

  // Form state — mirrors SystemSetting model
  const [form, setForm] = useState({
    platformName:          'EduCore LMS',
    primaryLanguage:       'English (US)',
    twoFactorEnabled:      false,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts:      5,
    smtpHost:              '',
    smtpPort:              587,
  });

  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast(null), []);

  // ── Fetch on mount ──────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/admin/settings`, authHeaders);
      setForm({
        platformName:          data.platformName          ?? 'EduCore LMS',
        primaryLanguage:       data.primaryLanguage       ?? 'English (US)',
        twoFactorEnabled:      data.twoFactorEnabled      ?? false,
        sessionTimeoutMinutes: data.sessionTimeoutMinutes ?? 30,
        maxLoginAttempts:      data.maxLoginAttempts      ?? 5,
        smtpHost:              data.smtpHost              ?? '',
        smtpPort:              data.smtpPort              ?? 587,
      });
    } catch (err) {
      setError('Failed to fetch system settings. Please verify the backend service is running.');
      showToast('Failed to load settings from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchSettings();
  }, [user, fetchSettings]);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/admin/settings`, form, authHeaders);
      showToast('Configuration saved successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/admin/settings`, authHeaders);
      setForm({
        platformName:          data.platformName,
        primaryLanguage:       data.primaryLanguage,
        twoFactorEnabled:      data.twoFactorEnabled,
        sessionTimeoutMinutes: data.sessionTimeoutMinutes,
        maxLoginAttempts:      data.maxLoginAttempts,
        smtpHost:              data.smtpHost,
        smtpPort:              data.smtpPort,
      });
      showToast('Changes discarded.', 'success');
    } catch {
      showToast('Could not revert changes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Skeleton ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout title="System Configuration">
        <div className="p-5 max-w-4xl mx-auto space-y-8 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <AdminLayout title="System Configuration">
        <div className="p-5 max-w-4xl mx-auto">
          <ErrorState message={error} onRetry={fetchSettings} />
        </div>
      </AdminLayout>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="System Configuration">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <form onSubmit={handleSave}>
        <div className="p-5 max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <div className="px-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              System Settings
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Global parameters and security protocols for the LMS. Changes are persisted to the database.
            </p>
          </div>

          {/* ── General Branding ────────────────────────────────────── */}
          <SettingsSection title="General Branding" icon="public">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Platform Name"
                id="platformName"
                value={form.platformName}
                onChange={e => handleChange('platformName', e.target.value)}
                placeholder="EduCore LMS"
                className="bg-white/5 border-white/10"
              />

              <div className="space-y-1.5">
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Primary Language
                </label>
                <select
                  value={form.primaryLanguage}
                  onChange={e => handleChange('primaryLanguage', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Arabic</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
                  Platform Logo
                </label>
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Upload New Logo
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      ref={logoInputRef}
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="py-2 px-4 text-xs font-black"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      Replace Asset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* ── Security ────────────────────────────────────────────── */}
          <SettingsSection title="Security & Authentication" icon="shield">
            <div className="space-y-6">
              <Toggle
                label="Two-Factor Authentication (2FA)"
                description="Force all admin and instructor accounts to use 2FA for increased security."
                checked={form.twoFactorEnabled}
                onChange={val => handleChange('twoFactorEnabled', val)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                    Session Timeout
                  </label>
                  <select
                    value={form.sessionTimeoutMinutes}
                    onChange={e => handleChange('sessionTimeoutMinutes', Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={240}>4 Hours</option>
                  </select>
                </div>

                <Input
                  label="Max Login Attempts"
                  id="maxLoginAttempts"
                  type="number"
                  min={1}
                  max={20}
                  value={form.maxLoginAttempts}
                  onChange={e => handleChange('maxLoginAttempts', Number(e.target.value))}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          </SettingsSection>

          {/* ── SMTP ────────────────────────────────────────────────── */}
          <SettingsSection title="Email Configuration (SMTP)" icon="mail">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="SMTP Host"
                id="smtpHost"
                placeholder="smtp.provider.com"
                value={form.smtpHost}
                onChange={e => handleChange('smtpHost', e.target.value)}
                className="md:col-span-2 bg-white/5 border-white/10"
              />
              <Input
                label="Port"
                id="smtpPort"
                type="number"
                value={form.smtpPort}
                onChange={e => handleChange('smtpPort', Number(e.target.value))}
                className="bg-white/5 border-white/10"
              />
            </div>
          </SettingsSection>

          {/* ── Action Footer ────────────────────────────────────────── */}
          <div className="flex justify-end gap-3 pt-4 pb-10">
            <Button
              type="button"
              variant="secondary"
              className="px-8"
              onClick={handleCancel}
              disabled={saving}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              className="px-12 shadow-xl shadow-primary/30 gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Configuration
                </>
              )}
            </Button>
          </div>

        </div>
      </form>
    </AdminLayout>
  );
};

export default SystemSettingsPage;
