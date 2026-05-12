import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span>AuthForge</span>
        </div>

        <h1>Đăng nhập</h1>
        <p className="auth-sub">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email" type="email"
              className={`form-control${errors.email ? ' has-error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mật khẩu</label>
            <div className="input-wrap">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className={`form-control${errors.password ? ' has-error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <span className="input-suffix" onClick={() => setShowPw(s => !s)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div style={{ marginTop: 20 }}>
            <button id="btn-login" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner" /> Đang đăng nhập...</> : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
