import React from 'react';
import { Header, Card } from '~/components';

export default function PatientHistory() {
  return (
    <div>
      <Header title="Medical History — Patient" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          View your medical history and reports here.
        </p>
      </Card>
    </div>
  );
}