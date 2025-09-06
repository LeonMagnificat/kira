import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

interface OutletContext {
  isSidebarMinimized: boolean;
}

function Header( { title, description }: { title?: string; description?: string }) {
  const context = useOutletContext<OutletContext>();
  const isSidebarMinimized = context?.isSidebarMinimized || false;
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  return (
    <header className={`bg-white shadow-sm rounded-2xl mb-0 transition-all duration-500 ease-in-out ${
      isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0  md:ml-[-70px]'
    }`}>
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Page Title & Breadcrumb */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title || "Page Title"}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Home</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm text-pink-600 font-medium">{title || ""}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 relative"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H7a2 2 0 01-2-2V7a2 2 0 012-2h4m0 14v-2.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-semibold">3</span>
              </div>
            </button>

            {/* Notifications Dropdown */}
            <div className={`absolute right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-2xl border border-gray-100 transition-all duration-300 ease-in-out z-50 ${
              isNotificationOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">Mark all read</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">New appointment scheduled</p>
                      <p className="text-xs text-gray-500 mt-1">John Smith - 2:30 PM today</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Patient record updated</p>
                      <p className="text-xs text-gray-500 mt-1">Sarah Johnson - Medical history</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">System maintenance scheduled</p>
                      <p className="text-xs text-gray-500 mt-1">Tonight at 11:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">New {title}</span>
          </button>

          {/* Profile Dropdown */}
         
          
        </div>
      </div>
    </header>
  )
}

export default Header