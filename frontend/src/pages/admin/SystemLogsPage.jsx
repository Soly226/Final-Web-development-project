import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const SystemLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All Levels');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const { user } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get('http://localhost:5000/api/admin/logs', config);
        const mappedLogs = data.map(log => ({
          id: log._id,
          time: new Date(log.timestamp).toLocaleString(),
          level: log.level.charAt(0).toUpperCase() + log.level.slice(1),
          category: log.source,
          message: log.message,
          user: log.metadata?.user || 'System'
        }));
        setLogs(mappedLogs);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLogs();
  }, [user]);

  const getLevelBadge = (level) => {
    const styles = {
      Error: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
      Warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      Info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    };
    return (
      <span className={twMerge("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", styles[level])}>
        {level}
      </span>
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = search === '' || 
      log.message.toLowerCase().includes(search.toLowerCase()) || 
      log.user.toLowerCase().includes(search.toLowerCase());
    
    const matchesLevel = filterLevel === 'All Levels' || log.level === filterLevel;
    const matchesCategory = filterCategory === 'All Categories' || log.category === filterCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <AdminLayout title="System Audit Logs">
      <div className="p-5 max-w-6xl mx-auto space-y-6">
        
        <Card className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Search Events</label>
            <Input 
              placeholder="Search by keywords, users, or messages..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border-white/10"
              icon={<span className="material-symbols-outlined">search</span>}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Level</label>
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option>All Levels</option>
                <option>Info</option>
                <option>Warning</option>
                <option>Error</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Category</label>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option>All Categories</option>
                <option>Auth</option>
                <option>Course</option>
                <option>System</option>
              </select>
            </div>
          </div>
          <Button className="w-full md:w-auto px-8" onClick={() => alert(`Exporting ${filteredLogs.length} logs to CSV...`)}>Export CSV</Button>
        </Card>

        <Card className="p-0 overflow-hidden border-white/5">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading system logs...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Level</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Event Message</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">User / Process</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-400">{log.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getLevelBadge(log.level)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{log.category}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">{log.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={twMerge(
                          "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight",
                          log.user.includes('@') ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20 italic font-medium"
                        )}>
                          {log.user}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing {filteredLogs.length} results</p>
            <div className="flex gap-2">
              <Button variant="secondary" className="py-2 px-4 text-xs" disabled>Previous</Button>
              <Button onClick={() => alert("No more pages available.")} className="py-2 px-4 text-xs">Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SystemLogsPage;
