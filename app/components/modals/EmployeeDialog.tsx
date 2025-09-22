import React, { useEffect, useState } from 'react'
import { Dialog, Input, Select } from '~/components'
import type { Employee } from '~/data/mockEmployees'

export type EmployeeDialogProps = {
  open: boolean
  mode: 'create' | 'edit'
  initial?: Partial<Employee>
  onClose: () => void
  onSubmit: (data: Omit<Employee, 'id'> & Partial<Pick<Employee, 'id'>>) => void
}

const categoryOptions: Employee['category'][] = ['doctors', 'nurses', 'janitors', 'investors', 'members']
const statusOptions: Employee['status'][] = ['active', 'inactive', 'on-leave']

export function EmployeeDialog({ open, mode, initial, onClose, onSubmit }: EmployeeDialogProps) {
  const [form, setForm] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    category: 'members',
    hireDate: new Date().toISOString().slice(0, 10),
    status: 'active',
    avatar: '',
    hasSystemAccess: false,
    salary: 0,
    address: '',
    emergencyContact: { name: '', phone: '', relationship: '' },
    skills: [],
    notes: ''
  })

  useEffect(() => {
    if (open) {
      setForm(prev => ({
        ...prev,
        ...(initial as any),
        // normalize nested fields
        emergencyContact: initial?.emergencyContact ?? { name: '', phone: '', relationship: '' },
        skills: initial?.skills ?? [],
        hireDate: (initial?.hireDate ?? prev.hireDate)?.toString().slice(0, 10),
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const submit = () => {
    // simple validation
    if (!form.firstName || !form.lastName || !form.email) return
    onSubmit({ ...(initial?.id ? { id: initial.id } : {}), ...form })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add Employee' : 'Edit Employee'}
      description={mode === 'create' ? 'Create a new employee profile' : 'Update employee details'}
      onSubmit={submit}
      submitLabel={mode === 'create' ? 'Create' : 'Save Changes'}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <Input value={form.firstName} onChange={(e: any) => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <Input value={form.lastName} onChange={(e: any) => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <Input value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <Input value={form.position} onChange={(e: any) => setForm({ ...form, position: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <Input value={form.department} onChange={(e: any) => setForm({ ...form, department: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Employee['category'] })}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {categoryOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Employee['status'] })}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
          <Input type="date" value={form.hireDate} onChange={(e: any) => setForm({ ...form, hireDate: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
          <Input type="number" value={form.salary} onChange={(e: any) => setForm({ ...form, salary: Number(e.target.value) || 0 })} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Input value={form.address} onChange={(e: any) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Name</label>
          <Input value={form.emergencyContact.name} onChange={(e: any) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
          <Input value={form.emergencyContact.phone} onChange={(e: any) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
          <Input value={form.emergencyContact.relationship} onChange={(e: any) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relationship: e.target.value } })} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </div>
      </div>
    </Dialog>
  )
}

export default EmployeeDialog