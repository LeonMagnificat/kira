import React, { useState, useMemo } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { sidebarItems } from '~/constants';
import {
  mockAppointments,
  mockAppointmentSlots,
  getAppointmentsByDate,
  getAppointmentsByStatus,
  type Appointment
} from '~/data/mockAppointments';
import { mockEmployees } from '~/data/mockEmployees';
import { mockPatients, getPatientById } from '~/data/mockBilling';
import { formatDate } from '~/utils/billingUtils';

interface OutletContext {
  isSidebarMinimized: boolean;
}

const appointmentsMeta = {
  title: "Appointments",
  description: "Manage and view all appointments in the admin dashboard.",
};

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'no-show': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: Appointment['priority']) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

function Appointments() {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();
  const [activeView, setActiveView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let filtered = mockAppointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (providerFilter !== 'all') {
      filtered = filtered.filter(apt => apt.providerId === providerFilter);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [statusFilter, providerFilter]);

  // Today's appointments
  const todaysAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return getAppointmentsByDate(today);
  }, []);

  // Appointment statistics
  const appointmentStats = useMemo(() => {
    const total = mockAppointments.length;
    const scheduled = getAppointmentsByStatus('scheduled').length;
    const confirmed = getAppointmentsByStatus('confirmed').length;
    const completed = getAppointmentsByStatus('completed').length;
    const cancelled = getAppointmentsByStatus('cancelled').length;
    const noShow = getAppointmentsByStatus('no-show').length;

    return {
      total,
      scheduled,
      confirmed,
      completed,
      cancelled,
      noShow,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0'
    };
  }, []);

  const doctors = mockEmployees.filter(emp => emp.category === 'doctors');

  const views = [
    { id: 'calendar', label: 'Calendar View', icon: '📅' },
    { id: 'list', label: 'List View', icon: '📋' },
    { id: 'today', label: "Today's Schedule", icon: '🗓️' }
  ];

  return (
    <>
      <main className="appointments wrapper">
        <Header title={sidebarItems[3].label} />

        </main>

    <div className="mt-4 lg:flex-row gap-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointmentStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todaysAppointments.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🗓️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{appointmentStats.completionRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No Shows</p>
                <p className="text-2xl font-bold text-gray-900">{appointmentStats.noShow}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-sm rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">All Providers</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors">
                New Appointment
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Export Schedule
              </button>
            </div>
          </div>
        </div>

        {/* View Navigation */}
        <div className="bg-white shadow-sm rounded-2xl mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeView === view.id
                      ? 'border-pink-700 text-pink-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{view.icon}</span>
                  {view.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'list' && (
          <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const patient = getPatientById(appointment.patientId);
                    const provider = mockEmployees.find(emp => emp.id === appointment.providerId);
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                            </div>
                            <div className="text-sm text-gray-500">{appointment.reason}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {provider ? `Dr. ${provider.firstName} ${provider.lastName}` : 'Unknown Provider'}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.roomNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(appointment.appointmentDate)}</div>
                          <div className="text-sm text-gray-500">{appointment.appointmentTime} ({appointment.duration}min)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-900">{appointment.type.replace('-', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(appointment.priority)}`}></div>
                            <span className="capitalize text-sm text-gray-900">{appointment.priority}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-pink-600 hover:text-pink-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'today' && (
          <div className="bg-white shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {todaysAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
              ) : (
                todaysAppointments.map((appointment) => {
                  const patient = getPatientById(appointment.patientId);
                  const provider = mockEmployees.find(emp => emp.id === appointment.providerId);
                  
                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(appointment.priority)}`}></div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                            </h4>
                            <p className="text-sm text-gray-500">{appointment.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{appointment.appointmentTime}</p>
                          <p className="text-sm text-gray-500">{appointment.duration} min</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Dr. {provider ? `${provider.firstName} ${provider.lastName}` : 'Unknown'}
                          </span>
                          <span className="text-sm text-gray-500">{appointment.roomNumber}</span>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="bg-white shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar View</h3>
            <div className="text-center py-12 text-gray-500">
              <span className="text-4xl mb-4 block">📅</span>
              <p>Calendar view will be implemented with a calendar component</p>
              <p className="text-sm mt-2">This would typically integrate with a calendar library like FullCalendar or react-big-calendar</p>
            </div>
          </div>
        )}

            
        </div>
      
    </>
  );
}

export default Appointments;