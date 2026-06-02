import React from 'react';
import InstructorLayout from '../../layouts/InstructorLayout';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InstructorProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <InstructorLayout title="My Profile">
      <div className="p-5 flex flex-col gap-6 max-w-4xl mx-auto">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-white shadow-xl shadow-amber-500/20 text-center">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
               <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-white blur-[100px] rotate-12"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 rounded-2xl bg-white/20 border-4 border-white/30 backdrop-blur-md flex items-center justify-center text-4xl font-extrabold shadow-lg mb-4">
                  {user?.name?.charAt(0) || 'I'}
               </div>
               <h2 className="text-3xl font-extrabold tracking-tight">{user?.name || 'Prof. Instructor'}</h2>
               <p className="text-white/80 font-semibold uppercase tracking-widest text-xs mt-1 bg-white/10 px-3 py-1 rounded-full border border-white/20">Computer Science Department</p>
            </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-1 flex flex-col gap-6">
              <Card className="p-5" hover={false}>
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">contact_mail</span> Contact Info
                 </h3>
                 <div className="flex flex-col gap-3">
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</p>
                       <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.email || 'instructor@educore.edu'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Office Location</p>
                       <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Building 4, Room 402</p>
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Office Hours</p>
                       <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Mon/Wed 2:00 PM - 4:00 PM</p>
                    </div>
                 </div>
              </Card>

              <Card className="p-5" hover={false}>
                 <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">security</span> Account Status
                 </h3>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                       <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">Active Instructor</p>
                       <p className="text-[10px] text-slate-500">Since Fall 2022</p>
                    </div>
                 </div>
              </Card>

              <button
                onClick={handleLogout}
                className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-rose-500/20 shadow-sm active:scale-95"
              >
                 <span className="material-symbols-outlined text-[20px]">logout</span>
                 Sign Out
              </button>
           </div>

           <div className="md:col-span-2">
              <Card className="p-6" hover={false}>
                 <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Edit Profile Details</h3>

                 <form className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div>
                         <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                         <input
                           type="text"
                           defaultValue={user?.name || 'Prof. Instructor'}
                           className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Display Name</label>
                         <input
                           type="text"
                           defaultValue="Dr. Instructor"
                           className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                         />
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Bio / Introduction</label>
                      <textarea
                        rows="4"
                        placeholder="Tell your students a bit about your background..."
                        defaultValue="Ph.D. in Computer Science. Research focus on distributed systems and cloud architecture. Passionate about teaching modern web technologies to the next generation of engineers."
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-2 flex justify-end">
                       <button onClick={(e) => { e.preventDefault(); alert('Profile details updated successfully!'); }} type="button" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Save Changes
                       </button>
                    </div>
                 </form>
              </Card>
           </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorProfilePage;