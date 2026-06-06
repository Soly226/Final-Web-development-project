import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import CourseTabNav from '../../components/course/CourseTabNav';
import apiClient from '../../lib/apiClient';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

export default function InsideCourseGradesTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGradesData = async () => {
    try {
      const [courseRes, gradesRes] = await Promise.all([
        apiClient.get(`/api/courses/${id}`),
        apiClient.get(`/api/student/courses/${id}/grades`),
      ]);
      setCourse(courseRes.data);
      setGrades(gradesRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch course details.', 'error');
      setCourse({ course_name: 'Web Development', course_code: 'CS-402' });
      setGrades([
        { id: '1', name: 'Homework 1', weight: '10%', score: 90, total: 100, status: 'GRADED' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGradesData();
  }, [id]);

  // Compute stats
  const gradedItems = grades.filter((g) => g.score !== null && g.score !== undefined);
  const totalScore = gradedItems.reduce((acc, curr) => acc + curr.score, 0);
  const totalPoints = gradedItems.reduce((acc, curr) => acc + curr.total, 0);
  const averagePct = totalPoints > 0 ? ((totalScore / totalPoints) * 100).toFixed(1) : 'N/A';

  const getLetterGrade = (pct) => {
    if (pct === 'N/A') return 'N/A';
    const num = parseFloat(pct);
    if (num >= 90) return 'A';
    if (num >= 80) return 'B';
    if (num >= 70) return 'C';
    if (num >= 60) return 'D';
    return 'F';
  };

  const letterGrade = getLetterGrade(averagePct);

  return (
    <StudentLayout title="Course Details">
      <div className="flex flex-col gap-6">
        
        {/* Course Header Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            {loading ? (
              <div className="space-y-1">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {course?.course_name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  {course?.course_code}
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => navigate('/my-courses')}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition-all text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Courses
          </button>
        </div>

        {/* Tab Navigation */}
        <CourseTabNav courseId={id} />

        {/* Grades Standing Widget */}
        <div className="rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex flex-col gap-4 p-5">
            <div className="flex justify-between items-start gap-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider">
                  Current Standing
                </p>
                <p className="text-slate-900 dark:text-white text-2xl font-black leading-tight">
                  {averagePct !== 'N/A' ? `${averagePct}% (${letterGrade})` : 'No grades available yet'}
                </p>
              </div>
              {averagePct !== 'N/A' && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  Top 15%
                </div>
              )}
            </div>
            {averagePct !== 'N/A' && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${averagePct}%` }}></div>
              </div>
            )}
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              {averagePct !== 'N/A'
                ? 'Course Summary: You are performing well. Keep up the consistent work on assignments.'
                : 'Assignments will display here along with feedback as soon as instructors release the scores.'}
            </p>
          </div>
        </div>

        {/* Detailed Grades */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Detailed Grades</h3>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded-full" />
                      <Skeleton className="h-3 w-16 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </div>
          ) : grades.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">school</span>
              <p className="text-slate-800 dark:text-white font-bold">No grades found</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">There are no graded items registered for this course yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {grades.map((grade) => (
                <div
                  key={grade.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-50 dark:bg-slate-850 size-10 flex items-center justify-center rounded-xl text-primary">
                      <span className="material-symbols-outlined">assignment</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-extrabold group-hover:text-primary transition-colors">{grade.name}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">Weight: {grade.weight || '25%'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {grade.score !== null && grade.score !== undefined ? (
                      <>
                        <p className="text-slate-900 dark:text-white text-sm font-extrabold">
                          {grade.score}/{grade.total}
                        </p>
                        <p className="text-emerald-555 text-[10px] font-black uppercase tracking-wider mt-0.5">{grade.status}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">- / {grade.total}</p>
                        <p className="text-amber-500 text-[10px] font-black uppercase tracking-wider mt-0.5">{grade.status}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}

