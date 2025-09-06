import React, { useState, useEffect } from 'react'
import { Header } from '~/components'
import { useOutletContext } from 'react-router-dom'
import { sidebarItems } from '~/constants'
import type { Employee } from '~/data/mockEmployees'
import { mockEmployees } from '~/data/mockEmployees'
import { employeeCategories } from '~/constants/employeeCategories'
import { getStatusColor } from '~/utils/employeeUtils'
import { EmployeeAvatar } from '~/components/EmployeeAvatar'

interface OutletContext {
  isSidebarMinimized: boolean;
}

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [displayedEmployees, setDisplayedEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'doctors' | 'nurses' | 'janitors' | 'investors' | 'members'>('all');
  
  const itemsPerPage = 5;
  const context = useOutletContext<OutletContext>();
  const isSidebarMinimized = context?.isSidebarMinimized || false;

  useEffect(() => {
    setEmployees(mockEmployees);
    setDisplayedEmployees(mockEmployees.slice(0, itemsPerPage));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    const filtered = employees.filter(employee => {
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || employee.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    setDisplayedEmployees(filtered.slice(0, currentPage * itemsPerPage));
  }, [employees, searchTerm, activeCategory, currentPage]);

  const loadMore = async () => {
    setIsLoading(true);
    // Add smooth loading animation
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(prev => prev + 1);
    setIsLoading(false);
  };

  const selectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditedEmployee({ ...employee });
  };

  const closePanel = () => {
    setSelectedEmployee(null);
    setEditedEmployee(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editedEmployee) {
      setEmployees(prev => 
        prev.map(emp => emp.id === editedEmployee.id ? editedEmployee : emp)
      );
      closePanel();
    }
  };

  const hasMoreToLoad = displayedEmployees.length < employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || employee.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  }).length;

  return (
    <>
      <main className="employees wrapper">
        <Header 
          title={sidebarItems[2].label}
        />
      </main>

      <div className={`flex flex-col mt-4 lg:flex-row gap-6 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0 md:ml-[-70px]'
      }`}>
        
        {/* Main Table Section */}
        <div className={`bg-white shadow-sm rounded-2xl mb-0 transition-all duration-300 ease-in-out ${
          selectedEmployee ? 'lg:w-3/4 w-full' : 'w-full'
        }`}>
        
        {/* Category Tabs */}
        <div className="bg-white  rounded-2xl p-6 my-4">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {employeeCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key as any)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === category.key
                      ? 'bg-pink-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeCategory === category.key
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Employees Table */}
          <div className="overflow-x-auto transition-all duration-300 ease-in-out">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Employee</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Position</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Department</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Hire Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 ease-in-out cursor-pointer transform hover:scale-[1.01] ${
                      selectedEmployee?.id === employee.id ? 'bg-pink-50 border-pink-200 shadow-md animate-subtlePulse' : ''
                    }`}
                    onClick={() => selectEmployee(employee)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <EmployeeAvatar employee={employee} size="small" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900 mr-2">
                              {employee.firstName} {employee.lastName}
                            </span>
                            {employee.hasSystemAccess && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                System Access
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900">{employee.position}</div>
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">{employee.department}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          {hasMoreToLoad && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="bg-pink-700 text-white px-6 py-3 rounded-lg hover:bg-pink-800 transition-all duration-300 ease-in-out font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  'Load More Employees'
                )}
              </button>
            </div>
          )}

          {displayedEmployees.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500">No employees found matching your criteria.</p>
            </div>
          )}
        </div>
        </div>

        {/* Side Panel */}
        {selectedEmployee && (
          <div className="lg:w-1/4 w-full bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 ease-in-out transform animate-slideIn">
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Employee' : 'Employee Details'}
              </h2>
              <button
                onClick={closePanel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Employee Card */}
            <div className="space-y-4">
              {/* Profile Section */}
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <EmployeeAvatar employee={selectedEmployee} size="large" />
                  <div className="mt-3">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </h3>
                      {selectedEmployee.hasSystemAccess && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          System Access
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{selectedEmployee.position}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                        {selectedEmployee.status.replace('-', ' ')}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {employeeCategories.find(cat => cat.key === selectedEmployee.category)?.icon} {employeeCategories.find(cat => cat.key === selectedEmployee.category)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedEmployee?.email || ''}
                      onChange={(e) => setEditedEmployee(prev => prev ? {...prev, email: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{selectedEmployee.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedEmployee?.phone || ''}
                      onChange={(e) => setEditedEmployee(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{selectedEmployee.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEmployee?.department || ''}
                      onChange={(e) => setEditedEmployee(prev => prev ? {...prev, department: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{selectedEmployee.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                  <p className="text-gray-900 text-sm">{new Date(selectedEmployee.hireDate).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedEmployee?.salary || ''}
                      onChange={(e) => setEditedEmployee(prev => prev ? {...prev, salary: parseInt(e.target.value)} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">${selectedEmployee.salary.toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployee.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  {isEditing ? (
                    <textarea
                      value={editedEmployee?.notes || ''}
                      onChange={(e) => setEditedEmployee(prev => prev ? {...prev, notes: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{selectedEmployee.notes}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-pink-700 text-white px-4 py-2 rounded-lg hover:bg-pink-800 transition-colors text-sm font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-pink-700 text-white px-4 py-2 rounded-lg hover:bg-pink-800 transition-colors text-sm font-medium"
                  >
                    Edit Employee
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Employees;