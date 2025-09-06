import React, { useState, useEffect, useRef } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { sidebarItems } from '~/constants';
import { mockEmployees, type Employee } from '~/data/mockEmployees';
import { 
  mockMessageGroups, 
  mockMessages, 
  getMessagesByGroup, 
  getGroupsForEmployee,
  type MessageGroup, 
  type Message 
} from '~/data/mockMessages';
import { EmployeeAvatar } from '~/components/EmployeeAvatar';
import { GroupMembersModal } from '~/components/GroupMembersModal';
import { MessageTemplates } from '~/components/MessageTemplates';

interface OutletContext {
  isSidebarMinimized: boolean;
}

function Messages() {
  const [selectedGroup, setSelectedGroup] = useState<MessageGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState<Employee>(mockEmployees.find(emp => emp.id === 'EMP001')!); // Simulate logged-in user
  const [availableGroups, setAvailableGroups] = useState<MessageGroup[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const context = useOutletContext<OutletContext>();
  const isSidebarMinimized = context?.isSidebarMinimized || false;

  // Get employees with system access for messaging
  const employeesWithAccess = mockEmployees.filter(emp => emp.hasSystemAccess);

  useEffect(() => {
    // Load groups for current user
    const userGroups = getGroupsForEmployee(currentUser.id);
    setAvailableGroups(userGroups);
    
    // Select first group by default
    if (userGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(userGroups[0]);
    }
  }, [currentUser.id, selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      const groupMessages = getMessagesByGroup(selectedGroup.id);
      setMessages(groupMessages);
    }
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Simulate typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    
    if (newMessage.trim()) {
      setIsTyping(true);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const message: Message = {
      id: `MSG${Date.now()}`,
      groupId: selectedGroup.id,
      senderId: currentUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getEmployeeById = (id: string) => {
    return mockEmployees.find(emp => emp.id === id);
  };

  const filteredGroups = availableGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupTypeIcon = (type: MessageGroup['type']) => {
    switch (type) {
      case 'case-discussion': return '🏥';
      case 'department': return '👥';
      case 'emergency': return '🚨';
      case 'general': return '💬';
      default: return '💬';
    }
  };

  const getGroupTypeColor = (type: MessageGroup['type']) => {
    switch (type) {
      case 'case-discussion': return 'bg-blue-100 text-blue-800';
      case 'department': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateMembers = (groupId: string, newMembers: string[]) => {
    setAvailableGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, members: newMembers }
          : group
      )
    );
    
    // Update selected group if it's the one being modified
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => prev ? { ...prev, members: newMembers } : null);
    }
  };

  return (
    <>
      <main className="messages wrapper">
        <Header title={sidebarItems[1].label} />
      </main>

      <div className={`flex flex-col lg:flex-row h-[calc(100vh-200px)] mt-4 gap-6 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0 md:ml-[-70px]'
      }`}>
        
        {/* Groups Sidebar */}
        <div className="lg:w-1/3 w-full bg-white shadow-sm rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Message Groups</h2>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="bg-pink-700 text-white p-2 rounded-lg hover:bg-pink-800 transition-colors"
                title="Create New Group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Groups List */}
          <div className="overflow-y-auto h-full">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedGroup?.id === group.id ? 'bg-pink-50 border-pink-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: group.color }}
                  >
                    {getGroupTypeIcon(group.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                      {group.isPrivate && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{group.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getGroupTypeColor(group.type)}`}>
                        {group.type.replace('-', ' ')}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{group.members.length} members</span>
                        <span>•</span>
                        <span>{formatTime(group.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedGroup ? (
          <div className="lg:w-2/3 w-full bg-white shadow-sm rounded-2xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: selectedGroup.color }}
                  >
                    {getGroupTypeIcon(selectedGroup.type)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedGroup.name}</h2>
                    <p className="text-sm text-gray-500">{selectedGroup.members.length} members • {selectedGroup.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowMembersModal(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Group members"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 relative">
              {messages.map((message) => {
                const sender = getEmployeeById(message.senderId);
                const isCurrentUser = message.senderId === currentUser.id;
                
                return (
                  <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-messageSlideIn`}>
                    <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                      {!isCurrentUser && sender && (
                        <EmployeeAvatar employee={sender} size="small" />
                      )}
                      <div className={`px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${
                        isCurrentUser 
                          ? 'bg-pink-700 text-white rounded-br-sm' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}>
                        {!isCurrentUser && sender && (
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            {sender.firstName} {sender.lastName}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${isCurrentUser ? 'text-pink-200' : 'text-gray-500'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex space-x-1 ml-2">
                              {message.reactions.map((reaction, index) => (
                                <span key={index} className="text-xs hover:scale-125 transition-transform cursor-pointer">
                                  {reaction.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-messageSlideIn">
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
                      <div className="typing-indicator flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
              
              {/* Scroll to Bottom Button */}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-4 bg-pink-700 text-white p-3 rounded-full shadow-lg hover:bg-pink-800 transition-colors animate-fadeInUp"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedGroup.name}...`}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  {/* Emoji Button */}
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Add emoji"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <div className="flex space-x-2">
                  {/* Template Button */}
                  <button
                    type="button"
                    onClick={() => setShowTemplates(true)}
                    className="p-3 text-gray-400 hover:text-gray-600 rounded-2xl hover:bg-gray-100 transition-colors"
                    title="Use template"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  {/* Attachment Button */}
                  <button
                    type="button"
                    className="p-3 text-gray-400 hover:text-gray-600 rounded-2xl hover:bg-gray-100 transition-colors"
                    title="Attach file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-2xl transition-all transform ${
                      newMessage.trim() 
                        ? 'bg-pink-700 text-white hover:bg-pink-800 hover:scale-105 animate-bounce-gentle' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  {selectedGroup.type === 'emergency' && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                      🚨 Emergency Channel
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span>{selectedGroup.members.length} members</span>
                  {selectedGroup.isPrivate && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:w-2/3 w-full bg-white shadow-sm rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a group to start messaging</h3>
              <p className="text-gray-500">Choose a group from the sidebar to view and send messages</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          employees={employeesWithAccess}
          currentUser={currentUser}
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={(group) => {
            setAvailableGroups(prev => [...prev, group]);
            setShowCreateGroup(false);
            setSelectedGroup(group);
          }}
        />
      )}

      {/* Group Members Modal */}
      {showMembersModal && selectedGroup && (
        <GroupMembersModal
          group={selectedGroup}
          employees={employeesWithAccess}
          currentUser={currentUser}
          onClose={() => setShowMembersModal(false)}
          onUpdateMembers={handleUpdateMembers}
        />
      )}

      {/* Message Templates Modal */}
      {showTemplates && (
        <MessageTemplates
          onSelectTemplate={(content) => setNewMessage(content)}
          onClose={() => setShowTemplates(false)}
          groupType={selectedGroup?.type}
        />
      )}
    </>
  );
}

// Create Group Modal Component
interface CreateGroupModalProps {
  employees: Employee[];
  currentUser: Employee;
  onClose: () => void;
  onCreateGroup: (group: MessageGroup) => void;
}

function CreateGroupModal({ employees, currentUser, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupType, setGroupType] = useState<MessageGroup['type']>('general');
  const [groupCategory, setGroupCategory] = useState<MessageGroup['category']>('all-staff');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUser.id]);
  const [isPrivate, setIsPrivate] = useState(false);

  const groupColors = ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#dc2626'];
  const [selectedColor, setSelectedColor] = useState(groupColors[0]);

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    const newGroup: MessageGroup = {
      id: `GRP${Date.now()}`,
      name: groupName.trim(),
      description: groupDescription.trim(),
      type: groupType,
      category: groupCategory,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      members: selectedMembers,
      isPrivate,
      lastActivity: new Date().toISOString(),
      messageCount: 0,
      color: selectedColor
    };

    onCreateGroup(newGroup);
  };

  const toggleMember = (employeeId: string) => {
    if (employeeId === currentUser.id) return; // Can't remove creator
    
    setSelectedMembers(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter group name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the purpose of this group..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value as MessageGroup['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="case-discussion">Case Discussion</option>
                  <option value="department">Department</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={groupCategory}
                  onChange={(e) => setGroupCategory(e.target.value as MessageGroup['category'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all-staff">All Staff</option>
                  <option value="doctors">Doctors</option>
                  <option value="nurses">Nurses</option>
                  <option value="leadership">Leadership</option>
                </select>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Color</label>
              <div className="flex space-x-2">
                {groupColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                Private Group (invitation only)
              </label>
            </div>
          </div>

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Members ({selectedMembers.length} selected)
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className={`p-3 border-b border-gray-100 last:border-b-0 ${
                    employee.id === currentUser.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(employee.id)}
                      onChange={() => toggleMember(employee.id)}
                      disabled={employee.id === currentUser.id}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex items-center">
                      <EmployeeAvatar employee={employee} size="small" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                          {employee.id === currentUser.id && ' (You)'}
                        </p>
                        <p className="text-xs text-gray-500">{employee.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length < 2}
            className="px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;