export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  isEdited?: boolean;
  editedAt?: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

export interface MessageGroup {
  id: string;
  name: string;
  description: string;
  type: 'case-discussion' | 'department' | 'general' | 'emergency';
  category: 'doctors' | 'nurses' | 'all-staff' | 'leadership';
  createdBy: string;
  createdAt: string;
  members: string[]; // Employee IDs
  isPrivate: boolean;
  lastActivity: string;
  messageCount: number;
  avatar?: string;
  color: string;
}

export const mockMessageGroups: MessageGroup[] = [
  {
    id: "GRP001",
    name: "Cardiac Surgery Team",
    description: "Discussion group for cardiac surgery cases and procedures",
    type: "case-discussion",
    category: "doctors",
    createdBy: "EMP001", // Dr. Sarah Johnson
    createdAt: "2024-01-15T09:00:00Z",
    members: ["EMP001", "EMP003", "EMP004", "EMP005"], // Doctors and nurses
    isPrivate: false,
    lastActivity: "2024-01-20T14:30:00Z",
    messageCount: 45,
    color: "#ef4444"
  },
  {
    id: "GRP002",
    name: "Pediatric Care Unit",
    description: "Coordination and case discussions for pediatric patients",
    type: "case-discussion",
    category: "doctors",
    createdBy: "EMP002", // Dr. Robert Williams
    createdAt: "2024-01-10T10:30:00Z",
    members: ["EMP002", "EMP004", "EMP005"],
    isPrivate: false,
    lastActivity: "2024-01-19T16:45:00Z",
    messageCount: 32,
    color: "#3b82f6"
  },
  {
    id: "GRP003",
    name: "Medical Department",
    description: "General discussions for all medical staff",
    type: "department",
    category: "doctors",
    createdBy: "EMP001",
    createdAt: "2024-01-05T08:00:00Z",
    members: ["EMP001", "EMP002", "EMP003"],
    isPrivate: false,
    lastActivity: "2024-01-20T11:20:00Z",
    messageCount: 78,
    color: "#10b981"
  },
  {
    id: "GRP004",
    name: "Nursing Team",
    description: "Coordination and support for nursing staff",
    type: "department",
    category: "nurses",
    createdBy: "EMP005", // Lisa Martinez (Head Nurse)
    createdAt: "2024-01-08T07:30:00Z",
    members: ["EMP004", "EMP005"],
    isPrivate: false,
    lastActivity: "2024-01-20T13:15:00Z",
    messageCount: 56,
    color: "#8b5cf6"
  },
  {
    id: "GRP005",
    name: "Leadership Council",
    description: "Strategic discussions and decision making",
    type: "general",
    category: "leadership",
    createdBy: "EMP010", // Richard Sterling
    createdAt: "2024-01-01T12:00:00Z",
    members: ["EMP001", "EMP010", "EMP011"],
    isPrivate: true,
    lastActivity: "2024-01-20T09:45:00Z",
    messageCount: 23,
    color: "#f59e0b"
  },
  {
    id: "GRP006",
    name: "Emergency Response",
    description: "Quick coordination for emergency situations",
    type: "emergency",
    category: "all-staff",
    createdBy: "EMP001",
    createdAt: "2024-01-01T00:00:00Z",
    members: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005", "EMP006"],
    isPrivate: false,
    lastActivity: "2024-01-18T22:30:00Z",
    messageCount: 12,
    color: "#dc2626"
  }
];

