import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MessagesInbox = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const messages = [
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAzpxbpysiOxHVO9crwvUwg-8kab_wT9i_rJiRUFxC06DhYCSch-LqAJJTZh51ibZgXQsX_PUva5byvE-3dPErAemhHy9Hz8hbdnHNFw-3lJxsQQuPAmjsle9VaipzHE2SVsggjHMKmKhMeboK_pW07mAChfS72HzdqjmKE_j0Udcp8i65iNrkUv-xtKKO2K1UuGW3pYXccawnnSq9kWNg-9UfLnt8rs8u7BH4lAkLeZuwch8tNbTT75WfCnOCr9g22oY5ChV50es',
      time: '10:45 AM',
      message: 'The research proposal looks promising. Let\'s discuss the final methodology...',
      isOnline: true,
      isActive: true
    },
    {
      id: 2,
      name: 'Mark Wilson (TA)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5_7ryyTU2HU9tYvLxoD9GCe6_4OFv4OYq6X9rNwVYZwTePI3V3i9MdIpxjGqNPqf5p8k-QsgmDM__yMY7nbOY8RsaG-2JzehYX-U9VZxPxWgqx0NxfsNILej4xAwZnW7l_C0XYPZ6D1DjHEAOs4HO2oj49cFF805IqZ6EXV11wJnTzgMnz-CYqNosgelM2SZ4A0n_Xcdv5MhCZ2ZcX9qnoGeuddSctRPqm4Tx2_OtYLoGGjrgoMP6sADGmcKewEskqiDNck_i7ag',
      time: '9:12 AM',
      message: 'Did you see the updated grading rubric for the midterms?',
      isOnline: false,
      isActive: false
    },
    {
      id: 3,
      name: 'Computer Science 101',
      avatar: null,
      initials: 'CS',
      time: 'Yesterday',
      message: 'Announcement: The deadline for Lab 4 has been extended to Friday.',
      isUnread: true,
      isActive: false
    },
    {
      id: 4,
      name: 'Kevin Miller',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzysZVl9ydJseV_3pZNVzElUt3s3K9Fgf3u9TWT5acJkhm39-huqIOkRI_DJeZcRRa3wGcrIhcCMVhIzH44T1tBA4lEalh6CWxBXPXGiXyLhoiKXl1j_781yfy0nY8YwMD2duzLguwBtgJDP4ZEvhGi8XRsps1F2TmBE9ZV40N5ZJas6hLnmx68FVBEyNecKXMnriYHBQ_oTVOdrT4aK8CTN7tzMl_3doBUupx3WasmUdwNUrLF0NnRBEDlhPQ6hFqanFYPrW-QbA',
      time: 'Monday',
      message: 'Thanks for the notes! Really helped with the study group session.',
      isOnline: false,
      isActive: false
    },
    {
      id: 5,
      name: 'Elena Rodriguez',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8OzdnXg6zZ7U1j95UYERn_o05b4Lb7YQkRiqpsPaRdvOpIbcTIODuyofhEQ2DXzrxrFfYsn0kBNXEo1AbejVCrIWQwCv2ThLUTFBg8MJRJZz1OJrKH7qTcXIttpleAAF258rEnVgtl4ne_hopDBUzlJwDtQkbIP228v6XrohjMEZtDAic5dnthIPrRT5T-5L3d_VfgdmrAlnmiBnUyI4BkFNKHB9UpxRgm94jxbyEcPL0vdWhKUaIwcQZmvDncB9yhv5ELvhfWwA',
      time: 'Oct 12',
      message: 'Are we still meeting at the library at 5 PM for the project?',
      isOnline: false,
      isActive: false
    },
    {
      id: 6,
      name: 'Academic Services',
      avatar: null,
      initials: 'AS',
      time: 'Oct 10',
      message: 'Your scholarship application for the next semester has been received.',
      isOnline: false,
      isActive: false
    }
  ];

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="relative flex h-screen w-full flex-col bg-white dark:bg-background-dark overflow-hidden max-w-md mx-auto border-x border-slate-200 dark:border-slate-800">
        {/* Header */}
        <header className="flex items-center bg-white dark:bg-background-dark px-4 py-4 justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
            <h1 className="text-xl font-bold tracking-tight">Messages</h1>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-white dark:bg-background-dark">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-xl">search</span>
            <input
              className="w-full h-11 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-slate-500"
              placeholder="Search conversations..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 bg-white dark:bg-background-dark">
          <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800">
            <button
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Chats
            </button>
            <button
              className={`pb-3 text-sm font-medium relative transition-colors ${
                activeTab === 'unread' ? 'border-primary text-primary border-b-2' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
              <span className="absolute top-0 -right-2 flex h-2 w-2 rounded-full bg-primary"></span>
            </button>
            <button
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'groups' ? 'border-primary text-primary border-b-2' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                message.isActive ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' : 'bg-white dark:bg-background-dark'
              }`}
            >
              <div className="relative shrink-0">
                {message.avatar ? (
                  <img
                    alt={message.name}
                    className="size-12 rounded-full object-cover"
                    src={message.avatar}
                  />
                ) : (
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    {message.initials}
                  </div>
                )}
                {message.isOnline && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></span>
                )}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-bold truncate ${
                    message.isActive ? 'text-primary' : 'text-slate-900 dark:text-slate-100'
                  }`}>
                    {message.name}
                  </p>
                  <span className={`text-[11px] font-medium ${
                    message.isActive ? 'text-primary' : 'text-slate-400'
                  }`}>
                    {message.time}
                  </span>
                </div>
                <p className={`text-xs truncate leading-normal ${
                  message.isActive ? 'font-bold text-primary' : message.isUnread ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-normal text-slate-500 dark:text-slate-400'
                }`}>
                  {message.message}
                </p>
              </div>
              {message.isUnread && !message.isActive && (
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 flex border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-2 pb-6 pt-2">
          <Link className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/student">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Home</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/courses">
            <span className="material-symbols-outlined">book_4</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Courses</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" to="/messages">
            <span className="material-symbols-outlined material-symbols-fill">chat_bubble</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Messages</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/grades">
            <span className="material-symbols-outlined">school</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Grades</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors" to="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MessagesInbox;