// Lightweight local CRUD helpers using localStorage with a namespaced key
// Keeps data in-memory fallback if localStorage is unavailable (SSR safety)

export type Id = string;
export type Entity<T> = T & { id: Id };

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch (_) {}
  return null;
}

function loadAll<T>(key: string, seed: Entity<T>[] = []): Entity<T>[] {
  const storage = getStorage();
  if (!storage) return [...seed];
  const raw = storage.getItem(key);
  if (!raw) {
    storage.setItem(key, JSON.stringify(seed));
    return [...seed];
  }
  try {
    return JSON.parse(raw) as Entity<T>[];
  } catch {
    return [...seed];
  }
}

function saveAll<T>(key: string, items: Entity<T>[]): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(key, JSON.stringify(items));
}

export function createItem<T>(key: string, item: Omit<Entity<T>, 'id'> & Partial<Pick<Entity<T>, 'id'>>): Entity<T> {
  const id = (item as any).id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const all = loadAll<T>(key);
  const created = { ...(item as any), id } as Entity<T>;
  all.unshift(created);
  saveAll(key, all);
  return created;
}

export function updateItem<T>(key: string, id: Id, patch: Partial<T>): Entity<T> | null {
  const all = loadAll<T>(key);
  const idx = all.findIndex(i => i.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...(patch as any) } as Entity<T>;
  all[idx] = updated;
  saveAll(key, all);
  return updated;
}

export function deleteItem<T>(key: string, id: Id): boolean {
  const all = loadAll<T>(key);
  const next = all.filter(i => i.id !== id);
  const changed = next.length !== all.length;
  if (changed) saveAll(key, next);
  return changed;
}

export function listItems<T>(key: string, seed: Entity<T>[] = []): Entity<T>[] {
  return loadAll<T>(key, seed);
}