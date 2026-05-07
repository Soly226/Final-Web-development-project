import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const INITIAL_TEMPLATES = {
  'enrollment': {
    name: 'New Course Enrollment',
    subject: 'Welcome to {{course_name}}!',
    body: `Hi {{student_name}},

Congratulations! You have been successfully enrolled in the course: {{course_name}}.

We are excited to have you on board. You can start your learning journey immediately by clicking the link below:

{{login_url}}

Best regards,
The EduCore Learning Team`
  },
  'reminder': {
    name: 'Assignment Due Reminder',
    subject: 'Gentle Reminder: Your assignment for {{course_name}} is due soon',
    body: `Hello {{student_name}},

This is a friendly reminder that your assignment for {{course_name}} is due on {{due_date}}.

Please make sure to submit your work on time to avoid any penalties. If you have any questions, feel free to reach out to {{instructor_name}}.

Good luck!
The EduCore Team`
  },
  'grading': {
    name: 'Grade Published',
    subject: 'Your grade for {{course_name}} has been published',
    body: `Greetings {{student_name}},

Your grade for the recent assessment in {{course_name}} is now available for review.

Log in to your dashboard to see your performance and feedback:
{{login_url}}

Keep up the great work!
Best,
{{instructor_name}}`
  },
  'welcome': {
    name: 'Welcome Email',
    subject: 'Welcome to the EduCore Platform!',
    body: `Hi {{student_name}},

Welcome to EduCore! We are thrilled to have you join our learning community.

To get started, please log in and explore your dashboard:
{{login_url}}

If you need any assistance, our support team is always here to help.

Happy Learning!
The EduCore Team`
  }
};

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [activeId, setActiveId] = useState('enrollment');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const placeholders = ['{{student_name}}', '{{course_name}}', '{{instructor_name}}', '{{login_url}}', '{{due_date}}'];

  const currentTemplate = templates[activeId];

  const handleUpdate = (field, value) => {
    setTemplates(prev => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        [field]: value
      }
    }));
  };

  const handleInsertPlaceholder = (tag) => {
    handleUpdate('body', currentTemplate.body + ' ' + tag);
    alert(`Inserted ${tag} at the end of the template.`);
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newName = formData.get('template_name');
    const newId = newName.toLowerCase().replace(/\s+/g, '_');

    if (templates[newId]) {
      alert("A template with this name already exists.");
      return;
    }

    setTemplates(prev => ({
      ...prev,
      [newId]: {
        name: newName,
        subject: `New Subject for ${newName}`,
        body: `Hi {{student_name}},\n\nWelcome to ${newName}!\n\nBest regards,\nThe Team`
      }
    }));
    setActiveId(newId);
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Communications Console">
      <div className="p-5 max-w-5xl mx-auto space-y-6">
        
        {/* Template Selector Section */}
        <Card className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-[0.15em]">Active Template</label>
            <select 
              value={activeId}
              onChange={(e) => setActiveId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {Object.entries(templates).map(([id, t]) => (
                <option key={id} value={id}>{t.name}</option>
              ))}
            </select>
          </div>
          <Button variant="secondary" className="w-full md:w-auto px-6 h-12 gap-2" onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined text-sm">add_circle</span>
            New Template
          </Button>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 space-y-6 overflow-visible">
              <Input 
                label="Email Subject" 
                value={currentTemplate.subject} 
                onChange={(e) => handleUpdate('subject', e.target.value)}
                className="bg-white/5 border-white/10 font-bold" 
              />
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Body (HTML/Markdown Supported)</label>
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="p-2 border-b border-white/10 flex gap-2 bg-white/5">
                    {['format_bold', 'format_italic', 'link', 'format_list_bulleted', 'image'].map(icon => (
                      <button key={icon} type="button" onClick={() => alert(`Formatting tool: ${icon}`)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full h-80 bg-transparent p-6 text-sm outline-none resize-none font-medium leading-relaxed text-slate-900 dark:text-white"
                    value={currentTemplate.body}
                    onChange={(e) => handleUpdate('body', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Placeholders Sidebar */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-xl">token</span>
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Variables</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mb-4">Click a placeholder to insert it into your editor template.</p>
              <div className="flex flex-wrap gap-2">
                {placeholders.map(tag => (
                  <button key={tag} type="button" onClick={() => handleInsertPlaceholder(tag)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono font-bold text-primary hover:border-primary hover:bg-primary/5 transition-all">
                    {tag}
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button className="w-full py-4 shadow-primary/30 gap-2" onClick={() => alert(`Successfully committed changes for template: ${currentTemplate.name}`)}>
                <span className="material-symbols-outlined text-sm">save</span>
                Commit Template
              </Button>
              <Button variant="secondary" className="w-full py-4 gap-2" onClick={() => alert('Test email sent to your admin email address.')}>
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                Send Test
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* New Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Template</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddTemplate} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Template Name</label>
                <input 
                  name="template_name" 
                  required 
                  autoFocus
                  placeholder="e.g. Monthly Newsletter"
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary text-slate-900 dark:text-white" 
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium italic">* After creation, you can edit the subject and body in the main editor.</p>
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-accent text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all text-sm">Create Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default EmailTemplatesPage;
