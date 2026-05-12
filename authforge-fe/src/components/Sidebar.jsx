import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (user?.username || user?.email || 'U').slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <span>AuthForge</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">Menu</div>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
        </div>

        {user?.role === 'admin' && (
          <div className="nav-section">
            <div className="nav-section-label">Quản trị</div>
            <NavLink to="/admin" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <Shield size={16} /> Admin Panel
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <Users size={16} /> Người dùng
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.username || user?.email?.split('@')[0]}</div>
            <div className="user-role-label">{user?.role}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
