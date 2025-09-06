import React, { useState, useMemo } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { sidebarItems } from '~/constants';
import {
  mockInvoices,
  mockPatients,
  mockServiceCodes,
  mockInsuranceClaims,
  mockPayments,
  getPatientById,
  type Invoice,
  type Patient,
  type ServiceCode,
  type InsuranceClaim,
  type Payment
} from '~/data/mockBilling';
import { mockEmployees, type Employee } from '~/data/mockEmployees';
import {
  mockAppointments,
  getAppointmentsByStatus,
  type Appointment
} from '~/data/mockAppointments';
import { formatCurrency, formatDate, getStatusColor } from '~/utils/billingUtils';

interface OutletContext {
  isMinimized: boolean;
}

// Enhanced analytics functions
const getAgeGroup = (dateOfBirth: string): string => {
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  if (age < 18) return '0-17';
  if (age < 35) return '18-34';
  if (age < 50) return '35-49';
  if (age < 65) return '50-64';
  return '65+';
};

const getSeasonFromDate = (date: string): string => {
  const month = new Date(date).getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Fall';
  return 'Winter';
};

const getDayOfWeek = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
};

const getTimeOfDay = (date: string): string => {
  const hour = new Date(date).getHours();
  if (hour < 6) return 'Night (12AM-6AM)';
  if (hour < 12) return 'Morning (6AM-12PM)';
  if (hour < 18) return 'Afternoon (12PM-6PM)';
  return 'Evening (6PM-12AM)';
};

