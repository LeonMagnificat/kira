import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { NavItems, MobileNav } from '~/components';

const doctorSidebar = [
  { id: 1, icon: '/assets/icons/members.svg', label: 'Patients', href: '/doctor/patients' },
  { id: 2, icon: '/assets/icons/reports.svg', label: 'Visits', href: '/doctor/visits' },
  { id: 3, icon: '/assets/icons/message.svg', label: 'Prescriptions', href: '/doctor/prescriptions' },
  { id: 4, icon: '/assets/icons/reports.svg', label: 'Appointments', href: '/doctor/appointments' },
];

export default function DoctorLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full hidden md:block z-10">
        <NavItems sidebarItems={doctorSidebar} isMinimized={isSidebarMinimized} onToggle={() => setIsSidebarMinimized(v => !v)} />
      </aside>
      <div className="md:hidden">
        <MobileNav sidebarItems={doctorSidebar} />
      </div>
      <main className={`p-6 pb-20 md:pb-6 transition-all duration-500 ease-in-out ${isSidebarMinimized ? 'md:ml-28' : 'md:ml-80'}`}>
        <Outlet context={{ isSidebarMinimized }} />
      </main>
    </div>
  );
}