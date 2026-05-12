import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const initials = (user?.username || user?.email || 'U').slice(0, 2).toUpperCase();
  const fmt = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

  return (
    <div className="fade-in">
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">Dashboard</span>
        <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
          {isAdmin ? '👑 Admin' : '👤 User'}
        </span>
      </div>

      <div className="page">
        {/* Welcome */}
        <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'var(--primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 700, flexShrink: 0
          }}>{initials}</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>
              Xin chào, {user?.username || user?.email?.split('@')[0]} 👋
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Bạn đang đăng nhập với vai trò <strong style={{ color: isAdmin ? 'var(--primary)' : '#0369a1' }}>{user?.role}</strong>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Vai trò</div>
            <div className={`stat-value ${isAdmin ? 'indigo' : ''}`} style={{ fontSize: '1.1rem' }}>
              {user?.role?.toUpperCase()}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Trạng thái</div>
            <div className="stat-value green" style={{ fontSize: '1rem' }}>
              {user?.status || 'Active'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">User ID</div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>#{user?.id || '—'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ngày tạo</div>
            <div className="stat-value" style={{ fontSize: '0.9rem' }}>{fmt(user?.createdAt)}</div>
          </div>
        </div>

        {/* Account Info */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Thông tin tài khoản</div>
              <div className="card-sub">Chi tiết tài khoản của bạn</div>
            </div>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
              <Shield size={10} /> {user?.role}
            </span>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Tên người dùng</div>
              <div className="info-value">{user?.username || '—'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{user?.email || '—'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Vai trò</div>
              <div className="info-value">
                <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>{user?.role}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Trạng thái</div>
              <div className="info-value">
                <span className={`badge ${user?.status === 'active' || !user?.status ? 'badge-active' : 'badge-inactive'}`}>
                  {user?.status || 'active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Quyền truy cập</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Xem profile cá nhân', ok: true },
              { label: 'Xem danh sách người dùng', ok: isAdmin },
              { label: 'Quản lý trạng thái người dùng', ok: isAdmin },
              { label: 'Truy cập Admin Panel', ok: isAdmin },
            ].map(({ label, ok }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 'var(--radius)',
                background: 'var(--bg)', border: '1px solid var(--border)',
                fontSize: '0.875rem'
              }}>
                <span>{label}</span>
                <span className={`badge ${ok ? 'badge-active' : 'badge-inactive'}`}>
                  {ok ? '✓ Có' : '✗ Không'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
