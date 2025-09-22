import React from 'react';
import { Header, Card } from '~/components';

export default function PatientMessages() {
  return (
    <div>
      <Header title="Messages — Patient" />
      <Card>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Secure messaging with doctors and nurses.
        </p>
      </Card>
    </div>
  );
}