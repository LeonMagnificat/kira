import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarItem = {
  id: string | number;
  icon: string; // URL or path to icon
  label: string;
  href: string;
};

interface SidebarProps {
  sidebarItems: SidebarItem[];
}

const MobileNav: React.FC<SidebarProps> = ({ sidebarItems }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Bottom Navigation Bar */}
      <div className="bg-white shadow-2xl border-t border-gray-200">
        <nav className="px-2 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {sidebarItems.map(({ id, icon, label, href }) => {
              const isActive = location.pathname === href;

              return (
                <Link
                  key={id}
                  to={href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out min-w-0 flex-1
                    ${
                      isActive
                        ? "text-pink-700 bg-pink-50"
                        : "text-gray-600 hover:text-pink-600 hover:bg-pink-25"
                    }`}
                >
                  <img 
                    src={icon} 
                    alt={label} 
                    className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ease-in-out ${
                      isActive ? "brightness-0 saturate-200 hue-rotate-315" : ""
                    }`}
                  />
                  <span className={`text-xs font-medium truncate w-full text-center transition-all duration-300 ease-in-out
                    ${isActive ? "text-pink-700" : "text-gray-600"}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
            
            {/* Profile/Menu Button */}
            <button
              onClick={toggleMenu}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out min-w-0 flex-1
                ${isMenuOpen ? "text-pink-700 bg-pink-50" : "text-gray-600 hover:text-pink-600 hover:bg-pink-25"}`}
              aria-label={isMenuOpen ? "Close menu" : "Open profile menu"}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs">JD</span>
              </div>
              <span className={`text-xs font-medium truncate w-full text-center transition-all duration-300 ease-in-out
                ${isMenuOpen ? "text-pink-700" : "text-gray-600"}`}>
                Profile
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Profile Menu Overlay - Slides up from bottom */}
      <div className={`absolute bottom-full left-0 right-0 bg-white shadow-2xl border-t border-gray-200 transition-all duration-500 ease-in-out
        ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="px-4 py-4">
          {/* Profile Info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer">
            <div className="w-8 h-8 bg-pink-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Kira</p>
              <p className="text-xs text-gray-500">Clinic Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
