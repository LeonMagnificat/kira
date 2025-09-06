import React, { useState, useEffect } from 'react';
import { Header, InvoiceDetailModal, CreateInvoiceModal } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { sidebarItems } from '~/constants';
import {
  mockInvoices,
  mockPatients,
  mockInsuranceClaims,
  mockPayments,
  getPatientById,
  type Invoice,
  type Patient,
  type InsuranceClaim
} from '~/data/mockBilling';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getPaymentMethodIcon,
  isOverdue,
  calculateCollectionRate,
  getRevenueByPeriod,
  getTopServices,
  getAgingReport,
  searchInvoices,
  filterInvoicesByStatus,
  sortInvoices
} from '~/utils/billingUtils';

interface OutletContext {
  isSidebarMinimized: boolean;
}

function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'claims' | 'reports'>('overview');

  const context = useOutletContext<OutletContext>();
  const isSidebarMinimized = context?.isSidebarMinimized || false;

  useEffect(() => {
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  useEffect(() => {
    let filtered = searchInvoices(invoices, mockPatients, searchTerm);
    filtered = filterInvoicesByStatus(filtered, statusFilter);
    filtered = sortInvoices(filtered, sortBy, sortOrder);
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder]);

  // Calculate dashboard metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const overdueInvoices = invoices.filter(isOverdue);
  const collectionRate = calculateCollectionRate(invoices);
  const monthlyRevenue = getRevenueByPeriod(invoices, 'month');
  const topServices = getTopServices(invoices);
  const agingReport = getAgingReport(invoices);

  const statusCounts = {
    all: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    partial: invoices.filter(inv => inv.status === 'partial').length,
    overdue: overdueInvoices.length,
    cancelled: invoices.filter(inv => inv.status === 'cancelled').length
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleCreateInvoice = (invoiceData: any) => {
    setInvoices([...invoices, invoiceData]);
    setShowCreateInvoice(false);
  };

  const handlePayment = (invoiceId: string, amount: number, method: string) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId 
          ? { 
              ...inv, 
              amountPaid: inv.amountPaid + amount,
              balanceDue: inv.balanceDue - amount,
              status: inv.balanceDue - amount <= 0 ? 'paid' as const : 'partial' as const
            }
          : inv
      )
    );
  };

  return (
    <>
      <main className="billing wrapper">
        <Header title={sidebarItems[5].label || 'Billing'} />
      </main>

      <div className={`flex flex-col mt-4 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0 md:ml-[-70px]'
      }`}>
        
        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm rounded-2xl mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'invoices', label: 'Invoices', icon: '📄' },
              { key: 'claims', label: 'Insurance Claims', icon: '🏥' },
              { key: 'reports', label: 'Reports', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-pink-700 border-b-2 border-pink-700 bg-pink-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600">+12.5% from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Collected</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCollected)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-blue-600">{collectionRate.toFixed(1)}% collection rate</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-yellow-600">{statusCounts.overdue} overdue invoices</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-purple-600">Monthly revenue</span>
                </div>
              </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Services */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
                <div className="space-y-4">
                  {topServices.map((service, index) => (
                    <div key={service.code} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-sm font-bold text-pink-700">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.code}</p>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                        <p className="text-sm text-gray-500">{service.count} services</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aging Report */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts Receivable Aging</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current (0-30 days)</span>
                    <span className="font-semibold text-green-600">{formatCurrency(agingReport.current)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">31-60 days</span>
                    <span className="font-semibold text-yellow-600">{formatCurrency(agingReport.thirtyDays)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">61-90 days</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(agingReport.sixtyDays)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">90+ days</span>
                    <span className="font-semibold text-red-600">{formatCurrency(agingReport.ninetyDays)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total Outstanding</span>
                      <span className="font-bold text-gray-900">{formatCurrency(agingReport.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white shadow-sm rounded-2xl">
            {/* Filters and Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="all">All Status ({statusCounts.all})</option>
                    <option value="draft">Draft ({statusCounts.draft})</option>
                    <option value="sent">Sent ({statusCounts.sent})</option>
                    <option value="paid">Paid ({statusCounts.paid})</option>
                    <option value="partial">Partial ({statusCounts.partial})</option>
                    <option value="overdue">Overdue ({statusCounts.overdue})</option>
                    <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowCreateInvoice(true)}
                  className="bg-pink-700 text-white px-4 py-2 rounded-lg hover:bg-pink-800 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Invoice
                </button>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th 
                      className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('invoiceNumber')}
                    >
                      <div className="flex items-center">
                        Invoice #
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Patient</th>
                    <th 
                      className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th 
                      className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th 
                      className="text-left py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('balance')}
                    >
                      <div className="flex items-center">
                        Balance Due
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const patient = getPatientById(invoice.patientId);
                    const overdue = isOverdue(invoice);
                    
                    return (
                      <tr 
                        key={invoice.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          overdue ? 'bg-red-50' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">Service: {formatDate(invoice.dateOfService)}</div>
                        </td>
                        <td className="py-4 px-6">
                          {patient && (
                            <div>
                              <div className="font-medium text-gray-900">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{patient.email}</div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900">{formatDate(invoice.createdDate)}</div>
                          <div className="text-sm text-gray-500">Due: {formatDate(invoice.dueDate)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">{formatCurrency(invoice.totalAmount)}</div>
                          <div className="text-sm text-gray-500">Paid: {formatCurrency(invoice.amountPaid)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                          {overdue && (
                            <div className="text-xs text-red-600 mt-1">Overdue</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">{formatCurrency(invoice.balanceDue)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                            >
                              View
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Edit
                            </button>
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              Pay
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No invoices found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div className="bg-white shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Insurance Claims</h3>
            <div className="space-y-4">
              {mockInsuranceClaims.map((claim) => {
                const patient = getPatientById(claim.patientId);
                return (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{claim.claimNumber}</h4>
                        <p className="text-sm text-gray-500">
                          {patient?.firstName} {patient?.lastName} • {claim.insuranceProvider}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {formatDate(claim.dateSubmitted)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Claimed Amount</p>
                        <p className="font-semibold">{formatCurrency(claim.claimedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Approved Amount</p>
                        <p className="font-semibold">{formatCurrency(claim.approvedAmount)}</p>
                      </div>
                    </div>
                    {claim.processingNotes && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">{claim.processingNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">📊</span>
                  <h4 className="font-medium text-gray-900">Revenue Report</h4>
                </div>
                <p className="text-sm text-gray-600">Monthly and yearly revenue analysis</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">📈</span>
                  <h4 className="font-medium text-gray-900">Collection Report</h4>
                </div>
                <p className="text-sm text-gray-600">Payment collection and aging analysis</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🏥</span>
                  <h4 className="font-medium text-gray-900">Insurance Report</h4>
                </div>
                <p className="text-sm text-gray-600">Claims processing and reimbursement rates</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">👨‍⚕️</span>
                  <h4 className="font-medium text-gray-900">Provider Report</h4>
                </div>
                <p className="text-sm text-gray-600">Revenue by healthcare provider</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🔍</span>
                  <h4 className="font-medium text-gray-900">Service Analysis</h4>
                </div>
                <p className="text-sm text-gray-600">Most profitable services and procedures</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">📋</span>
                  <h4 className="font-medium text-gray-900">Tax Report</h4>
                </div>
                <p className="text-sm text-gray-600">Tax documentation and compliance</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPayment={handlePayment}
        />
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <CreateInvoiceModal
          onClose={() => setShowCreateInvoice(false)}
          onCreateInvoice={handleCreateInvoice}
        />
      )}
    </>
  );
}

export default Billing;