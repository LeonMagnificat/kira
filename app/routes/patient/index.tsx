import React from 'react';
import { Header, Card } from '~/components';

export default function PatientHome() {
  return (
    <div>
      <Header title="Patient Dashboard" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h4 className="font-semibold">Health Overview</h4>
          <p className="text-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
            Modern, engaging visuals (vitals, charts, reminders) coming soon.
          </p>
        </Card>
        <Card>
          <h4 className="font-semibold">Appointments</h4>
          <p className="text-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
            Book, reschedule, or cancel appointments.
          </p>
        </Card>
        <Card>
          <h4 className="font-semibold">Messages</h4>
          <p className="text-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
            Secure messaging with your care team.
          </p>
        </Card>
      </div>
    </div>
  );
}