import React from 'react';
import { PatientRecord } from "~/data/mockPatientAdmin";
import { Button } from "~/components/ui/Button";

export type PatientQuickViewProps = {
  patient: PatientRecord | null;
  onClose: () => void;
};

/*
  Employee quick view:
  - Shows general information allowed for employee context
  - Hides sensitive details (visits, prescriptions, doctor comments) per request
*/
export const PatientQuickView: React.FC<PatientQuickViewProps> = ({ patient, onClose }) => {
  if (!patient) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-lg"
        style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Patient {patient.id}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                Record type: <span className="capitalize">{patient.recordType}</span>
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Created</p>
              <p className="font-medium">{new Date(patient.recordCreatedDate).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Last Updated</p>
              <p className="font-medium">{new Date(patient.lastUpdatedDate).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Profile Completeness</p>
              <p className="font-medium">{patient.profileCompleteness}%</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Status</p>
              <p className="font-medium capitalize">{patient.status}</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--color-muted)' }}>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Detailed medical data like past visits, prescriptions and doctors' comments are hidden in the employee profile view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientQuickView;