import React, { useMemo, useState } from 'react';
import { Header, Input, Card, Modal, ConfirmDialog } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { mockPatientRecords, type PatientRecord } from '~/data/mockPatientAdmin';
import { PatientTable } from '~/components/patients/PatientTable';
import { PatientQuickView } from '~/components/patients/PatientQuickView';
import { PatientQueue, type QueueItem } from '~/components/patients/PatientQueue';
import { PatientForm, type PatientFormValues } from '~/components/patients/PatientForm';

interface OutletContext { isSidebarMinimized: boolean }

const EmployeePatients: React.FC = () => {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();
  const [query, setQuery] = useState('');
  const [quickView, setQuickView] = useState<PatientRecord | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<PatientRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PatientRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = mockPatientRecords;
    if (!q) return base.slice(0, 50);
    return base
      .filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.recordType.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [query]);

  const handleQueue = (p: PatientRecord) => {
    setQueue((prev) => {
      if (prev.some(x => x.patient.id === p.id)) return prev; // avoid duplicates
      return [...prev, { id: `${p.id}-${Date.now()}`, patient: p, joinedAt: Date.now() }];
    });
  };

  const serveNext = () => setQueue((prev) => prev.slice(1));
  const clearQueue = () => setQueue([]);

  return (
    <div>
      <Header title="Patients" />

      <div className={`transition-all duration-500 ease-in-out`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Search + Table */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Input
                  placeholder="Search by ID, status, type"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full sm:max-w-md"
                />
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Showing {filtered.length} result(s)
                </p>
              </div>
            </Card>
            <div className="mt-4">
              <PatientTable
                data={filtered}
                onQuickView={setQuickView}
                onQueue={handleQueue}
              />
            </div>
          </div>

          {/* Right: Queue */}
          <div className="lg:col-span-1">
            <PatientQueue items={queue} onClear={clearQueue} onPop={serveNext} />
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <PatientQuickView patient={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
};

export default EmployeePatients;