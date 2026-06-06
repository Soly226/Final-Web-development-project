import React, { useState, useEffect } from 'react';
import StudentLayout from '../layouts/StudentLayout';
import apiClient from '../lib/apiClient';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function AcademicCalendarView() {
  const { showToast } = useToast();
  const today = new Date();
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/api/student/assignments');
      setAssignments(data || []);
    } catch (err) {
      showToast('Failed to fetch calendar events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Previous month trailing days
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  const prevMonthDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  // Next month leading days (fill up grid to multiples of 7)
  const totalCellsSoFar = prevMonthDays.length + daysInMonth;
  const trailingCellsCount = (7 - (totalCellsSoFar % 7)) % 7;
  const nextMonthDays = [];
  for (let i = 1; i <= trailingCellsCount; i++) {
    nextMonthDays.push(i);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null); // Reset selection when month changes
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null); // Reset selection when month changes
  };

  const getEventsForDate = (day) => {
    return assignments.filter((a) => {
      if (!a.deadline) return false;
      const d = new Date(a.deadline);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Get selected day events or upcoming events for the month if no day is selected
  const displayEvents = selectedDay 
    ? getEventsForDate(selectedDay)
    : assignments.filter((a) => {
        if (!a.deadline) return false;
        const d = new Date(a.deadline);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <StudentLayout title="Academic Calendar">
      <div className="flex flex-col gap-6">
        
        {/* Month Selector & Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Academic schedule and deadlines</p>
          </div>
          
          <div className="flex gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors bg-white dark:bg-slate-900"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={handleNextMonth}
              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors bg-white dark:bg-slate-900"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/60 shadow-sm">
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-[11px] font-black uppercase tracking-widest text-slate-400 text-center py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
            {/* Trailing days of previous month */}
            {prevMonthDays.map((day, idx) => (
              <div
                key={`prev-${idx}`}
                className="h-14 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 text-xs font-semibold"
              >
                {day}
              </div>
            ))}

            {/* Current month days */}
            {[...Array(daysInMonth)].map((_, idx) => {
              const day = idx + 1;
              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDay === day;
              const isTodayDay = isSameDay(today, new Date(currentYear, currentMonth, day));

              return (
                <button
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  key={`curr-${day}`}
                  className={`h-14 flex flex-col items-center justify-center text-xs font-extrabold relative transition-all focus:outline-none ${
                    isSelected
                      ? 'bg-primary text-white font-black'
                      : isTodayDay
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvents && (
                    <span
                      className={`absolute bottom-2 size-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-primary'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {/* Leading days of next month */}
            {nextMonthDays.map((day, idx) => (
              <div
                key={`next-${idx}`}
                className="h-14 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 text-xs font-semibold"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Agenda Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white">
              {selectedDay 
                ? `Deadlines for ${MONTHS[currentMonth]} ${selectedDay}`
                : `Upcoming Deadlines in ${MONTHS[currentMonth]}`}
            </h3>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs font-bold text-primary hover:underline focus:outline-none"
              >
                Show All Month
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : displayEvents.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">event_busy</span>
              <p className="text-slate-800 dark:text-white font-bold text-sm">No deadlines scheduled</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">You have no tasks due for this period.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {displayEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                >
                  <div className="w-1 rounded-full h-auto bg-primary"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm truncate">
                        {event.title}
                      </h4>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary/10">
                        {formatDateLabel(event.deadline)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mt-1">
                      <span className="material-symbols-outlined text-[14px]">school</span>
                      <span>{event.course?.name || 'Course'} ({event.course?.code})</span>
                    </div>
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
