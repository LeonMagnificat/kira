import React from 'react';

interface EmployeeAvatarProps {
  employee: {
    firstName: string;
    lastName: string;
    hasSystemAccess: boolean;
  };
  size?: 'small' | 'large';
  showSystemAccess?: boolean;
}

export function EmployeeAvatar({ 
  employee, 
  size = 'small', 
  showSystemAccess = true 
}: EmployeeAvatarProps) {
  const sizeClasses = size === 'large' ? 'w-16 h-16' : 'w-10 h-10';
  const iconSize = size === 'large' ? 'w-6 h-6' : 'w-4 h-4';
  const iconSvgSize = size === 'large' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';
  
  // Simple gender detection based on common female names
  const femaleNames = ['sarah', 'lisa', 'emily', 'amanda', 'rosa', 'victoria'];
  const firstName = employee.firstName.toLowerCase().replace('dr. ', '');
  const isFemale = femaleNames.some(name => firstName.includes(name));

  const avatarSrc = isFemale ? '/assets/icons/female.svg' : '/assets/icons/male.svg';

  return (
    <div className="relative">
      <img
        src={avatarSrc}
        alt={`${employee.firstName} ${employee.lastName}`}
        className={`${sizeClasses} rounded-full object-cover bg-gray-100 p-1`}
      />
      {showSystemAccess && employee.hasSystemAccess && (
        <div className={`absolute -bottom-1 -right-1 ${iconSize} bg-green-500 rounded-full flex items-center justify-center`}>
          <svg className={`${iconSvgSize} text-white`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-4 4-4-4 4-4 .257-.257A6 6 0 1118 8zm-6-2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}