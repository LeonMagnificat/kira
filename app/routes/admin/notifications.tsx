import React, { useState, useMemo } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import {
  mockNotifications,
  getNotificationsByType,
  getNotificationsByPriority,
  getUnreadNotifications,
  getRecentNotifications,
  getNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification
} from '~/data/mockNotifications';

interface OutletContext {
  isMinimized: boolean;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'appointment': return '📅';
    case 'billing': return '💰';
    case 'system': return '⚙️';
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'info': return 'ℹ️';
    default: return '📢';
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'appointment': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'billing': return 'bg-green-100 text-green-800 border-green-200';
    case 'system': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'success': return 'bg-green-100 text-green-800 border-green-200';
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'error': return 'bg-red-100 text-red-800 border-red-200';
    case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

function Notifications() {
  const { isMinimized } = useOutletContext<OutletContext>();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const notificationStats = useMemo(() => getNotificationStats(), []);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = mockNotifications;

    // Filter by type
    if (activeFilter !== 'all') {
      if (activeFilter === 'unread') {
        filtered = getUnreadNotifications();
      } else {
        filtered = getNotificationsByType(activeFilter as Notification['type']);
      }
    }

    // Filter by read status
    if (showOnlyUnread) {
      filtered = filtered.filter(n => !n.isRead);
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activeFilter, showOnlyUnread]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    // In a real app, you might navigate to the related page
    if (notification.actionUrl) {
      // navigate(notification.actionUrl);
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleMarkSelectedAsRead = () => {
    selectedNotifications.forEach(id => markNotificationAsRead(id));
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setSelectedNotifications([]);
  };

  const filters = [
    { id: 'all', label: 'All', count: notificationStats.total },
    { id: 'unread', label: 'Unread', count: notificationStats.unread },
    { id: 'appointment', label: 'Appointments', count: notificationStats.byType.appointment },
    { id: 'billing', label: 'Billing', count: notificationStats.byType.billing },
    { id: 'system', label: 'System', count: notificationStats.byType.system },
    { id: 'warning', label: 'Warnings', count: notificationStats.byType.warning },
    { id: 'error', label: 'Errors', count: notificationStats.byType.error }
  ];

  return (
    <>
      <main className="notifications wrapper">
        <div className={isMinimized ? 'ml-[-25px]' : 'ml-[-70px]'}>
          <Header title="Notifications" />
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{notificationStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">📢</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{notificationStats.unread}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <span className="text-2xl">🔴</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900">{notificationStats.byPriority.high}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">{getRecentNotifications(1).length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white shadow-sm rounded-2xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-pink-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showOnlyUnread}
                    onChange={(e) => setShowOnlyUnread(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Show only unread</span>
                </label>
                
                <div className="flex gap-2">
                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={handleMarkSelectedAsRead}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark Selected as Read
                    </button>
                  )}
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors text-sm"
                  >
                    Mark All as Read
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeFilter === 'all' ? 'All Notifications' : 
                   activeFilter === 'unread' ? 'Unread Notifications' :
                   `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Notifications`}
                </h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={handleSelectAll}
                    className="mr-2 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Select All</span>
                </label>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredNotifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <span className="text-4xl mb-4 block">📭</span>
                  <p className="text-gray-500">No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectNotification(notification.id);
                        }}
                        className="mt-1 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getNotificationColor(notification.type)}`}>
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                            <span className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                          </div>
                        </div>
                        
                        <p className={`mt-1 text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>

                        {notification.actionText && notification.actionUrl && (
                          <div className="mt-2">
                            <button className="text-sm text-pink-600 hover:text-pink-800 font-medium">
                              {notification.actionText} →
                            </button>
                          </div>
                        )}

                        {notification.metadata && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(notification.metadata).map(([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination would go here in a real app */}
          {filteredNotifications.length > 0 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                  Previous
                </button>
                <span className="px-3 py-2 text-sm bg-pink-700 text-white rounded">1</span>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Notifications;