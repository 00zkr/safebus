import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, BusFront, IdCard, LayoutDashboard, LogOut, Map, UserRound, Users } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/parents', label: 'Parents', icon: UserRound },
  { to: '/drivers', label: 'Drivers', icon: IdCard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/buses', label: 'Buses', icon: BusFront },
  { to: '/routes', label: 'Routes', icon: Map },
  { to: '/notifications', label: 'Notifications', icon: Bell }
];

export default function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('transport_user') || '{}');

  function logout() {
    localStorage.removeItem('transport_token');
    localStorage.removeItem('transport_user');
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/icon.png" alt="SafeBus logo" />
          <div>
            <strong>SafeBus</strong>
            <span>Toubkal IT Center</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button type="button" className="ghost-button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
