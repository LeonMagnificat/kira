import React, { useMemo, useState } from 'react';
import { Header, Card, Input } from '~/components';
import { mockAppointments } from '~/data/mockAppointments';

export default function DoctorAppointments() {
  const [query, setQuery] = useState('');
  const data = useMemo(() => {
    const q = query.toLowerCase();
    return mockAppointments.filter(a =>
      a.patientId.toLowerCase().includes(q) || a.status.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <Header title="Appointments — Doctor" />
      <Card>
        <Input placeholder="Search appointments (patient, status, type)" value={query} onChange={e => setQuery(e.target.value)} />
      </Card>
      <Card className="mt-4">
        <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {data.slice(0, 50).map(a => (
            <li key={a.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{a.appointmentDate} {a.appointmentTime} • {a.patientId}</p>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{a.type} • {a.status} • {a.reason}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-accent-weak)', color: 'var(--color-accent)' }}>manage</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}