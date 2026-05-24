import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseAssignments } from '../../../data/pages/student/InsideCourseAssignmentsPage.data';

export const useInsideCourseAssignments = () => {
  const { id } = useParams();
  const [filter, setFilter] = useState('All');
  const course = courseAssignments[id] || courseAssignments[1];

  const filtered = course.assignments.filter(a => filter === 'All' || a.status === filter.toLowerCase());

  const graded = course.assignments.filter(a => a.status === 'graded');
  const avgGrade = graded.length ? Math.round(graded.reduce((s, a) => s + (a.grade / a.points) * 100, 0) / graded.length) : null;

  const getGradeColor = (pct) => {
    if (!pct && pct !== 0) return 'text-slate-400';
    if (pct >= 90) return 'text-emerald-500';
    if (pct >= 75) return 'text-primary';
    if (pct >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  return {
    id,
    filter,
    setFilter,
    course,
    filtered,
    graded,
    avgGrade,
    getGradeColor
  };
};