function Reports() {
  const { isMinimized } = useOutletContext<OutletContext>();
  const [activeTab, setActiveTab] = useState('financial');
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedProvider, setSelectedProvider] = useState('all');

  // Filter data based on date range
  const filteredInvoices = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case 'last7days':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'last30days':
        filterDate.setDate(now.getDate() - 30);
        break;
      case 'last90days':
        filterDate.setDate(now.getDate() - 90);
        break;
      case 'last12months':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        filterDate.setDate(now.getDate() - 30);
    }

    return mockInvoices.filter(invoice => 
      new Date(invoice.dateOfService) >= filterDate &&
      (selectedProvider === 'all' || invoice.items.some(item => item.providerId === selectedProvider))
    );
  }, [dateRange, selectedProvider]);

  // Financial Analytics
  const financialMetrics = useMemo(() => {
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCollected = filteredInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalOutstanding = filteredInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
    const collectionRate = totalRevenue > 0 ? (totalCollected / totalRevenue) * 100 : 0;
    
    const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid').length;
    const overdueInvoices = filteredInvoices.filter(inv => inv.status === 'overdue').length;
    
    return {
      totalRevenue,
      totalCollected,
      totalOutstanding,
      collectionRate,
      averageInvoiceValue: filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0,
      paidInvoices,
      overdueInvoices,
      totalInvoices: filteredInvoices.length
    };
  }, [filteredInvoices]);

  // Service Analytics
  const serviceAnalytics = useMemo(() => {
    const serviceStats = new Map();
    
    filteredInvoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const key = item.serviceCode;
        if (!serviceStats.has(key)) {
          serviceStats.set(key, {
            code: item.serviceCode,
            description: item.description,
            count: 0,
            revenue: 0,
            avgPrice: 0,
            category: mockServiceCodes.find(s => s.code === item.serviceCode)?.category || 'other'
          });
        }
        const stat = serviceStats.get(key);
        stat.count += item.quantity;
        stat.revenue += item.totalPrice;
        stat.avgPrice = stat.revenue / stat.count;
      });
    });

    return Array.from(serviceStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredInvoices]);

  // Patient Demographics Analytics
  const patientAnalytics = useMemo(() => {
    const patientIds = new Set(filteredInvoices.map(inv => inv.patientId));
    const patients = Array.from(patientIds).map(id => getPatientById(id)).filter(Boolean) as Patient[];
    
    const ageGroups = new Map();
    const insuranceProviders = new Map();
    const genderStats = new Map();
    
    patients.forEach(patient => {
      // Age groups
      const ageGroup = getAgeGroup(patient.dateOfBirth);
      ageGroups.set(ageGroup, (ageGroups.get(ageGroup) || 0) + 1);
      
      // Insurance providers
      const provider = patient.insuranceInfo.provider;
      insuranceProviders.set(provider, (insuranceProviders.get(provider) || 0) + 1);
    });

    return {
      totalPatients: patients.length,
      ageGroups: Array.from(ageGroups.entries()).map(([group, count]) => ({ group, count })),
      insuranceProviders: Array.from(insuranceProviders.entries()).map(([provider, count]) => ({ provider, count })),
      averageAge: patients.reduce((sum, p) => {
        const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
        return sum + age;
      }, 0) / patients.length
    };
  }, [filteredInvoices]);

  // Seasonal and Time Analytics
  const temporalAnalytics = useMemo(() => {
    const seasonStats = new Map();
    const dayStats = new Map();
    const monthlyRevenue = new Map();
    
    filteredInvoices.forEach(invoice => {
      const season = getSeasonFromDate(invoice.dateOfService);
      const day = getDayOfWeek(invoice.dateOfService);
      const month = new Date(invoice.dateOfService).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      seasonStats.set(season, (seasonStats.get(season) || 0) + invoice.totalAmount);
      dayStats.set(day, (dayStats.get(day) || 0) + invoice.totalAmount);
      monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + invoice.totalAmount);
    });

    return {
      seasonalRevenue: Array.from(seasonStats.entries()).map(([season, revenue]) => ({ season, revenue })),
      dailyRevenue: Array.from(dayStats.entries()).map(([day, revenue]) => ({ day, revenue })),
      monthlyRevenue: Array.from(monthlyRevenue.entries()).map(([month, revenue]) => ({ month, revenue }))
    };
  }, [filteredInvoices]);

  // Provider Performance Analytics
  const providerAnalytics = useMemo(() => {
    const providerStats = new Map();
    
    filteredInvoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const providerId = item.providerId;
        const provider = mockEmployees.find(emp => emp.id === providerId);
        
        if (provider) {
          if (!providerStats.has(providerId)) {
            providerStats.set(providerId, {
              id: providerId,
              name: `${provider.firstName} ${provider.lastName}`,
              department: provider.department,
              position: provider.position,
              revenue: 0,
              patientCount: new Set(),
              serviceCount: 0,
              avgServiceValue: 0
            });
          }
          
          const stat = providerStats.get(providerId);
          stat.revenue += item.totalPrice;
          stat.patientCount.add(invoice.patientId);
          stat.serviceCount += item.quantity;
        }
      });
    });

    return Array.from(providerStats.values())
      .map(stat => ({
        ...stat,
        patientCount: stat.patientCount.size,
        avgServiceValue: stat.serviceCount > 0 ? stat.revenue / stat.serviceCount : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredInvoices]);

  // Insurance Analytics
  const insuranceAnalytics = useMemo(() => {
    const insuranceStats = new Map();
    const claimStats = {
      pending: 0,
      approved: 0,
      denied: 0,
      partial: 0,
      resubmitted: 0,
      totalClaimed: 0,
      totalApproved: 0
    };

    filteredInvoices.forEach(invoice => {
      const patient = getPatientById(invoice.patientId);
      if (patient) {
        const provider = patient.insuranceInfo.provider;
        if (!insuranceStats.has(provider)) {
          insuranceStats.set(provider, {
            provider,
            totalBilled: 0,
            totalCovered: 0,
            patientCount: new Set(),
            avgCoverage: 0,
            avgCopay: 0
          });
        }
        
        const stat = insuranceStats.get(provider);
        stat.totalBilled += invoice.totalAmount;
        stat.totalCovered += invoice.items.reduce((sum, item) => sum + item.insuranceCovered, 0);
        stat.patientCount.add(invoice.patientId);
        stat.avgCopay += patient.insuranceInfo.copay;
      }
    });

    mockInsuranceClaims.forEach(claim => {
      claimStats[claim.status]++;
      claimStats.totalClaimed += claim.claimedAmount;
      claimStats.totalApproved += claim.approvedAmount;
    });

    return {
      providerStats: Array.from(insuranceStats.values()).map(stat => ({
        ...stat,
        patientCount: stat.patientCount.size,
        avgCoverage: stat.totalBilled > 0 ? (stat.totalCovered / stat.totalBilled) * 100 : 0,
        avgCopay: stat.patientCount > 0 ? stat.avgCopay / stat.patientCount : 0
      })),
      claimStats
    };
  }, [filteredInvoices]);

  // Appointment Analytics
  const appointmentAnalytics = useMemo(() => {
    const filteredAppointments = mockAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'last7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case 'last90days':
          filterDate.setDate(now.getDate() - 90);
          break;
        case 'last12months':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          filterDate.setDate(now.getDate() - 30);
      }

      return appointmentDate >= filterDate &&
        (selectedProvider === 'all' || appointment.providerId === selectedProvider);
    });

    const statusStats = new Map();
    const typeStats = new Map();
    const priorityStats = new Map();
    const hourlyStats = new Map();
    const providerAppointmentStats = new Map();
    
    let totalDuration = 0;
    let completedAppointments = 0;
    let noShowCount = 0;
    let cancelledCount = 0;

    filteredAppointments.forEach(appointment => {
      // Status statistics
      statusStats.set(appointment.status, (statusStats.get(appointment.status) || 0) + 1);
      
      // Type statistics
      typeStats.set(appointment.type, (typeStats.get(appointment.type) || 0) + 1);
      
      // Priority statistics
      priorityStats.set(appointment.priority, (priorityStats.get(appointment.priority) || 0) + 1);
      
      // Hourly distribution
      const hour = parseInt(appointment.appointmentTime.split(':')[0]);
      hourlyStats.set(hour, (hourlyStats.get(hour) || 0) + 1);
      
      // Provider statistics
      if (!providerAppointmentStats.has(appointment.providerId)) {
        const provider = mockEmployees.find(emp => emp.id === appointment.providerId);
        providerAppointmentStats.set(appointment.providerId, {
          providerId: appointment.providerId,
          name: provider ? `Dr. ${provider.firstName} ${provider.lastName}` : 'Unknown',
          totalAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          noShowAppointments: 0,
          totalDuration: 0,
          avgDuration: 0,
          completionRate: 0
        });
      }
      
      const providerStat = providerAppointmentStats.get(appointment.providerId);
      providerStat.totalAppointments++;
      providerStat.totalDuration += appointment.duration;
      
      if (appointment.status === 'completed') {
        providerStat.completedAppointments++;
        completedAppointments++;
      } else if (appointment.status === 'cancelled') {
        providerStat.cancelledAppointments++;
        cancelledCount++;
      } else if (appointment.status === 'no-show') {
        providerStat.noShowAppointments++;
        noShowCount++;
      }
      
      totalDuration += appointment.duration;
    });

    // Calculate provider completion rates
    providerAppointmentStats.forEach((stat, providerId) => {
      stat.avgDuration = stat.totalAppointments > 0 ? stat.totalDuration / stat.totalAppointments : 0;
      stat.completionRate = stat.totalAppointments > 0 ? (stat.completedAppointments / stat.totalAppointments) * 100 : 0;
    });

    return {
      totalAppointments: filteredAppointments.length,
      completedAppointments,
      noShowCount,
      cancelledCount,
      completionRate: filteredAppointments.length > 0 ? (completedAppointments / filteredAppointments.length) * 100 : 0,
      noShowRate: filteredAppointments.length > 0 ? (noShowCount / filteredAppointments.length) * 100 : 0,
      avgDuration: filteredAppointments.length > 0 ? totalDuration / filteredAppointments.length : 0,
      statusDistribution: Array.from(statusStats.entries()).map(([status, count]) => ({ status, count })),
      typeDistribution: Array.from(typeStats.entries()).map(([type, count]) => ({ type, count })),
      priorityDistribution: Array.from(priorityStats.entries()).map(([priority, count]) => ({ priority, count })),
      hourlyDistribution: Array.from(hourlyStats.entries()).map(([hour, count]) => ({ hour, count })).sort((a, b) => a.hour - b.hour),
      providerStats: Array.from(providerAppointmentStats.values()).sort((a, b) => b.totalAppointments - a.totalAppointments)
    };
  }, [dateRange, selectedProvider]);

  const tabs = [
    { id: 'financial', label: 'Financial Performance', icon: '💰' },
    { id: 'services', label: 'Service Analytics', icon: '🏥' },
    { id: 'patients', label: 'Patient Demographics', icon: '👥' },
    { id: 'providers', label: 'Provider Performance', icon: '👨‍⚕️' },
    { id: 'appointments', label: 'Appointment Analytics', icon: '📅' },
    { id: 'insurance', label: 'Insurance Analytics', icon: '🏛️' },
    { id: 'temporal', label: 'Seasonal Trends', icon: '🗓️' },
    { id: 'operational', label: 'Operational Insights', icon: '📊' }
  ];

  const doctors = mockEmployees.filter(emp => emp.category === 'doctors');

  return (
    <>
      <main className="reports wrapper">
        <Header title={sidebarItems[6]?.label || 'Reports & Analytics'} />
        </main>
        
        {/* Controls */}

        <div className={`mt-4 lg:flex-row gap-6 transition-all duration-500 ease-in-out ${
        isMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0 md:ml-[-70px]'
      }`}>
        
            
        <div className="bg-white shadow-sm rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="last12months">Last 12 Months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
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
                Export Report
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Print
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

        {/* Financial Performance Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialMetrics.totalRevenue)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Collected</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialMetrics.totalCollected)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Outstanding</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialMetrics.totalOutstanding)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{financialMetrics.collectionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Trend */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-3">
                    {temporalAnalytics.monthlyRevenue.slice(0, 6).map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{month.month}</span>
                        <span className="font-medium">{formatCurrency(month.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Average Invoice Value</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(financialMetrics.averageInvoiceValue)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Payment Success Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {((financialMetrics.paidInvoices / financialMetrics.totalInvoices) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Analytics Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue Generating Services</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Service Code</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Description</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Category</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Count</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Revenue</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceAnalytics.map((service, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{service.code}</td>
                        <td className="py-3 text-sm text-gray-700">{service.description}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                            service.category === 'surgery' ? 'bg-red-100 text-red-800' :
                            service.category === 'diagnostic' ? 'bg-blue-100 text-blue-800' :
                            service.category === 'consultation' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {service.category}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-700 text-right">{service.count}</td>
                        <td className="py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(service.revenue)}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(service.avgPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Service Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
                <div className="space-y-3">
                  {Object.entries(
                    serviceAnalytics.reduce((acc, service) => {
                      acc[service.category] = (acc[service.category] || 0) + service.revenue;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([category, revenue]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{category}</span>
                     
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Frequency</h3>
                <div className="space-y-3">
                  {serviceAnalytics.slice(0, 5).map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{service.code}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-pink-700 h-2 rounded-full" 
                            style={{ width: `${(service.count / serviceAnalytics[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{service.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Demographics Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                <div className="space-y-3">
                  {patientAnalytics.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{group.group} years</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(group.count / patientAnalytics.totalPatients) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{group.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Providers</h3>
                <div className="space-y-3">
                  {patientAnalytics.insuranceProviders.map((provider, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{provider.provider}</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(provider.count / patientAnalytics.totalPatients) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{provider.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Statistics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Total Active Patients</p>
                    <p className="text-2xl font-bold text-blue-900">{patientAnalytics.totalPatients}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Average Patient Age</p>
                    <p className="text-2xl font-bold text-green-900">{patientAnalytics.averageAge.toFixed(1)} years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Provider Performance Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Performance Rankings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Rank</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Provider</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Department</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Revenue</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Patients</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Services</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Avg Service Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerAnalytics.map((provider, index) => (
                      <tr key={provider.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">#{index + 1}</td>
                        <td className="py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                            <p className="text-xs text-gray-500">{provider.position}</p>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-700">{provider.department}</td>
                        <td className="py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(provider.revenue)}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.patientCount}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.serviceCount}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(provider.avgServiceValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Analytics Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.totalAppointments}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-2xl">📅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.completionRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">No-Show Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.noShowRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <span className="text-2xl">❌</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.avgDuration.toFixed(0)}min</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
                <div className="space-y-3">
                  {appointmentAnalytics.statusDistribution.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{status.status.replace('-', ' ')}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-pink-700 h-2 rounded-full" 
                            style={{ width: `${(status.count / appointmentAnalytics.totalAppointments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{status.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Types</h3>
                <div className="space-y-3">
                  {appointmentAnalytics.typeDistribution.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{type.type.replace('-', ' ')}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(type.count / appointmentAnalytics.totalAppointments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{type.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                <div className="space-y-3">
                  {appointmentAnalytics.priorityDistribution.map((priority, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{priority.priority}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${(priority.count / appointmentAnalytics.totalAppointments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{priority.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Distribution</h3>
                <div className="space-y-2">
                  {appointmentAnalytics.hourlyDistribution.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{hour.hour}:00</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(hour.count / Math.max(...appointmentAnalytics.hourlyDistribution.map(h => h.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{hour.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Performance Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Appointment Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Provider</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Total</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Completed</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Cancelled</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">No-Show</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Completion Rate</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-500">Avg Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentAnalytics.providerStats.map((provider, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3">
                          <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                        </td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.totalAppointments}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.completedAppointments}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.cancelledAppointments}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.noShowAppointments}</td>
                        <td className="py-3 text-sm font-medium text-gray-900 text-right">{provider.completionRate.toFixed(1)}%</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.avgDuration.toFixed(0)}min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Insurance Analytics Tab */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Status Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800">Pending Claims</span>
                    <span className="text-lg font-bold text-yellow-900">{insuranceAnalytics.claimStats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Approved Claims</span>
                    <span className="text-lg font-bold text-green-900">{insuranceAnalytics.claimStats.approved}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-800">Denied Claims</span>
                    <span className="text-lg font-bold text-red-900">{insuranceAnalytics.claimStats.denied}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Partial Claims</span>
                    <span className="text-lg font-bold text-blue-900">{insuranceAnalytics.claimStats.partial}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reimbursement Summary</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Claimed</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(insuranceAnalytics.claimStats.totalClaimed)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Approved</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(insuranceAnalytics.claimStats.totalApproved)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Approval Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {insuranceAnalytics.claimStats.totalClaimed > 0 
                        ? ((insuranceAnalytics.claimStats.totalApproved / insuranceAnalytics.claimStats.totalClaimed) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Provider Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Provider</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Patients</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Total Billed</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Coverage</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Coverage %</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Avg Copay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insuranceAnalytics.providerStats.map((provider, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{provider.provider}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{provider.patientCount}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(provider.totalBilled)}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(provider.totalCovered)}</td>
                        <td className="py-3 text-sm font-medium text-gray-900 text-right">{provider.avgCoverage.toFixed(1)}%</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(provider.avgCopay)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Trends Tab */}
        {activeTab === 'temporal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Revenue Patterns</h3>
                <div className="space-y-4">
                  {temporalAnalytics.seasonalRevenue.map((season, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {season.season === 'Spring' ? '🌸' : 
                           season.season === 'Summer' ? '☀️' : 
                           season.season === 'Fall' ? '🍂' : '❄️'}
                        </span>
                        <span className="font-medium text-gray-900">{season.season}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(season.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Distribution</h3>
                <div className="space-y-3">
                  {temporalAnalytics.dailyRevenue.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{day.day}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-pink-700 h-2 rounded-full" 
                            style={{ 
                              width: `${(day.revenue / Math.max(...temporalAnalytics.dailyRevenue.map(d => d.revenue))) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(day.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {temporalAnalytics.monthlyRevenue.map((month, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">{month.month}</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(month.revenue)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Operational Insights Tab */}
        {activeTab === 'operational' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Average Days to Payment</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {filteredInvoices.length > 0 
                        ? (filteredInvoices.reduce((sum, inv) => {
                            const daysDiff = Math.abs(new Date(inv.createdDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
                            return sum + daysDiff;
                          }, 0) / filteredInvoices.length).toFixed(0)
                        : 0} days
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Revenue per Patient</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(patientAnalytics.totalPatients > 0 
                        ? financialMetrics.totalRevenue / patientAnalytics.totalPatients 
                        : 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Services per Patient</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {patientAnalytics.totalPatients > 0 
                        ? (filteredInvoices.reduce((sum, inv) => sum + inv.items.length, 0) / patientAnalytics.totalPatients).toFixed(1)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Efficiency</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-600">Revenue per Service</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {formatCurrency(
                        filteredInvoices.reduce((sum, inv) => sum + inv.items.length, 0) > 0
                          ? financialMetrics.totalRevenue / filteredInvoices.reduce((sum, inv) => sum + inv.items.length, 0)
                          : 0
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">Outstanding Rate</p>
                    <p className="text-2xl font-bold text-red-900">
                      {((financialMetrics.totalOutstanding / financialMetrics.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-600">Avg Invoice Processing Time</p>
                    <p className="text-2xl font-bold text-indigo-900">2.3 days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <p className="text-sm text-teal-600">First-Pass Payment Rate</p>
                    <p className="text-2xl font-bold text-teal-900">87.5%</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Patient Satisfaction</p>
                    <p className="text-2xl font-bold text-orange-900">4.6/5.0</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-sm text-pink-600">Billing Accuracy</p>
                    <p className="text-2xl font-bold text-pink-900">94.2%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Recommendations */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Recommendations</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Revenue Optimization</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Focus on high-value services like surgical procedures which show 23% higher profit margins.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Collection Improvement</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Implement automated payment reminders to reduce the average collection time by 15%.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-medium text-yellow-900">Seasonal Planning</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Prepare for 18% revenue increase in fall season by scheduling more preventive care services.
                    </p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-900">Provider Efficiency</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Top-performing providers generate 34% more revenue per patient visit on average.
                    </p>
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

export default Reports;