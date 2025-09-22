import type { Employee } from '~/data/mockEmployees';
import type { MessageGroup, Message } from '~/data/mockMessages';

export const getUnreadMessageCount = (groups: MessageGroup[], userId: string): number => {
  // In a real app, this would track read/unread status
  // For now, we'll simulate some unread messages
  return Math.floor(Math.random() * 5);
};

export const getLastMessagePreview = (messages: Message[]): string => {
  if (messages.length === 0) return 'No messages yet';
  
  const lastMessage = messages[messages.length - 1];
  return lastMessage.content.length > 50 
    ? lastMessage.content.substring(0, 50) + '...'
    : lastMessage.content;
};

export const canUserAccessGroup = (group: MessageGroup, user: Employee): boolean => {
  // Check if user is a member
  if (!group.members.includes(user.id)) return false;
  
  // Check category restrictions
  switch (group.category) {
    case 'doctors':
      return user.category === 'doctors';
    case 'nurses':
      return user.category === 'nurses';
    case 'leadership':
      return user.category === 'investors' || user.position.toLowerCase().includes('chief');
    case 'all-staff':
      return user.hasSystemAccess;
    default:
      return true;
  }
};

export const getGroupMembersByRole = (group: MessageGroup, employees: Employee[]) => {
  const members = employees.filter(emp => group.members.includes(emp.id));
  
  return {
    doctors: members.filter(emp => emp.category === 'doctors'),
    nurses: members.filter(emp => emp.category === 'nurses'),
    leadership: members.filter(emp => emp.category === 'investors'),
    others: members.filter(emp => !['doctors', 'nurses', 'investors'].includes(emp.category))
  };
};

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getGroupStatusColor = (type: MessageGroup['type']): string => {
  switch (type) {
    case 'emergency':
      return 'text-danger';
    case 'case-discussion':
      return 'text-accent';
    case 'department':
      return 'text-success';
    default:
      return 'text-muted-foreground';
  }
};

export const isUrgentGroup = (group: MessageGroup): boolean => {
  return group.type === 'emergency' || group.name.toLowerCase().includes('urgent');
};

export const getMentions = (message: string, employees: Employee[]): Employee[] => {
  const mentions: Employee[] = [];
  const words = message.split(' ');
  
  words.forEach(word => {
    if (word.startsWith('@')) {
      const name = word.substring(1).toLowerCase();
      const mentioned = employees.find(emp => 
        emp.firstName.toLowerCase().includes(name) || 
        emp.lastName.toLowerCase().includes(name)
      );
      if (mentioned) {
        mentions.push(mentioned);
      }
    }
  });
  
  return mentions;
};

export const highlightMentions = (message: string, currentUserId: string, employees: Employee[]): string => {
  let highlightedMessage = message;
  const mentions = getMentions(message, employees);
  
  mentions.forEach(mentioned => {
    const mentionPattern = new RegExp(`@${mentioned.firstName}`, 'gi');
    const isCurrentUser = mentioned.id === currentUserId;
    const highlightClass = isCurrentUser ? 'bg-yellow-200 font-semibold' : 'bg-blue-100 font-medium';
    
    highlightedMessage = highlightedMessage.replace(
      mentionPattern, 
      `<span class="${highlightClass}">@${mentioned.firstName}</span>`
    );
  });
  
  return highlightedMessage;
};