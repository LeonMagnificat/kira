import React from 'react';
import { Button } from "~/components/ui/Button";
import { PatientRecord } from "~/data/mockPatientAdmin";

export type PatientTableProps = {
  data: PatientRecord[];
  onQuickView: (patient: PatientRecord) => void;
  onQueue: (patient: PatientRecord) => void;
  showName?: boolean;
  getNameById?: (id: string) => string | undefined;
  showContact?: boolean;
};

function StatusBadge({ status }: { status: PatientRecord['status'] }) {
  const colors: Record<PatientRecord['status'], { bg: string; fg: string }> = {
    active: { bg: 'var(--color-success-weak)', fg: 'var(--color-success)' },
    inactive: { bg: 'var(--color-muted)', fg: 'var(--color-muted-foreground)' },
    archived: { bg: 'var(--color-danger-weak)', fg: 'var(--color-danger)' },
    pending: { bg: 'var(--color-warning-weak)', fg: 'var(--color-warning)' },
  };
  const c = colors[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ width: '100%' }}>
      <div
        className="h-2 rounded-full"
        style={{ background: 'var(--color-muted)' }}
      >
        <div
          className="h-2 rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: 'var(--color-accent)' }}
        />
      </div>
    </div>
  );
}

export const PatientTable: React.FC<PatientTableProps> = ({ data, onQuickView, onQueue, showName, getNameById, showContact }) => {
  return (
    <div className="w-full overflow-x-auto" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface)' }}>
      <table className="min-w-full" style={{ color: 'var(--color-foreground)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-left text-sm font-semibold px-4 py-3">Patient ID</th>
            {showName ? <th className="text-left text-sm font-semibold px-4 py-3">Name</th> : null}
            <th className="text-left text-sm font-semibold px-4 py-3">Status</th>
            <th className="text-left text-sm font-semibold px-4 py-3">Record Type</th>
            <th className="text-left text-sm font-semibold px-4 py-3">Profile</th>
            <th className="text-left text-sm font-semibold px-4 py-3">Created</th>
            {showContact ? <th className="text-left text-sm font-semibold px-4 py-3">Contact</th> : null}
            <th className="text-right text-sm font-semibold px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => {
            const name = showName && getNameById ? getNameById(p.id) : undefined;
            return (
              <tr key={p.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td className="px-4 py-3 font-medium">{p.id}</td>
                {showName ? (
                  <td className="px-4 py-3">{name ?? '—'}</td>
                ) : null}
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 capitalize">{p.recordType}</td>
                <td className="px-4 py-3" style={{ minWidth: 160 }}>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={p.profileCompleteness} />
                    <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{p.profileCompleteness}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  {new Date(p.recordCreatedDate).toLocaleDateString()}
                </td>
                {showContact ? (
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                    {/* Placeholder — extend with email/phone when record holds it */}
                    available on profile
                  </td>
                ) : null}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="secondary" size="sm" onClick={() => onQuickView(p)}>Quick view</Button>
                    <Button variant="primary" size="sm" onClick={() => onQueue(p)}>Add to queue</Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;