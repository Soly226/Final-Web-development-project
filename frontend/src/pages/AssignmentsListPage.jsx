import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import apiClient from '../lib/apiClient';
import Skeleton from '../components/ui/Skeleton';

export default function AssignmentsListPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.get('/api/student/assignments');
      setAssignments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter assignments based on search term and active tab
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.code.toLowerCase().includes(searchTerm.toLowerCase());

    const status = assignment.submission?.status;

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') {
      return matchesSearch && (status === 'Not Submitted' || status === 'Overdue');
    }
    if (activeTab === 'submitted') {
      return matchesSearch && status === 'Submitted';
    }
    if (activeTab === 'graded') {
      return matchesSearch && status === 'Graded';
    }
    return matchesSearch;
  });

  return (
    <StudentLayout title="Assignments">
      <div className="flex flex-col gap-6">
        
        {/* Page Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Assignments
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              View and submit assignments for your enrolled courses.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/40 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl self-start overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Assignments' },
            { id: 'pending', label: 'Pending' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'graded', label: 'Graded' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Assignments Listing */}
        <div className="space-y-4">
          {loading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 rounded-full w-24" />
                    <Skeleton className="h-5 rounded-full w-16" />
                  </div>
                  <Skeleton className="h-6 rounded-full w-3/5" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 rounded-full w-40" />
                    <Skeleton className="h-9 rounded-xl w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <span className="material-symbols-outlined text-rose-500 text-4xl mb-3">error_outline</span>
              <p className="text-slate-800 dark:text-white font-bold mb-1">Failed to load assignments</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">{error}</p>
              <button
                onClick={fetchAssignments}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredAssignments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8">
              <span className="material-symbols-outlined text-slate-400 text-4xl mb-3">assignment_late</span>
              <p className="text-slate-800 dark:text-white font-bold mb-1">No assignments found</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                {searchTerm ? 'Try adjusting your search query.' : 'You have no assignments listed in this category.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredAssignments.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {filteredAssignments.map((assignment) => {
                const status = assignment.submission?.status;
                const score = assignment.submission?.grade;
                const total = assignment.total_marks;

                let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                if (status === 'Graded') {
                  badgeColor = 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400';
                } else if (status === 'Submitted') {
                  badgeColor = 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light';
                } else if (status === 'Overdue') {
                  badgeColor = 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400';
                } else if (status === 'Not Submitted') {
                  badgeColor = 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
                }

                return (
                  <div
                    key={assignment._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          {assignment.course.code}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          • {assignment.course.name}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {assignment.title}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          Due: {formatDate(assignment.deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">grade</span>
                          Points: {total}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">person</span>
                          {assignment.instructor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${badgeColor}`}>
                        {status === 'Graded' ? `Graded: ${score}/${total}` : status}
                      </span>
                      
                      <Link
                        to={`/assignment/${assignment._id}`}
                        className="px-4 py-2 bg-primary hover:bg-accent text-white text-xs font-black rounded-xl shadow-md shadow-primary/10 transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        Details
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
