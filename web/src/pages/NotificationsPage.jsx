import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, Filter, MapPin, RotateCcw, Search } from 'lucide-react';
import { getBuses, getNotifications, getStudents } from '../api/transportApi';
import { connectRealtime } from '../api/realtime';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import NotificationBadge from '../components/NotificationBadge';
import PageHeader from '../components/PageHeader';

const emptyFilters = { student_id: '', bus_id: '', type: '', date: '' };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [toast, setToast] = useState('');

  async function load(nextFilters = filters) {
    setLoading(true);
    try {
      const [notificationRows, studentRows, busRows] = await Promise.all([
        getNotifications(nextFilters),
        getStudents(),
        getBuses()
      ]);
      setNotifications(notificationRows);
      setStudents(studentRows);
      setBuses(busRows);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.message || 'Could not load notifications.'));
  }, []);

  useEffect(() => {
    const socket = connectRealtime();

    socket.on('notifications:created', async (payload) => {
      setToast(`New ${payload.type || ''} notification received`);
      await load(filters);
      setTimeout(() => setToast(''), 3500);
    });

    return () => socket.disconnect();
  }, [filters]);

  const studentById = useMemo(() => Object.fromEntries(students.map((student) => [student.id, student])), [students]);
  const busById = useMemo(() => Object.fromEntries(buses.map((bus) => [bus.id, bus])), [buses]);
  const today = new Date().toISOString().slice(0, 10);
  const filteredNotifications = useMemo(() => {
    const term = search.toLowerCase();
    return notifications.filter((notification) => {
      const date = notification.created_at?.slice(0, 10);

      if (quickFilter === 'delays' && notification.type !== 'delay') return false;
      if (quickFilter === 'today' && date !== today) return false;
      if (quickFilter !== 'all' && !['delays', 'today'].includes(quickFilter) && notification.type !== quickFilter) {
        return false;
      }

      return [
        notification.student_name,
        studentById[notification.student_id]?.full_name,
        busById[notification.bus_id]?.name,
        notification.type,
        notification.message,
        notification.created_at
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [notifications, search, studentById, busById, quickFilter, today]);

  const summary = useMemo(() => {
    const todayRows = notifications.filter((notification) => notification.created_at?.slice(0, 10) === today);
    return {
      totalToday: todayRows.length,
      delaysToday: todayRows.filter((notification) => notification.type === 'delay').length,
      arrivalsToday: todayRows.filter((notification) => notification.type === 'arrival').length,
      nearStopsToday: todayRows.filter((notification) => notification.type === 'near_stop').length
    };
  }, [notifications, today]);

  const groupedNotifications = useMemo(() => {
    return filteredNotifications.reduce((groups, notification) => {
      const date = notification.created_at?.slice(0, 10) || 'Unknown date';
      const label = date === today ? 'Today' : date;
      return {
        ...groups,
        [label]: [...(groups[label] || []), notification]
      };
    }, {});
  }, [filteredNotifications, today]);

  async function apply(event) {
    event.preventDefault();
    setError('');
    try {
      await load(filters);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not filter notifications.');
    }
  }

  async function reset() {
    setFilters(emptyFilters);
    setQuickFilter('all');
    await load(emptyFilters);
  }

  return (
    <>
      <PageHeader title="Notifications" description="View parent notification history and filter by student, bus, type, or date." />
      {error ? <div className="form-error">{error}</div> : null}
      {toast ? <div className="live-toast">{toast}</div> : null}
      {loading ? <LoadingState label="Loading notifications..." /> : null}

      <section className="metric-grid notification-summary">
        <Metric icon={Bell} label="Total today" value={summary.totalToday} />
        <Metric icon={AlertTriangle} label="Delays today" value={summary.delaysToday} />
        <Metric icon={CheckCircle2} label="Arrivals today" value={summary.arrivalsToday} />
        <Metric icon={MapPin} label="Near-stop today" value={summary.nearStopsToday} />
      </section>

      <div className="quick-filters">
        {[
          ['all', 'All'],
          ['today', 'Today'],
          ['delays', 'Delays'],
          ['departure', 'Departures'],
          ['near_stop', 'Near Stops'],
          ['arrival', 'Arrivals']
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={quickFilter === value ? 'quick-filter active' : 'quick-filter'}
            onClick={() => setQuickFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <form className="inline-form" onSubmit={apply}>
        <select value={filters.student_id} onChange={(event) => setFilters({ ...filters, student_id: event.target.value })}>
          <option value="">Student</option>
          {students.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}
        </select>
        <select value={filters.bus_id} onChange={(event) => setFilters({ ...filters, bus_id: event.target.value })}>
          <option value="">Bus</option>
          {buses.map((bus) => <option key={bus.id} value={bus.id}>{bus.name}</option>)}
        </select>
        <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
          <option value="">Type</option>
          <option value="departure">departure</option>
          <option value="near_stop">near_stop</option>
          <option value="arrival">arrival</option>
          <option value="delay">delay</option>
        </select>
        <input type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
        <button type="submit"><Filter size={16} /><span>Filter</span></button>
        <button type="button" className="secondary" onClick={reset}><RotateCcw size={16} /><span>Reset</span></button>
      </form>

      <div className="search-row">
        <Search size={18} />
        <input placeholder="Search notification messages, types, students, or dates" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <section className="table-section">
        {filteredNotifications.length === 0 ? <EmptyState label="No matching notifications found." /> : (
          <div className="notification-groups">
            {Object.entries(groupedNotifications).map(([dateLabel, rows]) => (
              <section key={dateLabel} className="notification-group">
                <div className="section-title">
                  <h2>{dateLabel}</h2>
                  <span>{rows.length} notifications</span>
                </div>
                {rows.map((notification) => (
                  <article key={notification.id} className={`notification-item notification-card-${notification.type}`}>
                    <div className="notification-row">
                      <NotificationBadge type={notification.type} />
                      <span>{notification.created_at}</span>
                    </div>
                    <p>{notification.message}</p>
                    <div className="notification-meta">
                      <span>{notification.student_name || studentById[notification.student_id]?.full_name || '-'}</span>
                      <span>{busById[notification.bus_id]?.name || `Bus ${notification.bus_id || '-'}`}</span>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric compact-metric">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
