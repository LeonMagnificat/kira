import React, { useMemo, useState } from 'react';
import { Header, Card, Input } from '~/components';
import { mockAppointments } from '~/data/mockAppointments';

export default function PatientAppointments() {
  const [query, setQuery] = useState('');
  const data = useMemo(() => {
    const q = query.toLowerCase();
    return mockAppointments.filter(a => a.patientId.toLowerCase().includes('pat')).slice(0, 20);
  }, [query]);

  return (
    <div>
      <Header title="Appointments — Patient" />
      <Card>
        <Input placeholder="Search / book appointments (demo)" value={query} onChange={e => setQuery(e.target.value)} />
      </Card>
      <Card className="mt-4">
        <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {data.map(a => (
            <li key={a.id} className="py-3">
              <p className="font-medium">{a.appointmentDate} {a.appointmentTime} • {a.type}</p>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{a.status} • {a.reason}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}