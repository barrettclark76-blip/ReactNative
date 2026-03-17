import { SyncBehavior } from './types';

type BaseRecord = {
  id: string;
  updatedAt: string;
  source: 'imported' | 'manual';
};

export function resolveConflict<T extends BaseRecord>(
  existing: T | undefined,
  incoming: T,
  behavior: SyncBehavior = 'prefer_manual',
): T {
  if (!existing) {
    return incoming;
  }

  if (behavior === 'prefer_manual' && existing.source === 'manual') {
    return existing;
  }

  if (behavior === 'prefer_imported' && incoming.source === 'imported') {
    return incoming;
  }

  return new Date(existing.updatedAt).getTime() > new Date(incoming.updatedAt).getTime()
    ? existing
    : incoming;
}

export function mergeById<T extends BaseRecord>(
  existing: T[],
  incoming: T[],
  behavior: SyncBehavior = 'prefer_manual',
) {
  const map = new Map(existing.map((record) => [record.id, record]));
  incoming.forEach((record) => {
    const current = map.get(record.id);
    map.set(record.id, resolveConflict(current, record, behavior));
  });
  return Array.from(map.values());
}
