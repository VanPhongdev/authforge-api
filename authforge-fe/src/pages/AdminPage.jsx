import { useEffect, useState } from 'react';
import { Search, RefreshCw, UserX, UserCheck } from 'lucide-react';
import api from '../api/axios';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState('');

  const fetchUsers = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const toggleStatus = async (u) => {
    const next = u.status === 'active' ? 'inactive' : 'active';
    setUpdating(u.id);
    try {
      await api.patch(`/users/${u.id}/status`, { status: next });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: next } : x));
      showToast(`Đã ${next === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} "${u.username || u.email}"`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Cập nhật thất bại.');
    } finally { setUpdating(null); }
  };

  const filtered = users.filter(u =>
    (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active' || !u.status).length,
    inactive: users.filter(u => u.status === 'inactive').length,
  };

  return (
    <div className="fade-in">
      {/* Toast */}
      {toast && <div className="toast toast-success">{toast}</div>}

      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">Admin Panel</span>
        <button className="btn btn-outline btn-sm" onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={13} /> Làm mới
        </button>
      </div>

      <div className="page">
        <div className="page-header">
          <h1>Quản lý người dùng</h1>
          <p>Xem và quản lý tất cả tài khoản trong hệ thống</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-value indigo">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Admin</div>
            <div className="stat-value amber">{stats.admins}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Đang hoạt động</div>
            <div className="stat-value green">{stats.active}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Vô hiệu hóa</div>
            <div className="stat-value red">{stats.inactive}</div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Danh sách người dùng</div>
              <div className="card-sub">{filtered.length} / {users.length} người dùng</div>
            </div>
            <div className="search-wrap">
              <Search size={14} color="var(--text-light)" />
              <input
                placeholder="Tìm kiếm..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading-area">
              <div className="spinner spinner-dark" />
              Đang tải...
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-light)', padding: 32 }}>
                      Không tìm thấy người dùng.
                    </td></tr>
                  ) : filtered.map((u, i) => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                            background: u.role === 'admin' ? 'var(--primary)' : '#0284c7',
                            color: '#fff', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700
                          }}>
                            {(u.username || u.email || '?').slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500 }}>{u.username || '—'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 'active' || !u.status ? 'badge-active' : 'badge-inactive'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td>
                        {u.role !== 'admin' ? (
                          <button
                            className={`btn btn-sm ${u.status === 'active' || !u.status ? 'btn-danger-soft' : 'btn-success-soft'}`}
                            onClick={() => toggleStatus(u)}
                            disabled={updating === u.id}
                          >
                            {updating === u.id
                              ? <div className="spinner spinner-dark" style={{ width: 12, height: 12, borderWidth: 2, borderTopColor: 'currentColor', borderColor: 'rgba(0,0,0,0.1)' }} />
                              : u.status === 'active' || !u.status
                                ? <><UserX size={12} /> Vô hiệu</>
                                : <><UserCheck size={12} /> Kích hoạt</>
                            }
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
