import React, { useState, useMemo } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { sidebarItems } from '~/constants';
import {
  mockPatientRecords,
  mockDataQualityIssues,
  mockAccessLogs,
  mockBulkOperations,
  mockSystemMetrics,
  mockComplianceAlerts,
  getRecordsByStatus,
  getDataQualityStats,
  getComplianceStats,
  getAccessStats,
  type PatientRecord,
  type DataQualityIssue,
  type AccessLog,
  type BulkOperation,
  type ComplianceAlert
} from '~/data/mockPatientAdmin';
import { mockEmployees } from '~/data/mockEmployees';

interface OutletContext {
  isSidebarMinimized: boolean;
}

function PatientsAdmin() {
  const { isSidebarMinimized: isMinimized } = useOutletContext<OutletContext>();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Calculate metrics
  const recordStats = useMemo(() => getRecordsByStatus(mockPatientRecords), []);
  const qualityStats = useMemo(() => getDataQualityStats(mockPatientRecords), []);
  const complianceStats = useMemo(() => getComplianceStats(mockComplianceAlerts), []);
  const accessStats = useMemo(() => getAccessStats(mockAccessLogs), []);

  // Filter data based on date range
  const filteredMetrics = useMemo(() => {
    const days = dateRange === 'last7days' ? 7 : dateRange === 'last30days' ? 30 : 90;
    return mockSystemMetrics.slice(0, days);
  }, [dateRange]);

  // Get employee name by ID
  const getEmployeeName = (empId: string) => {
    const employee = mockEmployees.find(emp => emp.id === empId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown User';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: '📊' },
    { id: 'data-quality', label: 'Data Quality', icon: '🔍' },
    { id: 'access-logs', label: 'Access & Security', icon: '🔐' },
    { id: 'bulk-operations', label: 'Bulk Operations', icon: '📦' },
    { id: 'compliance', label: 'Compliance', icon: '⚖️' },
    { id: 'performance', label: 'Performance', icon: '⚡' }
  ];

  return (
    <>
      <main className="patients-admin wrapper">
        <Header title={sidebarItems[6].label} />
        </main>

    <div className={`flex flex-col mt-4 transition-all duration-500 ease-in-out ${
        isMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0 md:ml-[-70px]'
      }`}>

       
        
        {/* Admin Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Administrator Dashboard</h3>
              <p className="text-sm text-blue-700">
                This page provides system oversight and data health monitoring. No sensitive patient information is displayed.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-sm rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High & Critical</option>
                  <option value="medium">Medium & Above</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors">
                Export Report
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm rounded-2xl mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-700 text-pink-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* System Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">{mockPatientRecords.length.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12 today</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Data Quality</p>
                    <p className="text-2xl font-bold text-gray-900">{qualityStats.averageScore.toFixed(1)}%</p>
                    <p className="text-xs text-blue-600">{qualityStats.highQuality} high quality</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{mockDataQualityIssues.filter(i => i.status === 'open').length}</p>
                    <p className="text-xs text-red-600">{mockDataQualityIssues.filter(i => i.severity === 'critical').length} critical</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Access Success</p>
                    <p className="text-2xl font-bold text-gray-900">{accessStats.successRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">{accessStats.failed} failed attempts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Record Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Status Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(recordStats).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-pink-700 h-2 rounded-full" 
                            style={{ width: `${(count / mockPatientRecords.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
                <div className="space-y-4">
                  {filteredMetrics.slice(0, 5).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{metric.date}</p>
                        <p className="text-xs text-gray-600">
                          {metric.newRecords} new • {metric.updatedRecords} updated • {metric.activeUsers} users
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{metric.totalRecords}</p>
                        <p className="text-xs text-gray-600">total records</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Growth Trends */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends (Last 30 Days)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900">
                    {filteredMetrics.reduce((sum, m) => sum + m.newRecords, 0)}
                  </p>
                  <p className="text-sm text-blue-600">New Records</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-900">
                    {filteredMetrics.reduce((sum, m) => sum + m.updatedRecords, 0)}
                  </p>
                  <p className="text-sm text-green-600">Updates</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.max(...filteredMetrics.map(m => m.peakConcurrentUsers))}
                  </p>
                  <p className="text-sm text-purple-600">Peak Users</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-900">
                    {(filteredMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / filteredMetrics.length).toFixed(0)}ms
                  </p>
                  <p className="text-sm text-orange-600">Avg Response</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Quality Tab */}
        {activeTab === 'data-quality' && (
          <div className="space-y-6">
            {/* Quality Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Score Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">High Quality (90-100%)</span>
                    <span className="font-medium text-green-600">{qualityStats.highQuality}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medium Quality (70-89%)</span>
                    <span className="font-medium text-yellow-600">{qualityStats.mediumQuality}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Low Quality (70%)</span>
                    <span className="font-medium text-red-600">{qualityStats.lowQuality}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completeness</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Has Email</span>
                    <span className="font-medium">{mockPatientRecords.filter(r => r.hasEmail).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Has Phone</span>
                    <span className="font-medium">{mockPatientRecords.filter(r => r.hasPhone).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Has Address</span>
                    <span className="font-medium">{mockPatientRecords.filter(r => r.hasAddress).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Has Emergency Contact</span>
                    <span className="font-medium">{mockPatientRecords.filter(r => r.hasEmergencyContact).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Synced</span>
                    <span className="font-medium text-green-600">{mockPatientRecords.filter(r => r.syncStatus === 'synced').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-medium text-yellow-600">{mockPatientRecords.filter(r => r.syncStatus === 'pending').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Failed</span>
                    <span className="font-medium text-red-600">{mockPatientRecords.filter(r => r.syncStatus === 'failed').length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Quality Issues */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Issues</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Record ID</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Issue Type</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Severity</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Description</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Detected</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Assigned To</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDataQualityIssues.map((issue) => (
                      <tr key={issue.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{issue.recordId}</td>
                        <td className="py-3 text-sm text-gray-700 capitalize">{issue.issueType.replace('_', ' ')}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-700">{issue.description}</td>
                        <td className="py-3 text-sm text-gray-700">{formatDate(issue.detectedDate)}</td>
                        <td className="py-3 text-sm text-gray-700">{getEmployeeName(issue.assignedTo || '')}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Duplicate Detection */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Potential Duplicates</h3>
              <div className="space-y-4">
                {mockPatientRecords.filter(r => r.duplicateFlags.length > 0).map((record) => (
                  <div key={record.id} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-900">Record {record.id}</p>
                        <p className="text-sm text-orange-700">
                          Potential duplicates: {record.duplicateFlags.join(', ')}
                        </p>
                        <p className="text-xs text-orange-600">
                          Created: {formatDate(record.recordCreatedDate)} • Quality Score: {record.dataQualityScore}%
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                          Review
                        </button>
                        <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Access & Security Tab */}
        {activeTab === 'access-logs' && (
          <div className="space-y-6">
            {/* Access Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{accessStats.total}</p>
                  <p className="text-sm text-gray-600">Total Access Attempts</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-900">{accessStats.successful}</p>
                  <p className="text-sm text-gray-600">Successful</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-900">{accessStats.failed}</p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">{accessStats.averageDuration.toFixed(0)}ms</p>
                  <p className="text-sm text-gray-600">Avg Duration</p>
                </div>
              </div>
            </div>

            {/* Recent Access Logs */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Access Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Record ID</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">User</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Action</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Timestamp</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">IP Address</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAccessLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{log.recordId}</td>
                        <td className="py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                            <p className="text-xs text-gray-500">{log.userRole}</p>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-700 capitalize">{log.action}</td>
                        <td className="py-3 text-sm text-gray-700">{formatDate(log.timestamp)}</td>
                        <td className="py-3 text-sm text-gray-700">{log.ipAddress}</td>
                        <td className="py-3">
                          {log.success ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-sm text-gray-700">{log.duration}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Failed Access Attempts */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Failed Access Attempts</h3>
              <div className="space-y-4">
                {mockAccessLogs.filter(log => !log.success).map((log) => (
                  <div key={log.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">
                          {log.userName} attempted to {log.action} record {log.recordId}
                        </p>
                        <p className="text-sm text-red-700">
                          Reason: {log.failureReason}
                        </p>
                        <p className="text-xs text-red-600">
                          {formatDate(log.timestamp)} • IP: {log.ipAddress}
                        </p>
                      </div>
                      <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        Investigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bulk Operations Tab */}
        {activeTab === 'bulk-operations' && (
          <div className="space-y-6">
            {/* Operations Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{mockBulkOperations.length}</p>
                  <p className="text-sm text-gray-600">Total Operations</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-900">
                    {mockBulkOperations.filter(op => op.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">
                    {mockBulkOperations.filter(op => op.status === 'processing').length}
                  </p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-900">
                    {mockBulkOperations.filter(op => op.status === 'failed').length}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
            </div>

            {/* Bulk Operations List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bulk Operations</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Operation</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Initiated By</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Started</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Records</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Success Rate</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBulkOperations.map((operation) => (
                      <tr key={operation.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900 capitalize">{operation.operationType}</td>
                        <td className="py-3 text-sm text-gray-700">{getEmployeeName(operation.initiatedBy)}</td>
                        <td className="py-3 text-sm text-gray-700">{formatDate(operation.initiatedDate)}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(operation.status)}`}>
                            {operation.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-700 text-right">{operation.recordsProcessed}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">
                          {operation.recordsProcessed > 0 
                            ? ((operation.recordsSuccessful / operation.recordsProcessed) * 100).toFixed(1)
                            : 0}%
                        </td>
                        <td className="py-3 text-sm text-gray-700">{operation.fileName || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operation Errors */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operation Errors</h3>
              <div className="space-y-4">
                {mockBulkOperations.filter(op => op.errorLog && op.errorLog.length > 0).map((operation) => (
                  <div key={operation.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-yellow-900">
                          {operation.operationType.charAt(0).toUpperCase() + operation.operationType.slice(1)} Operation - {operation.fileName}
                        </p>
                        <p className="text-sm text-yellow-700 mb-2">
                          {operation.recordsFailed} of {operation.recordsProcessed} records failed
                        </p>
                        <div className="space-y-1">
                          {operation.errorLog?.slice(0, 3).map((error, index) => (
                            <p key={index} className="text-xs text-yellow-600">• {error}</p>
                          ))}
                          {operation.errorLog && operation.errorLog.length > 3 && (
                            <p className="text-xs text-yellow-600">... and {operation.errorLog.length - 3} more errors</p>
                          )}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-900">{complianceStats.critical}</p>
                  <p className="text-sm text-gray-600">Critical Alerts</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-900">{complianceStats.high}</p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-900">{complianceStats.open}</p>
                  <p className="text-sm text-gray-600">Open Issues</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{complianceStats.total}</p>
                  <p className="text-sm text-gray-600">Total Alerts</p>
                </div>
              </div>
            </div>

            {/* Compliance Alerts */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h3>
              <div className="space-y-4">
                {mockComplianceAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${
                    alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize mr-2 ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">
                          {alert.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>Detected: {formatDate(alert.detectedDate)}</span>
                          {alert.recordId && <span>Record: {alert.recordId}</span>}
                          {alert.assignedTo && <span>Assigned: {getEmployeeName(alert.assignedTo)}</span>}
                        </div>
                        {alert.resolutionNotes && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <p className="text-xs text-gray-600">Resolution: {alert.resolutionNotes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {alert.status === 'open' && (
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            Investigate
                          </button>
                        )}
                        <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Recommendations */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Recommendations</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Access Control</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Implement multi-factor authentication for all administrative accounts to enhance security.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Data Retention</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Review and archive inactive records older than 7 years to comply with retention policies.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-medium text-yellow-900">Audit Logging</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Enable detailed audit logging for all patient record access and modifications.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-900">Data Quality</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Implement automated data validation rules to prevent incomplete record creation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {(filteredMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / filteredMetrics.length).toFixed(0)}ms
                  </p>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.max(...filteredMetrics.map(m => m.peakConcurrentUsers))}
                  </p>
                  <p className="text-sm text-gray-600">Peak Concurrent Users</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredMetrics.reduce((sum, m) => sum + m.errorCount, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Errors</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">99.2%</p>
                  <p className="text-sm text-gray-600">System Uptime</p>
                </div>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Response Time Trend</h4>
                  <div className="space-y-2">
                    {filteredMetrics.slice(0, 7).map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{metric.date}</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((metric.averageResponseTime / 500) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{metric.averageResponseTime}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">User Activity</h4>
                  <div className="space-y-2">
                    {filteredMetrics.slice(0, 7).map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{metric.date}</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(metric.activeUsers / 30) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{metric.activeUsers} users</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Database Performance</p>
                      <p className="text-xs text-green-600">Query response time</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-900">Excellent</p>
                      <p className="text-xs text-green-600">{'< 100ms avg'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Memory Usage</p>
                      <p className="text-xs text-yellow-600">System memory</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-900">Moderate</p>
                      <p className="text-xs text-yellow-600">72% utilized</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Storage Usage</p>
                      <p className="text-xs text-blue-600">Disk space</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">Good</p>
                      <p className="text-xs text-blue-600">45% utilized</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientsAdmin;