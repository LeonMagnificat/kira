import React, { useEffect, useMemo, useState } from 'react';
import { Header, Input, Card, Modal, ConfirmDialog, Button } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { mockPatientRecords, type PatientRecord } from '~/data/mockPatientAdmin';
import { PatientTable } from '~/components/patients/PatientTable';
import { PatientQuickView } from '~/components/patients/PatientQuickView';
import { PatientQueue, type QueueItem } from '~/components/patients/PatientQueue';
import { PatientForm, type PatientFormValues } from '~/components/patients/PatientForm';
import { listPatients, createPatient, updatePatient, deletePatient } from '~/utils/patientLocalStore';

interface OutletContext { isSidebarMinimized: boolean }

const EmployeePatients: React.FC = () => {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();
  const [query, setQuery] = useState('');
  const [quickView, setQuickView] = useState<PatientRecord | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  // Local CRUD state
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<PatientRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PatientRecord | null>(null);

  // Seed from mocks on first render
  useEffect(() => {
    setPatients(listPatients(mockPatientRecords as any) as any);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = patients;
    if (!q) return base.slice(0, 50);
    return base
      .filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.recordType.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [query, patients]);

  const handleQueue = (p: PatientRecord) => {
    setQueue((prev) => {
      if (prev.some(x => x.patient.id === p.id)) return prev; // avoid duplicates
      return [...prev, { id: `${p.id}-${Date.now()}`, patient: p, joinedAt: Date.now() }];
    });
  };

  const serveNext = () => setQueue((prev) => prev.slice(1));
  const clearQueue = () => setQueue([]);

  // CRUD handlers
  const onCreate = (values: PatientFormValues) => {
    const created = createPatient(values as any) as any as PatientRecord;
    setPatients((prev) => [created, ...prev]);
    setShowCreate(false);
  };

  const onEdit = (values: PatientFormValues) => {
    if (!editTarget) return;
    const updated = updatePatient(editTarget.id, values as any);
    if (updated) {
      setPatients((prev) => prev.map(p => p.id === editTarget.id ? (updated as any) : p));
      setEditTarget(null);
    }
  };

  const onDelete = () => {
    if (!deleteTarget) return;
    const ok = deletePatient(deleteTarget.id);
    if (ok) setPatients((prev) => prev.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

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
                <div className="flex-1" />
                <Button variant="primary" onClick={() => setShowCreate(true)}>Create Patient</Button>
              </div>
            </Card>
            <div className="mt-4">
              <PatientTable
                data={filtered}
                onQuickView={setQuickView}
                onQueue={handleQueue}
                onEdit={(p) => setEditTarget(p)}
                onDelete={(p) => setDeleteTarget(p)}
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

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Patient">
        <PatientForm mode="create" onSubmit={onCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Patient">
        {editTarget ? (
          <PatientForm
            mode="edit"
            initial={{
              id: editTarget.id,
              recordType: editTarget.recordType,
              status: editTarget.status,
              profileCompleteness: editTarget.profileCompleteness,
              hasEmail: editTarget.hasEmail,
              hasPhone: editTarget.hasPhone,
              hasAddress: editTarget.hasAddress,
              hasEmergencyContact: editTarget.hasEmergencyContact,
              hasInsurance: editTarget.hasInsurance,
            }}
            onSubmit={onEdit}
            onCancel={() => setEditTarget(null)}
          />
        ) : null}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Patient"
        description={`Are you sure you want to delete ${deleteTarget?.id}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default EmployeePatients;