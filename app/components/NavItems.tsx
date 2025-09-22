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
  isMinimized?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarItems, isMinimized = false, onToggle }) => {
  const location = useLocation();
  const [internalIsMinimized, setInternalIsMinimized] = useState(false);

  // Use external state if provided, otherwise use internal state
  const currentIsMinimized = onToggle ? isMinimized : internalIsMinimized;
  
  const toggleSidebar = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsMinimized(!internalIsMinimized);
    }
  };

  return (
    <div
      className={`h-auto min-h-[calc(100vh-4rem)] max-h-screen p-4 m-4 shadow-sm rounded-2xl flex flex-col transition-all duration-500 ease-in-out ${
        currentIsMinimized ? 'w-20' : 'w-full max-w-[18rem] m-4'
      }`}
      style={{ background: 'var(--color-surface)' }}
    >
      {/* Logo Area */}
      <div className="mb-8 px-2 flex items-center">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary)' }}>
            <span className="font-bold text-xl" style={{ color: 'var(--color-primary-foreground)' }}>K</span>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            currentIsMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            <div className="whitespace-nowrap">
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>Kira</h1>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Clinic Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarItems.map(({ id, icon, label, href }) => {
            const isActive = location.pathname === href;

            return (
              <li key={id}>
                <Link
                  to={href}
                  className={`flex items-center rounded-lg transition-all duration-500 ease-in-out relative group ${
                    currentIsMinimized ? 'justify-center px-2 py-2' : 'gap-3 px-4 py-2'
                  }`}
                  style={{
                    color: isActive ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                    background: isActive ? 'var(--color-primary)' : 'transparent',
                  }}
                  title={currentIsMinimized ? label : ''}
                >
                  <img 
                    src={icon} 
                    alt={label} 
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-500 ease-in-out ${
                      isActive ? 'brightness-0 invert' : ''
                    }`}
                  />
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    currentIsMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  }`}>
                    <span className="whitespace-nowrap">{label}</span>
                  </div>
                  
                  {/* Tooltip for minimized state */}
                  {currentIsMinimized && (
                    <div
                      className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50"
                      style={{ background: 'var(--color-foreground)', color: 'var(--color-surface)' }}
                    >
                      {label}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45" style={{ background: 'var(--color-foreground)' }}></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="mt-4 px-2">
        <button
          onClick={toggleSidebar}
          className={`w-full rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 flex items-center ${
            currentIsMinimized ? 'justify-center px-2 py-2' : 'justify-between px-4 py-2'
          }`}
          style={{
            background: 'transparent',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)'
          }}
          aria-label={currentIsMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            currentIsMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--color-muted-foreground)' }}>
              {currentIsMinimized ? '' : 'Collapse Menu'}
            </span>
          </div>
          <svg 
            className={`w-5 h-5 transition-transform duration-500 ease-in-out flex-shrink-0 ${currentIsMinimized ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className={`flex items-center rounded-lg transition-all duration-500 ease-in-out cursor-pointer relative group ${
          currentIsMinimized ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
        }`} style={{ background: 'transparent' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(90deg, #ec4899, #db2777)' }}>
            <span className="font-semibold text-sm" style={{ color: 'white' }}>JD</span>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ease-in-out flex-1 ${
            currentIsMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            <div className="whitespace-nowrap">
              <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>John Doe</p>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Administrator</p>
            </div>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            currentIsMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-muted-foreground)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Profile Tooltip for minimized state */}
          {currentIsMinimized && (
            <div className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50" style={{ background: 'var(--color-foreground)', color: 'var(--color-surface)' }}>
              John Doe - Administrator
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45" style={{ background: 'var(--color-foreground)' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
