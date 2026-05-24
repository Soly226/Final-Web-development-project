import { useState } from 'react';
import { allCourses } from '../../../data/pages/student/MyCoursesPage.data';

export const useMyCourses = () => {
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All Categories');
  const [view, setView] = useState('grid');

  const filtered = allCourses.filter((c) => {
    const tagMatch = filter === 'All' || c.tag === filter;
    const catMatch = category === 'All Categories' || c.category === category;
    return tagMatch && catMatch;
  });

  return {
    filter,
    setFilter,
    category,
    setCategory,
    view,
    setView,
    filtered,
    allCourses
  };
};
