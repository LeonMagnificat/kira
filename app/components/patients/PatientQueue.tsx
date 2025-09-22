import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PatientRecord } from "~/data/mockPatientAdmin";
import { Button } from "~/components/ui/Button";

export type QueueItem = { id: string; patient: PatientRecord; joinedAt: number };
export type PatientQueueProps = {
  items: QueueItem[];
  onClear: () => void;
  onPop: () => void;
};

/*
  Modern queue design (simulated real-time):
  - Subtle pulse on the first item
  - Time-in-queue indicator
*/
export const PatientQueue: React.FC<PatientQueueProps> = ({ items, onClear, onPop }) => {
  const [, forceTick] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => forceTick((t) => (t + 1) % 1000000), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const firstId = items[0]?.id;

  return (
    <div className="rounded-2xl shadow-sm" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <h4 className="font-semibold">Open Queue</h4>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onPop}>Serve next</Button>
          <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
        </div>
      </div>
      <ul className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
        {items.map((q) => {
          const seconds = Math.max(0, Math.floor((Date.now() - q.joinedAt) / 1000));
          const isFirst = q.id === firstId;
          return (
            <li key={q.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${isFirst ? 'animate-pulse' : ''}`}
                    style={{ background: isFirst ? 'var(--color-primary)' : 'var(--color-border)' }}
                  />
                  <div>
                    <p className="font-medium">{q.patient.id}</p>
                    <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                      Waiting {seconds}s • {q.patient.recordType}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-primary-weak)', color: 'var(--color-primary)' }}>
                  in queue
                </span>
              </div>
            </li>
          );
        })}
        {items.length === 0 ? (
          <li className="px-4 py-8 text-center" style={{ color: 'var(--color-muted-foreground)' }}>
            Queue is empty. Add patients to the queue to get started.
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default PatientQueue;