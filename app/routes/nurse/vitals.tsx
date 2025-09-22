import React from 'react';
import { Header, Card } from '~/components';

export default function NurseVitals() {
  return (
    <div>
      <Header title="Vitals — Nurse" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Record and track patient vitals here. Real-time tracker UI coming soon.
        </p>
      </Card>
    </div>
  );
}