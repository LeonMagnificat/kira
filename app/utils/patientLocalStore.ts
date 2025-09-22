import type { PatientRecord } from '~/data/mockPatientAdmin';
import { listItems, createItem, updateItem, deleteItem } from '~/utils/localCrud';

const KEY = 'patients.local';

export function listPatients(seed: PatientRecord[]): PatientRecord[] {
  return listItems<PatientRecord>(KEY, seed as any) as any;
}

export function createPatient(values: PatientRecord): PatientRecord {
  return createItem<PatientRecord>(KEY, values as any) as any;
}

export function updatePatient(id: string, patch: Partial<PatientRecord>): PatientRecord | null {
  return updateItem<PatientRecord>(KEY, id, patch as any) as any;
}

export function deletePatient(id: string): boolean {
  return deleteItem<PatientRecord>(KEY, id);
}