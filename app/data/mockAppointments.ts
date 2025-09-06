export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // in minutes
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency' | 'routine-checkup';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  roomNumber?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  reminderSent: boolean;
  insuranceVerified: boolean;
}

export interface AppointmentSlot {
  id: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
}

export const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    patientId: 'PAT001',
    providerId: 'EMP001',
    appointmentDate: '2024-01-22',
    appointmentTime: '09:00',
    duration: 30,
    type: 'consultation',
    status: 'completed',
    reason: 'Annual physical examination',
    notes: 'Patient reports feeling well. All vitals normal.',
    roomNumber: 'Room 101',
    priority: 'medium',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-22T09:30:00Z',
    reminderSent: true,
    insuranceVerified: true
  },
  {
    id: 'APT002',
    patientId: 'PAT002',
    providerId: 'EMP002',
    appointmentDate: '2024-01-23',
    appointmentTime: '14:30',
    duration: 45,
    type: 'follow-up',
    status: 'completed',
    reason: 'Follow-up for hypertension management',
    notes: 'Blood pressure improved. Continue current medication.',
    roomNumber: 'Room 102',
    priority: 'medium',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-23T15:15:00Z',
    reminderSent: true,
    insuranceVerified: true
  },
  {
    id: 'APT003',
    patientId: 'PAT003',
    providerId: 'EMP003',
    appointmentDate: '2024-01-24',
    appointmentTime: '10:15',
    duration: 60,
    type: 'procedure',
    status: 'completed',
    reason: 'Minor surgical procedure',
    notes: 'Procedure completed successfully. Patient stable.',
    roomNumber: 'Room 201',
    priority: 'high',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-24T11:15:00Z',
    reminderSent: true,
    insuranceVerified: true
  },
  {
    id: 'APT004',
    patientId: 'PAT004',
    providerId: 'EMP001',
    appointmentDate: '2024-01-25',
    appointmentTime: '11:00',
    duration: 30,
    type: 'routine-checkup',
    status: 'confirmed',
    reason: 'Routine diabetes checkup',
    roomNumber: 'Room 103',
    priority: 'medium',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-24T16:00:00Z',
    reminderSent: true,
    insuranceVerified: true
  },
  {
    id: 'APT005',
    patientId: 'PAT005',
    providerId: 'EMP002',
    appointmentDate: '2024-01-25',
    appointmentTime: '15:30',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    reason: 'Chest pain evaluation',
    roomNumber: 'Room 104',
    priority: 'high',
    createdAt: '2024-01-19T10:30:00Z',
    updatedAt: '2024-01-19T10:30:00Z',
    reminderSent: false,
    insuranceVerified: false
  },
  {
    id: 'APT006',
    patientId: 'PAT006',
    providerId: 'EMP003',
    appointmentDate: '2024-01-26',
    appointmentTime: '09:30',
    duration: 45,
    type: 'follow-up',
    status: 'scheduled',
    reason: 'Post-surgery follow-up',
    roomNumber: 'Room 201',
    priority: 'high',
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-01-20T13:00:00Z',
    reminderSent: false,
    insuranceVerified: true
  },
  {
    id: 'APT007',
    patientId: 'PAT001',
    providerId: 'EMP004',
    appointmentDate: '2024-01-26',
    appointmentTime: '13:00',
    duration: 30,
    type: 'consultation',
    status: 'cancelled',
    reason: 'Skin rash consultation',
    priority: 'low',
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    reminderSent: false,
    insuranceVerified: false
  },
  {
    id: 'APT008',
    patientId: 'PAT007',
    providerId: 'EMP001',
    appointmentDate: '2024-01-27',
    appointmentTime: '08:30',
    duration: 30,
    type: 'emergency',
    status: 'in-progress',
    reason: 'Severe abdominal pain',
    roomNumber: 'ER-01',
    priority: 'urgent',
    createdAt: '2024-01-27T08:00:00Z',
    updatedAt: '2024-01-27T08:30:00Z',
    reminderSent: false,
    insuranceVerified: false
  },
  {
    id: 'APT009',
    patientId: 'PAT002',
    providerId: 'EMP002',
    appointmentDate: '2024-01-22',
    appointmentTime: '16:00',
    duration: 30,
    type: 'routine-checkup',
    status: 'no-show',
    reason: 'Regular health screening',
    roomNumber: 'Room 105',
    priority: 'low',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-22T16:30:00Z',
    reminderSent: true,
    insuranceVerified: true
  },
  {
    id: 'APT010',
    patientId: 'PAT008',
    providerId: 'EMP003',
    appointmentDate: '2024-01-28',
    appointmentTime: '14:00',
    duration: 60,
    type: 'procedure',
    status: 'scheduled',
    reason: 'Endoscopy procedure',
    roomNumber: 'Room 202',
    priority: 'high',
    createdAt: '2024-01-21T15:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
    reminderSent: false,
    insuranceVerified: true
  }
];

export const mockAppointmentSlots: AppointmentSlot[] = [
  // Generate slots for the next 7 days
  ...Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    const dateStr = date.toISOString().split('T')[0];
    
    return Array.from({ length: 4 }, (_, providerIndex) => {
      const providerId = `EMP00${providerIndex + 1}`;
      
      return Array.from({ length: 16 }, (_, slotIndex) => {
        const hour = 8 + Math.floor(slotIndex / 2);
        const minute = (slotIndex % 2) * 30;
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTime = `${hour.toString().padStart(2, '0')}:${(minute + 30).toString().padStart(2, '0')}`;
        
        const appointment = mockAppointments.find(apt => 
          apt.providerId === providerId && 
          apt.appointmentDate === dateStr && 
          apt.appointmentTime === startTime
        );
        
        return {
          id: `SLOT_${dateStr}_${providerId}_${startTime}`,
          providerId,
          date: dateStr,
          startTime,
          endTime,
          isAvailable: !appointment,
          appointmentId: appointment?.id
        };
      });
    }).flat();
  }).flat()
];

// Helper functions
export const getAppointmentById = (id: string): Appointment | undefined => {
  return mockAppointments.find(appointment => appointment.id === id);
};

export const getAppointmentsByPatient = (patientId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.patientId === patientId);
};

export const getAppointmentsByProvider = (providerId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.providerId === providerId);
};

export const getAppointmentsByDate = (date: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.appointmentDate === date);
};

export const getAppointmentsByStatus = (status: Appointment['status']): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.status === status);
};

export const getAvailableSlots = (providerId: string, date: string): AppointmentSlot[] => {
  return mockAppointmentSlots.filter(slot => 
    slot.providerId === providerId && 
    slot.date === date && 
    slot.isAvailable
  );
};