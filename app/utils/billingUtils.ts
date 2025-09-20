import type { Invoice, Patient, InsuranceClaim, Payment } from '~/data/mockBilling';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-success-weak text-success';
    case 'partial':
      return 'bg-warning-weak text-warning';
    case 'sent':
      return 'bg-accent-weak text-accent';
    case 'overdue':
      return 'bg-danger-weak text-danger';
    case 'draft':
      return 'bg-surface text-muted-foreground';
    case 'cancelled':
      return 'bg-danger-weak text-danger';
    case 'approved':
      return 'bg-success-weak text-success';
    case 'denied':
      return 'bg-danger-weak text-danger';
    case 'pending':
      return 'bg-warning-weak text-warning';
    default:
      return 'bg-surface text-muted-foreground';
  }
};

export const getPaymentMethodIcon = (method: string): string => {
  switch (method.toLowerCase()) {
    case 'cash':
      return '💵';
    case 'card':
      return '💳';
    case 'check':
      return '📝';
    case 'insurance':
      return '🏥';
    case 'online':
      return '💻';
    default:
      return '💰';
  }
};

export const calculateDaysOverdue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const isOverdue = (invoice: Invoice): boolean => {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') {
    return false;
  }
  return calculateDaysOverdue(invoice.dueDate) > 0;
};

export const calculateCollectionRate = (invoices: Invoice[]): number => {
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const collectedAmount = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  return totalAmount > 0 ? (collectedAmount / totalAmount) * 100 : 0;
};

export const getRevenueByPeriod = (invoices: Invoice[], period: 'week' | 'month' | 'quarter' | 'year') => {
  const now = new Date();
  const periodStart = new Date();
  
  switch (period) {
    case 'week':
      periodStart.setDate(now.getDate() - 7);
      break;
    case 'month':
      periodStart.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      periodStart.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      periodStart.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return invoices
    .filter(inv => new Date(inv.createdDate) >= periodStart)
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
};

export const getTopServices = (invoices: Invoice[], limit: number = 5) => {
  const serviceStats: Record<string, { count: number; revenue: number; description: string }> = {};
  
  invoices.forEach(invoice => {
    invoice.items.forEach(item => {
      if (!serviceStats[item.serviceCode]) {
        serviceStats[item.serviceCode] = {
          count: 0,
          revenue: 0,
          description: item.description
        };
      }
      serviceStats[item.serviceCode].count += item.quantity;
      serviceStats[item.serviceCode].revenue += item.totalPrice;
    });
  });
  
  return Object.entries(serviceStats)
    .map(([code, stats]) => ({ code, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};

export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `INV-${year}-${timestamp}`;
};

export const calculateInsuranceReimbursement = (
  servicePrice: number,
  insuranceCoverage: number,
  deductible: number,
  deductibleMet: number,
  copay: number
): { insurancePays: number; patientPays: number } => {
  const remainingDeductible = Math.max(0, deductible - deductibleMet);
  const deductibleApplied = Math.min(servicePrice, remainingDeductible);
  const amountAfterDeductible = servicePrice - deductibleApplied;
  
  const insuranceCovers = (amountAfterDeductible * insuranceCoverage) / 100;
  const patientCoinsurance = amountAfterDeductible - insuranceCovers;
  
  const insurancePays = insuranceCovers;
  const patientPays = deductibleApplied + patientCoinsurance + copay;
  
  return {
    insurancePays: Math.round(insurancePays * 100) / 100,
    patientPays: Math.round(patientPays * 100) / 100
  };
};

export const getAgingReport = (invoices: Invoice[]) => {
  const aging = {
    current: 0,      // 0-30 days
    thirtyDays: 0,   // 31-60 days
    sixtyDays: 0,    // 61-90 days
    ninetyDays: 0,   // 91+ days
    total: 0
  };
  
  invoices.forEach(invoice => {
    if (invoice.balanceDue > 0) {
      const daysOld = calculateDaysOverdue(invoice.dueDate);
      const amount = invoice.balanceDue;
      
      if (daysOld <= 30) {
        aging.current += amount;
      } else if (daysOld <= 60) {
        aging.thirtyDays += amount;
      } else if (daysOld <= 90) {
        aging.sixtyDays += amount;
      } else {
        aging.ninetyDays += amount;
      }
      
      aging.total += amount;
    }
  });
  
  return aging;
};

export const searchInvoices = (invoices: Invoice[], patients: Patient[], searchTerm: string) => {
  if (!searchTerm.trim()) return invoices;
  
  const term = searchTerm.toLowerCase();
  
  return invoices.filter(invoice => {
    const patient = patients.find(p => p.id === invoice.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
    
    return (
      invoice.invoiceNumber.toLowerCase().includes(term) ||
      patientName.includes(term) ||
      invoice.status.toLowerCase().includes(term) ||
      invoice.items.some(item => 
        item.description.toLowerCase().includes(term) ||
        item.serviceCode.toLowerCase().includes(term)
      )
    );
  });
};

export const filterInvoicesByStatus = (invoices: Invoice[], status: string) => {
  if (status === 'all') return invoices;
  return invoices.filter(invoice => invoice.status === status);
};

export const sortInvoices = (invoices: Invoice[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
  return [...invoices].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdDate);
        bValue = new Date(b.createdDate);
        break;
      case 'amount':
        aValue = a.totalAmount;
        bValue = b.totalAmount;
        break;
      case 'balance':
        aValue = a.balanceDue;
        bValue = b.balanceDue;
        break;
      case 'patient':
        aValue = a.patientId;
        bValue = b.patientId;
        break;
      default:
        aValue = a.invoiceNumber;
        bValue = b.invoiceNumber;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};