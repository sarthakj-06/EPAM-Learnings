import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Eye, Film, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';

export const MyBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.bookingStatus === activeTab;
  });

  const handleBookingCancelled = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
    );
    setSelectedBookingForModal(updatedBooking);
  };

  return (
    <div style={{ maxWidth: 1140, margin: '40px auto 90px', padding: '0 24px', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 36,
        flexWrap: 'wrap',
        gap: 18,
      }}>
        <div>
          <div style={{ color: '#f43f5e', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Customer Pass Wallet
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.025em' }}>
            My Cinema Tickets
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', marginTop: 4 }}>
            Access verified boarding QR passes, view past movie bookings, and manage cancellations.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: 5,
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.09)',
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              fontSize: '0.86rem',
              fontWeight: 700,
              background: activeTab === 'all' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'all' ? '#fff' : '#94a3b8',
              boxShadow: activeTab === 'all' ? '0 4px 14px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            All Passes ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              fontSize: '0.86rem',
              fontWeight: 700,
              background: activeTab === 'confirmed' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'confirmed' ? '#fff' : '#94a3b8',
              boxShadow: activeTab === 'confirmed' ? '0 4px 14px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              fontSize: '0.86rem',
              fontWeight: 700,
              background: activeTab === 'cancelled' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'cancelled' ? '#fff' : '#94a3b8',
              boxShadow: activeTab === 'cancelled' ? '0 4px 14px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#f43f5e', fontSize: '1.1rem' }}>
          <Sparkles size={28} style={{ display: 'inline-block', marginBottom: 12 }} />
          <div>Retrieving your cinema passes...</div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-panel-elevated" style={{ textAlign: 'center', padding: '70px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>🎟️</div>
          <h3 style={{ fontSize: '1.45rem', color: '#fff', marginBottom: 8, fontWeight: 800 }}>
            No tickets found in this section
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: 26, maxWidth: 450, margin: '0 auto 26px' }}>
            Ready for a movie night? Explore currently showing blockbuster listings and reserve premier seats.
          </p>
          <Link to="/movies" className="btn-primary" style={{ padding: '12px 26px' }}>
            <Film size={18} />
            <span>Browse Cinema Movies</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="glass-panel-elevated"
              style={{
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
                borderLeft: `5px solid ${b.bookingStatus === 'confirmed' ? '#10b981' : '#f43f5e'}`,
                transition: 'var(--transition)',
              }}
            >
              {/* Left Movie Info */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <img
                  src={b.movie?.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80'}
                  alt={b.movie?.title}
                  style={{ width: 72, height: 104, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-emerald' : 'badge-ruby'}`}>
                      {b.bookingStatus?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                      REF: {b.bookingNumber}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.015em' }}>
                    {b.movie?.title || 'Cinema Screening'}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#94a3b8', fontSize: '0.86rem', marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={14} color="#f43f5e" /> {b.theatre?.name}
                    </span>
                    <span style={{ color: '#475569' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={14} color="#0ea5e9" /> {b.show?.showDate || 'Scheduled'}
                    </span>
                    <span style={{ color: '#475569' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={14} color="#f59e0b" /> {b.show?.showTime || 'Time'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Seat & Price Info */}
              <div style={{ textAlign: 'right', minWidth: 140 }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
                  Seats ({b.seats?.length})
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6ee7b7', marginTop: 2 }}>
                  {b.seats?.join(', ')}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
                  ${b.totalAmount}
                </div>
              </div>

              {/* Right View Pass Button */}
              <div>
                <button
                  onClick={() => setSelectedBookingForModal(b)}
                  className="btn-primary"
                  style={{ padding: '11px 22px', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  <Eye size={16} />
                  <span>View Pass / QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBookingForModal && (
        <TicketModal
          booking={selectedBookingForModal}
          onClose={() => setSelectedBookingForModal(null)}
          onCancelled={handleBookingCancelled}
        />
      )}
    </div>
  );
};
