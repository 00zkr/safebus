import { useEffect, useMemo, useState } from 'react';
import { Edit, Phone, Save, Search, Trash2, X } from 'lucide-react';
import { createStudent, deleteStudent, getBuses, getRoutes, getStudents, updateStudent } from '../api/transportApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Notice from '../components/Notice';
import PageHeader from '../components/PageHeader';

const emptyForm = { full_name: '', parent_phone: '', parent_username: '', parent_password: '', bus_id: '', route_id: '' };

function getApiErrorMessage(err) {
  const details = err.response?.data?.errors;

  if (Array.isArray(details) && details.length > 0) {
    return details.map((error) => error.message).join(' ');
  }

  return err.response?.data?.message || 'Could not save parent account.';
}

export default function ParentAccountsPage() {
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [studentRows, busRows, routeRows] = await Promise.all([getStudents(), getBuses(), getRoutes()]);
      setStudents(studentRows);
      setBuses(busRows);
      setRoutes(routeRows);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.message || 'Could not load parent accounts.'));
  }, []);

  const busById = useMemo(() => Object.fromEntries(buses.map((bus) => [bus.id, bus])), [buses]);
  const routeById = useMemo(() => Object.fromEntries(routes.map((route) => [route.id, route])), [routes]);
  const filteredAccounts = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((student) =>
      [
        `parent-${student.id}`,
        student.full_name,
        student.parent_phone,
        student.parent_username,
        busById[student.bus_id]?.name,
        routeById[student.route_id]?.name
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [students, search, busById, routeById]);

  function edit(student) {
    setEditingId(student.id);
    setForm({
      full_name: student.full_name,
      parent_phone: student.parent_phone,
      parent_username: student.parent_username || '',
      parent_password: '',
      bus_id: String(student.bus_id),
      route_id: String(student.route_id)
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    const payload = {
      full_name: form.full_name,
      parent_phone: form.parent_phone,
      parent_username: form.parent_username,
      bus_id: Number(form.bus_id),
      route_id: Number(form.route_id)
    };

    if (form.parent_password) {
      payload.parent_password = form.parent_password;
    }

    try {
      if (editingId) {
        await updateStudent(editingId, payload);
      } else {
        await createStudent(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Parent account updated.' : 'Parent account created.');
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function remove(id) {
    if (!confirm('Delete this parent account and child assignment?')) return;
    await deleteStudent(id);
    setNotice('Parent account deleted.');
    await load();
  }

  return (
    <>
      <PageHeader title="Parent Accounts" description="Manage parent contact details and linked child transport assignments." />
      {error ? <div className="form-error">{error}</div> : null}
      <Notice>{notice}</Notice>
      {loading ? <LoadingState label="Loading parent accounts..." /> : null}

      <form className="inline-form" onSubmit={submit}>
        <input placeholder="Child full name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
        <input placeholder="Parent phone" value={form.parent_phone} onChange={(event) => setForm({ ...form, parent_phone: event.target.value })} />
        <input placeholder="Username" value={form.parent_username} onChange={(event) => setForm({ ...form, parent_username: event.target.value })} required />
        <input placeholder={editingId ? 'New password (optional)' : 'Password'} type="password" value={form.parent_password} onChange={(event) => setForm({ ...form, parent_password: event.target.value })} required={!editingId} />
        <select value={form.bus_id} onChange={(event) => setForm({ ...form, bus_id: event.target.value })}>
          <option value="">Assigned bus</option>
          {buses.map((bus) => <option key={bus.id} value={bus.id}>{bus.name}</option>)}
        </select>
        <select value={form.route_id} onChange={(event) => setForm({ ...form, route_id: event.target.value })}>
          <option value="">Assigned route</option>
          {routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
        </select>
        <button type="submit"><Save size={16} /><span>{editingId ? 'Update' : 'Create'}</span></button>
        {editingId ? <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}><X size={16} /><span>Cancel</span></button> : null}
      </form>

      <div className="search-row">
        <Search size={18} />
        <input placeholder="Search parent accounts, usernames, phones, children, buses, or routes" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <section className="account-grid">
        {filteredAccounts.length === 0 ? <EmptyState label="No matching parent accounts." /> : filteredAccounts.map((student) => (
          <article key={student.id} className="account-card">
            <div className="account-card-header">
              <div>
                <span className="account-kicker">parent-{student.id}</span>
                <h2>{student.full_name}</h2>
              </div>
              <Phone size={22} />
            </div>
            <dl>
              <div><dt>Parent phone</dt><dd>{student.parent_phone}</dd></div>
              <div><dt>Username</dt><dd>{student.parent_username || '-'}</dd></div>
              <div><dt>Bus</dt><dd>{busById[student.bus_id]?.name || '-'}</dd></div>
              <div><dt>Route</dt><dd>{routeById[student.route_id]?.name || '-'}</dd></div>
              <div><dt>Password</dt><dd>{student.parent_username ? 'Set in MySQL' : 'Not set'}</dd></div>
            </dl>
            <div className="row-actions">
              <button type="button" className="icon-button" onClick={() => edit(student)} title="Edit"><Edit size={16} /></button>
              <button type="button" className="icon-button danger" onClick={() => remove(student.id)} title="Delete"><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
