import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Ticket, LayoutDashboard, User, LogOut, Search, Radio, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(10, 13, 20, 0.88)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)',
    }}>
      <div style={{
        maxWidth: 1320,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f43f5e 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(244, 63, 94, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <Film size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #ffffff 40%, #fb7185 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                IMOVIES
              </span>
              <span style={{
                fontSize: '0.62rem',
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(244, 63, 94, 0.18)',
                color: '#f43f5e',
                fontWeight: 800,
                letterSpacing: '0.05em',
                border: '1px solid rgba(244, 63, 94, 0.3)',
              }}>
                LUXE
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: -2, fontWeight: 600 }}>
              Premiere Cinemas
            </div>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} style={{
          display: 'none',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: 999,
          padding: '8px 18px',
          width: 330,
          transition: 'all 0.25s ease',
        }} className="desktop-search">
          <Search size={16} color="#94a3b8" style={{ marginRight: 10, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search movies, genres, cast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.88rem',
              width: '100%',
            }}
          />
          <span style={{
            fontSize: '0.68rem',
            color: '#64748b',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '2px 7px',
            borderRadius: 6,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            ⌘K
          </span>
        </form>

        {/* Live Socket Status Beacon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 14px',
          borderRadius: 999,
          background: connected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          fontSize: '0.74rem',
          fontWeight: 600,
          color: connected ? '#6ee7b7' : '#fca5a5',
          boxShadow: connected ? '0 0 14px rgba(16, 185, 129, 0.2)' : 'none',
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: connected ? '#10b981' : '#ef4444',
            boxShadow: connected ? '0 0 8px #10b981' : 'none',
            display: 'inline-block',
          }} className={connected ? 'radar-pulse' : ''} />
          <span>{connected ? 'Live Seat Engine' : 'Reconnecting...'}</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive('/') ? '#f43f5e' : '#cbd5e1',
              padding: '6px 10px',
              borderRadius: 8,
              background: isActive('/') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            Home
          </Link>
          <Link
            to="/movies"
            style={{
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive('/movies') ? '#f43f5e' : '#cbd5e1',
              padding: '6px 10px',
              borderRadius: 8,
              background: isActive('/movies') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            Browse Movies
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive('/my-bookings') ? '#f43f5e' : '#cbd5e1',
                padding: '6px 10px',
                borderRadius: 8,
                background: isActive('/my-bookings') ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
              }}
            >
              <Ticket size={16} color={isActive('/my-bookings') ? '#f43f5e' : '#f59e0b'} />
              <span>My Passes</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fcd34d',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 2px 10px rgba(245, 158, 11, 0.15)',
              }}
            >
              <LayoutDashboard size={15} />
              <span>Admin Center</span>
            </Link>
          )}

          {/* User Auth Info */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 6 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 12px 4px 6px',
                borderRadius: 999,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #f43f5e',
                  }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  padding: 8,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f43f5e';
                  e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}>
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: 8,
            borderRadius: 10,
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          padding: '18px 24px 24px',
          background: 'rgba(10, 13, 20, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 12,
            padding: '10px 16px',
          }}>
            <Search size={16} color="#94a3b8" style={{ marginRight: 10 }} />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.9rem',
                width: '100%',
              }}
            />
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', fontWeight: 600, padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            Home
          </Link>
          <Link
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#fff', fontWeight: 600, padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            Browse Movies
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#fff', fontWeight: 600, padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              My Cinema Passes
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#fbbf24', fontWeight: 700, padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              Admin Center
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Signed in as {user.name}</span>
              <button onClick={logout} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary" style={{ textAlign: 'center' }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ textAlign: 'center' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-search, .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 961px) {
          .desktop-search { display: flex !important; }
          .desktop-nav { display: flex !important; }
        }
        .desktop-search:focus-within {
          border-color: rgba(244, 63, 94, 0.5) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 16px rgba(244, 63, 94, 0.25);
        }
        .radar-pulse {
          animation: radarBeacon 2s infinite ease-in-out;
        }
        @keyframes radarBeacon {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.35); opacity: 0.5; }
        }
      `}</style>
    </header>
  );
};
