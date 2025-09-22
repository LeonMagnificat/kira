import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { NavItems, MobileNav } from '~/components';

const patientSidebar = [
  { id: 1, icon: '/assets/icons/reports.svg', label: 'History', href: '/patient/history' },
  { id: 2, icon: '/assets/icons/message.svg', label: 'Prescriptions', href: '/patient/prescriptions' },
  { id: 3, icon: '/assets/icons/reports.svg', label: 'Appointments', href: '/patient/appointments' },
  { id: 4, icon: '/assets/icons/message.svg', label: 'Messages', href: '/patient/messages' },
  { id: 5, icon: '/assets/icons/reports.svg', label: 'Documents', href: '/patient/documents' },
];

export default function PatientLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full hidden md:block z-10">
        <NavItems sidebarItems={patientSidebar} isMinimized={isSidebarMinimized} onToggle={() => setIsSidebarMinimized(v => !v)} />
      </aside>
      <div className="md:hidden">
        <MobileNav sidebarItems={patientSidebar} />
      </div>
      <main className={`p-6 pb-20 md:pb-6 transition-all duration-500 ease-in-out ${isSidebarMinimized ? 'md:ml-28' : 'md:ml-80'}`}>
        <Outlet context={{ isSidebarMinimized }} />
      </main>
    </div>
  );
}