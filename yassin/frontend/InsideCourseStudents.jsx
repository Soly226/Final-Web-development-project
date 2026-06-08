import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import CourseTabNav from '../../components/course/CourseTabNav';
import apiClient from '../../lib/apiClient';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

export default function InsideCourseStudents() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudentsData = async () => {
    try {
      const [courseRes, classmatesRes] = await Promise.all([
        apiClient.get(`/api/courses/${id}`),
        apiClient.get(`/api/student/courses/${id}/students`),
      ]);
      setCourse(courseRes.data);
      setClassmates(classmatesRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch classmate list.', 'error');
      setCourse({ course_name: 'Web Development', course_code: 'CS-402' });
      setClassmates([
        { _id: '1', full_name: 'Alice Johnson', email: 'alice@example.com', department: 'Computer Science' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsData();
  }, [id]);

  const handleMessageRedirect = (classmate) => {
    navigate(`/messages?to=${classmate._id}&role=Student&name=${encodeURIComponent(classmate.full_name)}`);
  };

  const handleInstructorMessageRedirect = (instructor) => {
    navigate(`/messages?to=${instructor._id}&role=Instructor&name=${encodeURIComponent(instructor.full_name)}`);
  };

  const filteredClassmates = classmates.filter((classmate) => {
    const query = searchQuery.toLowerCase();
    return (
      classmate.full_name?.toLowerCase().includes(query) ||
      classmate.email?.toLowerCase().includes(query) ||
      classmate.department?.toLowerCase().includes(query)
    );
  });

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

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input
              type="text"
              placeholder="Search classmates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold shadow-sm"
            />
          </div>
          {!loading && (
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 self-end sm:self-center">
              Showing {filteredClassmates.length} classmates
            </span>
          )}
        </div>

        {/* Instructors Section */}
        {course?.assigned_instructors && course.assigned_instructors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Instructors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.assigned_instructors.map((instructor) => (
                <div
                  key={instructor._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center justify-between hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {instructor.profileImage ? (
                      <img
                        src={instructor.profileImage}
                        alt={instructor.full_name}
                        className="size-10 rounded-xl object-cover flex-shrink-0 border border-slate-100 dark:border-slate-800"
                      />
                    ) : (
                      <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                        {instructor.initials || instructor.full_name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-slate-900 dark:text-white text-sm font-extrabold truncate">
                        {instructor.full_name}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-0.5 truncate">
                        {instructor.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInstructorMessageRedirect(instructor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xs">chat_bubble</span>
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classmates List */}
        <div className="space-y-3 mt-2">
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Your Classmates</h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded-full" />
                      <Skeleton className="h-3 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredClassmates.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">groups</span>
              <p className="text-slate-800 dark:text-white font-bold">No classmates found</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Try adjusting your search criteria or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClassmates.map((classmate) => (
                <div
                  key={classmate._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center justify-between hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {classmate.profileImage ? (
                      <img
                        src={classmate.profileImage}
                        alt={classmate.full_name}
                        className="size-10 rounded-xl object-cover flex-shrink-0 border border-slate-100 dark:border-slate-800"
                      />
                    ) : (
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                        {classmate.initials || classmate.full_name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-slate-900 dark:text-white text-sm font-extrabold truncate">
                        {classmate.full_name}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-0.5 truncate">
                        {classmate.department || 'General'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleMessageRedirect(classmate)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xs">mail</span>
                    Message
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </StudentLayout>
  );
}
