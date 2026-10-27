import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, Film, Sparkles } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Drama', 'Cyberpunk', 'Biography', 'Animation'];
const LANGUAGES = ['All', 'English', 'Spanish', 'Japanese', 'German'];

export const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchFilteredMovies = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedGenre !== 'All') query.append('genre', selectedGenre);
      if (selectedLanguage !== 'All') query.append('language', selectedLanguage);
      if (selectedStatus !== 'All') query.append('status', selectedStatus);

      const res = await fetch(`/api/movies?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMovies(data.movies);
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredMovies();
  }, [search, selectedGenre, selectedLanguage, selectedStatus]);

  const handleReset = () => {
    setSearch('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedStatus('All');
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 24px 80px', minHeight: '85vh' }}>
      {/* Page Title & Breadcrumb */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f43f5e', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Film size={14} /> Full Cinema Catalog
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.025em' }}>
          Browse Movie Experiences
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.02rem', marginTop: 6, maxWidth: 650 }}>
          Filter through our multiplex screenings by genre, audio language, or release schedule.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel-elevated" style={{ padding: '28px', marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          {/* Search box */}
          <div style={{
            flex: 1,
            minWidth: 280,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            transition: 'all 0.2s ease',
          }}>
            <Search size={18} color="#94a3b8" style={{ marginRight: 12 }} />
            <input
              type="text"
              placeholder="Search by title, director, or cast..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.95rem',
                width: '100%',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'transparent', color: '#64748b', fontSize: '0.8rem', padding: '0 4px', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              background: '#131926',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              fontSize: '0.92rem',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <option value="All">All Statuses</option>
            <option value="now_showing">Now Showing</option>
            <option value="coming_soon">Coming Soon</option>
          </select>

          {/* Language selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              background: '#131926',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              fontSize: '0.92rem',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang === 'All' ? 'All Languages' : lang}
              </option>
            ))}
          </select>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '12px 20px', fontSize: '0.9rem', gap: 8 }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Genre Pills */}
        <div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10, fontWeight: 800, letterSpacing: '0.08em' }}>
            Filter by Genre
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GENRES.map((g) => {
              const isSelected = selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    background: isSelected ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#fff' : '#cbd5e1',
                    border: `1px solid ${isSelected ? 'rgba(244, 63, 94, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                    boxShadow: isSelected ? '0 4px 14px var(--primary-glow)' : 'none',
                    transition: 'var(--transition)',
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ color: '#94a3b8', fontSize: '0.92rem', fontWeight: 600 }}>
          Found <strong style={{ color: '#fff' }}>{movies.length}</strong> title{movies.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#f43f5e', fontSize: '1.1rem' }}>
          <Sparkles size={28} style={{ display: 'inline-block', marginBottom: 12 }} />
          <div>Updating filtered cinema titles...</div>
        </div>
      ) : movies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 8 }}>No matching movies found</h3>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>Try adjusting your search terms or clearing genre filters.</p>
          <button onClick={handleReset} className="btn-primary" style={{ padding: '10px 22px' }}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid-movies">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
