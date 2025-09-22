export type Gender = 'male' | 'female' | 'other';

export interface PatientDetails {
  id: string;
  fullName: string;
  gender?: Gender;
  dob?: string; // ISO date
  phone?: string;
  email?: string;
}

export const mockPatientDetails: PatientDetails[] = [
  { id: 'PAT001', fullName: 'John Doe', gender: 'male', dob: '1985-03-12', phone: '+1 555-0101', email: 'john.doe@example.com' },
  { id: 'PAT002', fullName: 'Emily Carter', gender: 'female', dob: '1990-07-22', phone: '+1 555-0102', email: 'emily.carter@example.com' },
  { id: 'PAT003', fullName: 'Michael Brown', gender: 'male', dob: '1978-11-08' },
  { id: 'PAT004', fullName: 'Sophia Martinez', gender: 'female', dob: '1995-02-17', phone: '+1 555-0104' },
  { id: 'PAT005', fullName: 'Liam Johnson', gender: 'male', dob: '1989-09-30', email: 'liam.j@example.com' },
  { id: 'PAT006', fullName: 'Olivia Smith', gender: 'female' },
  { id: 'PAT007', fullName: 'Ava Wilson', gender: 'female' },
  { id: 'PAT008', fullName: 'Noah Davis', gender: 'male' },
  { id: 'PAT009', fullName: 'Isabella Taylor', gender: 'female' },
  { id: 'PAT010', fullName: 'Ethan Anderson', gender: 'male' },
];

export const patientDetailsById = new Map(mockPatientDetails.map(d => [d.id, d]));

export function getPatientName(id: string): string | undefined {
  return patientDetailsById.get(id)?.fullName;
}