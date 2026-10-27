import React from 'react';
import { Crown, Sparkles, Lock, Check, Film, Tv } from 'lucide-react';

export const SeatGrid = ({
  seats = [],
  selectedSeats = [],
  onSeatToggle,
  pricing = { vip: 400, premium: 280, standard: 180 },
}) => {
  // Group seats by tier and row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getTierName = (row) => {
    if (row === 'A' || row === 'B') return 'VIP Recliner Experience';
    if (row === 'C' || row === 'D') return 'Premium Club Stage';
    return 'Standard Classic Tier';
  };

  const getTierPrice = (row) => {
    if (row === 'A' || row === 'B') return pricing.vip || 400;
    if (row === 'C' || row === 'D') return pricing.premium || 280;
    return pricing.standard || 180;
  };

  return (
    <div style={{
      width: '100%',
      background: 'rgba(14, 19, 30, 0.85)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '44px 28px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Curved Screen & Projector Light */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-curve" />
        <div className="cinema-screen-beam" />
        <span className="cinema-screen-label">IMAX Laser Curved Screen</span>
      </div>

      {/* Seat Rows Map */}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {rows.map((rowLetter, rIdx) => {
          const rowSeats = seats.filter((s) => s.row === rowLetter);
          // Show section divider header for row A, C, E
          const isSectionStart = rowLetter === 'A' || rowLetter === 'C' || rowLetter === 'E';

          return (
            <React.Fragment key={rowLetter}>
              {isSectionStart && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 8,
                  marginTop: rIdx > 0 ? 30 : 0,
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 800 }}>
                    {rowLetter === 'A' && <Crown size={16} color="#fbbf24" />}
                    {rowLetter === 'C' && <Sparkles size={16} color="#fda4af" />}
                    {rowLetter === 'E' && <Film size={16} color="#7dd3fc" />}
                    <span style={{
                      color: rowLetter === 'A' ? '#fbbf24' : rowLetter === 'C' ? '#fda4af' : '#7dd3fc',
                      letterSpacing: '0.02em',
                    }}>
                      {getTierName(rowLetter)}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#94a3b8' }}>
                    ${getTierPrice(rowLetter)} <span style={{ fontSize: '0.72rem', color: '#64748b' }}>/ ticket</span>
                  </span>
                </div>
              )}

              <div className="seat-row">
                <span className="seat-row-label">{rowLetter}</span>

                <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                    const isBooked = seat.status === 'booked';
                    const isLocked = seat.status === 'locked' && !isSelected;

                    let statusClass = 'available';
                    if (isBooked) statusClass = 'booked';
                    else if (isLocked) statusClass = 'locked';
                    else if (isSelected) statusClass = 'selected';

                    return (
                      <button
                        key={seat.seatNumber}
                        disabled={isBooked || isLocked}
                        onClick={() => onSeatToggle(seat)}
                        className={`seat-unit ${seat.tier} ${statusClass}`}
                        title={`${seat.seatNumber} • ${seat.tier.toUpperCase()} • $${seat.price}`}
                        style={{
                          marginRight: seat.col === 5 ? 18 : 0, // Central Aisle gap
                        }}
                      >
                        {isSelected ? (
                          <Check size={14} strokeWidth={3.5} />
                        ) : isLocked ? (
                          <Lock size={12} />
                        ) : (
                          seat.col
                        )}
                      </button>
                    );
                  })}
                </div>

                <span className="seat-row-label">{rowLetter}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: 48,
        paddingTop: 24,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 22,
        fontSize: '0.82rem',
        color: '#94a3b8',
        fontWeight: 600,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="seat-unit vip" style={{ width: 22, height: 22, fontSize: '0.62rem', cursor: 'default' }}>VIP</div>
          <span>VIP Recliner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="seat-unit premium" style={{ width: 22, height: 22, fontSize: '0.62rem', cursor: 'default' }}>P</div>
          <span>Premium Club</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="seat-unit standard" style={{ width: 22, height: 22, fontSize: '0.62rem', cursor: 'default' }}>S</div>
          <span>Standard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="seat-unit selected" style={{ width: 22, height: 22, fontSize: '0.62rem', cursor: 'default' }}>✓</div>
          <span>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="seat-unit locked" style={{ width: 22, height: 22, fontSize: '0.62rem', cursor: 'default' }}>
            <Lock size={10} />
          </div>
          <span>Hold / In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="seat-unit booked" style={{ width: 22, height: 22, fontSize: '0.62rem', cursor: 'default' }}>✕</div>
          <span>Reserved / Sold</span>
        </div>
      </div>
    </div>
  );
};
