import React, { useMemo, useState } from 'react';
import { Header, Input, Card } from '~/components';
import { mockPatientRecords, type PatientRecord } from '~/data/mockPatientAdmin';
import { PatientTable } from '~/components/patients/PatientTable';
import { PatientQuickView } from '~/components/patients/PatientQuickView';
import { getPatientName } from "~/data/mockPatientDetails";

export default function DoctorPatients() {
  const [query, setQuery] = useState('');
  const [quick, setQuick] = useState<PatientRecord | null>(null);

  const data = useMemo(() => {
    const q = query.toLowerCase();
    return mockPatientRecords.filter(p =>
      p.id.toLowerCase().includes(q) || p.status.toLowerCase().includes(q) || p.recordType.toLowerCase().includes(q)
    ).slice(0, 100);
  }, [query]);

  return (
    <div>
      <Header title="Patients — Doctor" />
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input placeholder="Search patients (ID, status, type)" value={query} onChange={(e) => setQuery(e.target.value)} />
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Full medical access: open a patient to manage visits & prescriptions</p>
        </div>
      </Card>
      <div className="mt-4">
        <PatientTable
          data={data}
          onQuickView={setQuick}
          onQueue={() => {}}
          showName
          getNameById={getPatientName}
          showContact
        />
      </div>

      <PatientQuickView patient={quick} onClose={() => setQuick(null)} />
    </div>
  );
}