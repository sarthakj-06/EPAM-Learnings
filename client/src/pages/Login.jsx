import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from || '/';
  const bookingDraft = location.state?.bookingDraft;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (bookingDraft) {
        navigate(`/booking/${bookingDraft.showId}`);
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPw);
      if (bookingDraft) {
        navigate(`/booking/${bookingDraft.showId}`);
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '82vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>
      <div className="glass-panel-elevated" style={{
        maxWidth: 450,
        width: '100%',
        padding: '40px 36px',
        position: 'relative',
      }}>
        {/* Logo Icon */}
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 25px var(--primary-glow)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <Film size={26} color="#fff" />
        </div>

        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, textAlign: 'center', color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', textAlign: 'center', marginBottom: 28 }}>
          Sign in to access your digital tickets and member privileges
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.18)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: 10,
            fontSize: '0.88rem',
            marginBottom: 20,
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
            }}>
              <Mail size={17} color="#94a3b8" style={{ marginRight: 12 }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.92rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
            }}>
              <Lock size={17} color="#94a3b8" style={{ marginRight: 12 }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.92rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 800, marginTop: 8 }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Quick Demo Logins Box */}
        <div style={{
          marginTop: 28,
          paddingTop: 22,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12, fontWeight: 800, letterSpacing: '0.06em' }}>
            Instant One-Click Demo Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@example.com', 'userpassword123')}
              className="btn-secondary"
              style={{ padding: '10px 12px', fontSize: '0.82rem', justifyContent: 'center', fontWeight: 700 }}
            >
              <UserCheck size={15} color="#38bdf8" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@imovies.com', 'adminpassword123')}
              className="btn-secondary"
              style={{ padding: '10px 12px', fontSize: '0.82rem', justifyContent: 'center', fontWeight: 700 }}
            >
              <ShieldCheck size={15} color="#fbbf24" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#f43f5e', fontWeight: 700 }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};
