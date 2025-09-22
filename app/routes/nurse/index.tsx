import React from 'react';
import { Header, Card } from '~/components';

export default function NurseHome() {
  return (
    <div>
      <Header title="Nurse Dashboard" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h4 className="font-semibold">Task Focus</h4>
          <p className="text-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
            Quick access to patient vitals, medication timelines, and schedule.
          </p>
        </Card>
        <Card>
          <h4 className="font-semibold">Real-time Monitoring</h4>
          <p className="text-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
            Visuals for vitals tracker coming soon.
          </p>
        </Card>
        <Card>
          <h4 className="font-semibold">Medication</h4>
          <p className="text-sm mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
            Track medication administration records.
          </p>
        </Card>
      </div>
    </div>
  );
}