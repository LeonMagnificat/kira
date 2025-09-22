import React, { useMemo, useState } from 'react';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Select } from '~/components/ui/Select';
import type { PatientRecord } from '~/data/mockPatientAdmin';

export type PatientFormValues = Pick<PatientRecord,
  'id' | 'recordType' | 'status' | 'profileCompleteness' | 'hasEmail' | 'hasPhone' | 'hasAddress' | 'hasEmergencyContact' | 'hasInsurance'>;

export type PatientFormProps = {
  mode: 'create' | 'edit';
  initial?: PatientFormValues;
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
};

const defaultValues: PatientFormValues = {
  id: '',
  recordType: 'patient',
  status: 'active',
  profileCompleteness: 0,
  hasEmail: false,
  hasPhone: false,
  hasAddress: false,
  hasEmergencyContact: false,
  hasInsurance: false,
};

export function PatientForm({ mode, initial, onSubmit, onCancel }: PatientFormProps) {
  const [values, setValues] = useState<PatientFormValues>({ ...(defaultValues), ...(initial ?? {}) });
  const isEdit = mode === 'edit';

  const canSubmit = useMemo(() => {
    return values.id.trim().length > 0 && values.profileCompleteness >= 0 && values.profileCompleteness <= 100;
  }, [values]);

  const handleChange = (k: keyof PatientFormValues, v: any) => setValues(prev => ({ ...prev, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit(values); }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Patient ID</label>
          <Input value={values.id} onChange={(e) => handleChange('id', e.target.value)} disabled={isEdit} />
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Record Type</label>
          <Select value={values.recordType} onChange={(e) => handleChange('recordType', e.target.value)}>
            <option value="patient">patient</option>
            <option value="member">member</option>
            <option value="prospect">prospect</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Status</label>
          <Select value={values.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="archived">archived</option>
            <option value="pending">pending</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Profile Completeness</label>
          <Input type="number" min={0} max={100} value={values.profileCompleteness} onChange={(e) => handleChange('profileCompleteness', Number(e.target.value))} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(['hasEmail','hasPhone','hasAddress','hasEmergencyContact','hasInsurance'] as const).map(key => (
          <label key={key} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
            <input type="checkbox" checked={values[key]} onChange={(e) => handleChange(key, e.target.checked)} />
            <span>{key}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={!canSubmit}>{isEdit ? 'Save' : 'Create'}</Button>
      </div>
    </form>
  );
}

export default PatientForm;