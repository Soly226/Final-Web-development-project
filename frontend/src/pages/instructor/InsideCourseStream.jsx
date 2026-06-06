import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';

const InsideCourseStream = () => {
  const { id } = useParams();

  const sidebarLinks = [
    { label: '← Courses', to: '/instructor', icon: 'arrow_back' },
    { label: 'Lectures', to: `/instructor/course/${id}/lectures`, matchPrefix: `/instructor/course/${id}/lectures`, icon: 'play_lesson' },
    { label: 'Stream', to: `/instructor/course/${id}/stream`, matchPrefix: `/instructor/course/${id}/stream`, icon: 'dynamic_feed' },
    { label: 'Assignments', to: '/instructor/assignments', matchPrefix: '/instructor/assignments', icon: 'assignment' },
    { label: 'Students', to: `/instructor/course/${id}/students`, matchPrefix: `/instructor/course/${id}/students`, icon: 'groups' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Topbar title="Inside Course" />

      <div className="flex flex-col md:flex-row">
        <Sidebar links={sidebarLinks} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <div>InsideCourseStream</div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InsideCourseStream;
