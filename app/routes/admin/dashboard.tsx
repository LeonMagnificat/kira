import React, { useState, useEffect } from 'react'
import { Header } from '~/components'
import { useOutletContext } from 'react-router-dom'
import { sidebarItems } from '~/constants'

interface OutletContext {
  isSidebarMinimized: boolean;
}

const adminLayoutMeta = {
  title: "Dashboard",
  description: "Admin dashboard for managing the clinic."
};

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const context = useOutletContext<OutletContext>();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app, this would come from your API
  const dashboardData = {
    systemStatus: {
      isOnline: true,
      lastBackup: "2024-01-15 03:00 AM",
      storageUsed: 65,
      activeUsers: 3
    },
    dailyOperations: {
      newPatients: 5,
      appointmentsToday: { scheduled: 24, completed: 18 },
      outstandingTasks: 7,
      staffNotes: "Remember: Dr. Smith out tomorrow, reschedule his appointments"
    },
    recentActivity: [
      { type: "login", message: "Sarah Johnson logged in", time: "10:30 AM" },
      { type: "patient", message: "New patient registered: Mike Davis", time: "09:45 AM" },
      { type: "appointment", message: "Appointment completed: Jane Doe", time: "09:15 AM" }
    ]
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isSidebarMinimized = context?.isSidebarMinimized || false;

  return (
    <>
    <main className="dashboard wrapper">
      <Header 
        title={sidebarItems[0].label || ''}
      />
      </main>

      <div className={`flex flex-col  h-[calc(100vh-200px)] mt-4 gap-6 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0 md:ml-[-70px]'
      }`}>

      <div className="bg-surface shadow-sm rounded-2xl mb-0">
<div className="bg-surface shadow-sm rounded-2xl p-6 my-4 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, Dr. Admin</h1>
            <p className="text-muted-foreground mt-1">{formatDate(currentTime)}</p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <div className="text-3xl font-mono font-bold text-primary">{formatTime(currentTime)}</div>
            <p className="text-sm text-muted-foreground">Current Time</p>
          </div>
        </div>
      </div>

      {/* Alert Bar */}
      {dashboardData.dailyOperations.staffNotes && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-2xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800 font-medium">Important Notice: {dashboardData.dailyOperations.staffNotes}</p>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Status */}
        <div className="bg-surface shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            System Status
          </h2>
          
          <div className="space-y-4">
            {/* System Online */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">System Status</span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${dashboardData.systemStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${dashboardData.systemStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData.systemStatus.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Last Backup */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Backup</span>
              <span className="font-medium text-foreground">{dashboardData.systemStatus.lastBackup}</span>
            </div>

            {/* Storage Space */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-medium text-foreground">{dashboardData.systemStatus.storageUsed}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${dashboardData.systemStatus.storageUsed > 80 ? 'bg-red-500' : dashboardData.systemStatus.storageUsed > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${dashboardData.systemStatus.storageUsed}%` }}
                ></div>
              </div>
            </div>

            {/* Active Users */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Staff</span>
              <span className="font-medium text-foreground">{dashboardData.systemStatus.activeUsers} online</span>
            </div>
          </div>
        </div>

        {/* Daily Operations */}
        <div className="bg-surface shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Today's Operations
          </h2>
          
          <div className="space-y-4">
            {/* New Patients */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">New Patients</span>
                <span className="text-2xl font-bold text-green-600">{dashboardData.dailyOperations.newPatients}</span>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-800 font-medium">Appointments</span>
                <span className="text-sm text-blue-600">
                  {dashboardData.dailyOperations.appointmentsToday.completed}/{dashboardData.dailyOperations.appointmentsToday.scheduled}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(dashboardData.dailyOperations.appointmentsToday.completed / dashboardData.dailyOperations.appointmentsToday.scheduled) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Outstanding Tasks */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 font-medium">Pending Tasks</span>
                <span className="text-2xl font-bold text-yellow-600">{dashboardData.dailyOperations.outstandingTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Management */}
        <div className="bg-surface shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            <button className="w-full bg-pink-700 text-white py-3 px-4 rounded-lg hover:bg-pink-800 transition-colors font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Staff
            </button>
            
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Reset Password
            </button>
            
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
              </svg>
              Generate Reports
            </button>
            
            <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              System Settings
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-surface shadow-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Recent Activity (Last 7 Days)
        </h2>
        
        <div className="space-y-3">
          {dashboardData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'login' ? 'bg-green-500' : 
                  activity.type === 'patient' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></div>
                <span className="text-foreground">{activity.message}</span>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
      </>
      
     
    
  )
}

export default Dashboard