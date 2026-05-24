import { useState } from 'react';
import { gradeData } from '../../../data/pages/student/MyGradesPage.data';

export const useMyGrades = () => {
  const [expanded, setExpanded] = useState(1);

  const getGradeColor = (pct) => {
    if (pct >= 90) return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500' };
    if (pct >= 75) return { text: 'text-primary', bg: 'bg-primary/10', ring: 'ring-primary' };
    if (pct >= 60) return { text: 'text-amber-500', bg: 'bg-amber-500/10', ring: 'ring-amber-500' };
    return { text: 'text-rose-500', bg: 'bg-rose-500/10', ring: 'ring-rose-500' };
  };

  const gpa = (gradeData.reduce((sum, c) => sum + c.overallGrade, 0) / gradeData.length / 25).toFixed(2);

  return {
    expanded,
    setExpanded,
    gpa,
    getGradeColor,
    gradeData
  };
};
