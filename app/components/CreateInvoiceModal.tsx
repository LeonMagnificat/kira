import React, { useState } from 'react';
import type { Patient, ServiceCode, BillingItem } from '~/data/mockBilling';
import { mockPatients, mockServiceCodes } from '~/data/mockBilling';
import { formatCurrency, calculateInsuranceReimbursement, generateInvoiceNumber } from '~/utils/billingUtils';

interface CreateInvoiceModalProps {
  onClose: () => void;
  onCreateInvoice: (invoiceData: any) => void;
}

export function CreateInvoiceModal({ onClose, onCreateInvoice }: CreateInvoiceModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<BillingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceCode | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = mockServiceCodes.filter(service =>
    service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addServiceItem = () => {
    if (!selectedService || !selectedPatient) return;

    const unitPrice = selectedService.basePrice;
    const totalPrice = unitPrice * quantity;
    
    // Calculate insurance coverage
    const { insurancePays, patientPays } = calculateInsuranceReimbursement(
      totalPrice,
      selectedService.insuranceCoverage,
      selectedPatient.insuranceInfo.deductible,
      selectedPatient.insuranceInfo.deductibleMet,
      selectedPatient.insuranceInfo.copay
    );

    const newItem: BillingItem = {
      id: `ITEM${Date.now()}`,
      serviceCode: selectedService.code,
      description: selectedService.description,
      quantity,
      unitPrice,
      totalPrice,
      insuranceCovered: insurancePays,
      patientResponsible: patientPays,
      providerId: 'EMP001' // Default provider
    };

    setItems([...items, newItem]);
    setSelectedService(null);
    setQuantity(1);
    setSearchTerm('');
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const insuranceCovered = items.reduce((sum, item) => sum + item.insuranceCovered, 0);
    const patientResponsible = items.reduce((sum, item) => sum + item.patientResponsible, 0);
    
    return { subtotal, insuranceCovered, patientResponsible };
  };

  const handleCreateInvoice = () => {
    if (!selectedPatient || items.length === 0) return;

    const totals = calculateTotals();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

    const invoiceData = {
      id: `INV${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      patientId: selectedPatient.id,
      dateOfService: serviceDate,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'draft' as const,
      items,
      subtotal: totals.subtotal,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: totals.subtotal,
      amountPaid: 0,
      balanceDue: totals.subtotal,
      notes
    };

    onCreateInvoice(invoiceData);
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }}>
        {/* Header */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>Create New Invoice</h2>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Main Form */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Patient Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Select Patient</h3>
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              {!selectedPatient && searchTerm && (
                <div className="max-h-40 overflow-y-auto rounded-lg" style={{ border: '1px solid var(--color-border)' }}>
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setSearchTerm('');
                      }}
                      className="w-full text-left p-3 transition-colors"
                      style={{ borderBottom: '1px solid var(--color-border)', background: 'transparent' }}
                    >
                      <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                        {patient.email} • {patient.insuranceInfo.provider}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedPatient && (
                <div className="p-4 rounded-lg" style={{ background: 'var(--color-accent-weak)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                        {selectedPatient.insuranceInfo.provider} • 
                        Copay: {formatCurrency(selectedPatient.insuranceInfo.copay)} • 
                        Deductible: {formatCurrency(selectedPatient.insuranceInfo.deductible - selectedPatient.insuranceInfo.deductibleMet)} remaining
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="transition-colors"
                      style={{ color: 'var(--color-muted-foreground)' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Service Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Add Services */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Add Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search services by code or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg focus:ring-2"
                    style={{ border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg focus:ring-2"
                    style={{ border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              {searchTerm && !selectedService && (
                <div className="max-h-40 overflow-y-auto rounded-lg mb-4" style={{ border: '1px solid var(--color-border)' }}>
                  {filteredServices.map((service) => (
                    <button
                      key={service.code}
                      onClick={() => {
                        setSelectedService(service);
                        setSearchTerm('');
                      }}
                      className="w-full text-left p-3 transition-colors last:border-b-0"
                      style={{ borderBottom: '1px solid var(--color-border)', background: 'transparent' }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>{service.code}</div>
                          <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{service.description}</div>
                          <div className="text-xs capitalize" style={{ color: 'var(--color-muted-foreground)' }}>{service.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(service.basePrice)}</div>
                          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{service.insuranceCoverage}% covered</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedService && (
                <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--color-success-weak)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--color-foreground)' }}>{selectedService.code}</h4>
                      <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{selectedService.description}</p>
                      <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                        {formatCurrency(selectedService.basePrice)} × {quantity} = {formatCurrency(selectedService.basePrice * quantity)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={addServiceItem}
                        disabled={!selectedPatient}
                        className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: 'var(--color-success)', color: 'var(--color-primary-foreground)' }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setSelectedService(null);
                          setSearchTerm('');
                        }}
                        className="px-4 py-2 rounded-lg transition-colors"
                        style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Items */}
            {items.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Invoice Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-medium text-gray-600">Code</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-600">Description</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-600">Qty</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-600">Price</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-600">Total</th>
                        <th className="text-center py-2 text-sm font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3 text-sm font-medium text-gray-900">{item.serviceCode}</td>
                          <td className="py-3 text-sm text-gray-700">{item.description}</td>
                          <td className="py-3 text-sm text-gray-700 text-right">{item.quantity}</td>
                          <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.totalPrice)}</td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Additional notes or comments..."
              />
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-80 border-l border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Invoice Summary</h3>
            
            {items.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance Coverage</span>
                      <span className="font-medium text-blue-600">{formatCurrency(totals.insuranceCovered)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient Responsibility</span>
                      <span className="font-medium text-orange-600">{formatCurrency(totals.patientResponsible)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total Amount</span>
                        <span className="font-bold text-gray-900">{formatCurrency(totals.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPatient && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Insurance Info</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provider</span>
                        <span>{selectedPatient.insuranceInfo.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Copay</span>
                        <span>{formatCurrency(selectedPatient.insuranceInfo.copay)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deductible Remaining</span>
                        <span>{formatCurrency(selectedPatient.insuranceInfo.deductible - selectedPatient.insuranceInfo.deductibleMet)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={handleCreateInvoice}
                    disabled={!selectedPatient || items.length === 0}
                    className="w-full bg-pink-700 text-white py-3 px-4 rounded-lg hover:bg-pink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Create Invoice
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Add services to see invoice summary</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}