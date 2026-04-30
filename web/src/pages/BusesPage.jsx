import { useEffect, useState } from 'react';
import { Edit, Save, Search, Trash2, X } from 'lucide-react';
import { createBus, deleteBus, getBuses, updateBus } from '../api/transportApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Notice from '../components/Notice';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

const emptyForm = { name: '', driver_name: '', status: 'idle', current_lat: '', current_lng: '' };

export default function BusesPage() {
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
      setBuses(await getBuses());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.message || 'Could not load buses.'));
  }, []);

  const filteredBuses = buses.filter((bus) => {
    const term = search.toLowerCase();
    return [bus.name, bus.driver_name, bus.status].some((value) => value.toLowerCase().includes(term));
  });

  function edit(bus) {
    setEditingId(bus.id);
    setForm({
      name: bus.name,
      driver_name: bus.driver_name,
      status: bus.status,
      current_lat: bus.current_lat || '',
      current_lng: bus.current_lng || ''
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    const payload = {
      name: form.name,
      driver_name: form.driver_name,
      status: form.status,
      current_lat: form.current_lat === '' ? null : Number(form.current_lat),
      current_lng: form.current_lng === '' ? null : Number(form.current_lng)
    };

    try {
      if (editingId) {
        await updateBus(editingId, payload);
      } else {
        await createBus(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Bus updated successfully.' : 'Bus created successfully.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save bus.');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this bus? Students or routes may depend on it.')) return;
    await deleteBus(id);
    setNotice('Bus deleted successfully.');
    await load();
  }

  return (
    <>
      <PageHeader title="Buses" description="Manage buses, drivers, statuses, and stored GPS positions." />
      {error ? <div className="form-error">{error}</div> : null}
      <Notice>{notice}</Notice>
      {loading ? <LoadingState label="Loading buses..." /> : null}

      <form className="inline-form" onSubmit={submit}>
        <input placeholder="Bus name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input placeholder="Driver name" value={form.driver_name} onChange={(event) => setForm({ ...form, driver_name: event.target.value })} />
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="idle">idle</option>
          <option value="active">active</option>
          <option value="delayed">delayed</option>
          <option value="completed">completed</option>
        </select>
        <input placeholder="Latitude" value={form.current_lat} onChange={(event) => setForm({ ...form, current_lat: event.target.value })} />
        <input placeholder="Longitude" value={form.current_lng} onChange={(event) => setForm({ ...form, current_lng: event.target.value })} />
        <button type="submit"><Save size={16} /><span>{editingId ? 'Update' : 'Create'}</span></button>
        {editingId ? <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}><X size={16} /><span>Cancel</span></button> : null}
      </form>

      <div className="search-row">
        <Search size={18} />
        <input placeholder="Search buses, drivers, or statuses" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <section className="table-section">
        {filteredBuses.length === 0 ? <EmptyState label="No matching buses." /> : (
          <table>
            <thead>
              <tr><th>Name</th><th>Driver</th><th>Status</th><th>Location</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <tr key={bus.id}>
                  <td>{bus.name}</td>
                  <td>{bus.driver_name}</td>
                  <td><StatusBadge value={bus.status} /></td>
                  <td>{bus.current_lat && bus.current_lng ? `${bus.current_lat}, ${bus.current_lng}` : '-'}</td>
                  <td className="row-actions">
                    <button type="button" className="icon-button" onClick={() => edit(bus)} title="Edit"><Edit size={16} /></button>
                    <button type="button" className="icon-button danger" onClick={() => remove(bus.id)} title="Delete"><Trash2 size={16} /></button>
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
