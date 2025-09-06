import React, { useState } from "react";
import { Outlet } from "react-router";
import { NavItems, MobileNav } from "../../../app/components";
import { sidebarItems } from "../../constants";



function adminLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex-shrink-0 hidden md:block z-10">
        <NavItems 
          sidebarItems={sidebarItems} 
          isMinimized={isSidebarMinimized}
          onToggle={toggleSidebar}
        />
      </aside>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileNav sidebarItems={sidebarItems} />
      </div>
      
      {/* Main Content */}
      <main className={`p-6 pb-20 md:pb-6 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'md:ml-28' : 'md:ml-80'
      }`}>
        <Outlet context={{ isSidebarMinimized }} />
      </main>
    </div>
  );
}

export default adminLayout;
