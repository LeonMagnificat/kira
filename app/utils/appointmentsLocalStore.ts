import type { Appointment } from '~/data/mockAppointments';
import { listItems, createItem, updateItem, deleteItem } from '~/utils/localCrud';

const KEY = 'appointments.local';

export function listAppointments(seed: Appointment[]): Appointment[] {
  return listItems<Appointment>(KEY, seed as any) as any;
}

export function createAppointment(values: Appointment): Appointment {
  return createItem<Appointment>(KEY, values as any) as any;
}

export function updateAppointment(id: string, patch: Partial<Appointment>): Appointment | null {
  return updateItem<Appointment>(KEY, id, patch as any) as any;
}

export function deleteAppointment(id: string): boolean {
  return deleteItem<Appointment>(KEY, id);
}