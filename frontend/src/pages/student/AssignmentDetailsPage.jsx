import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';

const assignmentsData = {
  1: {
    id: 1, title: 'API Integration Lab', course: 'Advanced React 2024', type: 'Lab',
    dueDate: 'April 14, 2026 — 11:59 PM', points: 100, weight: '10%',
    status: 'pending',
    color: 'from-primary to-accent', icon: 'code',
    description: `In this lab, you will build a fully functional weather dashboard that fetches data from a public REST API using React. The goal is to practice data fetching with useEffect, state management with useState, and proper error/loading state handling.\n\nYour application should:\n- Connect to the OpenWeatherMap API (free tier)\n- Display current weather for a user-searched city\n- Show a 5-day forecast with appropriate icons\n- Handle loading and error states gracefully\n- Be responsive across screen sizes`,
    requirements: [
      'Use React functional components with hooks only',
      'Implement proper loading and error states',
      'Handle API errors gracefully (invalid city, network errors)',
      'Style with Tailwind CSS — no inline styles',
      'Include a README with setup instructions',
      'Submit as a GitHub repository link',
    ],
    rubric: [
      { item: 'API Integration & Functionality', points: 40 },
      { item: 'Component Design & Reusability', points: 25 },
      { item: 'Error & Loading State Handling', points: 20 },
      { item: 'Code Quality & Comments', points: 10 },
      { item: 'README Documentation', points: 5 },
    ],
    attachments: [
      { name: 'lab_starter_template.zip', size: '2.4 MB', icon: 'folder_zip' },
      { name: 'api_documentation.pdf', size: '1.1 MB', icon: 'picture_as_pdf' },
    ],
  },
  2: {
    id: 2, title: 'Midterm Quiz #2', course: 'Data Structures & Algorithms', type: 'Quiz',
    dueDate: 'April 15, 2026 — 9:00 AM', points: 50, weight: '15%',
    status: 'pending',
    color: 'from-violet-500 to-purple-500', icon: 'quiz',
    description: 'This quiz covers Binary Search Trees (BST), AVL Trees, and basic graph algorithms (BFS/DFS). You will have 45 minutes to complete 25 multiple-choice questions. The quiz will be available at exactly 9:00 AM and will auto-submit at 9:45 AM.',
    requirements: [
      '25 multiple-choice questions',
      '45 minutes time limit — auto-submits',
      'No collaboration allowed (monitored)',
      'Covers modules 5–8 from the course material',
      'One attempt only',
    ],
    rubric: [
      { item: 'BST Operations & Properties', points: 15 },
      { item: 'AVL Tree Rotations', points: 15 },
      { item: 'BFS / DFS Traversal', points: 15 },
      { item: 'Complexity Analysis', points: 5 },
    ],
    attachments: [
      { name: 'study_guide_modules_5_8.pdf', size: '3.2 MB', icon: 'picture_as_pdf' },
    ],
  },
};

const statusConfig = {
  pending: { label: 'Not Submitted', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: 'schedule' },
  submitted: { label: 'Submitted', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: 'check_circle' },
  graded: { label: 'Graded', color: 'bg-primary/10 text-primary border-primary/20', icon: 'grade' },
  late: { label: 'Late', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20', icon: 'warning' },
};

const typeConfig = {
  Lab: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Quiz: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Assignment: 'bg-primary/10 text-primary',
  Exam: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const AssignmentDetailsPage = () => {
  const { id } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');

  const assignment = assignmentsData[id] || assignmentsData[1];
  const statusCfg = statusConfig[submitted ? 'submitted' : assignment.status];

  return (
    <StudentLayout title="Assignment Details">
      <div className="p-5 flex flex-col gap-5 max-w-3xl mx-auto">

        {/* Back */}
        <Link to="/student/courses" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors w-fit group">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Courses
        </Link>

        {/* Assignment Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
              <span className="material-symbols-outlined text-3xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>{assignment.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={twMerge('text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 border border-white/30', '')}>{assignment.course}</span>
                <span className={twMerge('text-[10px] font-black uppercase px-2 py-0.5 rounded-full', typeConfig[assignment.type])}>{assignment.type}</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">{assignment.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-white/80 text-xs font-semibold flex-wrap">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">schedule</span>{assignment.dueDate}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">valorant</span>{assignment.points} pts · {assignment.weight}</span>
              </div>
            </div>
          </div>
          {/* Status Badge */}
          <div className={twMerge('mt-4 relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold', statusCfg.color)}>
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{statusCfg.icon}</span>
            {statusCfg.label}
          </div>
        </div>

        {/* Description */}
        <Card className="p-5" hover={false}>
          <h2 className="text-slate-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            Description
          </h2>
          <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {assignment.description}
          </div>
        </Card>

        {/* Requirements */}
        <Card className="p-5" hover={false}>
          <h2 className="text-slate-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
            Requirements
          </h2>
          <ul className="flex flex-col gap-2">
            {assignment.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-black mt-0.5">{i + 1}</span>
                {req}
              </li>
            ))}
          </ul>
        </Card>

        {/* Rubric */}
        <Card className="p-5" hover={false}>
          <h2 className="text-slate-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
            Grading Rubric
          </h2>
          <div className="flex flex-col gap-2">
            {assignment.rubric.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 dark:border-white/5 last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-300">{r.item}</span>
                <span className="text-sm font-black text-primary flex-shrink-0 ml-4">{r.points} pts</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 font-black">
              <span className="text-sm text-slate-900 dark:text-white">Total</span>
              <span className="text-sm text-primary">{assignment.points} pts</span>
            </div>
          </div>
        </Card>

        {/* Attachments */}
        {assignment.attachments?.length > 0 && (
          <Card className="p-5" hover={false}>
            <h2 className="text-slate-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>attach_file</span>
              Attachments
            </h2>
            <div className="flex flex-col gap-2">
              {assignment.attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{file.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{file.name}</p>
                    <p className="text-[11px] text-slate-500">{file.size}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">download</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Submission Panel */}
        {!submitted ? (
          <Card className="p-5 border-2 border-primary/20" hover={false}>
            <h2 className="text-slate-900 dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>upload</span>
              Submit Your Work
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Submission Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourname/project"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Note to Instructor (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add any notes about your submission..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => { if (link.trim()) setSubmitted(true); }}
                  disabled={!link.trim()}
                  className="flex-1 py-3.5"
                >
                  <span className="material-symbols-outlined text-xl mr-2">send</span>
                  Submit Assignment
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 glass rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-lg">Submitted Successfully!</p>
              <p className="text-slate-500 text-sm mt-1">Your work has been received. Your instructor will review it shortly.</p>
            </div>
            <p className="text-[11px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg truncate max-w-xs">{link}</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default AssignmentDetailsPage;
