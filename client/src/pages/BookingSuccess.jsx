import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Printer, Film, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BookingSuccess = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await fetch(`/api/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            setBooking(data.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [bookingId, token]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: '#f43f5e', fontSize: '1.2rem' }}>
        <Sparkles size={32} style={{ display: 'inline-block', marginBottom: 12 }} />
        <div>Generating verified digital admission pass...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 840, margin: '40px auto 90px', padding: '0 24px', textAlign: 'center' }}>
      {/* Success Badge */}
      <div style={{
        width: 76,
        height: 76,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
        border: '2px solid #10b981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        boxShadow: '0 0 35px rgba(16, 185, 129, 0.45)',
      }}>
        <CheckCircle2 size={42} color="#34d399" />
      </div>

      <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
        Payment Verified & Confirmed
      </div>
      <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fff', marginBottom: 10, letterSpacing: '-0.025em' }}>
        Reservation Confirmed!
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.6 }}>
        Your cinema seats have been allocated and registered. Present your scannable digital boarding pass below at the multiplex gate.
      </p>

      {/* Perforated Digital Ticket Pass */}
      {booking && (
        <div style={{ maxWidth: 540, margin: '0 auto 44px', textAlign: 'left' }}>
          <div className="digital-ticket">
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #240c17 0%, #170912 100%)',
              padding: '26px 30px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-ruby" style={{ marginBottom: 8 }}>
                    OFFICIAL BOARDING PASS
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.02em' }}>
                    {booking.movie?.title || 'Movie Experience'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fda4af', fontSize: '0.88rem', marginTop: 4 }}>
                    <MapPin size={14} color="#f43f5e" />
                    <span>{booking.theatre?.name || 'Grand Plex Theatre'}</span>
                  </div>
                </div>
                <span className="badge badge-emerald" style={{ fontWeight: 800 }}>
                  CONFIRMED
                </span>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '28px 30px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 24,
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>Date</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: 3 }}>
                    {booking.show?.showDate || 'Today'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>Showtime</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: 3 }}>
                    {booking.show?.showTime || '07:30 PM'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>Auditorium</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: 3 }}>
                    {booking.show?.screenName?.split('-')[0] || 'Screen 1'}
                  </div>
                </div>
              </div>

              {/* Seats Pill Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Assigned Seats</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#6ee7b7', marginTop: 2 }}>
                    {booking.seats?.join(', ')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Total Paid</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginTop: 2 }}>
                    ${booking.totalAmount}
                  </div>
                </div>
              </div>

              <div className="ticket-divider" />

              {/* QR and Barcode Verification */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>Booking Reference</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginTop: 2, letterSpacing: '0.04em' }}>
                    {booking.bookingNumber}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                    Scan QR at theatre automated check-in
                  </div>
                </div>

                {booking.qrCode && (
                  <div style={{
                    padding: 8,
                    background: '#0d111a',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    borderRadius: 12,
                    boxShadow: '0 4px 16px rgba(244, 63, 94, 0.2)',
                  }}>
                    <img src={booking.qrCode} alt="QR Pass" style={{ width: 88, height: 88, display: 'block', borderRadius: 6 }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          <Printer size={17} />
          <span>Print / Save PDF</span>
        </button>
        <Link to="/my-bookings" className="btn-primary" style={{ padding: '12px 26px', fontSize: '0.95rem' }}>
          <Ticket size={17} />
          <span>My Passes</span>
        </Link>
        <Link to="/movies" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          <Film size={17} />
          <span>Browse More Movies</span>
        </Link>
      </div>
    </div>
  );
};
