import React, { useState, useEffect } from 'react';
import type { MessageGroup } from '~/data/mockMessages';
import { getUnreadMessageCount } from '~/utils/messageUtils';

interface MessageNotificationProps {
  groups: MessageGroup[];
  userId: string;
  className?: string;
}

export function MessageNotification({ groups, userId, className = '' }: MessageNotificationProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = getUnreadMessageCount(groups, userId);
    setUnreadCount(count);
  }, [groups, userId]);

  if (unreadCount === 0) return null;

  return (
    <div className={`absolute -top-1 -right-1 ${className}`}>
      <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
        {unreadCount > 9 ? '9+' : unreadCount}
      </div>
    </div>
  );
}

interface MessageToastProps {
  message: string;
  senderName: string;
  groupName: string;
  onClose: () => void;
  onClick: () => void;
}

export function MessageToast({ message, senderName, groupName, onClose, onClick }: MessageToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm border-l-4 border-pink-500 z-50 animate-slideIn">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={onClick}>
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
            <p className="text-sm font-semibold text-gray-900">{senderName}</p>
            <span className="text-xs text-gray-500 ml-2">in {groupName}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}