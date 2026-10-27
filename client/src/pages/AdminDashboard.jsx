import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Film, Video, Calendar, DollarSign, Users, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states for adding movie
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 135,
    releaseDate: new Date().toISOString().split('T')[0],
    rating: 8.5,
    director: '',
    status: 'now_showing',
  });

  // Form states for adding show
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenName: 'Screen 1 - IMAX Laser',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:30 PM',
    language: 'English',
    format: 'IMAX 3D',
    vipPrice: 420,
    premiumPrice: 300,
    standardPrice: 200,
  });

  const fetchData = async () => {
    try {
      const [resStats, resMovies, resTheatres, resShows] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/movies'),
        fetch('/api/theatres'),
        fetch('/api/shows'),
      ]);

      const [dataStats, dataMovies, dataTheatres, dataShows] = await Promise.all([
        resStats.json(),
        resMovies.json(),
        resTheatres.json(),
        resShows.json(),
      ]);

      if (dataStats.success) setStats(dataStats.stats);
      if (dataMovies.success) {
        setMovies(dataMovies.movies);
        if (dataMovies.movies.length > 0 && !showForm.movieId) {
          setShowForm((prev) => ({ ...prev, movieId: dataMovies.movies[0]._id }));
        }
      }
      if (dataTheatres.success) {
        setTheatres(dataTheatres.theatres);
        if (dataTheatres.theatres.length > 0 && !showForm.theatreId) {
          setShowForm((prev) => ({ ...prev, theatreId: dataTheatres.theatres[0]._id }));
        }
      }
      if (dataShows.success) setShows(dataShows.shows);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Handle Add Movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...movieForm,
          genre: movieForm.genre.split(',').map((g) => g.trim()),
          language: movieForm.language.split(',').map((l) => l.trim()),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to add movie');

      setMessage('Movie added successfully! 🎬');
      setMovieForm({
        title: '',
        description: '',
        poster: '',
        backdrop: '',
        genre: 'Action, Sci-Fi',
        language: 'English',
        duration: 135,
        releaseDate: new Date().toISOString().split('T')[0],
        rating: 8.5,
        director: '',
        status: 'now_showing',
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Delete Movie
  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie and its associated showtimes?')) return;
    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Movie removed from library');
        fetchData();
      }
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  // Handle Add Show
  const handleAddShow = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movie: showForm.movieId,
          theatre: showForm.theatreId,
          screenName: showForm.screenName,
          showDate: showForm.showDate,
          showTime: showForm.showTime,
          language: showForm.language,
          format: showForm.format,
          pricing: {
            vip: Number(showForm.vipPrice),
            premium: Number(showForm.premiumPrice),
            standard: Number(showForm.standardPrice),
          },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to schedule show');

      setMessage('Show scheduled successfully with 60-seat matrix! 🎟️');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Delete Show
  const handleDeleteShow = async (id) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      const res = await fetch(`/api/shows/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Show schedule deleted');
        fetchData();
      }
    } catch (err) {
      setError('Failed to delete show');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: '#f43f5e', fontSize: '1.2rem' }}>
        <Sparkles size={32} style={{ display: 'inline-block', marginBottom: 12 }} />
        <div>Connecting to Cinema Command Center...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1320, margin: '40px auto 90px', padding: '0 24px' }}>
      {/* Dashboard Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 36,
        flexWrap: 'wrap',
        gap: 20,
      }}>
        <div>
          <span className="badge badge-ruby" style={{ marginBottom: 8 }}>
            SUPERADMIN PRIVILEGES
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.025em' }}>
            Cinema Command Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', marginTop: 4 }}>
            Box office analytics, scheduled multiplex screenings, and movie library management.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: 5,
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.09)',
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '9px 20px',
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: 700,
              background: activeTab === 'overview' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'overview' ? '#fff' : '#94a3b8',
              boxShadow: activeTab === 'overview' ? '0 4px 14px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            style={{
              padding: '9px 20px',
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: 700,
              background: activeTab === 'movies' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'movies' ? '#fff' : '#94a3b8',
              boxShadow: activeTab === 'movies' ? '0 4px 14px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Manage Movies ({movies.length})
          </button>
          <button
            onClick={() => setActiveTab('shows')}
            style={{
              padding: '9px 20px',
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: 700,
              background: activeTab === 'shows' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'shows' ? '#fff' : '#94a3b8',
              boxShadow: activeTab === 'shows' ? '0 4px 14px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Schedule Shows ({shows.length})
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.18)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#6ee7b7',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 700,
        }}>
          <CheckCircle2 size={20} color="#34d399" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          color: '#fca5a5',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 600,
        }}>
          <AlertCircle size={20} color="#f87171" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 22,
            marginBottom: 36,
          }}>
            <div className="glass-panel-elevated" style={{ padding: '26px', borderTop: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Box Office Revenue</span>
                <div style={{ padding: 8, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  <DollarSign size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399', letterSpacing: '-0.02em' }}>
                ${stats?.totalRevenue?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={14} color="#10b981" />
                <span>Realized box office receipts</span>
              </div>
            </div>

            <div className="glass-panel-elevated" style={{ padding: '26px', borderTop: '4px solid #0ea5e9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tickets Sold</span>
                <div style={{ padding: 8, borderRadius: 10, background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
                  <Film size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em' }}>
                {stats?.totalTicketsSold || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6 }}>
                Across IMAX & Dolby screens
              </div>
            </div>

            <div className="glass-panel-elevated" style={{ padding: '26px', borderTop: '4px solid #f43f5e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Library Titles</span>
                <div style={{ padding: 8, borderRadius: 10, background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
                  <Video size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fda4af', letterSpacing: '-0.02em' }}>
                {stats?.totalMovies || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6 }}>
                Active in cinema distribution
              </div>
            </div>

            <div className="glass-panel-elevated" style={{ padding: '26px', borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Patrons</span>
                <div style={{ padding: 8, borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                  <Users size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '-0.02em' }}>
                {stats?.totalUsers || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6 }}>
                Verified customer accounts
              </div>
            </div>
          </div>

          {/* Recent Bookings Ledger Table */}
          <div className="glass-panel-elevated" style={{ padding: '30px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: 20 }}>
              Recent Box Office Transactions
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '14px 16px' }}>Ref #</th>
                  <th style={{ padding: '14px 16px' }}>Customer</th>
                  <th style={{ padding: '14px 16px' }}>Movie</th>
                  <th style={{ padding: '14px 16px' }}>Theatre</th>
                  <th style={{ padding: '14px 16px' }}>Seats</th>
                  <th style={{ padding: '14px 16px' }}>Amount</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#fff' }}>{b.bookingNumber}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{b.user}</td>
                    <td style={{ padding: '14px 16px', color: '#fda4af', fontWeight: 700 }}>{b.movie}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{b.theatre}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#6ee7b7' }}>{b.seats?.join(', ')}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#fff' }}>${b.totalAmount}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-emerald' : 'badge-ruby'}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MOVIES */}
      {activeTab === 'movies' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32 }} className="admin-grid">
          {/* Add Movie Form */}
          <div className="glass-panel-elevated" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} color="#f43f5e" />
              <span>Add New Blockbuster</span>
            </h3>

            <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dune: Part Two"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Synopsis / Storyline</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter compelling movie description..."
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="input-field"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Poster Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={movieForm.poster}
                  onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Genres (comma-sep)</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Duration (mins)</label>
                  <input
                    type="number"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Status</label>
                  <select
                    value={movieForm.status}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                    className="input-field"
                    style={{ background: '#131926' }}
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>IMDb Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 12, justifyContent: 'center', padding: '13px' }}>
                <Plus size={17} />
                <span>Save Movie to Library</span>
              </button>
            </form>
          </div>

          {/* Current Movies List */}
          <div className="glass-panel-elevated" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 20 }}>
              Active Movie Library ({movies.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 600, overflowY: 'auto' }}>
              {movies.map((m) => (
                <div
                  key={m._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    gap: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src={m.poster} alt={m.title} style={{ width: 48, height: 68, borderRadius: 8, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.96rem' }}>{m.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                        {m.duration}m • {m.genre?.join(', ')}
                      </div>
                      <span className={`badge ${m.status === 'now_showing' ? 'badge-emerald' : 'badge-ruby'}`} style={{ marginTop: 6, fontSize: '0.65rem' }}>
                        {m.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMovie(m._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: 10,
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                    title="Delete Movie"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULE SHOWS */}
      {activeTab === 'shows' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32 }} className="admin-grid">
          {/* Add Show Form */}
          <div className="glass-panel-elevated" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color="#f43f5e" />
              <span>Schedule New Show</span>
            </h3>

            <form onSubmit={handleAddShow} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Select Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  className="input-field"
                  style={{ background: '#131926' }}
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Select Multiplex Theatre</label>
                <select
                  value={showForm.theatreId}
                  onChange={(e) => setShowForm({ ...showForm, theatreId: e.target.value })}
                  className="input-field"
                  style={{ background: '#131926' }}
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Show Date</label>
                  <input
                    type="date"
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Show Time</label>
                  <input
                    type="text"
                    value={showForm.showTime}
                    placeholder="e.g. 08:15 PM"
                    onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Screen Format</label>
                  <select
                    value={showForm.format}
                    onChange={(e) => setShowForm({ ...showForm, format: e.target.value })}
                    className="input-field"
                    style={{ background: '#131926' }}
                  >
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>Screen Name</label>
                  <input
                    type="text"
                    value={showForm.screenName}
                    onChange={(e) => setShowForm({ ...showForm, screenName: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#fbbf24', display: 'block', marginBottom: 4, fontWeight: 700 }}>VIP Price ($)</label>
                  <input
                    type="number"
                    value={showForm.vipPrice}
                    onChange={(e) => setShowForm({ ...showForm, vipPrice: e.target.value })}
                    className="input-field"
                    style={{ padding: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#fda4af', display: 'block', marginBottom: 4, fontWeight: 700 }}>Prem Price ($)</label>
                  <input
                    type="number"
                    value={showForm.premiumPrice}
                    onChange={(e) => setShowForm({ ...showForm, premiumPrice: e.target.value })}
                    className="input-field"
                    style={{ padding: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#7dd3fc', display: 'block', marginBottom: 4, fontWeight: 700 }}>Std Price ($)</label>
                  <input
                    type="number"
                    value={showForm.standardPrice}
                    onChange={(e) => setShowForm({ ...showForm, standardPrice: e.target.value })}
                    className="input-field"
                    style={{ padding: '10px' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 12, justifyContent: 'center', padding: '13px' }}>
                <Plus size={17} />
                <span>Publish Show & Generate 60 Seats</span>
              </button>
            </form>
          </div>

          {/* Current Shows List */}
          <div className="glass-panel-elevated" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 20 }}>
              Active Scheduled Shows ({shows.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 600, overflowY: 'auto' }}>
              {shows.map((s) => (
                <div
                  key={s._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    gap: 14,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.98rem' }}>
                      {s.movie?.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 3 }}>
                      {s.theatre?.name} • {s.showDate} at {s.showTime}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#fda4af', marginTop: 4, fontWeight: 700 }}>
                      {s.format} • VIP: ${s.pricing?.vip} / Std: ${s.pricing?.standard}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteShow(s._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: 10,
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                    title="Delete Show"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 950px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
