import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import HODInstructorWorkload from './HODInstructorWorkload';

const HODInstructorList = ({ instructors: propInstructors }) => {
  const [instructors, setInstructors] = useState(propInstructors || []);
  const [loading, setLoading] = useState(!propInstructors);
  const { showToast } = useToast();

  useEffect(() => {
    if (propInstructors) {
      setInstructors(propInstructors);
      return;
    }

    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/instructor/department/instructors');
        setInstructors(res.data);
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to load instructors directory.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [propInstructors]);

  if (loading) {
    return (
      <div className="py-10 text-center text-slate-450 dark:text-slate-500 font-bold text-sm">
        Loading instructors directory...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {instructors.length > 0 ? (
        instructors.map((inst) => (
          <Card key={inst._id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" hover={false}>
            <div className="flex items-center gap-4 min-w-0">
              <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-extrabold text-base">
                {inst.full_name ? inst.full_name.charAt(0) : 'D'}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {inst.full_name}
                </h4>
                <p className="text-xs text-slate-450 truncate">{inst.email}</p>
                <div className="flex gap-2.5 mt-1.5 text-[10px] text-slate-400">
                  {inst.phone && <span>📞 {inst.phone}</span>}
                  {inst.office_location && <span>📍 {inst.office_location}</span>}
                </div>
              </div>
            </div>
            
            <HODInstructorWorkload instructor={inst} />
          </Card>
        ))
      ) : (
        <div className="text-center py-10 text-slate-450 dark:text-slate-500 italic">No instructors found.</div>
      )}
    </div>
  );
};

export default HODInstructorList;