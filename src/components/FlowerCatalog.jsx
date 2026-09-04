import React, { useState } from 'react';
import FlowerSvg, { FLOWER_TYPES } from './FlowerSvg';
import { Plus, Sparkles, Paintbrush, Info } from 'lucide-react';

export default function FlowerCatalog({ onAddFlower }) {
  const [selectedType, setSelectedType] = useState(FLOWER_TYPES[0]);
  const [currentColor, setCurrentColor] = useState(FLOWER_TYPES[0].defaultColor);
  const [initialNote, setInitialNote] = useState('');

  const COLOR_PALETTE = [
    '#e11d48', '#f472b6', '#fb7185', '#f59e0b',
    '#fde047', '#ffffff', '#8b5cf6', '#a78bfa',
    '#38bdf8', '#6366f1', '#10b981', '#475569'
  ];

  const handleSelectType = (flower) => {
    setSelectedType(flower);
    setCurrentColor(flower.defaultColor);
  };

  const handleAdd = () => {
    onAddFlower({
      type: selectedType.id,
      color: currentColor,
      message: initialNote,
      cardTheme: 'parchment'
    });
    setInitialNote('');
  };

  return (
    <aside
      className="sketch-box"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Sparkles size={18} />
          <h2 className="font-heading" style={{ fontSize: '1.2rem' }}>Flower Palette</h2>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Select real blooms to send your heart & secret notes across the miles
        </p>
      </div>

      {/* Flower Grid Selector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.45rem'
        }}
      >
        {FLOWER_TYPES.map((flower) => {
          const isSelected = selectedType.id === flower.id;
          return (
            <button
              key={flower.id}
              type="button"
              onClick={() => handleSelectType(flower)}
              title={`${flower.name} - ${flower.desc}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem 0.2rem',
                borderRadius: '12px',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--bg-card-border)',
                background: isSelected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <FlowerSvg type={flower.id} color={isSelected ? currentColor : flower.defaultColor} size={34} />
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  marginTop: '3px',
                  color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: '1.15',
                  wordBreak: 'break-word',
                  maxWidth: '100%'
                }}
              >
                {flower.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Flower Card & Customizer */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: '16px',
          border: '1.5px dashed var(--border-sketch)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h3 className="font-heading" style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
            {selectedType.name}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedType.desc}</p>
        </div>

        {/* Live Flower SVG Preview */}
        <div
          style={{
            padding: '0.85rem',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid var(--bg-card-border)'
          }}
        >
          <FlowerSvg type={selectedType.id} color={currentColor} size={76} />
        </div>

        {/* Color Palette Picker */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Paintbrush size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Petal Shading Color:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrentColor(c)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: currentColor === c ? '2.5px solid var(--border-sketch)' : '1px solid rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transform: currentColor === c ? 'scale(1.18)' : 'scale(1)',
                  transition: 'transform 0.15s ease'
                }}
              />
            ))}
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              title="Custom Hex Color"
              style={{
                width: '28px',
                height: '28px',
                padding: 0,
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
          </div>
        </div>

        {/* Optional Quick Message Input */}
        <div style={{ width: '100%' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Attach Secret Note (Optional):
          </label>
          <input
            type="text"
            placeholder="e.g. 'Counting every mile until our airport hug...'"
            value={initialNote}
            onChange={(e) => setInitialNote(e.target.value)}
            className="font-handwriting"
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--bg-card-border)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>

        {/* Add Flower Button */}
        <button
          type="button"
          onClick={handleAdd}
          className="sketch-button sketch-button-primary"
          style={{ width: '100%', marginTop: '0.2rem', padding: '0.65rem' }}
        >
          <Plus size={18} /> Add Stem to Bouquet
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: '8px' }}>
        <Info size={16} color="var(--primary)" />
        <span>You can drag, rotate, resize, and add secret love notes to any bloom on the canvas!</span>
      </div>
    </aside>
  );
}
