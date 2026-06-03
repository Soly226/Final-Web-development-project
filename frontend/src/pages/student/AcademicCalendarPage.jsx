import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import { twMerge } from 'tailwind-merge';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const events = [
  { id: 1, date: '2026-04-14', type: 'assignment', title: 'API Integration Lab', course: 'Advanced React', color: 'bg-primary', urgent: true },
  { id: 2, date: '2026-04-15', type: 'quiz', title: 'Midterm Quiz #2', course: 'Data Structures', color: 'bg-violet-500', urgent: true },
  { id: 3, date: '2026-04-16', type: 'lecture', title: 'State Management Live', course: 'Advanced React', color: 'bg-cyan-500', urgent: false },
  { id: 4, date: '2026-04-18', type: 'assignment', title: 'Linear Regression Report', course: 'Machine Learning', color: 'bg-orange-500', urgent: false },
  { id: 5, date: '2026-04-20', type: 'exam', title: 'Midterm Exam', course: 'Advanced React', color: 'bg-rose-500', urgent: false },
  { id: 6, date: '2026-04-22', type: 'lecture', title: 'Trees & Graphs — Part 2', course: 'Data Structures', color: 'bg-emerald-500', urgent: false },
  { id: 7, date: '2026-04-25', type: 'assignment', title: 'Final Project Submission', course: 'Data Structures', color: 'bg-violet-500', urgent: false },
  { id: 8, date: '2026-04-28', type: 'exam', title: 'Final Exam', course: 'Machine Learning', color: 'bg-rose-500', urgent: false },
  { id: 9, date: '2026-04-10', type: 'assignment', title: 'Component Design Lab', course: 'Advanced React', color: 'bg-primary', urgent: false },
  { id: 10, date: '2026-04-08', type: 'lecture', title: 'Intro to ML', course: 'Machine Learning', color: 'bg-orange-500', urgent: false },
];

const typeIcons = {
  assignment: 'assignment',
  quiz: 'quiz',
  lecture: 'live_tv',
  exam: 'description',
};

const typeColors = {
  assignment: 'bg-primary/10 text-primary border-primary/20',
  quiz: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  lecture: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  exam: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const AcademicCalendarPage = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1);
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const upcomingEvents = events
    .filter(e => e.date >= today.toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const isToday = (day) => {
    return today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
  };

  const trailing = (7 - ((firstDay + daysInMonth) % 7)) % 7;

  return (
    <StudentLayout title="Academic Calendar">
      <div className="p-5 flex flex-col gap-5 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tight">Academic Calendar</h2>
            <p className="text-slate-500 text-sm mt-0.5">Track deadlines, exams, and lectures</p>
          </div>
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold text-slate-500 capitalize">assignment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <span className="text-[10px] font-semibold text-slate-500 capitalize">quiz</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-[10px] font-semibold text-slate-500 capitalize">lecture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-[10px] font-semibold text-slate-500 capitalize">exam</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl border border-white/20 dark:border-white/10 p-5">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-5">
                <button aria-label="Previous month" onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary/10 text-slate-500 hover:text-primary transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h3 className="text-slate-900 dark:text-white font-extrabold text-lg">{MONTHS[currentMonth]} {currentYear}</h3>
                <button aria-label="Next month" onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary/10 text-slate-500 hover:text-primary transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400 py-1">{d}</div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for first week */}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="py-1.5" />)}

                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDate(day);
                  const hasEvents = dayEvents.length > 0;
                  const today_ = isToday(day);
                  const isSelected = selectedDate === day;

                  return (
                    <button
                      key={day}
                      aria-label={`Select ${MONTHS[currentMonth]} ${day}, ${currentYear}`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={twMerge(
                        'relative flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all group',
                        today_ ? 'bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20' :
                          isSelected ? 'bg-primary/15 text-primary ring-2 ring-primary/40' :
                            'hover:bg-primary/5 text-slate-700 dark:text-slate-300'
                      )}
                    >
                      <span className={twMerge('text-sm font-bold', today_ ? 'text-white' : '')}>{day}</span>
                      {hasEvents && (
                        <div className="flex gap-0.5 flex-wrap justify-center">
                          {dayEvents.slice(0, 3).map((e, j) => (
                            <span key={j} className={twMerge('w-1.5 h-1.5 rounded-full', e.color, today_ ? 'opacity-70' : '')} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Trailing empty cells so rows align */}
                {[...Array(trailing)].map((_, i) => <div key={`trail-${i}`} className="py-1.5" />)}
              </div>

              {/* Selected Day Events */}
              {selectedDate && (
                <div className="mt-5 pt-5 border-t border-white/10 dark:border-white/5">
                  <p className="text-sm font-black text-slate-900 dark:text-white mb-3">
                    {MONTHS[currentMonth]} {selectedDate}, {currentYear}
                    {selectedEvents.length === 0 && <span className="text-slate-400 font-normal ml-2">— No events</span>}
                  </p>
                  <div className="flex flex-col gap-2">
                    {selectedEvents.map((e) => (
                      <Link key={e.id} to={`/student/assignments/${e.id}`} className={twMerge('flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01]', typeColors[e.type])}>
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{typeIcons[e.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{e.title}</p>
                          <p className="text-[11px] opacity-70">{e.course}</p>
                        </div>
                        <span className="text-[10px] font-black uppercase capitalize px-2 py-0.5 bg-white/20 rounded-full">{e.type}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="flex flex-col gap-3">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight px-1">Upcoming Deadlines</h3>
            {upcomingEvents.map((e) => {
              const eventDate = new Date(e.date + 'T00:00:00');
              const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
              return (
                <Link key={e.id} to={`/student/assignments/${e.id}`} className={twMerge('group flex items-start gap-3 p-4 glass rounded-2xl border transition-all hover:border-primary/30', typeColors[e.type])}>
                  <div className={twMerge('w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center', typeColors[e.type])}>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{typeIcons[e.type]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{e.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{e.course}</p>
                    <p className={twMerge('text-[11px] font-bold mt-1', diffDays <= 1 ? 'text-rose-500' : diffDays <= 3 ? 'text-amber-500' : 'text-emerald-500')}>
                      {diffDays === 0 ? 'Due Today' : diffDays === 1 ? 'Due Tomorrow' : `In ${diffDays} days`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default AcademicCalendarPage;
