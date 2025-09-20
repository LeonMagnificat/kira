import React, { useMemo } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { mockAppointments } from '~/data/mockAppointments';
import { mockNotifications, getRecentNotifications } from '~/data/mockNotifications';
import { mockEmployees } from '~/data/mockEmployees';
import { mockMessages, mockMessageGroups } from '~/data/mockMessages';

interface OutletContext { isSidebarMinimized: boolean }

const EmployeeHome: React.FC = () => {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return mockAppointments
      .filter(a => ['scheduled', 'confirmed'].includes(a.status))
      .sort((a, b) => new Date(`${a.appointmentDate}T${a.appointmentTime}`).getTime() - new Date(`${b.appointmentDate}T${b.appointmentTime}`).getTime())
      .slice(0, 5);
  }, []);

  const workingDoctors = useMemo(() => mockEmployees.filter(e => e.category === 'doctors' && e.status === 'active').slice(0, 5), []);
  const recentNotifications = useMemo(() => getRecentNotifications(7).slice(0, 5), []);
  const recentMessages = useMemo(() => mockMessages.slice(-5).reverse(), []);

  return (
    <div>
      <main className="dashboard wrapper">
        <Header title="Employee Home" />
      </main>

      <div className={`bg-white shadow-sm rounded-2xl mb-0 transition-all duration-500 ease-in-out ${
        isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0  md:ml-[-70px]'}`}>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <section className="bg-white shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="p-3 rounded-lg bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{apt.type} • {apt.appointmentDate} {apt.appointmentTime}</p>
                    <p className="text-sm text-gray-600">Priority: {apt.priority}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 capitalize">{apt.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Working Doctors</h2>
            <ul className="space-y-3">
              {workingDoctors.map(doc => (
                <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-800">{doc.firstName} {doc.lastName}</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Active</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
            <ul className="space-y-3">
              {recentNotifications.map(n => (
                <li key={n.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="bg-white shadow-sm rounded-2xl p-6 m-6">
          <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
          <div className="space-y-3">
            {recentMessages.map(m => (
              <div key={m.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-gray-800">{m.content}</span>
                <span className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;