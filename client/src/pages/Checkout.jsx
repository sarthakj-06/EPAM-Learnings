import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building, ShieldCheck, Tag, Lock, CheckCircle2, AlertCircle, Film, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { socket } = useSocket();

  const bookingState = location.state;

  if (!bookingState || !bookingState.show || !bookingState.selectedSeats) {
    return <Navigate to="/movies" replace />;
  }

  const { show, selectedSeats, subtotal, convenienceFee } = bookingState;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState('');

  // Form states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardName, setCardName] = useState(user?.name || 'Alex Johnson');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [selectedBank, setSelectedBank] = useState('Chase Bank');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Promo calculation
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'IMOVIES50') {
      setDiscount(50);
      setPromoApplied('IMOVIES50 ($50 Off)');
    } else if (code === 'VIPPASS') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setPromoApplied(`VIPPASS (20% Off: -$${disc})`);
    } else {
      setPromoError('Invalid promo code. Try IMOVIES50 or VIPPASS');
    }
  };

  const applyQuickPromo = (code) => {
    setPromoCode(code);
    setPromoError('');
    if (code === 'IMOVIES50') {
      setDiscount(50);
      setPromoApplied('IMOVIES50 ($50 Off)');
    } else if (code === 'VIPPASS') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setPromoApplied(`VIPPASS (20% Off: -$${disc})`);
    }
  };

  const finalTotal = Math.max(0, subtotal + convenienceFee - discount);

  const handleCompletePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const seatNumbers = selectedSeats.map((s) => s.seatNumber);
      const seatDetails = selectedSeats.map((s) => ({
        seatNumber: s.seatNumber,
        tier: s.tier,
        price: s.price,
      }));

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          showId: show._id,
          seats: seatNumbers,
          seatDetails,
          subtotal,
          convenienceFee,
          discount,
          totalAmount: finalTotal,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Payment processing failed');
      }

      // Notify live socket listeners
      if (socket) {
        socket.emit('seats:booked', {
          showId: show._id,
          seats: seatNumbers,
        });
      }

      // Launch Confetti Celebration!
      try {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ea580c', '#fbbf24', '#10b981', '#38bdf8'],
        });
      } catch (err) {
        // non-blocking
      }

      navigate(`/booking-success/${data.booking._id}`, {
        state: { booking: data.booking },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: 1120, margin: '40px auto 90px', padding: '0 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ color: '#f43f5e', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Final Step
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginTop: 4, letterSpacing: '-0.025em' }}>
          Express Cinema Checkout
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.98rem', marginTop: 4 }}>
          Complete your reservation with PCI-compliant encrypted cinema payment gateway.
        </p>
      </div>

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 36,
        alignItems: 'flex-start',
      }} className="checkout-grid">
        {/* Left: Payment Form & Options */}
        <div className="glass-panel-elevated" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 20, color: '#fff' }}>
            Select Payment Method
          </h2>

          {/* Payment Method Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 28,
          }}>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{
                padding: '16px 10px',
                borderRadius: 'var(--radius-md)',
                background: paymentMethod === 'card' ? 'rgba(244, 63, 94, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${paymentMethod === 'card' ? 'rgba(244, 63, 94, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: paymentMethod === 'card' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)',
                boxShadow: paymentMethod === 'card' ? '0 4px 16px var(--primary-glow)' : 'none',
              }}
            >
              <CreditCard size={22} color={paymentMethod === 'card' ? '#f43f5e' : '#94a3b8'} />
              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Credit Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              style={{
                padding: '16px 10px',
                borderRadius: 'var(--radius-md)',
                background: paymentMethod === 'upi' ? 'rgba(14, 165, 233, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${paymentMethod === 'upi' ? '#0ea5e9' : 'rgba(255, 255, 255, 0.08)'}`,
                color: paymentMethod === 'upi' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)',
                boxShadow: paymentMethod === 'upi' ? '0 4px 16px var(--accent-cyan-glow)' : 'none',
              }}
            >
              <Smartphone size={22} color={paymentMethod === 'upi' ? '#38bdf8' : '#94a3b8'} />
              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Instant UPI</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              style={{
                padding: '16px 10px',
                borderRadius: 'var(--radius-md)',
                background: paymentMethod === 'netbanking' ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${paymentMethod === 'netbanking' ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
                color: paymentMethod === 'netbanking' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)',
                boxShadow: paymentMethod === 'netbanking' ? '0 4px 16px var(--accent-gold-glow)' : 'none',
              }}
            >
              <Building size={22} color={paymentMethod === 'netbanking' ? '#fbbf24' : '#94a3b8'} />
              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Net Banking</span>
            </button>
          </div>

          <form onSubmit={handleCompletePayment}>
            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
                    Cardholder Full Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      placeholder="MM/YY"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
                      Security CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                      maxLength={4}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Inputs */}
            {paymentMethod === 'upi' && (
              <div>
                <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  required
                  className="input-field"
                  style={{ marginBottom: 12 }}
                />
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Supported Apps: Google Pay, PhonePe, Paytm, Amazon Pay, Apple Pay
                </div>
              </div>
            )}

            {/* Net Banking Inputs */}
            {paymentMethod === 'netbanking' && (
              <div>
                <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 8, fontWeight: 700 }}>
                  Select Financial Institution
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="input-field"
                  style={{ background: '#131926', cursor: 'pointer' }}
                >
                  <option value="Chase Bank">Chase Bank</option>
                  <option value="Bank of America">Bank of America</option>
                  <option value="Wells Fargo">Wells Fargo</option>
                  <option value="Citibank">Citibank</option>
                  <option value="PNC Bank">PNC Bank</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '16px',
                fontSize: '1.05rem',
                fontWeight: 800,
                marginTop: 28,
              }}
            >
              <Lock size={18} />
              <span>{processing ? 'Processing Secure Reservation...' : `Pay $${finalTotal} & Confirm Tickets`}</span>
            </button>
          </form>
        </div>

        {/* Right: Booking Summary & Promo */}
        <div>
          {/* Order Details Panel */}
          <div className="glass-panel-elevated" style={{ padding: '28px', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 18, color: '#fff' }}>
              Cinema Admission Pass
            </h3>

            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <img
                src={show.movie?.poster}
                alt={show.movie?.title}
                style={{ width: 70, height: 100, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  {show.movie?.title}
                </h4>
                <div style={{ fontSize: '0.82rem', color: '#fda4af', marginTop: 3, fontWeight: 700 }}>
                  {show.format} • {show.language}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: 4 }}>
                  {show.theatre?.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 2 }}>
                  {show.showDate} at {show.showTime}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <span style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: 600 }}>Reserved Seats:</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#6ee7b7' }}>
                {selectedSeats.map((s) => s.seatNumber).join(', ')}
              </span>
            </div>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, fontWeight: 800, letterSpacing: '0.05em' }}>
                Have a Promo Voucher?
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Enter code (e.g. IMOVIES50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    textTransform: 'uppercase',
                  }}
                />
                <button
                  type="submit"
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.88rem', fontWeight: 700 }}
                >
                  Apply
                </button>
              </div>

              {/* Quick Click Promo Pills */}
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Quick test:</span>
                <button
                  type="button"
                  onClick={() => applyQuickPromo('IMOVIES50')}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#f59e0b',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  IMOVIES50 ($50)
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPromo('VIPPASS')}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#f43f5e',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  VIPPASS (20%)
                </button>
              </div>

              {promoApplied && (
                <div style={{ marginTop: 10, color: '#34d399', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700 }}>
                  <CheckCircle2 size={15} /> {promoApplied}
                </div>
              )}
              {promoError && (
                <div style={{ marginTop: 10, color: '#f87171', fontSize: '0.84rem' }}>
                  {promoError}
                </div>
              )}
            </form>

            {/* Total breakdown */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: '0.92rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal ({selectedSeats.length} seats)</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Auditorium Facility Fee</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${convenienceFee}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 700 }}>
                  <span>Voucher Discount</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#fff',
                fontSize: '1.3rem',
                fontWeight: 900,
                borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
                paddingTop: 12,
                marginTop: 6,
              }}>
                <span>Total Due</span>
                <span style={{
                  background: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  ${finalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
