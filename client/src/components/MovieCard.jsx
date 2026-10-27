import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, ArrowRight, Sparkles } from 'lucide-react';

export const MovieCard = ({ movie }) => {
  return (
    <div style={{
      background: 'rgba(16, 22, 34, 0.72)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.65)',
    }} className="movie-card-hover">
      {/* Poster Image with overlay */}
      <div style={{ position: 'relative', width: '100%', height: 360, overflow: 'hidden' }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="poster-img"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(10,13,20,0.4) 60%, rgba(10,13,20,0.95) 100%)',
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}>
          <span className={`badge ${movie.status === 'now_showing' ? 'badge-emerald' : 'badge-ruby'}`}>
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
          <div style={{
            background: 'rgba(10, 13, 20, 0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '4px 10px',
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}>
            <Star size={13} fill="#fbbf24" strokeWidth={0} />
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* Formats Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          zIndex: 2,
        }}>
          {movie.formats?.slice(0, 2).map((fmt, i) => (
            <span key={i} style={{
              background: 'rgba(15, 20, 30, 0.75)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: 6,
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              letterSpacing: '0.04em',
            }}>
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Movie Details */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 800,
          marginBottom: 8,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#f8fafc',
          letterSpacing: '-0.02em',
        }}>
          {movie.title}
        </h3>

        {/* Metadata row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: '#94a3b8',
          fontSize: '0.82rem',
          marginBottom: 12,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} color="#f43f5e" /> {movie.duration}m
          </span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#cbd5e1',
          }}>
            {movie.certification || 'UA'}
          </span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>
            {movie.language?.join(', ')}
          </span>
        </div>

        {/* Genre Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {movie.genre?.slice(0, 3).map((g, idx) => (
            <span key={idx} style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '3px 9px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.07)',
            }}>
              {g}
            </span>
          ))}
        </div>

        {/* Book Button */}
        <div style={{ marginTop: 'auto' }}>
          <Link
            to={`/movie/${movie._id}`}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '11px 16px',
              fontSize: '0.92rem',
              fontWeight: 700,
              gap: 8,
            }}
          >
            <Ticket size={16} />
            <span>Select Seats</span>
            <ArrowRight size={15} style={{ opacity: 0.8 }} />
          </Link>
        </div>
      </div>
    </div>
  );
};
