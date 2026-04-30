import { useEffect, useMemo, useState } from 'react';
import { Edit, Save, Search, Trash2, X } from 'lucide-react';
import { createRoute, deleteRoute, getBuses, getRoutes, updateRoute } from '../api/transportApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Notice from '../components/Notice';
import PageHeader from '../components/PageHeader';

const emptyForm = { name: '', stops: '', start_time: '07:00', end_time: '08:00', bus_id: '' };

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [routeRows, busRows] = await Promise.all([getRoutes(), getBuses()]);
      setRoutes(routeRows);
      setBuses(busRows);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.message || 'Could not load routes.'));
  }, []);

  const busById = useMemo(() => Object.fromEntries(buses.map((bus) => [bus.id, bus])), [buses]);

  function parseStops(stops) {
    if (Array.isArray(stops)) return stops.join(', ');
    if (typeof stops === 'string') {
      try {
        const parsed = JSON.parse(stops);
        return Array.isArray(parsed) ? parsed.join(', ') : stops;
      } catch {
        return stops;
      }
    }
    return '';
  }

  const filteredRoutes = routes.filter((route) => {
    const term = search.toLowerCase();
    return [route.name, parseStops(route.stops), busById[route.bus_id]?.name]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term));
  });

  function edit(route) {
    setEditingId(route.id);
    setForm({
      name: route.name,
      stops: parseStops(route.stops),
      start_time: route.start_time,
      end_time: route.end_time,
      bus_id: String(route.bus_id)
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    const payload = {
      name: form.name,
      stops: form.stops.split(',').map((stop) => stop.trim()).filter(Boolean),
      start_time: form.start_time,
      end_time: form.end_time,
      bus_id: Number(form.bus_id)
    };

    try {
      if (editingId) {
        await updateRoute(editingId, payload);
      } else {
        await createRoute(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Route updated successfully.' : 'Route created successfully.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save route.');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this route? Students may depend on it.')) return;
    await deleteRoute(id);
    setNotice('Route deleted successfully.');
    await load();
  }

  return (
    <>
      <PageHeader title="Routes" description="Create routes, define stops, times, and assigned buses." />
      {error ? <div className="form-error">{error}</div> : null}
      <Notice>{notice}</Notice>
      {loading ? <LoadingState label="Loading routes..." /> : null}

      <form className="inline-form" onSubmit={submit}>
        <input placeholder="Route name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input placeholder="Stops separated by commas" value={form.stops} onChange={(event) => setForm({ ...form, stops: event.target.value })} />
        <input type="time" value={form.start_time.slice(0, 5)} onChange={(event) => setForm({ ...form, start_time: event.target.value })} />
        <input type="time" value={form.end_time.slice(0, 5)} onChange={(event) => setForm({ ...form, end_time: event.target.value })} />
        <select value={form.bus_id} onChange={(event) => setForm({ ...form, bus_id: event.target.value })}>
          <option value="">Bus</option>
          {buses.map((bus) => <option key={bus.id} value={bus.id}>{bus.name}</option>)}
        </select>
        <button type="submit"><Save size={16} /><span>{editingId ? 'Update' : 'Create'}</span></button>
        {editingId ? <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}><X size={16} /><span>Cancel</span></button> : null}
      </form>

      <div className="search-row">
        <Search size={18} />
        <input placeholder="Search routes, stops, or buses" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <section className="table-section">
        {filteredRoutes.length === 0 ? <EmptyState label="No matching routes." /> : (
          <table>
            <thead>
              <tr><th>Name</th><th>Stops</th><th>Time</th><th>Bus</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.id}>
                  <td>{route.name}</td>
                  <td>{parseStops(route.stops)}</td>
                  <td>{route.start_time} - {route.end_time}</td>
                  <td>{busById[route.bus_id]?.name || '-'}</td>
                  <td className="row-actions">
                    <button type="button" className="icon-button" onClick={() => edit(route)} title="Edit"><Edit size={16} /></button>
                    <button type="button" className="icon-button danger" onClick={() => remove(route.id)} title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
