import React, { useState } from 'react';
import { X, Printer, Calendar, Clock, MapPin, Film, AlertTriangle, CheckCircle, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TicketModal = ({ booking, onClose, onCancelled }) => {
  const { token } = useAuth();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? An 85% refund will be credited instantly (15% standard processing fee applies).')) {
      return;
    }

    setCancelling(true);
    setCancelError('');

    try {
      const res = await fetch(`/api/bookings/${booking._id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Customer requested cancellation via portal' }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      setCancelSuccess(true);
      if (onCancelled) onCancelled(data.booking);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        maxWidth: 520,
        width: '100%',
        position: 'relative',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -48,
            right: 0,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            width: 38,
            height: 38,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
        >
          <X size={20} />
        </button>

        {/* Digital Ticket Container */}
        <div className="digital-ticket">
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #240c17 0%, #170912 100%)',
            padding: '26px 30px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-ruby" style={{ marginBottom: 8 }}>
                  IMOVIES CINEMA PASS
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.02em' }}>
                  {booking.movie?.title || 'Movie Experience'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fda4af', fontSize: '0.86rem', marginTop: 4 }}>
                  <MapPin size={14} color="#f43f5e" />
                  <span>{booking.theatre?.name || 'Grand Plex Theatre'}</span>
                </div>
              </div>
              <span className={`badge ${booking.bookingStatus === 'confirmed' ? 'badge-emerald' : 'badge-gold'}`}>
                {booking.bookingStatus?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '26px 30px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 20,
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>Date</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: 3 }}>
                  {booking.show?.showDate || 'Today'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>Time</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: 3 }}>
                  {booking.show?.showTime || '07:30 PM'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>Auditorium</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: 3 }}>
                  {booking.show?.screenName?.split('-')[0] || 'Screen 1'}
                </div>
              </div>
            </div>

            {/* Reserved Seats List */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: 20,
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>Assigned Seats</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6ee7b7', marginTop: 2 }}>
                  {booking.seats?.join(', ')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>Total Paid</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginTop: 2 }}>
                  ${booking.totalAmount}
                </div>
              </div>
            </div>

            <div className="ticket-divider" />

            {/* QR Code and Reference */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>Booking Number</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', marginTop: 2 }}>
                  {booking.bookingNumber}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 4 }}>
                  Scan to enter cinema auditorium
                </div>
              </div>

              {booking.qrCode && (
                <div style={{
                  padding: 8,
                  background: '#0d111a',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: 12,
                }}>
                  <img src={booking.qrCode} alt="QR Pass" style={{ width: 80, height: 80, display: 'block', borderRadius: 6 }} />
                </div>
              )}
            </div>

            {/* Errors / Statuses */}
            {cancelError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.18)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: '0.84rem',
                marginBottom: 16,
              }}>
                {cancelError}
              </div>
            )}

            {cancelSuccess && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.18)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#6ee7b7',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: '0.84rem',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 700,
              }}>
                <CheckCircle size={16} /> Booking successfully cancelled. 85% refund credited.
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
              >
                <Printer size={16} />
                <span>Print Ticket</span>
              </button>

              {booking.bookingStatus === 'confirmed' && (
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  style={{
                    flex: 1,
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                >
                  <AlertTriangle size={16} />
                  <span>{cancelling ? 'Refunding...' : 'Cancel & Refund'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
