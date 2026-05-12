import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.full_name || form.full_name.length < 3) e.full_name = 'Tên ít nhất 3 ký tự';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.password || form.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự';
    if (form.password !== form.confirm) e.confirm = 'Mật khẩu không khớp';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiError(''); setSuccess('');
    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password });
      setSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  /* password strength */
  const strength = (() => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColors = ['#e2e8f0', '#dc2626', '#d97706', '#2563eb', '#16a34a'];
  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];

  return (
    <div className="auth-page">
      <div className="auth-box fade-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span>AuthForge</span>
        </div>

        <h1>Tạo tài khoản</h1>
        <p className="auth-sub">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>

        {apiError && <div className="alert alert-error">{apiError}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="full_name">Họ và tên</label>
            <input id="full_name" type="text"
              className={`form-control${errors.full_name ? ' has-error' : ''}`}
              placeholder="Nguyễn Văn A" value={form.full_name} onChange={set('full_name')} />
            {errors.full_name && <p className="form-error">{errors.full_name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email"
              className={`form-control${errors.email ? ' has-error' : ''}`}
              placeholder="you@example.com" value={form.email} onChange={set('email')} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-pw">Mật khẩu</label>
            <div className="input-wrap">
              <input id="reg-pw" type={showPw ? 'text' : 'password'}
                className={`form-control${errors.password ? ' has-error' : ''}`}
                placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={set('password')} />
              <span className="input-suffix" onClick={() => setShowPw(s => !s)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            </div>
            {form.password && (
              <div style={{ marginTop: 6 }}>
                <div className="pw-bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="pw-bar"
                      style={{ background: i <= strength ? strengthColors[strength] : undefined }} />
                  ))}
                </div>
                <p style={{ fontSize: '0.72rem', color: strengthColors[strength], marginTop: 3 }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Xác nhận mật khẩu</label>
            <input id="confirm" type="password"
              className={`form-control${errors.confirm ? ' has-error' : ''}`}
              placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={set('confirm')} />
            {errors.confirm && <p className="form-error">{errors.confirm}</p>}
          </div>

          <div style={{ marginTop: 20 }}>
            <button id="btn-register" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="spinner" /> Đang tạo tài khoản...</> : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
