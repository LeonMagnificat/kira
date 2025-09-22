import React from 'react';
import { Header, Card } from '~/components';

export default function DoctorVisits() {
  return (
    <div>
      <Header title="Visits — Doctor" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Add and review patient visits. Connect to charts for vitals and diagnostics.
        </p>
      </Card>
    </div>
  );
}