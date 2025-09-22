import type { Invoice } from '~/data/mockBilling';
import { listItems, createItem, updateItem, deleteItem } from '~/utils/localCrud';

const KEY = 'billing.invoices.local';

export function listInvoices(seed: Invoice[]): Invoice[] {
  return listItems<Invoice>(KEY, seed as any) as any;
}

export function createInvoice(values: Invoice): Invoice {
  return createItem<Invoice>(KEY, values as any) as any;
}

export function updateInvoice(id: string, patch: Partial<Invoice>): Invoice | null {
  return updateItem<Invoice>(KEY, id, patch as any) as any;
}

export function deleteInvoice(id: string): boolean {
  return deleteItem<Invoice>(KEY, id);
}