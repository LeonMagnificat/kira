import React from 'react';
import { Header, Card } from '~/components';

export default function PatientDocuments() {
  return (
    <div>
      <Header title="Documents — Patient" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Upload and manage personal health documents (lab results, scans).
        </p>
      </Card>
    </div>
  );
}