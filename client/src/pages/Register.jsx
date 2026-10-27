import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Lock, Mail, User, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, phone, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
    }}>
      <div className="glass-panel-elevated" style={{
        maxWidth: 480,
        width: '100%',
        padding: '40px 36px',
      }}>
        {/* Logo */}
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
          Join IMovies Luxe
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', textAlign: 'center', marginBottom: 28 }}>
          Create your account for instant ticket bookings and VIP privileges
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
              Full Name
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
            }}>
              <User size={17} color="#94a3b8" style={{ marginRight: 12 }} />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
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
                placeholder="jane@example.com"
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
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
              Mobile Phone
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
            }}>
              <Phone size={17} color="#94a3b8" style={{ marginRight: 12 }} />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#f43f5e', fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
