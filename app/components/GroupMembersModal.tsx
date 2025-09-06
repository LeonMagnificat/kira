import React, { useState } from 'react';
import type { MessageGroup } from '~/data/mockMessages';
import type { Employee } from '~/data/mockEmployees';
import { EmployeeAvatar } from './EmployeeAvatar';

interface GroupMembersModalProps {
  group: MessageGroup;
  employees: Employee[];
  currentUser: Employee;
  onClose: () => void;
  onUpdateMembers: (groupId: string, newMembers: string[]) => void;
}

export function GroupMembersModal({ 
  group, 
  employees, 
  currentUser, 
  onClose, 
  onUpdateMembers 
}: GroupMembersModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>(group.members);
  const [searchTerm, setSearchTerm] = useState('');

  const groupMembers = employees.filter(emp => group.members.includes(emp.id));
  const availableEmployees = employees.filter(emp => 
    emp.hasSystemAccess && 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isCreator = group.createdBy === currentUser.id;
  const canManageMembers = isCreator || currentUser.category === 'investors';

  const toggleMember = (employeeId: string) => {
    if (employeeId === group.createdBy) return; // Can't remove creator
    
    setSelectedMembers(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSave = () => {
    onUpdateMembers(group.id, selectedMembers);
    onClose();
  };

  const getMemberRole = (employee: Employee) => {
    if (employee.id === group.createdBy) return 'Creator';
    if (employee.category === 'investors') return 'Admin';
    return 'Member';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: group.color }}
              >
                {group.type === 'emergency' ? '🚨' : '👥'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
                <p className="text-sm text-gray-500">{group.members.length} members</p>
              </div>
            </div>
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

        <div className="flex h-96">
          {/* Current Members */}
          <div className="w-1/2 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Current Members</h3>
            </div>
            <div className="overflow-y-auto h-full p-4 space-y-3">
              {groupMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <EmployeeAvatar employee={member} size="small" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getMemberRole(member)} • {member.position}
                      </p>
                    </div>
                  </div>
                  {canManageMembers && member.id !== group.createdBy && (
                    <button
                      onClick={() => toggleMember(member.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Members */}
          {canManageMembers && (
            <div className="w-1/2">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Add Members</h3>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="overflow-y-auto h-full p-4 space-y-3">
                {availableEmployees
                  .filter(emp => !group.members.includes(emp.id))
                  .map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <EmployeeAvatar employee={employee} size="small" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{employee.position}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMember(employee.id)}
                        className="text-green-500 hover:text-green-700 p-1"
                        title="Add member"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {canManageMembers && (
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}