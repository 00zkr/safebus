import { useEffect, useState } from 'react';
import { Edit, MapPin, Save, Search, Trash2, X } from 'lucide-react';
import { createBus, deleteBus, getBuses, updateBus } from '../api/transportApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Notice from '../components/Notice';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

const emptyForm = { name: '', driver_name: '', driver_username: '', driver_password: '', status: 'idle', current_lat: '', current_lng: '' };

function getApiErrorMessage(err) {
  const details = err.response?.data?.errors;

  if (Array.isArray(details) && details.length > 0) {
    return details.map((error) => error.message).join(' ');
  }

  return err.response?.data?.message || 'Could not save driver account.';
}

export default function DriverAccountsPage() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    try {
      setBuses(await getBuses());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.message || 'Could not load driver accounts.'));
  }, []);

  const filteredDrivers = buses.filter((bus) => {
    const term = search.toLowerCase();
    return [`driver-${bus.id}`, bus.name, bus.driver_name, bus.driver_username, bus.status]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term));
  });

  function edit(bus) {
    setEditingId(bus.id);
    setForm({
      name: bus.name,
      driver_name: bus.driver_name,
      driver_username: bus.driver_username || '',
      driver_password: '',
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
      driver_username: form.driver_username,
      status: form.status,
      current_lat: form.current_lat === '' ? null : Number(form.current_lat),
      current_lng: form.current_lng === '' ? null : Number(form.current_lng)
    };

    if (form.driver_password) {
      payload.driver_password = form.driver_password;
    }

    try {
      if (editingId) {
        await updateBus(editingId, payload);
      } else {
        await createBus(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Driver account updated.' : 'Driver account created.');
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function remove(id) {
    if (!confirm('Delete this driver account and assigned bus?')) return;
    await deleteBus(id);
    setNotice('Driver account deleted.');
    await load();
  }

  return (
    <>
      <PageHeader title="Driver Accounts" description="Manage driver details, assigned buses, statuses, and live GPS records." />
      {error ? <div className="form-error">{error}</div> : null}
      <Notice>{notice}</Notice>
      {loading ? <LoadingState label="Loading driver accounts..." /> : null}

      <form className="inline-form" onSubmit={submit}>
        <input placeholder="Bus/account name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input placeholder="Driver full name" value={form.driver_name} onChange={(event) => setForm({ ...form, driver_name: event.target.value })} />
        <input placeholder="Username" value={form.driver_username} onChange={(event) => setForm({ ...form, driver_username: event.target.value })} required />
        <input placeholder={editingId ? 'New password (optional)' : 'Password'} type="password" value={form.driver_password} onChange={(event) => setForm({ ...form, driver_password: event.target.value })} required={!editingId} />
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
        <input placeholder="Search driver accounts, usernames, buses, or statuses" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <section className="account-grid">
        {filteredDrivers.length === 0 ? <EmptyState label="No matching driver accounts." /> : filteredDrivers.map((bus) => (
          <article key={bus.id} className="account-card">
            <div className="account-card-header">
              <div>
                <span className="account-kicker">driver-{bus.id}</span>
                <h2>{bus.driver_name}</h2>
              </div>
              <StatusBadge value={bus.status} />
            </div>
            <dl>
              <div><dt>Assigned bus</dt><dd>{bus.name}</dd></div>
              <div><dt>Username</dt><dd>{bus.driver_username || '-'}</dd></div>
              <div><dt>Password</dt><dd>{bus.driver_username ? 'Set in MySQL' : 'Not set'}</dd></div>
              <div><dt>Location</dt><dd>{bus.current_lat && bus.current_lng ? `${bus.current_lat}, ${bus.current_lng}` : '-'}</dd></div>
            </dl>
            {bus.current_lat && bus.current_lng ? (
              <a className="map-link" href={`https://www.openstreetmap.org/?mlat=${bus.current_lat}&mlon=${bus.current_lng}#map=15/${bus.current_lat}/${bus.current_lng}`} target="_blank" rel="noreferrer">
                <MapPin size={16} />
                <span>Open map</span>
              </a>
            ) : null}
            <div className="row-actions">
              <button type="button" className="icon-button" onClick={() => edit(bus)} title="Edit"><Edit size={16} /></button>
              <button type="button" className="icon-button danger" onClick={() => remove(bus.id)} title="Delete"><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