export const mockMessages: Message[] = [
  // Cardiac Surgery Team Messages
  {
    id: "MSG001",
    groupId: "GRP001",
    senderId: "EMP001",
    content: "Good morning team! We have a complex cardiac bypass scheduled for 2 PM today. Patient is 65-year-old male with triple vessel disease.",
    timestamp: "2024-01-20T08:30:00Z",
    type: "text"
  },
  {
    id: "MSG002",
    groupId: "GRP001",
    senderId: "EMP003",
    content: "I've reviewed the pre-op imaging. The LAD stenosis is severe at 95%. We should plan for LIMA to LAD graft.",
    timestamp: "2024-01-20T08:45:00Z",
    type: "text"
  },
  {
    id: "MSG003",
    groupId: "GRP001",
    senderId: "EMP004",
    content: "Patient's vitals are stable. Pre-op checklist completed. Ready for surgery.",
    timestamp: "2024-01-20T13:30:00Z",
    type: "text"
  },
  {
    id: "MSG004",
    groupId: "GRP001",
    senderId: "EMP005",
    content: "OR 3 is prepped and ready. All equipment checked and functioning.",
    timestamp: "2024-01-20T13:45:00Z",
    type: "text"
  },
  {
    id: "MSG005",
    groupId: "GRP001",
    senderId: "EMP001",
    content: "Excellent work everyone. Surgery completed successfully. Patient is stable and heading to recovery.",
    timestamp: "2024-01-20T17:15:00Z",
    type: "text",
    reactions: [
      { emoji: "👏", userId: "EMP003", timestamp: "2024-01-20T17:16:00Z" },
      { emoji: "👏", userId: "EMP004", timestamp: "2024-01-20T17:16:00Z" },
      { emoji: "❤️", userId: "EMP005", timestamp: "2024-01-20T17:17:00Z" }
    ]
  },

  // Pediatric Care Unit Messages
  {
    id: "MSG006",
    groupId: "GRP002",
    senderId: "EMP002",
    content: "We have a 7-year-old with suspected appendicitis in ER. Symptoms started 6 hours ago.",
    timestamp: "2024-01-19T14:20:00Z",
    type: "text"
  },
  {
    id: "MSG007",
    groupId: "GRP002",
    senderId: "EMP004",
    content: "I'll prepare the pediatric assessment room. Parents are quite anxious.",
    timestamp: "2024-01-19T14:25:00Z",
    type: "text"
  },
  {
    id: "MSG008",
    groupId: "GRP002",
    senderId: "EMP002",
    content: "CT scan confirms appendicitis. We need to schedule surgery immediately. Contacting Dr. Thompson.",
    timestamp: "2024-01-19T15:30:00Z",
    type: "text"
  },

  // Medical Department Messages
  {
    id: "MSG009",
    groupId: "GRP003",
    senderId: "EMP001",
    content: "Monthly department meeting scheduled for Friday at 3 PM. Please review the quality metrics report beforehand.",
    timestamp: "2024-01-20T09:00:00Z",
    type: "text"
  },
  {
    id: "MSG010",
    groupId: "GRP003",
    senderId: "EMP003",
    content: "Patient satisfaction scores have improved by 15% this quarter. Great work everyone!",
    timestamp: "2024-01-20T10:30:00Z",
    type: "text",
    reactions: [
      { emoji: "🎉", userId: "EMP001", timestamp: "2024-01-20T10:31:00Z" },
      { emoji: "👍", userId: "EMP002", timestamp: "2024-01-20T10:32:00Z" }
    ]
  },

  // Nursing Team Messages
  {
    id: "MSG011",
    groupId: "GRP004",
    senderId: "EMP005",
    content: "Reminder: New IV protocol training tomorrow at 8 AM in conference room B.",
    timestamp: "2024-01-20T12:00:00Z",
    type: "text"
  },
  {
    id: "MSG012",
    groupId: "GRP004",
    senderId: "EMP004",
    content: "I'll be there! Looking forward to learning the new techniques.",
    timestamp: "2024-01-20T12:15:00Z",
    type: "text"
  },

  // Leadership Council Messages
  {
    id: "MSG013",
    groupId: "GRP005",
    senderId: "EMP010",
    content: "Q4 financial review shows 12% growth. We should discuss expansion plans for the new wing.",
    timestamp: "2024-01-20T08:00:00Z",
    type: "text"
  },
  {
    id: "MSG014",
    groupId: "GRP005",
    senderId: "EMP011",
    content: "I've prepared the investment analysis. The ROI projections look very promising.",
    timestamp: "2024-01-20T09:30:00Z",
    type: "text"
  },

  // Emergency Response Messages
  {
    id: "MSG015",
    groupId: "GRP006",
    senderId: "EMP001",
    content: "🚨 EMERGENCY: Multi-vehicle accident incoming. ETA 10 minutes. All hands on deck!",
    timestamp: "2024-01-18T22:25:00Z",
    type: "text"
  },
  {
    id: "MSG016",
    groupId: "GRP006",
    senderId: "EMP005",
    content: "Trauma bay 1 and 2 are ready. Extra staff called in.",
    timestamp: "2024-01-18T22:27:00Z",
    type: "text"
  },
  {
    id: "MSG017",
    groupId: "GRP006",
    senderId: "EMP003",
    content: "OR 1 on standby for emergency surgery if needed.",
    timestamp: "2024-01-18T22:28:00Z",
    type: "text"
  }
];

// Helper function to get messages for a specific group
export const getMessagesByGroup = (groupId: string): Message[] => {
  return mockMessages
    .filter(message => message.groupId === groupId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Helper function to get groups for a specific employee
export const getGroupsForEmployee = (employeeId: string): MessageGroup[] => {
  return mockMessageGroups.filter(group => group.members.includes(employeeId));
};

// Helper function to get employees with system access (can use messaging)
export const getEmployeesWithMessagingAccess = () => {
  // This would typically import from mockEmployees, but to avoid circular imports,
  // we'll define the logic here or in the component
  return [];
};