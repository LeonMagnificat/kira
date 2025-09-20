import React, { useMemo, useState } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { mockPatientRecords } from '~/data/mockPatientAdmin';

interface OutletContext { isSidebarMinimized: boolean }

const EmployeePatients: React.FC = () => {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();
  const [query, setQuery] = useState('');

  const patients = useMemo(() => {
    const list = mockPatientRecords;
    if (!query) return list.slice(0, 25);
    return list.filter(p => p.id.toLowerCase().includes(query.toLowerCase())).slice(0, 25);
  }, [query]);

  return (
    <div>
      <main className="dashboard wrapper">
        <Header title="Patients" />
      </main>

      <div className={`bg-white shadow-sm rounded-2xl mb-0 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0  md:ml-[-70px]'}`}>

        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by Patient ID"
              className="w-full max-w-md border rounded-lg px-3 py-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map(p => (
              <div key={p.id} className="p-4 bg-gray-50 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{p.id}</h3>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${
                    p.status === 'active' ? 'bg-green-100 text-green-700' : p.status === 'inactive' ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{p.status}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>Profile: {p.profileCompleteness}%</p>
                  <p>Record Type: {p.recordType}</p>
                  <p>Created: {new Date(p.recordCreatedDate).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePatients;