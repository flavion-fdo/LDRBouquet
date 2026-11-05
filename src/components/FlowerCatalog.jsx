import React, { useState } from 'react';
import FlowerSvg, { FLOWER_TYPES, GreenerySvg, GREENERY_TYPES } from './FlowerSvg';
import { Plus, Sparkles, Paintbrush, Info, Flower2, Leaf } from 'lucide-react';

export default function FlowerCatalog({ onAddFlower, onAddGreenery }) {
  const [catalogTab, setCatalogTab] = useState('blooms'); // 'blooms' | 'greenery'

  // Flower Blooms State
  const [selectedType, setSelectedType] = useState(FLOWER_TYPES[0]);
  const [currentColor, setCurrentColor] = useState(FLOWER_TYPES[0].defaultColor);
  const [initialNote, setInitialNote] = useState('');

  // Greenery Foliage State (Pure design)
  const [selectedGreenery, setSelectedGreenery] = useState(GREENERY_TYPES[0]);
  const [currentGreeneryColor, setCurrentGreeneryColor] = useState(GREENERY_TYPES[0].defaultColor);

  const FLOWER_PALETTE = [
    '#e11d48', '#f472b6', '#fb7185', '#f59e0b',
    '#fde047', '#ffffff', '#8b5cf6', '#a78bfa',
    '#38bdf8', '#6366f1', '#10b981', '#475569'
  ];

  const GREENERY_PALETTE = [
    '#3f6212', '#4d7c0f', '#65a30d', '#2d6a4f',
    '#1b4332', '#4f772d', '#556b2f', '#2a4330',
    '#334155', '#d4af37'
  ];

  const handleSelectType = (flower) => {
    setSelectedType(flower);
    setCurrentColor(flower.defaultColor);
  };

  const handleSelectGreenery = (green) => {
    setSelectedGreenery(green);
    setCurrentGreeneryColor(green.defaultColor);
  };

  const handleAddFlower = () => {
    if (onAddFlower) {
      onAddFlower({
        type: selectedType.id,
        color: currentColor,
        message: initialNote,
        cardTheme: 'parchment'
      });
      setInitialNote('');
    }
  };

  const handleAddGreenery = () => {
    if (onAddGreenery) {
      onAddGreenery({
        type: selectedGreenery.id,
        color: currentGreeneryColor
      });
    }
  };

  return (
    <aside
      className="sketch-box"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Sparkles size={18} />
          <h2 className="font-heading" style={{ fontSize: '1.2rem' }}>Botanical Palette</h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Select blooms with secret notes or decorative greenery stems
        </p>
      </div>

      {/* Palette Tab Switcher: Blooms vs Greenery */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          padding: '3px',
          borderRadius: '12px',
          border: '1px solid var(--bg-card-border)',
          gap: '4px'
        }}
      >
        <button
          type="button"
          onClick={() => setCatalogTab('blooms')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '0.45rem 0.6rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: catalogTab === 'blooms' ? 'var(--bg-card)' : 'transparent',
            color: catalogTab === 'blooms' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: catalogTab === 'blooms' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Flower2 size={14} />
          <span>Blooms ({FLOWER_TYPES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCatalogTab('greenery')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '0.45rem 0.6rem',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: catalogTab === 'greenery' ? 'var(--bg-card)' : 'transparent',
            color: catalogTab === 'greenery' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: catalogTab === 'greenery' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Leaf size={14} />
          <span>Greenery ({GREENERY_TYPES.length})</span>
        </button>
      </div>

      {/* TAB 1: FLOWER BLOOMS */}
      {catalogTab === 'blooms' && (
        <>
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
                {FLOWER_PALETTE.map((c) => (
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
              onClick={handleAddFlower}
              className="sketch-button sketch-button-primary"
              style={{ width: '100%', marginTop: '0.2rem', padding: '0.65rem' }}
            >
              <Plus size={18} /> Add Bloom to Bouquet
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: '8px' }}>
            <Info size={16} color="var(--primary)" />
            <span>Drag, rotate, scale, and click blooms to add notes, photos, audio & videos!</span>
          </div>
        </>
      )}

      {/* TAB 2: GREENERY & FOLIAGE (Pure Design) */}
      {catalogTab === 'greenery' && (
        <>
          {/* Greenery Grid Selector */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.45rem'
            }}
          >
            {GREENERY_TYPES.map((green) => {
              const isSelected = selectedGreenery.id === green.id;
              return (
                <button
                  key={green.id}
                  type="button"
                  onClick={() => handleSelectGreenery(green)}
                  title={`${green.name} - ${green.desc}`}
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
                  <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GreenerySvg type={green.id} color={isSelected ? currentGreeneryColor : green.defaultColor} height={42} />
                  </div>
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
                    {green.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Greenery Card & Customizer */}
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
                {selectedGreenery.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedGreenery.desc}</p>
            </div>

            {/* Live Greenery Preview */}
            <div
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid var(--bg-card-border)',
                height: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GreenerySvg type={selectedGreenery.id} color={currentGreeneryColor} height={95} />
            </div>

            {/* Greenery Shading Palette */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Paintbrush size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Foliage Leaf Color:
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {GREENERY_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrentGreeneryColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: currentGreeneryColor === c ? '2.5px solid var(--border-sketch)' : '1px solid rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      transform: currentGreeneryColor === c ? 'scale(1.18)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={currentGreeneryColor}
                  onChange={(e) => setCurrentGreeneryColor(e.target.value)}
                  title="Custom Foliage Color"
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

            {/* Pure Design Badge Note */}
            <div
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--bg-card-border)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: '1.3'
              }}
            >
              🌿 <strong>Pure Botanical Design:</strong> Greenery stems are purely for arrangement styling. You can move, rotate, and scale them freely on canvas without note popups!
            </div>

            {/* Add Greenery Button */}
            <button
              type="button"
              onClick={handleAddGreenery}
              className="sketch-button sketch-button-primary"
              style={{ width: '100%', marginTop: '0.2rem', padding: '0.65rem' }}
            >
              <Plus size={18} /> Add Foliage Stem to Bouquet
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
