import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SettingsSection = ({ title, icon, children }) => (
  <Card className="p-0 overflow-hidden border-white/5">
    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <h3 className="font-bold text-sm tracking-tight">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </Card>
);

const SystemSettingsPage = () => {
  const logoInputRef = React.useRef(null);

  const handleSave = () => {
    alert("Configuration changes saved successfully!");
  };

  return (
    <AdminLayout title="System Configuration">
      <div className="p-5 max-w-4xl mx-auto space-y-8">
        
        {/* Header Intro */}
        <div className="px-1">
          <h2 className="text-2xl font-extrabold tracking-tight">System Settings</h2>
          <p className="text-sm text-slate-500 font-medium">Global parameters and security protocols for the LMS.</p>
        </div>

        {/* General Settings */}
        <SettingsSection title="General branding" icon="public">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Platform Name" placeholder="EduCore LMS" defaultValue="EduCore LMS" className="bg-white/5 border-white/10" />
            <div className="space-y-1.5">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">Primary Language</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Platform Logo</label>
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Upload New Logo</p>
                  <input type="file" className="hidden" ref={logoInputRef} accept="image/*" />
                  <Button variant="secondary" className="py-2 px-4 text-xs font-black" onClick={() => logoInputRef.current?.click()}>
                    Replace Asset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title="Security & Authentication" icon="shield">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="max-w-[70%]">
                <p className="font-bold text-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Force all admin and instructor accounts to use 2FA for increased security.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">Session Timeout</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none">
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>4 Hours</option>
                </select>
              </div>
              <Input label="Max Login Attempts" type="number" defaultValue="5" className="bg-white/5 border-white/10" />
            </div>
          </div>
        </SettingsSection>

        {/* Email/SMTP */}
        <SettingsSection title="Email Configuration (SMTP)" icon="mail">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="SMTP Host" placeholder="smtp.provider.com" className="md:col-span-2 bg-white/5 border-white/10" />
            <Input label="Port" type="number" defaultValue="587" className="bg-white/5 border-white/10" />
          </div>
        </SettingsSection>

        {/* Action Footer */}
        <div className="flex justify-end gap-3 pt-4 pb-10">
          <Button variant="secondary" className="px-8">Cancel Changes</Button>
          <Button className="px-12 shadow-xl shadow-primary/30" onClick={handleSave}>Save Configuration</Button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default SystemSettingsPage;
