import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { login } from '../api/transportApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(form.username, form.password);

      if (response.user.role !== 'admin') {
        setError('Only admin users can access the web dashboard.');
        return;
      }

      localStorage.setItem('transport_token', response.token);
      localStorage.setItem('transport_user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <form className="login-panel" onSubmit={handleSubmit}>
        <div className="login-heading">
          <img src="/logo.svg" alt="SafeBus logo" />
          <h1>SafeBus</h1>
          <p>Toubkal IT Center transport control</p>
        </div>

        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            type="password"
            autoComplete="current-password"
          />
        </label>

        {error ? <div className="form-error">{error}</div> : null}

        <button type="submit" disabled={loading}>
          <LogIn size={18} />
          <span>{loading ? 'Signing in' : 'Login'}</span>
        </button>
      </form>
    </main>
  );
}
