import React, { useMemo, useState } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { mockEmployees } from '~/data/mockEmployees';
import { mockMessageGroups, getMessagesByGroup } from '~/data/mockMessages';

interface OutletContext { isSidebarMinimized: boolean }

const EmployeeMessages: React.FC = () => {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(mockMessageGroups[0]?.id ?? '');

  const groups = useMemo(() => mockMessageGroups, []);
  const messages = useMemo(() => selectedGroupId ? getMessagesByGroup(selectedGroupId) : [], [selectedGroupId]);

  const groupName = groups.find(g => g.id === selectedGroupId)?.name ?? 'Messages';

  return (
    <div>
      <main className="dashboard wrapper">
        <Header title={`Messages • ${groupName}`} />
      </main>

      <div className={`bg-white shadow-sm rounded-2xl mb-0 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0  md:ml-[-70px]'}`}>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Groups list */}
          <aside className="lg:col-span-1 bg-white shadow-sm rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Groups</h3>
            <ul className="space-y-2">
              {groups.map(g => (
                <li key={g.id}>
                  <button
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${selectedGroupId === g.id ? 'bg-pink-100 text-pink-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {g.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Messages */}
          <section className="lg:col-span-3 bg-white shadow-sm rounded-2xl p-4">
            <div className="space-y-3">
              {messages.map(m => (
                <div key={m.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{m.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(m.timestamp).toLocaleString()}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-gray-500">Select a group to view messages.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMessages;