import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Play, Ticket, ChevronRight, Award, Film, Users, Sparkles, Flame } from 'lucide-react';

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  // Helper to generate 3 consecutive dates (Today, Tomorrow, Day After)
  const getDates = () => {
    const list = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const formatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      list.push({ iso, dayName, formatted });
    }
    return list;
  };

  const dates = getDates();

  useEffect(() => {
    setSelectedDate(dates[0].iso);
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        if (data.success) {
          setMovie(data.movie);
          setShows(data.shows || []);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: '#f43f5e', fontSize: '1.2rem' }}>
        <Sparkles size={32} style={{ display: 'inline-block', marginBottom: 12 }} />
        <div>Preparing cinematic experience...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: 12 }}>Movie Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>The title you requested could not be retrieved from the cinema database.</p>
        <Link to="/movies" className="btn-primary" style={{ padding: '12px 24px' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by selected date
  const filteredShows = shows.filter((s) => s.showDate === selectedDate);

  // Group shows by Theatre
  const showsByTheatre = filteredShows.reduce((acc, show) => {
    const theatreName = show.theatre?.name || 'Grand Multiplex';
    if (!acc[theatreName]) {
      acc[theatreName] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    acc[theatreName].shows.push(show);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Movie Hero Header */}
      <div style={{
        position: 'relative',
        minHeight: 520,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        {/* Backdrop */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${movie.backdrop || movie.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'brightness(0.3) contrast(1.2)',
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 35%, #0a0d14 100%)',
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(244, 63, 94, 0.18) 0%, transparent 60%)',
        }} />

        <div style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '50px 24px',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          display: 'flex',
          gap: 40,
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}>
          {/* Poster Card */}
          <div style={{
            width: 230,
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            flexShrink: 0,
          }}>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: 340, objectFit: 'cover' }} />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-gold">
                <Star size={13} fill="#fbbf24" strokeWidth={0} /> {movie.rating} / 10 IMDb
              </span>
              <span className="badge badge-ruby">
                {movie.certification || 'UA'}
              </span>
              <span className="badge badge-cyan">
                <Clock size={13} /> {movie.duration} Minutes
              </span>
              {movie.formats?.map((fmt, i) => (
                <span key={i} style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#cbd5e1',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}>
                  {fmt}
                </span>
              ))}
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              color: '#fff',
              marginBottom: 16,
              letterSpacing: '-0.025em',
            }}>
              {movie.title}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.65, maxWidth: 820, marginBottom: 22 }}>
              {movie.description}
            </p>

            {/* Cast & Crew Info */}
            <div style={{ display: 'flex', gap: 24, color: '#94a3b8', fontSize: '0.9rem', flexWrap: 'wrap', marginBottom: 24 }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Director</span>
                <strong style={{ color: '#fff' }}>{movie.director || 'Acclaimed Director'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Cast</span>
                <strong style={{ color: '#fff' }}>{movie.cast?.join(', ')}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Audio Languages</span>
                <strong style={{ color: '#fff' }}>{movie.language?.join(', ')}</strong>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 14 }}>
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Watch Trailer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Section */}
      <div style={{ maxWidth: 1320, margin: '48px auto 0', padding: '0 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: '#f43f5e', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Auditorium Schedules
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.02em' }}>
            Select Date & Available Showtimes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.96rem', marginTop: 4 }}>
            Choose your date and multiplex below to open the live interactive seat allocation screen.
          </p>
        </div>

        {/* Date Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: 14,
          marginBottom: 36,
          overflowX: 'auto',
          paddingBottom: 8,
        }}>
          {dates.map((d) => {
            const isSelected = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                style={{
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isSelected ? 'rgba(244, 63, 94, 0.5)' : 'rgba(255, 255, 255, 0.09)'}`,
                  color: isSelected ? '#fff' : '#cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: 130,
                  boxShadow: isSelected ? '0 8px 24px var(--primary-glow)' : 'none',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, opacity: isSelected ? 0.9 : 0.6, letterSpacing: '0.06em' }}>
                  {d.dayName}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 4 }}>
                  {d.formatted}
                </div>
              </button>
            );
          })}
        </div>

        {/* Theatres List */}
        {Object.keys(showsByTheatre).length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '70px 24px' }}>
            <Calendar size={40} color="#f43f5e" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 8, fontWeight: 800 }}>
              No shows scheduled for {selectedDate}
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto' }}>
              Please select another date above or visit back shortly as daily show schedules are posted continuously.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {Object.entries(showsByTheatre).map(([theatreName, group]) => (
              <div key={theatreName} className="glass-panel-elevated" style={{ padding: '28px' }}>
                {/* Theatre Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 18,
                  marginBottom: 22,
                  flexWrap: 'wrap',
                  gap: 14,
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                      {theatreName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.88rem', marginTop: 4 }}>
                      <MapPin size={15} color="#f43f5e" />
                      <span>{group.theatre?.address || group.theatre?.location || 'Downtown Sector'}</span>
                    </div>
                  </div>

                  {/* Facilities tags */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {group.theatre?.facilities?.slice(0, 4).map((f, i) => (
                      <span key={i} className="badge badge-ruby" style={{ fontSize: '0.72rem' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Buttons */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {group.shows.map((show) => (
                    <button
                      key={show._id}
                      onClick={() => navigate(`/booking/${show._id}`)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(244, 63, 94, 0.28)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 22px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition)',
                      }}
                      className="showtime-btn"
                    >
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff' }}>
                        {show.showTime}
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.76rem', color: '#fda4af', fontWeight: 800, letterSpacing: '0.04em' }}>
                          {show.format}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: '#6ee7b7', fontWeight: 700 }}>
                          {show.availableSeats} seats left
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .showtime-btn:hover {
          background: rgba(244, 63, 94, 0.16) !important;
          border-color: #f43f5e !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(244, 63, 94, 0.35);
        }
      `}</style>
    </div>
  );
};
