import React, { useMemo, useState } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { mockPatientRecords } from '~/data/mockPatientAdmin';

interface OutletContext { isSidebarMinimized: boolean }

type JourneyStage = 'arrived' | 'registered' | 'waiting_doctor' | 'with_doctor' | 'in_lab' | 'completed';

type JourneyAction = 'register' | 'queue' | 'start_consultation' | 'send_to_lab' | 'complete';

const stageMeta: Record<JourneyStage, { label: string; color: string }> = {
  arrived: { label: 'Arrived', color: 'bg-gray-100 text-gray-800' },
  registered: { label: 'Registered', color: 'bg-blue-100 text-blue-800' },
  waiting_doctor: { label: 'Waiting Doctor', color: 'bg-yellow-100 text-yellow-800' },
  with_doctor: { label: 'With Doctor', color: 'bg-green-100 text-green-800' },
  in_lab: { label: 'In Lab', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-200 text-green-900' },
};

const nextStageByAction: Record<JourneyAction, JourneyStage> = {
  register: 'registered',
  queue: 'waiting_doctor',
  start_consultation: 'with_doctor',
  send_to_lab: 'in_lab',
  complete: 'completed',
};

const EmployeeMonitoring: React.FC = () => {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();
  const [filter, setFilter] = useState<JourneyStage | 'all'>('all');

  // Keep an editable journey map in state (starts as arrived by default)
  const [journeyMap, setJourneyMap] = useState<Record<string, JourneyStage>>({});

  const records = useMemo(() => mockPatientRecords.slice(0, 25), []);

  const items = useMemo(() => {
    const withStages = records.map(r => ({
      ...r,
      stage: journeyMap[r.id] ?? 'arrived' as JourneyStage,
    }));
    return filter === 'all' ? withStages : withStages.filter(i => i.stage === filter);
  }, [records, filter, journeyMap]);

  const updateStage = (id: string, action: JourneyAction) => {
    setJourneyMap(prev => ({ ...prev, [id]: nextStageByAction[action] }));
  };

  return (
    <div>
      <main className="dashboard wrapper">
        <Header title="Patient Journey Monitoring" />
      </main>

      <div className={`bg-white shadow-sm rounded-2xl mb-0 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0  md:ml-[-70px]'}`}>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['all','arrived','registered','waiting_doctor','with_doctor','in_lab','completed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={`px-3 py-1 rounded-lg text-sm border ${filter === s ? 'bg-pink-700 text-white border-pink-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                {s === 'all' ? 'All' : stageMeta[s as JourneyStage].label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(p => (
              <div key={p.id} className="p-4 bg-gray-50 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{p.id}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${stageMeta[(p as any).stage].color}`}>
                    {stageMeta[(p as any).stage].label}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Profile: {p.profileCompleteness}%</p>
                  <p>Record Type: {p.recordType}</p>
                  <p>Accesses: {p.accessCount}</p>
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                    onClick={() => updateStage(p.id, 'register')}
                  >
                    Register
                  </button>
                  <button
                    className="px-3 py-1 text-xs rounded bg-yellow-600 text-white"
                    onClick={() => updateStage(p.id, 'queue')}
                  >
                    Send to Queue
                  </button>
                  <button
                    className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                    onClick={() => updateStage(p.id, 'start_consultation')}
                  >
                    Start Consultation
                  </button>
                  <button
                    className="px-3 py-1 text-xs rounded bg-purple-600 text-white"
                    onClick={() => updateStage(p.id, 'send_to_lab')}
                  >
                    Send to Lab
                  </button>
                  <button
                    className="px-3 py-1 text-xs rounded bg-gray-700 text-white"
                    onClick={() => updateStage(p.id, 'complete')}
                  >
                    Complete
                  </button>
                  <button className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-800">Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMonitoring;