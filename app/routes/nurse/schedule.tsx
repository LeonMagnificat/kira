import React from 'react';
import { Header, Card } from '~/components';

export default function NurseSchedule() {
  return (
    <div>
      <Header title="Schedule — Nurse" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Assist with scheduling appointments. Integrate provider slots and availability.
        </p>
      </Card>
    </div>
  );
}