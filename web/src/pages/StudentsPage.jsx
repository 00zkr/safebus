import { useEffect, useMemo, useState } from 'react';
import { Edit, Save, Search, Trash2, X } from 'lucide-react';
import { createStudent, deleteStudent, getBuses, getRoutes, getStudents, updateStudent } from '../api/transportApi';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Notice from '../components/Notice';
import PageHeader from '../components/PageHeader';

const emptyForm = { full_name: '', parent_phone: '', bus_id: '', route_id: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
    load().catch((err) => setError(err.response?.data?.message || 'Could not load students.'));
  }, []);

  const busById = useMemo(() => Object.fromEntries(buses.map((bus) => [bus.id, bus])), [buses]);
  const routeById = useMemo(() => Object.fromEntries(routes.map((route) => [route.id, route])), [routes]);
  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((student) =>
      [student.full_name, student.parent_phone, busById[student.bus_id]?.name, routeById[student.route_id]?.name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [students, search, busById, routeById]);

  function edit(student) {
    setEditingId(student.id);
    setForm({
      full_name: student.full_name,
      parent_phone: student.parent_phone,
      bus_id: String(student.bus_id),
      route_id: String(student.route_id)
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    const payload = {
      ...form,
      bus_id: Number(form.bus_id),
      route_id: Number(form.route_id)
    };

    try {
      if (editingId) {
        await updateStudent(editingId, payload);
      } else {
        await createStudent(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Student updated successfully.' : 'Student created successfully.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save student.');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this student?')) return;
    await deleteStudent(id);
    setNotice('Student deleted successfully.');
    await load();
  }

  return (
    <>
      <PageHeader title="Students" description="Create, edit, delete, and assign students to buses and routes." />
      {error ? <div className="form-error">{error}</div> : null}
      <Notice>{notice}</Notice>
      {loading ? <LoadingState label="Loading students..." /> : null}

      <form className="inline-form" onSubmit={submit}>
        <input placeholder="Full name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
        <input placeholder="Parent phone" value={form.parent_phone} onChange={(event) => setForm({ ...form, parent_phone: event.target.value })} />
        <select value={form.bus_id} onChange={(event) => setForm({ ...form, bus_id: event.target.value })}>
          <option value="">Bus</option>
          {buses.map((bus) => <option key={bus.id} value={bus.id}>{bus.name}</option>)}
        </select>
        <select value={form.route_id} onChange={(event) => setForm({ ...form, route_id: event.target.value })}>
          <option value="">Route</option>
          {routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
        </select>
        <button type="submit"><Save size={16} /><span>{editingId ? 'Update' : 'Create'}</span></button>
        {editingId ? <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}><X size={16} /><span>Cancel</span></button> : null}
      </form>

      <div className="search-row">
        <Search size={18} />
        <input placeholder="Search students, phones, buses, or routes" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <section className="table-section">
        {filteredStudents.length === 0 ? <EmptyState label="No matching students." /> : (
          <table>
            <thead>
              <tr><th>Name</th><th>Parent phone</th><th>Bus</th><th>Route</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.full_name}</td>
                  <td>{student.parent_phone}</td>
                  <td>{busById[student.bus_id]?.name || '-'}</td>
                  <td>{routeById[student.route_id]?.name || '-'}</td>
                  <td className="row-actions">
                    <button type="button" className="icon-button" onClick={() => edit(student)} title="Edit"><Edit size={16} /></button>
                    <button type="button" className="icon-button danger" onClick={() => remove(student.id)} title="Delete"><Trash2 size={16} /></button>
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
