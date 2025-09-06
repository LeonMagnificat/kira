export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'billing' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  actionUrl?: string;
  actionText?: string;
  relatedId?: string; // ID of related appointment, patient, etc.
  userId?: string; // If notification is for specific user
  metadata?: Record<string, any>;
}

export const mockNotifications: Notification[] = [
  {
    id: 'NOT001',
    title: 'Upcoming Appointment Reminder',
    message: 'You have an appointment with Dr. Smith tomorrow at 2:00 PM',
    type: 'appointment',
    priority: 'medium',
    isRead: false,
    createdAt: '2024-01-27T10:00:00Z',
    updatedAt: '2024-01-27T10:00:00Z',
    actionUrl: '/appointments',
    actionText: 'View Appointment',
    relatedId: 'APT004',
    metadata: {
      appointmentDate: '2024-01-28',
      appointmentTime: '14:00',
      doctorName: 'Dr. Smith'
    }
  },
  {
    id: 'NOT002',
    title: 'Payment Received',
    message: 'Payment of $187.50 has been received for invoice INV001',
    type: 'billing',
    priority: 'low',
    isRead: false,
    createdAt: '2024-01-27T09:30:00Z',
    updatedAt: '2024-01-27T09:30:00Z',
    actionUrl: '/billing',
    actionText: 'View Invoice',
    relatedId: 'INV001',
    metadata: {
      amount: 187.50,
      paymentMethod: 'Credit Card'
    }
  },
  {
    id: 'NOT003',
    title: 'System Maintenance Scheduled',
    message: 'System maintenance is scheduled for tonight from 11 PM to 2 AM',
    type: 'system',
    priority: 'high',
    isRead: true,
    createdAt: '2024-01-26T15:00:00Z',
    updatedAt: '2024-01-27T08:00:00Z',
    metadata: {
      maintenanceStart: '2024-01-27T23:00:00Z',
      maintenanceEnd: '2024-01-28T02:00:00Z'
    }
  },
  {
    id: 'NOT004',
    title: 'Insurance Claim Approved',
    message: 'Insurance claim CLM-2024-001 has been approved for $187.50',
    type: 'success',
    priority: 'medium',
    isRead: false,
    createdAt: '2024-01-26T14:20:00Z',
    updatedAt: '2024-01-26T14:20:00Z',
    actionUrl: '/billing',
    actionText: 'View Claim',
    relatedId: 'CLM001',
    metadata: {
      claimAmount: 187.50,
      approvedAmount: 187.50,
      insuranceProvider: 'Blue Cross Blue Shield'
    }
  },
  {
    id: 'NOT005',
    title: 'Patient No-Show Alert',
    message: 'Patient John Doe did not show up for their 4:00 PM appointment',
    type: 'warning',
    priority: 'medium',
    isRead: true,
    createdAt: '2024-01-26T16:30:00Z',
    updatedAt: '2024-01-26T17:00:00Z',
    actionUrl: '/appointments',
    actionText: 'Reschedule',
    relatedId: 'APT009',
    metadata: {
      patientName: 'John Doe',
      appointmentTime: '16:00',
      missedDate: '2024-01-26'
    }
  },
  {
    id: 'NOT006',
    title: 'New Patient Registration',
    message: 'A new patient Sarah Johnson has registered and needs verification',
    type: 'info',
    priority: 'low',
    isRead: false,
    createdAt: '2024-01-26T11:45:00Z',
    updatedAt: '2024-01-26T11:45:00Z',
    actionUrl: '/patients',
    actionText: 'Review Patient',
    relatedId: 'PAT009',
    metadata: {
      patientName: 'Sarah Johnson',
      registrationDate: '2024-01-26'
    }
  },
  {
    id: 'NOT007',
    title: 'Overdue Invoice Alert',
    message: 'Invoice INV003 is now 30 days overdue. Amount: $165.75',
    type: 'error',
    priority: 'high',
    isRead: false,
    createdAt: '2024-01-26T09:00:00Z',
    updatedAt: '2024-01-26T09:00:00Z',
    actionUrl: '/billing',
    actionText: 'Send Reminder',
    relatedId: 'INV003',
    metadata: {
      invoiceAmount: 165.75,
      daysPastDue: 30,
      patientName: 'Michael Brown'
    }
  },
  {
    id: 'NOT008',
    title: 'Appointment Cancelled',
    message: 'Dr. Wilson cancelled the appointment scheduled for tomorrow at 1:00 PM',
    type: 'warning',
    priority: 'high',
    isRead: true,
    createdAt: '2024-01-25T16:20:00Z',
    updatedAt: '2024-01-25T17:00:00Z',
    actionUrl: '/appointments',
    actionText: 'Reschedule',
    relatedId: 'APT007',
    metadata: {
      doctorName: 'Dr. Wilson',
      originalDate: '2024-01-26',
      originalTime: '13:00'
    }
  },
  {
    id: 'NOT009',
    title: 'Lab Results Available',
    message: 'Lab results for patient Emily Davis are now available for review',
    type: 'info',
    priority: 'medium',
    isRead: false,
    createdAt: '2024-01-25T14:30:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    actionUrl: '/patients',
    actionText: 'View Results',
    relatedId: 'PAT005',
    metadata: {
      patientName: 'Emily Davis',
      testType: 'Blood Work',
      resultDate: '2024-01-25'
    }
  },
  {
    id: 'NOT010',
    title: 'Staff Schedule Updated',
    message: 'The staff schedule for next week has been updated. Please review your assignments.',
    type: 'info',
    priority: 'low',
    isRead: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    actionUrl: '/employees',
    actionText: 'View Schedule',
    metadata: {
      weekStart: '2024-01-29',
      weekEnd: '2024-02-04'
    }
  },
  {
    id: 'NOT011',
    title: 'Emergency Contact Update Required',
    message: 'Patient Robert Wilson needs to update their emergency contact information',
    type: 'warning',
    priority: 'medium',
    isRead: false,
    createdAt: '2024-01-24T13:15:00Z',
    updatedAt: '2024-01-24T13:15:00Z',
    actionUrl: '/patients',
    actionText: 'Update Contact',
    relatedId: 'PAT007',
    metadata: {
      patientName: 'Robert Wilson',
      lastUpdated: '2023-06-15'
    }
  },
  {
    id: 'NOT012',
    title: 'Prescription Refill Request',
    message: 'Patient Lisa Anderson has requested a refill for their medication',
    type: 'info',
    priority: 'medium',
    isRead: true,
    createdAt: '2024-01-24T11:00:00Z',
    updatedAt: '2024-01-24T14:30:00Z',
    actionUrl: '/patients',
    actionText: 'Process Refill',
    relatedId: 'PAT008',
    metadata: {
      patientName: 'Lisa Anderson',
      medication: 'Lisinopril 10mg',
      lastFilled: '2024-01-10'
    }
  }
];

