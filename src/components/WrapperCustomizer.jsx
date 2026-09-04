import React from 'react';
import { Package, Ribbon, Tag, Palette, Sparkles, Send, Plane } from 'lucide-react';

export default function WrapperCustomizer({ bouquet, onUpdateBouquet }) {
  const {
    wrapperStyle = 'kraft',
    ribbonColor = '#e11d48',
    tagTo = '',
    tagFrom = '',
    tagDistance = '',
    tagMessage = ''
  } = bouquet;

  const WRAPPER_STYLES = [
    { id: 'kraft', name: 'Airmail Kraft Cone', desc: 'Warm brown paper with vintage postal charm' },
    { id: 'satin', name: 'Romantic Satin Silk', desc: 'Lush fabric fold in passionate red' },
    { id: 'newsprint', name: 'Vintage Love Letters', desc: 'Poetic newsprint script wrap' },
    { id: 'vase', name: 'Glass Crystal Vase', desc: 'Clear glass with fresh water stems' },
    { id: 'celestial', name: 'Starlit Midnight', desc: 'Deep starry sky with gold foil constellation' }
  ];

  const RIBBON_COLORS = ['#e11d48', '#d97706', '#059669', '#2563eb', '#7c3aed', '#475569', '#fbbf24'];

  const handleWrapperChange = (styleId) => {
    onUpdateBouquet({ wrapperStyle: styleId });
  };

  return (
    <aside
      className="sketch-box"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Package size={18} />
          <h2 className="font-heading" style={{ fontSize: '1.2rem' }}>Wrap & Gift Tag</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Customize the outer packaging, ribbon tie, and dedication note
        </p>
      </div>

      {/* Wrapper Selection */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          Wrapper Material:
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {WRAPPER_STYLES.map((w) => (
            <button
              key={w.id}
              onClick={() => handleWrapperChange(w.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: wrapperStyle === w.id ? '2px solid var(--primary)' : '1px solid var(--bg-card-border)',
                background: wrapperStyle === w.id ? 'var(--primary-light)' : 'var(--bg-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{w.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.desc}</div>
              </div>
              {wrapperStyle === w.id && <Sparkles size={16} color="var(--primary)" />}
            </button>
          ))}
        </div>
      </div>

      {/* Ribbon Color Selector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '8px' }}>
          <Ribbon size={16} color="var(--text-muted)" />
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Ribbon Tie Color:
          </label>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {RIBBON_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onUpdateBouquet({ ribbonColor: c })}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: c,
                border: ribbonColor === c ? '2px solid var(--border-sketch)' : '1px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transform: ribbonColor === c ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.15s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Gift Tag Customizer for Long Distance Love */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: '16px',
          border: '1.5px dashed var(--border-sketch)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Tag size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Long Distance Dedication Tag 💌
          </span>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
            To (Loved One's Name / City):
          </label>
          <input
            type="text"
            placeholder="e.g. 'My Dearest', 'Sarah', 'Elena'..."
            value={tagTo}
            onChange={(e) => onUpdateBouquet({ tagTo: e.target.value })}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem',
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: '1px solid var(--bg-card-border)',
              background: 'var(--bg-card)',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
            From (Your Name / City):
          </label>
          <input
            type="text"
            placeholder="e.g. 'Yours Always', 'Liam', 'Noah'..."
            value={tagFrom}
            onChange={(e) => onUpdateBouquet({ tagFrom: e.target.value })}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem',
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: '1px solid var(--bg-card-border)',
              background: 'var(--bg-card)',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
            Miles Apart / Airmail Note:
          </label>
          <input
            type="text"
            placeholder="e.g. 'Miles Apart ✈️', 'Across the Ocean'..."
            value={tagDistance}
            onChange={(e) => onUpdateBouquet({ tagDistance: e.target.value })}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem',
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: '1px solid var(--bg-card-border)',
              background: 'var(--bg-card)',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
            Dedication Message:
          </label>
          <input
            type="text"
            placeholder="e.g. 'Distance means nothing when someone means everything.'"
            value={tagMessage}
            onChange={(e) => onUpdateBouquet({ tagMessage: e.target.value })}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem',
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: '1px solid var(--bg-card-border)',
              background: 'var(--bg-card)',
              outline: 'none'
            }}
          />
        </div>
      </div>
    </aside>
  );
}
