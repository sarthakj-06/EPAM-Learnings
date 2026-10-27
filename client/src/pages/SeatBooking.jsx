import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Film, MapPin, Calendar, Clock, ShieldCheck, ChevronRight, AlertCircle, ArrowLeft, Sparkles, Timer } from 'lucide-react';
import { SeatGrid } from '../components/SeatGrid';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export const SeatBooking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins lock countdown
  const [lockError, setLockError] = useState('');

  // Fetch initial show data & seats
  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const res = await fetch(`/api/shows/${showId}`);
        const data = await res.json();
        if (data.success) {
          setShow(data.show);
          setSeats(data.seats || []);
        }
      } catch (err) {
        console.error('Failed to fetch show seats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [showId]);

  // Real-time Socket.io seat synchronisation
  useEffect(() => {
    if (!socket || !showId) return;

    // Join room for this specific show
    socket.emit('show:join', { showId });

    // Handle full seat sync
    socket.on('seats:sync', ({ showId: sId, seats: incomingSeats }) => {
      if (sId === showId) {
        setSeats(incomingSeats);
      }
    });

    // Handle seat locked by another user
    socket.on('seat:locked', ({ showId: sId, seatNumber, lockedBy, seat }) => {
      if (sId === showId) {
        setSeats((prev) =>
          prev.map((s) => (s.seatNumber === seatNumber ? { ...s, status: 'locked', lockedBy } : s))
        );
      }
    });

    // Handle seat unlocked
    socket.on('seat:unlocked', ({ showId: sId, seatNumber }) => {
      if (sId === showId) {
        setSeats((prev) =>
          prev.map((s) => (s.seatNumber === seatNumber ? { ...s, status: 'available', lockedBy: null } : s))
        );
      }
    });

    // Handle seats booked
    socket.on('seats:booked', ({ showId: sId, seats: bookedNums }) => {
      if (sId === showId) {
        setSeats((prev) =>
          prev.map((s) => (bookedNums.includes(s.seatNumber) ? { ...s, status: 'booked' } : s))
        );
      }
    });

    // Handle lock errors
    socket.on('seat:error', ({ message }) => {
      setLockError(message);
      setTimeout(() => setLockError(''), 4000);
    });

    return () => {
      socket.emit('show:leave', { showId });
      socket.off('seats:sync');
      socket.off('seat:locked');
      socket.off('seat:unlocked');
      socket.off('seats:booked');
      socket.off('seat:error');
    };
  }, [socket, showId]);

  // Reservation countdown timer
  useEffect(() => {
    if (selectedSeats.length === 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto release selected seats
          selectedSeats.forEach((s) => {
            socket?.emit('seat:unlock', { showId, seatNumber: s.seatNumber });
          });
          setSelectedSeats([]);
          alert('Seat reservation hold time expired (5 minutes). Please re-select your seats.');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats, socket, showId]);

  // Toggle seat selection
  const handleSeatToggle = (seat) => {
    setLockError('');
    const exists = selectedSeats.find((s) => s.seatNumber === seat.seatNumber);

    if (exists) {
      // Unlock seat
      if (socket) {
        socket.emit('seat:unlock', { showId, seatNumber: seat.seatNumber });
      }
      setSelectedSeats((prev) => prev.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      // Max 8 tickets per transaction
      if (selectedSeats.length >= 8) {
        setLockError('Maximum 8 seats allowed per reservation');
        return;
      }
      // Lock seat
      if (socket) {
        socket.emit('seat:lock', { showId, seatNumber: seat.seatNumber });
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: '#f43f5e', fontSize: '1.2rem' }}>
        <Sparkles size={32} style={{ display: 'inline-block', marginBottom: 12 }} />
        <div>Connecting to live cinema theatre layout...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: 12 }}>Showtime Not Found</h2>
        <Link to="/movies" className="btn-primary" style={{ padding: '12px 24px' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Price calculation
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalAmount = subtotal + convenienceFee;

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/booking/${showId}`,
          bookingDraft: { showId, selectedSeats, subtotal, convenienceFee, totalAmount },
        },
      });
      return;
    }

    navigate('/checkout', {
      state: {
        show,
        selectedSeats,
        subtotal,
        convenienceFee,
        totalAmount,
      },
    });
  };

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '30px 24px 80px' }}>
      {/* Back Button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 16px',
            borderRadius: 999,
            color: '#cbd5e1',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
        >
          <ArrowLeft size={16} />
          <span>Back to Movie Info</span>
        </button>
      </div>

      {/* Header Info Banner */}
      <div className="glass-panel-elevated" style={{
        padding: '24px 30px',
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 18,
      }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <span className="badge badge-ruby">
              {show.format}
            </span>
            <span className="badge badge-cyan">
              {show.language}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            {show.movie?.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#94a3b8', fontSize: '0.9rem', marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={15} color="#f43f5e" /> {show.theatre?.name} ({show.screenName})
            </span>
            <span style={{ color: '#475569' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={15} color="#0ea5e9" /> {show.showDate}
            </span>
            <span style={{ color: '#475569' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={15} color="#f59e0b" /> {show.showTime}
            </span>
          </div>
        </div>

        {/* Hold Countdown */}
        {selectedSeats.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 22px',
            textAlign: 'center',
            boxShadow: '0 4px 18px rgba(245, 158, 11, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
              <Timer size={13} /> Seats Locked For
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', marginTop: 2 }}>
              {formatTimer(timerSeconds)}
            </div>
          </div>
        )}
      </div>

      {lockError && (
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
          fontSize: '0.92rem',
          fontWeight: 600,
        }}>
          <AlertCircle size={20} color="#f87171" />
          <span>{lockError}</span>
        </div>
      )}

      {/* Main Seating Layout & Checkout Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: 32,
        alignItems: 'flex-start',
      }} className="seat-booking-grid">
        {/* Left Column: Interactive Seat Grid */}
        <div>
          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            pricing={show.pricing}
          />
        </div>

        {/* Right Column: Order Summary Floating Card */}
        <div className="glass-panel-elevated" style={{ padding: '28px', position: 'sticky', top: 90 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Film size={18} color="#f43f5e" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>
              Booking Summary
            </h3>
          </div>

          {selectedSeats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                fontSize: '1.5rem',
              }}>
                🎟️
              </div>
              <div style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.95rem' }}>No Seats Selected Yet</div>
              <p style={{ fontSize: '0.84rem', marginTop: 4 }}>Click on available auditorium seats to lock them</p>
            </div>
          ) : (
            <div>
              {/* Selected Seats Pills */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10, fontWeight: 800, letterSpacing: '0.06em' }}>
                  Reserved Seats ({selectedSeats.length})
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedSeats.map((s) => (
                    <div
                      key={s.seatNumber}
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        padding: '6px 12px',
                        borderRadius: 10,
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        color: '#6ee7b7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <span>{s.seatNumber}</span>
                      <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>(${s.price})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '18px 0',
                marginBottom: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                fontSize: '0.92rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Tickets Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>${subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Auditorium Facility Fee</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>${convenienceFee}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  paddingTop: 10,
                  borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
                }}>
                  <span>Total Due</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ${totalAmount}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '1rem', fontWeight: 800 }}
              >
                <span>Proceed to Checkout</span>
                <ChevronRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: '#64748b', fontSize: '0.78rem', marginTop: 16 }}>
                <ShieldCheck size={15} color="#10b981" />
                <span>Protected by 256-Bit SSL Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .seat-booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
