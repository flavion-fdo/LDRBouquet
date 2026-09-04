import React from 'react';
import { Flower2, Eye, PenTool, Sparkles, Share2, Palette, RefreshCw, Bookmark, Heart } from 'lucide-react';

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
      className="glass-panel"
      style={{
        position: 'sticky',
        top: '1rem',
        margin: '0.5rem 1.5rem 1rem 1.5rem',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        zIndex: 50
      }}
    >
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            border: '2px solid var(--border-sketch)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}
        >
          <Flower2 size={24} />
        </div>
        <div>
          <h1 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.1 }}>
            Petal & Quill
          </h1>
          <p className="font-handwriting" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
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
          padding: '4px',
          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
          border: '2px solid var(--border-sketch)'
        }}
      >
        <button
          onClick={() => setMode('studio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1rem',
            borderRadius: '20px',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            background: mode === 'studio' ? 'var(--bg-card)' : 'transparent',
            color: mode === 'studio' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: mode === 'studio' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <PenTool size={16} /> Studio Mode
        </button>

        <button
          onClick={() => setMode('preview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1rem',
            borderRadius: '20px',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            background: mode === 'preview' ? 'var(--primary)' : 'transparent',
            color: mode === 'preview' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: mode === 'preview' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Eye size={16} /> Recipient View
        </button>
      </div>

      {/* Control Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Preset Selector */}
        {mode === 'studio' && (
          <button
            className="sketch-button"
            onClick={onLoadPreset}
            title="Load inspiration sample bouquet"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
          >
            <Bookmark size={15} /> Presets
          </button>
        )}

        {/* Theme Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--bg-card-border)' }}>
          <Palette size={15} color="var(--text-muted)" />
          {['parchment', 'rose', 'sage', 'midnight'].map((t) => (
            <button
              key={t}
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
            onClick={onClearBouquet}
            className="sketch-button"
            title="Clear canvas and start fresh"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} /> Reset
          </button>
        )}

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="sketch-button sketch-button-primary"
          style={{ fontSize: '0.9rem', padding: '0.55rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Share2 size={16} /> Finish & Share Bouquet 💌
        </button>
      </div>
    </header>
  );
}
