import React from 'react';
import { Header, Card } from '~/components';

export default function PatientPrescriptions() {
  return (
    <div>
      <Header title="Prescriptions — Patient" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Access prescriptions and medication reminders.
        </p>
      </Card>
    </div>
  );
}