import React from 'react';
import { Film, ShieldCheck, Heart, Sparkles, Layers, Cpu, Radio, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, rgba(10, 13, 20, 0.95) 0%, #06080d 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '70px 24px 36px',
      marginTop: 90,
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 48,
          marginBottom: 48,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #f43f5e 0%, #ea580c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(244, 63, 94, 0.35)',
              }}>
                <Film size={20} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                IMOVIES <span style={{ color: '#f43f5e', fontSize: '0.9rem' }}>LUXE</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: 20 }}>
              The definitive cinema ticketing platform. Experience precision Dolby Atmos sound, IMAX Laser visual clarity, and real-time Socket.io seat reservation.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-ruby"><Layers size={12} /> MERN Stack</span>
              <span className="badge badge-gold"><Cpu size={12} /> Real-Time Socket.io</span>
              <span className="badge badge-emerald"><ShieldCheck size={12} /> Secure JWT</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: 18, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Cinemas & Sound Stages
            </h4>
            <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • IMAX Laser 4K Dual Projection
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • Dolby Atmos 64-Channel Spatial Audio
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • VIP Electric Luxury Leather Recliners
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • 4DX Environmental Motion Pods
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • In-Seat Gourmet Dining Concierge
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: 18, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Patron Services
            </h4>
            <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • 1-Click Instant Cancellation & Refund
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • Contactless Scannable QR Boarding Pass
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • Loyalty Points & Promo Redemptions
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • Private Theatre & Corporate Screenings
              </li>
              <li style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                • 24/7 Ticketing Concierge Helpdesk
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: 18, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Cinema Insider Newsletter
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 14 }}>
              Get private invitations to midnight premieres, film festival previews, and secret promo codes.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  padding: '11px 16px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  flex: 1,
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              />
              <button className="btn-primary" style={{ padding: '11px 18px', fontSize: '0.88rem' }}>
                Join
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, color: '#64748b', fontSize: '0.78rem' }}>
              <Award size={14} color="#f59e0b" />
              <span>Instant $50 off coupon on your first booking</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: '0.85rem',
          color: '#64748b',
        }}>
          <div>
            © {new Date().getFullYear()} <strong style={{ color: '#94a3b8' }}>IMovies Luxe Cinema Experience</strong>. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Engineered with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for discerning cinephiles worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};
