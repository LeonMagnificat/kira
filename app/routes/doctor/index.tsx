import React, { useMemo, useState } from 'react';
import { Header, Card, Input, Tabs } from '~/components';
import { mockPatientRecords } from '~/data/mockPatientAdmin';
import { mockAppointments, getAppointmentsByStatus } from '~/data/mockAppointments';

export default function DoctorHome() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('overview');

  const patients = useMemo(() => {
    const q = query.toLowerCase();
    return mockPatientRecords.filter(p => p.id.toLowerCase().includes(q)).slice(0, 10);
  }, [query]);

  return (
    <div>
      <Header title="Doctor Dashboard" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Input placeholder="Advanced search patients" value={query} onChange={e => setQuery(e.target.value)} />
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Quick filters and charting coming soon</p>
            </div>
          </Card>

          <div className="mt-4">
            <Tabs value={tab} onChange={setTab} items={[
              { key: 'overview', label: 'Overview' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
            ]} />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {tab === 'overview' && (
                <>
                  <Card className="col-span-1" elevated>
                    <h4 className="font-semibold">Recent Patients</h4>
                    <ul className="mt-3 space-y-2">
                      {patients.map(p => (
                        <li key={p.id} className="flex items-center justify-between">
                          <span className="font-medium">{p.id}</span>
                          <span className="text-sm capitalize" style={{ color: 'var(--color-muted-foreground)' }}>{p.recordType}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="col-span-1" elevated>
                    <h4 className="font-semibold">Today’s Appointments</h4>
                    <ul className="mt-3 space-y-2">
                      {mockAppointments.slice(0, 6).map(a => (
                        <li key={a.id} className="flex items-center justify-between">
                          <span className="font-medium">{a.appointmentTime} • {a.patientId}</span>
                          <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{a.status}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </>
              )}
              {tab !== 'overview' && (
                <Card>
                  <h4 className="font-semibold capitalize">{tab} Appointments</h4>
                  <ul className="mt-3 space-y-2">
                    {getAppointmentsByStatus(tab as any).slice(0, 10).map(a => (
                      <li key={a.id} className="flex items-center justify-between">
                        <span className="font-medium">{a.appointmentDate} {a.appointmentTime} • {a.patientId}</span>
                        <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{a.reason}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1">
          <Card>
            <h4 className="font-semibold">Quick Actions</h4>
            <ul className="mt-3 space-y-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              <li>+ New Prescription</li>
              <li>+ New Visit</li>
              <li>+ New Appointment</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}