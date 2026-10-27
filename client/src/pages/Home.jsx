import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, Sparkles, Star, ShieldCheck, Zap, Video, Monitor, ChevronRight, Flame } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('now_showing');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/movies');
        const data = await res.json();
        if (data.success) {
          setMovies(data.movies);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featuredMovie = movies.find((m) => m.featured && m.status === 'now_showing') || movies[0];
  const filteredMovies = movies.filter((m) => m.status === activeTab);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      {/* Hero Showcase Section */}
      {featuredMovie && (
        <section style={{
          position: 'relative',
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Backdrop Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${featuredMovie.backdrop || featuredMovie.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            filter: 'brightness(0.32) contrast(1.2)',
          }} />

          {/* Gradients */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #0a0d14 18%, rgba(10,13,20,0.8) 55%, rgba(10,13,20,0.3) 100%)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, #0a0d14 100%)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 75% 30%, rgba(244, 63, 94, 0.15) 0%, transparent 60%)',
          }} />

          {/* Content */}
          <div style={{
            maxWidth: 1320,
            margin: '0 auto',
            padding: '60px 24px',
            position: 'relative',
            zIndex: 10,
            width: '100%',
          }}>
            <div style={{ maxWidth: 680 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                <span className="badge badge-ruby">
                  <Flame size={13} /> Premiere Spotlight
                </span>
                <span className="badge badge-gold">
                  <Star size={13} fill="#fbbf24" strokeWidth={0} /> {featuredMovie.rating} IMDb
                </span>
                <span className="badge badge-cyan">
                  {featuredMovie.formats?.[0] || 'IMAX Laser 3D'}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 10px',
                  borderRadius: 999,
                }}>
                  {featuredMovie.certification || 'UA'}
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                lineHeight: 1.08,
                fontWeight: 900,
                color: '#fff',
                marginBottom: 20,
                letterSpacing: '-0.03em',
                textShadow: '0 4px 30px rgba(0,0,0,0.8)',
              }}>
                {featuredMovie.title}
              </h1>

              <p style={{
                color: '#cbd5e1',
                fontSize: '1.08rem',
                lineHeight: 1.65,
                marginBottom: 28,
                maxWidth: 620,
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}>
                {featuredMovie.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                color: '#94a3b8',
                fontSize: '0.92rem',
                marginBottom: 36,
                flexWrap: 'wrap',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <strong style={{ color: '#fff' }}>Runtime:</strong> {featuredMovie.duration} mins
                </span>
                <span style={{ color: '#475569' }}>•</span>
                <span><strong style={{ color: '#fff' }}>Genre:</strong> {featuredMovie.genre?.join(', ')}</span>
                <span style={{ color: '#475569' }}>•</span>
                <span><strong style={{ color: '#fff' }}>Director:</strong> {featuredMovie.director}</span>
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to={`/movie/${featuredMovie._id}`} className="btn-primary" style={{ padding: '15px 32px', fontSize: '1.05rem', fontWeight: 700 }}>
                  <Ticket size={20} />
                  <span>Reserve Seats Now</span>
                </Link>
                {featuredMovie.trailerUrl && (
                  <a
                    href={featuredMovie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '15px 26px', fontSize: '1.05rem', fontWeight: 600 }}
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Watch Trailer</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Feature Highlights Bar */}
      <div style={{
        maxWidth: 1280,
        margin: '-35px auto 60px',
        position: 'relative',
        zIndex: 20,
        padding: '0 20px',
      }}>
        <div className="glass-panel-elevated" style={{
          padding: '26px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 24,
          background: 'rgba(16, 22, 34, 0.85)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(234, 88, 12, 0.1) 100%)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e',
              flexShrink: 0,
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#f8fafc' }}>Live Seat Allocation</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>Real-time Socket.io hold engine</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0,
            }}>
              <Monitor size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#f8fafc' }}>IMAX Laser & Atmos</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>64-Channel spatial soundscape</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              flexShrink: 0,
            }}>
              <Video size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#f8fafc' }}>Instant QR Pass</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>Contactless digital entry verification</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              flexShrink: 0,
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#f8fafc' }}>Zero-Fuss Cancellation</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>Automated 85% instant refund</div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid Section */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 36,
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f43f5e', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Sparkles size={14} /> Curated Movie Collection
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.025em' }}>
              Current & Upcoming Blockbusters
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.98rem', marginTop: 4 }}>
              Select your showtime, choose preferred seats on our interactive cinema map, and book seamlessly.
            </p>
          </div>

          {/* Tab Filter Capsule */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: 5,
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.09)',
          }}>
            <button
              onClick={() => setActiveTab('now_showing')}
              style={{
                padding: '9px 22px',
                borderRadius: 10,
                fontSize: '0.9rem',
                fontWeight: 700,
                background: activeTab === 'now_showing' ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === 'now_showing' ? '#fff' : '#94a3b8',
                transition: 'var(--transition)',
                boxShadow: activeTab === 'now_showing' ? '0 4px 16px var(--primary-glow)' : 'none',
              }}
            >
              Now Showing
            </button>
            <button
              onClick={() => setActiveTab('coming_soon')}
              style={{
                padding: '9px 22px',
                borderRadius: 10,
                fontSize: '0.9rem',
                fontWeight: 700,
                background: activeTab === 'coming_soon' ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === 'coming_soon' ? '#fff' : '#94a3b8',
                transition: 'var(--transition)',
                boxShadow: activeTab === 'coming_soon' ? '0 4px 16px var(--primary-glow)' : 'none',
              }}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#f43f5e', fontSize: '1.1rem' }}>
            <Sparkles size={28} className="animate-pulse" style={{ display: 'inline-block', marginBottom: 12 }} />
            <div>Loading cinema schedule & titles...</div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.1rem' }}>No movies currently found in this category.</p>
          </div>
        ) : (
          <div className="grid-movies">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
