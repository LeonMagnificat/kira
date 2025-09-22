import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

interface OutletContext {
  isSidebarMinimized: boolean;
}

function Header( { title, description }: { title?: string; description?: string }) {
  const context = useOutletContext<OutletContext>();
  const isSidebarMinimized = context?.isSidebarMinimized || false;
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  const goToSettings = () => {
    setIsProfileOpen(false);
    navigate('/settings');
  }

  return (
    <header
      className={`shadow-sm rounded-2xl mb-0 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0  md:ml-[-70px]'
      }`}
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Page Title & Breadcrumb */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{title || "Page Title"}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Home</span>
              <svg className="w-4 h-4" style={{ color: 'var(--color-muted-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{title || ""}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5" style={{ color: 'var(--color-muted-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ease-in-out"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
                boxShadow: 'none'
              }}
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2"
            style={{ background: 'transparent', color: 'var(--color-foreground)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 relative"
              style={{ background: 'transparent', color: 'var(--color-foreground)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H7a2 2 0 01-2-2V7a2 2 0 012-2h4m0 14v-2.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                <span className="text-xs" style={{ color: 'var(--color-primary-foreground)' }}>3</span>
              </div>
            </button>

            {/* Notifications Dropdown */}
            <div className={`absolute right-0 top-full mt-2 w-80 shadow-xl rounded-2xl border transition-all duration-300 ease-in-out z-50 ${
              isNotificationOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`} style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Notifications</h3>
                  <button className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>Mark all read</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'transparent' }}>
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--color-primary)' }}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>New appointment scheduled</p>
                      <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>John Smith - 2:30 PM today</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'transparent' }}>
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--color-primary)' }}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Patient record updated</p>
                      <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Sarah Johnson - Medical history</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'transparent' }}>
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--color-border)' }}></div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>System maintenance scheduled</p>
                      <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Tonight at 11:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <button className="w-full text-center text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 shadow-md"
            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">New {title}</span>
          </button>

          {/* Theme toggle for global control */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:opacity-90"
              style={{ background: 'transparent', color: 'var(--color-foreground)' }}
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #ec4899, #db2777)' }}>
                <span className="text-xs font-bold text-white">JD</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-56 shadow-xl rounded-2xl border transition-all duration-200 z-50 ${
                isProfileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              role="menu"
            >
              <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>John Doe</p>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Administrator</p>
              </div>
              <div className="py-1">
                <button onClick={goToSettings} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ color: 'var(--color-foreground)' }} role="menuitem">
                  My Profile
                </button>
                <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: 'var(--color-foreground)' }} role="menuitem">
                  Account Settings
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ color: 'var(--color-foreground)' }} role="menuitem">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header