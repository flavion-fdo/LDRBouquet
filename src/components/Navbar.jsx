import React from 'react';
import { Flower2, Eye, PenTool, Share2, Palette, RefreshCw, Bookmark } from 'lucide-react';

export default function Navbar({
  mode,
  setMode,
  theme,
  setTheme,
  onOpenShare,
  onClearBouquet,
  onLoadPreset
}) {
  return (
    <header
      className="glass-panel navbar-container"
      style={{
        position: 'sticky',
        top: '0.5rem',
        margin: '0.5rem 1.5rem 1rem 1.5rem',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        zIndex: 50
      }}
    >
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            border: '2px solid var(--border-sketch)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}
        >
          <Flower2 size={22} />
        </div>
        <div>
          <h1 className="font-heading navbar-title" style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.1 }}>
            Petal & Quill
          </h1>
          <p className="font-handwriting navbar-subtitle" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Long Distance Bouquets & Secret Notes 💌
          </p>
        </div>
      </div>

      {/* Mode Switcher: Studio (Builder) vs Presentation (Recipient) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          padding: '3px',
          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
          border: '2px solid var(--border-sketch)'
        }}
      >
        <button
          type="button"
          onClick={() => setMode('studio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '18px',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.84rem',
            cursor: 'pointer',
            background: mode === 'studio' ? 'var(--bg-card)' : 'transparent',
            color: mode === 'studio' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: mode === 'studio' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <PenTool size={15} /> <span>Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('preview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '18px',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.84rem',
            cursor: 'pointer',
            background: mode === 'preview' ? 'var(--primary)' : 'transparent',
            color: mode === 'preview' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: mode === 'preview' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Eye size={15} /> <span>Recipient View</span>
        </button>
      </div>

      {/* Control Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Preset Selector */}
        {mode === 'studio' && (
          <button
            type="button"
            className="sketch-button"
            onClick={onLoadPreset}
            title="Load inspiration sample bouquet"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
          >
            <Bookmark size={14} /> Presets
          </button>
        )}

        {/* Theme Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-secondary)', padding: '3px 6px', borderRadius: '12px', border: '1px solid var(--bg-card-border)' }}>
          <Palette size={14} color="var(--text-muted)" />
          {['parchment', 'rose', 'sage', 'midnight'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              title={`Switch theme to ${t}`}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: theme === t ? '2px solid var(--border-sketch)' : '1px solid transparent',
                cursor: 'pointer',
                background:
                  t === 'parchment' ? '#fbf7ee' :
                  t === 'rose' ? '#fda4af' :
                  t === 'sage' ? '#86efac' : '#1e1b4b',
                transform: theme === t ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.15s ease'
              }}
            />
          ))}
        </div>

        {/* Clear All */}
        {mode === 'studio' && (
          <button
            type="button"
            onClick={onClearBouquet}
            className="sketch-button"
            title="Clear canvas and start fresh"
            style={{ padding: '0.45rem 0.7rem', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} /> Reset
          </button>
        )}

        {/* Share Button */}
        <button
          type="button"
          onClick={onOpenShare}
          className="sketch-button sketch-button-primary"
          style={{ fontSize: '0.86rem', padding: '0.45rem 0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Share2 size={15} /> <span>Share 💌</span>
        </button>
      </div>
    </header>
  );
}
