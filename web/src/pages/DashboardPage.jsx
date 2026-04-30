import { useEffect, useState } from 'react';
import { AlertTriangle, Bell, Bus, CheckCircle2, Clock, RotateCcw, Send, Users } from 'lucide-react';
import {
  createNotification,
  getBuses,
  getNotifications,
  getRoutes,
  getStudents,
  resetDemoData
} from '../api/transportApi';
import { connectRealtime } from '../api/realtime';
import BusMap from '../components/BusMap';
import LoadingState from '../components/LoadingState';
import NotificationBadge from '../components/NotificationBadge';
import Notice from '../components/Notice';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const [state, setState] = useState({ buses: [], students: [], routes: [], notifications: [] });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [liveMessage, setLiveMessage] = useState('Waiting for live updates');
  const [testStudentId, setTestStudentId] = useState('');

  async function loadDashboard() {
    setLoading(true);
    try {
      const [buses, students, routes, notifications] = await Promise.all([
        getBuses(),
        getStudents(),
        getRoutes(),
        getNotifications()
      ]);
      setState({ buses, students, routes, notifications });
      setTestStudentId((current) => current || String(students[0]?.id || ''));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const socket = connectRealtime();

    socket.on('system:ready', () => setLiveMessage('Live updates connected'));
    socket.on('bus:updated', (bus) => {
      setState((current) => ({
        ...current,
        buses: current.buses.map((item) => (item.id === bus.id ? bus : item))
      }));
      setLiveMessage(`Live update received for ${bus.name}`);
    });
    socket.on('notifications:created', async () => {
      const notifications = await getNotifications();
      setState((current) => ({ ...current, notifications }));
      setLiveMessage('New notification received');
    });
    socket.on('demo:reset', () => {
      loadDashboard();
      setLiveMessage('Demo data reset');
    });

    return () => socket.disconnect();
  }, []);

  const activeBuses = state.buses.filter((bus) => bus.status === 'active').length;
  const delays = state.buses.filter((bus) => bus.status === 'delayed').length;
  const completedRoutes = state.buses.filter((bus) => bus.status === 'completed').length;

  async function resetDemo() {
    const shouldReset = confirm('Reset the database to the original demo data?');
    if (!shouldReset) return;

    setResetting(true);
    setError('');
    setNotice('');

    try {
      const result = await resetDemoData();
      setNotice(result.message);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset demo data.');
    } finally {
      setResetting(false);
    }
  }

  async function sendTestNotification(type) {
    if (!testStudentId) {
      setError('Choose a student before sending a test notification.');
      return;
    }

    const student = state.students.find((item) => item.id === Number(testStudentId));
    const bus = state.buses.find((item) => item.id === student?.bus_id);
    const message =
      type === 'departure'
        ? `${bus?.name || 'The bus'} has departed. This is an admin test notification.`
        : `${bus?.name || 'The bus'} has arrived. This is an admin test notification.`;

    try {
      await createNotification({
        student_id: Number(testStudentId),
        type,
        message
      });
      setNotice(`${type === 'departure' ? 'Start' : 'Arrival'} test notification sent.`);
      const notifications = await getNotifications();
      setState((current) => ({ ...current, notifications }));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send test notification.');
    }
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={liveMessage}
        action={
          <button type="button" onClick={resetDemo} disabled={resetting}>
            <RotateCcw size={16} />
            <span>{resetting ? 'Resetting' : 'Reset Demo'}</span>
          </button>
        }
      />
      {error ? <div className="form-error">{error}</div> : null}
      <Notice>{notice}</Notice>
      {loading ? <LoadingState label="Loading dashboard..." /> : null}

      <section className="metric-grid">
        <Metric icon={Bus} label="Active buses" value={activeBuses} />
        <Metric icon={AlertTriangle} label="Delays" value={delays} />
        <Metric icon={CheckCircle2} label="Completed routes" value={completedRoutes} />
        <Metric icon={Users} label="Students" value={state.students.length} />
      </section>

      <section className="test-notification-panel">
        <div>
          <h2>Test Parent Notification</h2>
          <p>Send a start or arrival alert from admin to verify Android notification shade behavior.</p>
        </div>
        <select value={testStudentId} onChange={(event) => setTestStudentId(event.target.value)}>
          <option value="">Choose student</option>
          {state.students.map((student) => (
            <option key={student.id} value={student.id}>{student.full_name}</option>
          ))}
        </select>
        <button type="button" onClick={() => sendTestNotification('departure')}>
          <Send size={16} />
          <span>Send Start</span>
        </button>
        <button type="button" onClick={() => sendTestNotification('arrival')}>
          <Bell size={16} />
          <span>Send Arrival</span>
        </button>
      </section>

      <section className="table-section">
        <div className="section-title">
          <h2>Bus Status</h2>
          <span>{state.routes.length} routes</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Bus</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {state.buses.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.name}</td>
                <td>{bus.driver_name}</td>
                <td><StatusBadge value={bus.status} /></td>
                <td>{bus.current_lat && bus.current_lng ? `${bus.current_lat}, ${bus.current_lng}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <BusMap buses={state.buses} />

      <section className="table-section">
        <div className="section-title">
          <h2>Recent Notifications</h2>
          <Clock size={18} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {state.notifications.slice(0, 5).map((notification) => (
              <tr key={notification.id}>
                <td><NotificationBadge type={notification.type} /></td>
                <td>{notification.message}</td>
                <td>{notification.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
