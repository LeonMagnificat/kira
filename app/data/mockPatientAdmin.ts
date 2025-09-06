// Mock data for Patient/Member Administration - No sensitive medical data
export interface PatientRecord {
  id: string;
  recordCreatedDate: string;
  lastUpdatedDate: string;
  lastAccessedDate: string;
  accessCount: number;
  profileCompleteness: number; // percentage
  hasEmail: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
  hasEmergencyContact: boolean;
  hasInsurance: boolean;
  status: 'active' | 'inactive' | 'archived' | 'pending';
  createdBy: string;
  lastUpdatedBy: string;
  duplicateFlags: string[]; // IDs of potential duplicates
  dataQualityScore: number; // 0-100
  complianceFlags: string[];
  syncStatus: 'synced' | 'pending' | 'failed' | 'error';
  recordType: 'patient' | 'member' | 'prospect';
}

export interface DataQualityIssue {
  id: string;
  recordId: string;
  issueType: 'missing_email' | 'missing_phone' | 'invalid_email' | 'invalid_phone' | 'missing_address' | 'missing_emergency_contact' | 'duplicate_record' | 'incomplete_profile';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedDate: string;
  status: 'open' | 'resolved' | 'ignored';
  assignedTo?: string;
}

export interface AccessLog {
  id: string;
  recordId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'export' | 'print';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  duration: number; // in milliseconds
}

export interface BulkOperation {
  id: string;
  operationType: 'import' | 'export' | 'update' | 'merge' | 'archive';
  initiatedBy: string;
  initiatedDate: string;
  completedDate?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errorLog?: string[];
  fileName?: string;
  fileSize?: number;
}

export interface SystemMetric {
  date: string;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  deletedRecords: number;
  averageResponseTime: number; // in ms
  errorCount: number;
  activeUsers: number;
  peakConcurrentUsers: number;
}

export interface ComplianceAlert {
  id: string;
  type: 'gdpr_violation' | 'hipaa_violation' | 'data_breach' | 'unauthorized_access' | 'retention_policy' | 'consent_expired';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recordId?: string;
  userId?: string;
  description: string;
  detectedDate: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolutionDate?: string;
  resolutionNotes?: string;
}

// Mock Data Generation
export const mockPatientRecords: PatientRecord[] = [
  {
    id: 'PAT001',
    recordCreatedDate: '2024-01-15T10:30:00Z',
    lastUpdatedDate: '2024-01-20T14:22:00Z',
    lastAccessedDate: '2024-01-25T09:15:00Z',
    accessCount: 15,
    profileCompleteness: 95,
    hasEmail: true,
    hasPhone: true,
    hasAddress: true,
    hasEmergencyContact: true,
    hasInsurance: true,
    status: 'active',
    createdBy: 'EMP001',
    lastUpdatedBy: 'EMP003',
    duplicateFlags: [],
    dataQualityScore: 98,
    complianceFlags: [],
    syncStatus: 'synced',
    recordType: 'patient'
  },
  {
    id: 'PAT002',
    recordCreatedDate: '2024-01-18T11:45:00Z',
    lastUpdatedDate: '2024-01-18T11:45:00Z',
    lastAccessedDate: '2024-01-22T16:30:00Z',
    accessCount: 8,
    profileCompleteness: 75,
    hasEmail: true,
    hasPhone: false,
    hasAddress: true,
    hasEmergencyContact: false,
    hasInsurance: true,
    status: 'active',
    createdBy: 'EMP002',
    lastUpdatedBy: 'EMP002',
    duplicateFlags: ['PAT015'],
    dataQualityScore: 72,
    complianceFlags: ['missing_phone'],
    syncStatus: 'pending',
    recordType: 'patient'
  },
  {
    id: 'PAT003',
    recordCreatedDate: '2023-12-10T08:20:00Z',
    lastUpdatedDate: '2023-12-10T08:20:00Z',
    lastAccessedDate: '2023-12-15T10:00:00Z',
    accessCount: 2,
    profileCompleteness: 45,
    hasEmail: false,
    hasPhone: true,
    hasAddress: false,
    hasEmergencyContact: false,
    hasInsurance: false,
    status: 'inactive',
    createdBy: 'EMP004',
    lastUpdatedBy: 'EMP004',
    duplicateFlags: [],
    dataQualityScore: 35,
    complianceFlags: ['incomplete_profile', 'missing_email'],
    syncStatus: 'failed',
    recordType: 'prospect'
  },
  {
    id: 'PAT004',
    recordCreatedDate: '2024-01-22T13:15:00Z',
    lastUpdatedDate: '2024-01-24T09:30:00Z',
    lastAccessedDate: '2024-01-25T11:45:00Z',
    accessCount: 12,
    profileCompleteness: 88,
    hasEmail: true,
    hasPhone: true,
    hasAddress: true,
    hasEmergencyContact: true,
    hasInsurance: false,
    status: 'active',
    createdBy: 'EMP001',
    lastUpdatedBy: 'EMP005',
    duplicateFlags: [],
    dataQualityScore: 85,
    complianceFlags: ['missing_insurance'],
    syncStatus: 'synced',
    recordType: 'member'
  },
  {
    id: 'PAT005',
    recordCreatedDate: '2024-01-10T07:45:00Z',
    lastUpdatedDate: '2024-01-23T15:20:00Z',
    lastAccessedDate: '2024-01-25T08:30:00Z',
    accessCount: 25,
    profileCompleteness: 100,
    hasEmail: true,
    hasPhone: true,
    hasAddress: true,
    hasEmergencyContact: true,
    hasInsurance: true,
    status: 'active',
    createdBy: 'EMP003',
    lastUpdatedBy: 'EMP001',
    duplicateFlags: [],
    dataQualityScore: 100,
    complianceFlags: [],
    syncStatus: 'synced',
    recordType: 'patient'
  }
];

