import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { NavItems, MobileNav } from '~/components';

const nurseSidebar = [
  { id: 1, icon: '/assets/icons/members.svg', label: 'Patients', href: '/nurse/patients' },
  { id: 2, icon: '/assets/icons/reports.svg', label: 'Vitals', href: '/nurse/vitals' },
  { id: 3, icon: '/assets/icons/reports.svg', label: 'Medication', href: '/nurse/medication' },
  { id: 4, icon: '/assets/icons/reports.svg', label: 'Schedule', href: '/nurse/schedule' },
];

export default function NurseLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full hidden md:block z-10">
        <NavItems sidebarItems={nurseSidebar} isMinimized={isSidebarMinimized} onToggle={() => setIsSidebarMinimized(v => !v)} />
      </aside>
      <div className="md:hidden">
        <MobileNav sidebarItems={nurseSidebar} />
      </div>
      <main className={`p-6 pb-20 md:pb-6 transition-all duration-500 ease-in-out ${isSidebarMinimized ? 'md:ml-28' : 'md:ml-80'}`}>
        <Outlet context={{ isSidebarMinimized }} />
      </main>
    </div>
  );
}