// Helper functions
export const getNotificationById = (id: string): Notification | undefined => {
  return mockNotifications.find(notification => notification.id === id);
};

export const getNotificationsByType = (type: Notification['type']): Notification[] => {
  return mockNotifications.filter(notification => notification.type === type);
};

export const getNotificationsByPriority = (priority: Notification['priority']): Notification[] => {
  return mockNotifications.filter(notification => notification.priority === priority);
};

export const getUnreadNotifications = (): Notification[] => {
  return mockNotifications.filter(notification => !notification.isRead);
};

export const getRecentNotifications = (days: number = 7): Notification[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return mockNotifications.filter(notification => 
    new Date(notification.createdAt) >= cutoffDate
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const markNotificationAsRead = (id: string): void => {
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
    notification.updatedAt = new Date().toISOString();
  }
};

export const markAllNotificationsAsRead = (): void => {
  const now = new Date().toISOString();
  mockNotifications.forEach(notification => {
    if (!notification.isRead) {
      notification.isRead = true;
      notification.updatedAt = now;
    }
  });
};

export const getNotificationStats = () => {
  const total = mockNotifications.length;
  const unread = getUnreadNotifications().length;
  const byType = {
    info: getNotificationsByType('info').length,
    success: getNotificationsByType('success').length,
    warning: getNotificationsByType('warning').length,
    error: getNotificationsByType('error').length,
    appointment: getNotificationsByType('appointment').length,
    billing: getNotificationsByType('billing').length,
    system: getNotificationsByType('system').length
  };
  const byPriority = {
    low: getNotificationsByPriority('low').length,
    medium: getNotificationsByPriority('medium').length,
    high: getNotificationsByPriority('high').length,
    urgent: getNotificationsByPriority('urgent').length
  };

  return {
    total,
    unread,
    read: total - unread,
    byType,
    byPriority
  };
};