export const mockDataQualityIssues: DataQualityIssue[] = [
  {
    id: 'DQ001',
    recordId: 'PAT002',
    issueType: 'missing_phone',
    severity: 'medium',
    description: 'Patient record missing phone number',
    detectedDate: '2024-01-20T10:00:00Z',
    status: 'open',
    assignedTo: 'EMP001'
  },
  {
    id: 'DQ002',
    recordId: 'PAT003',
    issueType: 'missing_email',
    severity: 'high',
    description: 'Patient record missing email address',
    detectedDate: '2024-01-18T14:30:00Z',
    status: 'open',
    assignedTo: 'EMP002'
  },
  {
    id: 'DQ003',
    recordId: 'PAT002',
    issueType: 'duplicate_record',
    severity: 'high',
    description: 'Potential duplicate record detected with PAT015',
    detectedDate: '2024-01-19T09:15:00Z',
    status: 'open',
    assignedTo: 'EMP001'
  },
  {
    id: 'DQ004',
    recordId: 'PAT003',
    issueType: 'incomplete_profile',
    severity: 'critical',
    description: 'Profile completeness below 50% threshold',
    detectedDate: '2024-01-21T11:00:00Z',
    status: 'open',
    assignedTo: 'EMP004'
  }
];

export const mockAccessLogs: AccessLog[] = [
  {
    id: 'AL001',
    recordId: 'PAT001',
    userId: 'EMP001',
    userName: 'Dr. Sarah Johnson',
    userRole: 'Doctor',
    action: 'view',
    timestamp: '2024-01-25T09:15:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true,
    duration: 1250
  },
  {
    id: 'AL002',
    recordId: 'PAT002',
    userId: 'EMP003',
    userName: 'Dr. Michael Chen',
    userRole: 'Doctor',
    action: 'update',
    timestamp: '2024-01-24T14:30:00Z',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    success: true,
    duration: 3200
  },
  {
    id: 'AL003',
    recordId: 'PAT004',
    userId: 'EMP999',
    userName: 'Unknown User',
    userRole: 'Unknown',
    action: 'view',
    timestamp: '2024-01-23T18:45:00Z',
    ipAddress: '203.0.113.45',
    userAgent: 'curl/7.68.0',
    success: false,
    failureReason: 'Unauthorized access attempt',
    duration: 0
  },
  {
    id: 'AL004',
    recordId: 'PAT005',
    userId: 'EMP002',
    userName: 'Nurse Emily Davis',
    userRole: 'Nurse',
    action: 'export',
    timestamp: '2024-01-22T10:20:00Z',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true,
    duration: 5400
  }
];

export const mockBulkOperations: BulkOperation[] = [
  {
    id: 'BO001',
    operationType: 'import',
    initiatedBy: 'EMP001',
    initiatedDate: '2024-01-20T09:00:00Z',
    completedDate: '2024-01-20T09:15:00Z',
    status: 'completed',
    recordsProcessed: 150,
    recordsSuccessful: 147,
    recordsFailed: 3,
    errorLog: ['Invalid email format in row 23', 'Missing required field in row 67', 'Duplicate ID in row 134'],
    fileName: 'patient_import_jan2024.csv',
    fileSize: 2048576
  },
  {
    id: 'BO002',
    operationType: 'update',
    initiatedBy: 'EMP003',
    initiatedDate: '2024-01-22T14:30:00Z',
    completedDate: '2024-01-22T14:45:00Z',
    status: 'completed',
    recordsProcessed: 75,
    recordsSuccessful: 75,
    recordsFailed: 0,
    fileName: 'insurance_update_batch.csv',
    fileSize: 512000
  },
  {
    id: 'BO003',
    operationType: 'export',
    initiatedBy: 'EMP002',
    initiatedDate: '2024-01-24T16:00:00Z',
    status: 'processing',
    recordsProcessed: 320,
    recordsSuccessful: 320,
    recordsFailed: 0
  }
];

