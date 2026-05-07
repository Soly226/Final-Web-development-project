import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StatBox = ({ label, value, trend, up }) => (
  <Card className="p-4 border-l-4" style={{ borderLeftColor: up ? '#10b981' : '#f43f5e' }}>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
    <p className="text-2xl font-black">{value}</p>
    <div className={twMerge("text-[10px] font-bold flex items-center mt-1", up ? "text-emerald-500" : "text-rose-500")}>
      <span className="material-symbols-outlined text-[12px] mr-1">{up ? 'trending_up' : 'trending_down'}</span>
      {trend} vs last month
    </div>
  </Card>
);

const AdminReportsPage = () => {
  return (
    <AdminLayout title="Strategic Reports">
      <div className="p-5 max-w-6xl mx-auto space-y-6">
        
        {/* Date Selector Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-1">
          <div>
            <h2 className="text-2xl font-black tracking-tight">System Performance</h2>
            <p className="text-sm text-slate-500 font-medium">Reporting Period: <span className="text-slate-900 dark:text-white font-bold">Oct 1 - Oct 31, 2023</span></p>
          </div>
          <Button variant="secondary" className="gap-2 px-6">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            Adjust Range
          </Button>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Total Enrollments" value="12,450" trend="+12.2%" up={true} />
          <StatBox label="Completion Rate" value="84.2%" trend="+3.1%" up={true} />
          <StatBox label="Average Grade" value="B+" trend="-1.5%" up={false} />
          <StatBox label="Instructors" value="428" trend="+5.0%" up={true} />
        </div>

        {/* Detailed Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Growth Chart */}
          <Card className="lg:col-span-2 p-6 overflow-visible">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-sm tracking-tight">Enrollment Trends</h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/40"></span>
                <span className="w-3 h-3 rounded-full bg-primary"></span>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4 px-4 pb-2">
              {[40, 60, 45, 80, 70, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div 
                    className={twMerge(
                      "w-full rounded-t-xl transition-all duration-500 group-hover:brightness-125",
                      i === 5 ? "bg-gradient-to-t from-primary to-accent shadow-lg shadow-primary/30" : "bg-primary/20"
                    )} 
                    style={{ height: `${h}%` }}
                  ></div>
                  <span className={twMerge("text-[10px] font-black uppercase tracking-widest", i === 5 ? "text-primary" : "text-slate-400")}>
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Side Panels */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-sm tracking-tight mb-4">Popular Modules</h3>
              <div className="space-y-4">
                {[
                  { icon: 'terminal', name: 'Intro to Python', count: '2,400', trend: '+12%' },
                  { icon: 'brush', name: 'UI Design Basics', count: '1,850', trend: '+8%' },
                  { icon: 'data_usage', name: 'Data Science 101', count: '1,200', trend: '-2%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-primary">
                        <span className="material-symbols-outlined text-md">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold truncate">{item.name}</p>
                        <p className="text-[9px] text-slate-500">{item.count} students</p>
                      </div>
                    </div>
                    <span className={twMerge("text-[10px] font-black", item.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                      {item.trend}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Button className="w-full py-5 text-md shadow-primary/30 gap-3">
              <span className="material-symbols-outlined">download</span>
              Generate PDF Report
            </Button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

import { twMerge } from 'tailwind-merge';

export default AdminReportsPage;
