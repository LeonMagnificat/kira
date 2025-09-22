import React, { useMemo } from 'react';
import { Header } from '~/components';
import { useOutletContext } from 'react-router-dom';
import { mockAppointments } from '~/data/mockAppointments';
import { getRecentNotifications } from '~/data/mockNotifications';
import { mockEmployees } from '~/data/mockEmployees';
import { mockMessages } from '~/data/mockMessages';

interface OutletContext { isSidebarMinimized: boolean }

const EmployeeHome: React.FC = () => {
  const { isSidebarMinimized } = useOutletContext<OutletContext>();

  const upcomingAppointments = useMemo(() => {
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

      <div
        className={`shadow-sm rounded-2xl mb-0 transition-all duration-500 ease-in-out ${isSidebarMinimized ? 'sm:ml-[0px] md:ml-[-25px]' : 'sm:ml-0  md:ml-[-70px]'}`}
        style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <section className="shadow-sm rounded-2xl p-6" style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }}>
            <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--color-muted)' }}>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-foreground)' }}>{apt.type} • {apt.appointmentDate} {apt.appointmentTime}</p>
                    <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Priority: {apt.priority}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded capitalize" style={{ background: 'var(--color-accent-weak)', color: 'var(--color-accent)' }}>{apt.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="shadow-sm rounded-2xl p-6" style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }}>
            <h2 className="text-lg font-semibold mb-4">Working Doctors</h2>
            <ul className="space-y-3">
              {workingDoctors.map(doc => (
                <li key={doc.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-muted)' }}>
                  <span>{doc.firstName} {doc.lastName}</span>
                  <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-success-weak)', color: 'var(--color-success)' }}>Active</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="shadow-sm rounded-2xl p-6" style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }}>
            <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
            <ul className="space-y-3">
              {recentNotifications.map(n => (
                <li key={n.id} className="p-3 rounded-lg" style={{ background: 'var(--color-muted)' }}>
                  <p className="font-medium" style={{ color: 'var(--color-foreground)' }}>{n.title}</p>
                  <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{n.message}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="shadow-sm rounded-2xl p-6 m-6" style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }}>
          <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
          <div className="space-y-3">
            {recentMessages.map(m => (
              <div key={m.id} className="p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--color-muted)' }}>
                <span>{m.content}</span>
                <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{new Date(m.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;