export const mockSystemMetrics: SystemMetric[] = [
  {
    date: '2024-01-25',
    totalRecords: 1247,
    newRecords: 12,
    updatedRecords: 34,
    deletedRecords: 2,
    averageResponseTime: 245,
    errorCount: 3,
    activeUsers: 15,
    peakConcurrentUsers: 8
  },
  {
    date: '2024-01-24',
    totalRecords: 1235,
    newRecords: 18,
    updatedRecords: 28,
    deletedRecords: 1,
    averageResponseTime: 198,
    errorCount: 1,
    activeUsers: 22,
    peakConcurrentUsers: 12
  },
  {
    date: '2024-01-23',
    totalRecords: 1217,
    newRecords: 8,
    updatedRecords: 41,
    deletedRecords: 0,
    averageResponseTime: 312,
    errorCount: 5,
    activeUsers: 19,
    peakConcurrentUsers: 9
  },
  {
    date: '2024-01-22',
    totalRecords: 1209,
    newRecords: 25,
    updatedRecords: 52,
    deletedRecords: 3,
    averageResponseTime: 189,
    errorCount: 2,
    activeUsers: 28,
    peakConcurrentUsers: 15
  },
  {
    date: '2024-01-21',
    totalRecords: 1184,
    newRecords: 15,
    updatedRecords: 19,
    deletedRecords: 1,
    averageResponseTime: 267,
    errorCount: 4,
    activeUsers: 17,
    peakConcurrentUsers: 7
  }
];

export const mockComplianceAlerts: ComplianceAlert[] = [
  {
    id: 'CA001',
    type: 'unauthorized_access',
    severity: 'high',
    recordId: 'PAT004',
    userId: 'EMP999',
    description: 'Unauthorized access attempt from external IP address',
    detectedDate: '2024-01-23T18:45:00Z',
    status: 'investigating',
    assignedTo: 'EMP001'
  },
  {
    id: 'CA002',
    type: 'gdpr_violation',
    severity: 'medium',
    recordId: 'PAT003',
    description: 'Patient record accessed without proper consent documentation',
    detectedDate: '2024-01-22T10:30:00Z',
    status: 'open',
    assignedTo: 'EMP002'
  },
  {
    id: 'CA003',
    type: 'retention_policy',
    severity: 'low',
    description: '15 inactive records exceed retention policy timeframe',
    detectedDate: '2024-01-20T08:00:00Z',
    status: 'resolved',
    assignedTo: 'EMP004',
    resolutionDate: '2024-01-24T16:00:00Z',
    resolutionNotes: 'Records archived according to policy'
  },
  {
    id: 'CA004',
    type: 'data_breach',
    severity: 'critical',
    description: 'Potential data export to unauthorized location detected',
    detectedDate: '2024-01-25T11:20:00Z',
    status: 'investigating',
    assignedTo: 'EMP001'
  }
];

// Utility functions for admin analytics
export const getRecordsByStatus = (records: PatientRecord[]) => {
  return records.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getDataQualityStats = (records: PatientRecord[]) => {
  const total = records.length;
  const highQuality = records.filter(r => r.dataQualityScore >= 90).length;
  const mediumQuality = records.filter(r => r.dataQualityScore >= 70 && r.dataQualityScore < 90).length;
  const lowQuality = records.filter(r => r.dataQualityScore < 70).length;
  
  return {
    total,
    highQuality,
    mediumQuality,
    lowQuality,
    averageScore: records.reduce((sum, r) => sum + r.dataQualityScore, 0) / total
  };
};

export const getComplianceStats = (alerts: ComplianceAlert[]) => {
  const total = alerts.length;
  const critical = alerts.filter(a => a.severity === 'critical').length;
  const high = alerts.filter(a => a.severity === 'high').length;
  const medium = alerts.filter(a => a.severity === 'medium').length;
  const low = alerts.filter(a => a.severity === 'low').length;
  const open = alerts.filter(a => a.status === 'open' || a.status === 'investigating').length;
  
  return { total, critical, high, medium, low, open };
};

export const getAccessStats = (logs: AccessLog[]) => {
  const total = logs.length;
  const successful = logs.filter(l => l.success).length;
  const failed = logs.filter(l => !l.success).length;
  const averageDuration = logs.filter(l => l.success).reduce((sum, l) => sum + l.duration, 0) / successful;
  
  return { total, successful, failed, successRate: (successful / total) * 100, averageDuration };
};