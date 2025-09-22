import React from 'react';
import { Header, Card } from '~/components';

export default function DoctorPrescriptions() {
  return (
    <div>
      <Header title="Prescriptions — Doctor" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Create and manage prescriptions. Integrate with patient profile pages to view/add medications.
        </p>
      </Card>
    </div>
  );
}