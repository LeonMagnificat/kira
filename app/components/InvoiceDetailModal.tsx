import React, { useState } from 'react';
import type { Invoice, Patient, Payment } from '~/data/mockBilling';
import { getPatientById, getPaymentsByInvoice } from '~/data/mockBilling';
import { formatCurrency, formatDate, getStatusColor, getPaymentMethodIcon } from '~/utils/billingUtils';

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPayment?: (invoiceId: string, amount: number, method: string) => void;
}

export function InvoiceDetailModal({ invoice, onClose, onPayment }: InvoiceDetailModalProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(invoice.balanceDue.toString());
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'check' | 'online'>('card');

  const patient = getPatientById(invoice.patientId);
  const payments = getPaymentsByInvoice(invoice.id);

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0 && amount <= invoice.balanceDue && onPayment) {
      onPayment(invoice.id, amount, paymentMethod);
      setShowPaymentForm(false);
      onClose();
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const sendInvoice = () => {
    // Simulate sending invoice
    alert('Invoice sent to patient email');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h2>
              <p className="text-gray-600">
                Service Date: {formatDate(invoice.dateOfService)} • 
                Created: {formatDate(invoice.createdDate)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
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
        </div>

        <div className="flex h-[600px]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Patient Information */}
            {patient && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Insurance</p>
                    <p className="font-medium">
                      {patient.insuranceInfo.provider} • Policy: {patient.insuranceInfo.policyNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Services */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Services & Procedures</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Code</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Description</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">Qty</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">Unit Price</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{item.serviceCode}</td>
                        <td className="py-3 text-sm text-gray-700">{item.description}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{item.quantity}</td>
                        <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Billing Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(invoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Balance Due</span>
                  <span className={`font-bold ${invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(invoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Insurance Breakdown */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Insurance Breakdown</h3>
              <div className="space-y-3">
                {invoice.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{item.serviceCode}</span>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-blue-600">Insurance: {formatCurrency(item.insuranceCovered)}</span>
                        <span className="text-gray-500 mx-2">•</span>
                        <span className="text-orange-600">Patient: {formatCurrency(item.patientResponsible)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment History */}
            {payments.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-600">
                            {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)} • 
                            {formatDate(payment.paymentDate)}
                          </p>
                        </div>
                      </div>
                      {payment.transactionId && (
                        <span className="text-xs text-gray-500">ID: {payment.transactionId}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="w-80 border-l border-gray-200 p-6">
            <div className="space-y-4">
              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={printInvoice}
                    className="w-full flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Invoice
                  </button>
                  
                  <button
                    onClick={sendInvoice}
                    className="w-full flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send to Patient
                  </button>

                  {invoice.balanceDue > 0 && (
                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="w-full flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Record Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Form */}
              {showPaymentForm && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Record Payment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        max={invoice.balanceDue}
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="card">Credit/Debit Card</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="online">Online Payment</option>
                      </select>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handlePayment}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Record Payment
                      </button>
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Invoice Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date</span>
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  </div>
                  {invoice.insuranceClaimId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Claim ID</span>
                      <span className="font-medium">{invoice.insuranceClaimId}</span>
                    </div>
                  )}
                  {invoice.notes && (
                    <div>
                      <span className="text-gray-600">Notes</span>
                      <p className="text-gray-900 mt-1">{invoice.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}