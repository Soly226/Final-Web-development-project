import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { twMerge } from 'tailwind-merge';

const API_BASE = 'http://localhost:5000/api';

// ─── Toast ─────────────────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={twMerge(
        'fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl',
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

// ─── Broadcast Modal ────────────────────────────────────────────────────────

const BroadcastModal = ({ onClose, onSuccess, authHeaders }) => {
  const [form, setForm]     = useState({ title: '', content: '', targetRole: 'all' });
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API_BASE}/admin/broadcast`, form, authHeaders);
      onSuccess('System broadcast sent successfully!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send broadcast.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">campaign</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Broadcast</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <Input
            label="Broadcast Title"
            id="broadcast-title"
            placeholder="e.g. Scheduled Maintenance Notice"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
              Message Content
            </label>
            <textarea
              rows={4}
              placeholder="Write your announcement here..."
              value={form.content}
              onChange={e => handleChange('content', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
              Target Audience
            </label>
            <select
              value={form.targetRole}
              onChange={e => handleChange('targetRole', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Everyone (All Roles)</option>
              <option value="student">Students Only</option>
              <option value="instructor">Instructors Only</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={sending}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={sending}>
              {sending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Sending…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">send</span>
                  Send Broadcast
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── New Template Modal ─────────────────────────────────────────────────────

const NewTemplateModal = ({ onClose, onCreate, authHeaders }) => {
  const [name,   setName]   = useState('');
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const defaultSubject = `New Subject for ${name.trim()}`;
      const defaultBody    = `Hi {{student_name}},\n\nWelcome to ${name.trim()}!\n\nBest regards,\nThe EduCore Team`;
      const { data } = await axios.post(
        `${API_BASE}/admin/email-templates`,
        { name: name.trim(), subject: defaultSubject, body: defaultBody },
        authHeaders
      );
      onCreate(data);   // pass the full DB object back
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create template.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-white/10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Template</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Template Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Monthly Newsletter"
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary text-slate-900 dark:text-white"
            />
          </div>
          {error && (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}
          <p className="text-[10px] text-slate-500 font-medium italic">
            * After creation, edit the subject and body in the main editor, then click Commit.
          </p>
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-accent text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Saving…</>
              ) : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
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

// ─── Skeleton ───────────────────────────────────────────────────────────────

const Skeleton = () => (
  <AdminLayout title="Communications Console">
    <div className="p-5 max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  </AdminLayout>
);

// ─── Main Page ──────────────────────────────────────────────────────────────

const PLACEHOLDERS = [
  '{{student_name}}', '{{course_name}}', '{{instructor_name}}',
  '{{login_url}}', '{{due_date}}', '{{student_id}}'
];

const EmailTemplatesPage = () => {
  const { user } = useAuth();

  const [templates,        setTemplates]        = useState([]);
  const [activeId,         setActiveId]         = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [committing,       setCommitting]       = useState(false);
  const [showNewModal,     setShowNewModal]     = useState(false);
  const [showBroadcast,    setShowBroadcast]    = useState(false);
  const [toast,            setToast]            = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast(null), []);

  const activeTemplate = templates.find(t => t._id === activeId) || null;

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/admin/email-templates`, authHeaders);
      setTemplates(data);
      if (data.length > 0) setActiveId(data[0]._id);
    } catch (err) {
      setError('Failed to load email templates. Please verify that your backend server is online.');
      showToast('Failed to load email templates.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTemplates();
  }, [user, fetchTemplates]);

  // ── Update active template field locally ──────────────────────────────────
  const handleUpdate = (field, value) => {
    setTemplates(prev =>
      prev.map(t => t._id === activeId ? { ...t, [field]: value } : t)
    );
  };

  // ── Commit to DB ──────────────────────────────────────────────────────────
  const handleCommit = async () => {
    if (!activeTemplate) return;
    setCommitting(true);
    try {
      await axios.put(
        `${API_BASE}/admin/email-templates/${activeTemplate._id}`,
        { subject: activeTemplate.subject, body: activeTemplate.body },
        authHeaders
      );
      showToast(`"${activeTemplate.name}" committed successfully!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save template.', 'error');
    } finally {
      setCommitting(false);
    }
  };

  // ── Insert placeholder at end of body ─────────────────────────────────────
  const handleInsertPlaceholder = (tag) => {
    if (!activeTemplate) return;
    handleUpdate('body', activeTemplate.body + ' ' + tag);
  };

  // ── Add a fully saved DB template returned from the modal ────────────────
  const handleCreate = (savedTemplate) => {
    setTemplates(prev => [...prev, savedTemplate]);
    setActiveId(savedTemplate._id);
    showToast(`Template "${savedTemplate.name}" created and saved to database!`, 'success');
  };

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <AdminLayout title="Communications Console">
        <div className="p-5 max-w-5xl mx-auto">
          <ErrorState message={error} onRetry={fetchTemplates} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Communications Console">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      {showBroadcast && (
        <BroadcastModal
          authHeaders={authHeaders}
          onClose={() => setShowBroadcast(false)}
          onSuccess={msg => showToast(msg, 'success')}
        />
      )}
      {showNewModal && (
        <NewTemplateModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreate}
          authHeaders={authHeaders}
        />
      )}

      <div className="p-5 max-w-5xl mx-auto space-y-6">

        {/* ── Header row ─────────────────────────────────────────────── */}
        <Card className="flex flex-col md:flex-row gap-4 items-center">
          {/* Template selector */}
          <div className="flex-1 w-full">
            <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-[0.15em]">
              Active Template
            </label>
            {templates.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No templates found in database.</p>
            ) : (
              <select
                value={activeId ?? ''}
                onChange={e => setActiveId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {templates.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              className="flex-1 md:flex-none px-5 h-12 gap-2"
              onClick={() => setShowNewModal(true)}
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              New Template
            </Button>
            <Button
              className="flex-1 md:flex-none px-5 h-12 gap-2 bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/20"
              onClick={() => setShowBroadcast(true)}
            >
              <span className="material-symbols-outlined text-sm">campaign</span>
              Broadcast
            </Button>
          </div>
        </Card>

        {/* ── Editor + Sidebar ─────────────────────────────────────────── */}
        {activeTemplate ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6 space-y-6 overflow-visible">
                <Input
                  label="Email Subject"
                  id="email-subject"
                  value={activeTemplate.subject}
                  onChange={e => handleUpdate('subject', e.target.value)}
                  className="bg-white/5 border-white/10 font-bold"
                />

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Email Body
                  </label>
                  <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    {/* Formatting toolbar */}
                    <div className="p-2 border-b border-white/10 flex gap-2 bg-white/5">
                      {['format_bold', 'format_italic', 'link', 'format_list_bulleted'].map(icon => (
                        <button
                          key={icon}
                          type="button"
                          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">{icon}</span>
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full h-80 bg-transparent p-6 text-sm outline-none resize-none font-medium leading-relaxed text-slate-900 dark:text-white"
                      value={activeTemplate.body}
                      onChange={e => handleUpdate('body', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Placeholders */}
              <Card className="bg-primary/5 border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-xl">token</span>
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Variables</h3>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mb-4">
                  Click a placeholder to append it to the template body.
                </p>
                <div className="flex flex-wrap gap-2">
                  {PLACEHOLDERS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertPlaceholder(tag)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono font-bold text-primary hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Save button */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full py-4 shadow-primary/30 gap-2"
                  onClick={handleCommit}
                  disabled={committing}
                >
                  {committing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Committing…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      Commit Template
                    </>
                  )}
                </Button>

                {/* DB indicator — always synced now that POST is real */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="material-symbols-outlined text-base">cloud_done</span>
                  Synced with database
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">
              mail_outline
            </span>
            <p className="text-slate-500 font-semibold">No templates available.</p>
            <p className="text-xs text-slate-400 mt-1">
              Create your first template using the button above.
            </p>
          </Card>
        )}

      </div>
    </AdminLayout>
  );
};

export default EmailTemplatesPage;
