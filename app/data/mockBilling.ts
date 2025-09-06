export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    copay: number;
    deductible: number;
    deductibleMet: number;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface ServiceCode {
  code: string;
  description: string;
  category: 'consultation' | 'procedure' | 'diagnostic' | 'therapy' | 'surgery' | 'emergency';
  basePrice: number;
  insuranceCoverage: number; // percentage
  duration: number; // in minutes
}

export interface BillingItem {
  id: string;
  serviceCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  insuranceCovered: number;
  patientResponsible: number;
  providerId: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  appointmentId?: string;
  dateOfService: string;
  createdDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partial';
  items: BillingItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  insuranceClaimId?: string;
  paymentMethod?: 'cash' | 'card' | 'check' | 'insurance' | 'online';
  notes?: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  invoiceId: string;
  insuranceProvider: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'denied' | 'partial' | 'resubmitted';
  claimedAmount: number;
  approvedAmount: number;
  denialReason?: string;
  processingNotes?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'check' | 'insurance' | 'online';
  transactionId?: string;
  notes?: string;
  processedBy: string;
}

// Mock Data
export const mockPatients: Patient[] = [
  {
    id: 'PAT001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1985-03-15',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS123456789',
      groupNumber: 'GRP001',
      copay: 25,
      deductible: 1500,
      deductibleMet: 800
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '(555) 123-4568'
    }
  },
  {
    id: 'PAT002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1992-07-22',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    address: {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    insuranceInfo: {
      provider: 'Aetna',
      policyNumber: 'AET987654321',
      groupNumber: 'GRP002',
      copay: 30,
      deductible: 2000,
      deductibleMet: 1200
    },
    emergencyContact: {
      name: 'Robert Johnson',
      relationship: 'Father',
      phone: '(555) 234-5679'
    }
  },
  {
    id: 'PAT003',
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfBirth: '1978-11-08',
    email: 'michael.brown@email.com',
    phone: '(555) 345-6789',
    address: {
      street: '789 Pine St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703'
    },
    insuranceInfo: {
      provider: 'UnitedHealthcare',
      policyNumber: 'UHC456789123',
      groupNumber: 'GRP003',
      copay: 20,
      deductible: 1000,
      deductibleMet: 1000
    },
    emergencyContact: {
      name: 'Lisa Brown',
      relationship: 'Spouse',
      phone: '(555) 345-6790'
    }
  }
];

export const mockServiceCodes: ServiceCode[] = [
  {
    code: '99213',
    description: 'Office Visit - Established Patient (Level 3)',
    category: 'consultation',
    basePrice: 150,
    insuranceCoverage: 80,
    duration: 30
  },
  {
    code: '99214',
    description: 'Office Visit - Established Patient (Level 4)',
    category: 'consultation',
    basePrice: 200,
    insuranceCoverage: 80,
    duration: 45
  },
  {
    code: '93000',
    description: 'Electrocardiogram (ECG)',
    category: 'diagnostic',
    basePrice: 75,
    insuranceCoverage: 90,
    duration: 15
  },
  {
    code: '36415',
    description: 'Blood Draw/Venipuncture',
    category: 'procedure',
    basePrice: 25,
    insuranceCoverage: 95,
    duration: 10
  },
  {
    code: '80053',
    description: 'Comprehensive Metabolic Panel',
    category: 'diagnostic',
    basePrice: 45,
    insuranceCoverage: 90,
    duration: 5
  },
  {
    code: '90471',
    description: 'Immunization Administration',
    category: 'procedure',
    basePrice: 30,
    insuranceCoverage: 100,
    duration: 10
  },
  {
    code: '29540',
    description: 'Strapping of Ankle',
    category: 'procedure',
    basePrice: 85,
    insuranceCoverage: 75,
    duration: 20
  },
  {
    code: '12001',
    description: 'Simple Repair of Superficial Wounds',
    category: 'procedure',
    basePrice: 120,
    insuranceCoverage: 85,
    duration: 25
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-2024-001',
    patientId: 'PAT001',
    appointmentId: 'APT001',
    dateOfService: '2024-01-15',
    createdDate: '2024-01-15',
    dueDate: '2024-02-14',
    status: 'paid',
    items: [
      {
        id: 'ITEM001',
        serviceCode: '99213',
        description: 'Office Visit - Established Patient (Level 3)',
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
        insuranceCovered: 120,
        patientResponsible: 30,
        providerId: 'EMP003'
      },
      {
        id: 'ITEM002',
        serviceCode: '93000',
        description: 'Electrocardiogram (ECG)',
        quantity: 1,
        unitPrice: 75,
        totalPrice: 75,
        insuranceCovered: 67.50,
        patientResponsible: 7.50,
        providerId: 'EMP003'
      }
    ],
    subtotal: 225,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 225,
    amountPaid: 225,
    balanceDue: 0,
    insuranceClaimId: 'CLM001',
    paymentMethod: 'insurance'
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV-2024-002',
    patientId: 'PAT002',
    dateOfService: '2024-01-18',
    createdDate: '2024-01-18',
    dueDate: '2024-02-17',
    status: 'partial',
    items: [
      {
        id: 'ITEM003',
        serviceCode: '99214',
        description: 'Office Visit - Established Patient (Level 4)',
        quantity: 1,
        unitPrice: 200,
        totalPrice: 200,
        insuranceCovered: 160,
        patientResponsible: 40,
        providerId: 'EMP004'
      },
      {
        id: 'ITEM004',
        serviceCode: '36415',
        description: 'Blood Draw/Venipuncture',
        quantity: 1,
        unitPrice: 25,
        totalPrice: 25,
        insuranceCovered: 23.75,
        patientResponsible: 1.25,
        providerId: 'EMP005'
      },
      {
        id: 'ITEM005',
        serviceCode: '80053',
        description: 'Comprehensive Metabolic Panel',
        quantity: 1,
        unitPrice: 45,
        totalPrice: 45,
        insuranceCovered: 40.50,
        patientResponsible: 4.50,
        providerId: 'EMP005'
      }
    ],
    subtotal: 270,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 270,
    amountPaid: 160,
    balanceDue: 110,
    insuranceClaimId: 'CLM002',
    paymentMethod: 'insurance'
  },
  {
    id: 'INV003',
    invoiceNumber: 'INV-2024-003',
    patientId: 'PAT003',
    dateOfService: '2024-01-20',
    createdDate: '2024-01-20',
    dueDate: '2024-02-19',
    status: 'sent',
    items: [
      {
        id: 'ITEM006',
        serviceCode: '12001',
        description: 'Simple Repair of Superficial Wounds',
        quantity: 1,
        unitPrice: 120,
        totalPrice: 120,
        insuranceCovered: 102,
        patientResponsible: 18,
        providerId: 'EMP006'
      },
      {
        id: 'ITEM007',
        serviceCode: '29540',
        description: 'Strapping of Ankle',
        quantity: 1,
        unitPrice: 85,
        totalPrice: 85,
        insuranceCovered: 63.75,
        patientResponsible: 21.25,
        providerId: 'EMP006'
      }
    ],
    subtotal: 205,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 205,
    amountPaid: 0,
    balanceDue: 205,
    insuranceClaimId: 'CLM003'
  }
];

