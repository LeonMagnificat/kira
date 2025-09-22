import React from 'react';
import { Header, Card } from '~/components';

export default function NurseMedication() {
  return (
    <div>
      <Header title="Medication — Nurse" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Track medication administration records and timelines.
        </p>
      </Card>
    </div>
  );
}