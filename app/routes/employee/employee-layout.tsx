import React, { useState } from "react";
import { Outlet } from "react-router";
import { NavItems, MobileNav, Header } from "~/components";

// Employee-specific sidebar
const employeeSidebar = [
  { id: 1, icon: "/assets/icons/home.svg", label: "Home", href: "/employee/home" },
  { id: 2, icon: "/assets/icons/message.svg", label: "Messages", href: "/employee/messages" },
  { id: 3, icon: "/assets/icons/members.svg", label: "Patients", href: "/employee/patients" },
  { id: 4, icon: "/assets/icons/reports.svg", label: "Monitoring", href: "/employee/monitoring" },
];

function EmployeeLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => setIsSidebarMinimized((v) => !v);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex-shrink-0 hidden md:block z-10">
        <NavItems
          sidebarItems={employeeSidebar}
          isMinimized={isSidebarMinimized}
          onToggle={toggleSidebar}
        />
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileNav sidebarItems={employeeSidebar} />
      </div>

      {/* Main Content */}
      <main
        className={`p-6 pb-20 md:pb-6 transition-all duration-500 ease-in-out ${
          isSidebarMinimized ? "md:ml-28" : "md:ml-80"
        }`}
      >
        <Outlet context={{ isSidebarMinimized }} />
      </main>
    </div>
  );
}

export default EmployeeLayout;