export const mockInsuranceClaims: InsuranceClaim[] = [
  {
    id: 'CLM001',
    claimNumber: 'CLM-2024-001',
    patientId: 'PAT001',
    invoiceId: 'INV001',
    insuranceProvider: 'Blue Cross Blue Shield',
    dateSubmitted: '2024-01-16',
    status: 'approved',
    claimedAmount: 187.50,
    approvedAmount: 187.50
  },
  {
    id: 'CLM002',
    claimNumber: 'CLM-2024-002',
    patientId: 'PAT002',
    invoiceId: 'INV002',
    insuranceProvider: 'Aetna',
    dateSubmitted: '2024-01-19',
    status: 'partial',
    claimedAmount: 224.25,
    approvedAmount: 160.00,
    processingNotes: 'Partial approval - deductible not met for full coverage'
  },
  {
    id: 'CLM003',
    claimNumber: 'CLM-2024-003',
    patientId: 'PAT003',
    invoiceId: 'INV003',
    insuranceProvider: 'UnitedHealthcare',
    dateSubmitted: '2024-01-21',
    status: 'pending',
    claimedAmount: 165.75,
    approvedAmount: 0
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    invoiceId: 'INV001',
    patientId: 'PAT001',
    amount: 187.50,
    paymentDate: '2024-01-25',
    paymentMethod: 'insurance',
    processedBy: 'EMP001'
  },
  {
    id: 'PAY002',
    invoiceId: 'INV001',
    patientId: 'PAT001',
    amount: 37.50,
    paymentDate: '2024-01-26',
    paymentMethod: 'card',
    transactionId: 'TXN123456',
    processedBy: 'EMP001'
  },
  {
    id: 'PAY003',
    invoiceId: 'INV002',
    patientId: 'PAT002',
    amount: 160.00,
    paymentDate: '2024-01-28',
    paymentMethod: 'insurance',
    processedBy: 'EMP001'
  }
];

// Utility functions
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

export const getServiceCodeByCode = (code: string): ServiceCode | undefined => {
  return mockServiceCodes.find(service => service.code === code);
};

export const getInvoicesByPatient = (patientId: string): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.patientId === patientId);
};

export const getPaymentsByInvoice = (invoiceId: string): Payment[] => {
  return mockPayments.filter(payment => payment.invoiceId === invoiceId);
};

export const calculateInvoiceTotals = (items: BillingItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const insuranceCovered = items.reduce((sum, item) => sum + item.insuranceCovered, 0);
  const patientResponsible = items.reduce((sum, item) => sum + item.patientResponsible, 0);
  
  return {
    subtotal,
    insuranceCovered,
    patientResponsible
  };
};