import React, { useState, useEffect } from 'react';
import { Header, InvoiceDetailModal, CreateInvoiceModal, Card, Input, Select, Tabs } from '~/components';
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
        <div className="shadow-sm rounded-2xl mb-6" style={{ background: 'var(--color-surface)' }}>
          <div className="flex" style={{ borderBottom: '1px solid var(--color-border)' }}>
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'invoices', label: 'Invoices', icon: '📄' },
              { key: 'claims', label: 'Insurance Claims', icon: '🏥' },
              { key: 'reports', label: 'Reports', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className="flex items-center px-6 py-4 font-medium transition-colors"
                style={{
                  color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  background: activeTab === tab.key ? 'var(--color-primary-weak)' : 'transparent'
                }}
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
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Total Revenue</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-weak)' }}>
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm" style={{ color: 'var(--color-success)' }}>+12.5% from last month</span>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Collected</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(totalCollected)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent-weak)' }}>
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm" style={{ color: 'var(--color-accent)' }}>{collectionRate.toFixed(1)}% collection rate</span>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Outstanding</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(totalOutstanding)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-warning-weak)' }}>
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm" style={{ color: 'var(--color-warning)' }}>{statusCounts.overdue} overdue invoices</span>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>This Month</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(monthlyRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent-weak)' }}>
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm" style={{ color: 'var(--color-accent)' }}>Monthly revenue</span>
                </div>
              </Card>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Services */}
              <Card>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>Top Services</h3>
                <div className="space-y-4">
                  {topServices.map((service, index) => (
                    <div key={service.code} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--color-primary-weak)', color: 'var(--color-primary)' }}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-foreground)' }}>{service.code}</p>
                          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{service.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(service.revenue)}</p>
                        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{service.count} services</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Aging Report */}
              <Card>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>Accounts Receivable Aging</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--color-muted-foreground)' }}>Current (0-30 days)</span>
                    <span className="font-semibold" style={{ color: 'var(--color-success)' }}>{formatCurrency(agingReport.current)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--color-muted-foreground)' }}>31-60 days</span>
                    <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>{formatCurrency(agingReport.thirtyDays)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--color-muted-foreground)' }}>61-90 days</span>
                    <span className="font-semibold" style={{ color: '#ea580c' }}>{formatCurrency(agingReport.sixtyDays)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--color-muted-foreground)' }}>90+ days</span>
                    <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>{formatCurrency(agingReport.ninetyDays)}</span>
                  </div>
                  <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>Total Outstanding</span>
                      <span className="font-bold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(agingReport.total)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="shadow-sm rounded-2xl" style={{ background: 'var(--color-surface)' }}>
            {/* Filters and Search */}
            <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-muted-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status ({statusCounts.all})</option>
                    <option value="draft">Draft ({statusCounts.draft})</option>
                    <option value="sent">Sent ({statusCounts.sent})</option>
                    <option value="paid">Paid ({statusCounts.paid})</option>
                    <option value="partial">Partial ({statusCounts.partial})</option>
                    <option value="overdue">Overdue ({statusCounts.overdue})</option>
                    <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
                  </Select>
                </div>

                <button
                  onClick={() => setShowCreateInvoice(true)}
                  className="px-4 py-2 rounded-lg transition-colors flex items-center"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
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
                        className={`transition-colors ${overdue ? '' : ''}`}
                        style={{ borderBottom: '1px solid var(--color-border)', background: overdue ? 'var(--color-danger-weak)' : 'transparent' }}
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>{invoice.invoiceNumber}</div>
                          <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Service: {formatDate(invoice.dateOfService)}</div>
                        </td>
                        <td className="py-4 px-6">
                          {patient && (
                            <div>
                              <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{patient.email}</div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div style={{ color: 'var(--color-foreground)' }}>{formatDate(invoice.createdDate)}</div>
                          <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Due: {formatDate(invoice.dueDate)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(invoice.totalAmount)}</div>
                          <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Paid: {formatCurrency(invoice.amountPaid)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                          {overdue && (
                            <div className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>Overdue</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(invoice.balanceDue)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-sm font-medium"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              View
                            </button>
                            <button className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                              Edit
                            </button>
                            <button className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>
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
          <Card padding>
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-foreground)' }}>Insurance Claims</h3>
            <div className="space-y-4">
              {mockInsuranceClaims.map((claim) => {
                const patient = getPatientById(claim.patientId);
                return (
                  <div key={claim.id} className="rounded-lg p-4" style={{ border: '1px solid var(--color-border)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium" style={{ color: 'var(--color-foreground)' }}>{claim.claimNumber}</h4>
                        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                          {patient?.firstName} {patient?.lastName} • {claim.insuranceProvider}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                          Submitted: {formatDate(claim.dateSubmitted)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Claimed Amount</p>
                        <p className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(claim.claimedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Approved Amount</p>
                        <p className="font-semibold" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(claim.approvedAmount)}</p>
                      </div>
                    </div>
                    {claim.processingNotes && (
                      <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--color-warning-weak)' }}>
                        <p className="text-sm" style={{ color: 'var(--color-warning)' }}>{claim.processingNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <Card padding>
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-foreground)' }}>Financial Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '📊', title: 'Revenue Report', desc: 'Monthly and yearly revenue analysis' },
                { icon: '📈', title: 'Collection Report', desc: 'Payment collection and aging analysis' },
                { icon: '🏥', title: 'Insurance Report', desc: 'Claims processing and reimbursement rates' },
                { icon: '👨‍⚕️', title: 'Provider Report', desc: 'Revenue by healthcare provider' },
                { icon: '🔍', title: 'Service Analysis', desc: 'Most profitable services and procedures' },
                { icon: '📋', title: 'Tax Report', desc: 'Tax documentation and compliance' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <h4 className="font-medium" style={{ color: 'var(--color-foreground)' }}>{item.title}</h4>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
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