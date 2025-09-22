import React, { useMemo, useState } from 'react';
import { Header, Input, Card } from '~/components';
import { mockPatientRecords } from '~/data/mockPatientAdmin';
import { getPatientName } from "~/data/mockPatientDetails";

export default function NursePatients() {
  const [query, setQuery] = useState('');
  const data = useMemo(() => {
    const q = query.toLowerCase();
    return mockPatientRecords.filter(p => p.id.toLowerCase().includes(q)).slice(0, 50);
  }, [query]);

  return (
    <div>
      <Header title="Patients — Nurse" />
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input placeholder="Search assigned patients" value={query} onChange={e => setQuery(e.target.value)} />
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            View assigned data and history. Record vitals and observations.
          </p>
        </div>
      </Card>
      <Card className="mt-4">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.map(p => (
            <li key={p.id} className="p-4 rounded-xl" style={{ background: 'var(--color-muted)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{getPatientName(p.id) ?? p.id}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'var(--color-primary-weak)', color: 'var(--color-primary)' }}>{p.status}</span>
                </div>
                <span className="text-sm capitalize" style={{ color: 'var(--color-muted-foreground)' }}>{p.recordType}</span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>ID: {p.id}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}