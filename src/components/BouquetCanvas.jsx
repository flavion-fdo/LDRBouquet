import React, { useState } from 'react';
import FlowerSvg, { GreenerySvg } from './FlowerSvg';
import { Trash2, Edit3, RotateCw, ZoomIn, ZoomOut, Sparkles, MessageCircle, Heart, Tag, Share2, Send, Plane } from 'lucide-react';

export default function BouquetCanvas({
  bouquet,
  mode,
  selectedFlowerId,
  setSelectedFlowerId,
  onUpdateFlower,
  onDeleteFlower,
  onOpenMessageModal,
  onFlowerClickRecipient,
  onOpenShare,
  onOpenDedicationModal
}) {
  const {
    flowers = [],
    wrapperStyle = 'kraft',
    ribbonColor = '#e11d48',
    tagTo,
    tagFrom,
    tagDistance,
    tagMessage
  } = bouquet;

  const flowersWithNotes = flowers.filter((f) => f.message && f.message.trim()).length;

  const handleFlowerClick = (flower) => {
    if (mode === 'preview') {
      onFlowerClickRecipient(flower);
    } else {
      setSelectedFlowerId(flower.id);
    }
  };

  // Wrapper Base SVG Renderer
  const renderWrapper = () => {
    switch (wrapperStyle) {
      case 'satin':
        return (
          <div style={{ position: 'relative', width: '220px', margin: '0 auto' }}>
            <svg width="220" height="240" viewBox="0 0 220 240" className="hand-drawn-svg">
              <path d="M 30 0 L 190 0 L 160 220 L 60 220 Z" fill="#f43f5e" stroke="var(--border-sketch)" strokeWidth="2.5" />
              <path d="M 60 0 L 110 220 L 160 0" fill="rgba(255,255,255,0.2)" stroke="var(--border-sketch)" strokeWidth="1.5" />
              {/* Satin Bow & Ribbon */}
              <circle cx="110" cy="110" r="16" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 110 110 Q 70 80 50 110 Q 70 130 110 110" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 110 110 Q 150 80 170 110 Q 150 130 110 110" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 105 125 Q 90 180 80 210" fill="none" stroke={ribbonColor} strokeWidth="6" strokeLinecap="round" />
              <path d="M 115 125 Q 130 180 140 210" fill="none" stroke={ribbonColor} strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'newsprint':
        return (
          <div style={{ position: 'relative', width: '220px', margin: '0 auto' }}>
            <svg width="220" height="240" viewBox="0 0 220 240" className="hand-drawn-svg">
              <path d="M 25 0 L 195 0 L 165 220 L 55 220 Z" fill="#f5f0e6" stroke="var(--border-sketch)" strokeWidth="2.5" />
              {/* Newsprint Text Lines */}
              {[30, 50, 70, 90, 150, 170, 190].map((y, idx) => (
                <line key={idx} x1="50" y1={y} x2="170" y2={y} stroke="rgba(52, 42, 34, 0.35)" strokeWidth="2" strokeDasharray="6 4" />
              ))}
              {/* Vintage Floral Stamp */}
              <circle cx="110" cy="120" r="24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" />
              <text x="110" y="125" textAnchor="middle" fill="var(--primary)" fontSize="10" fontFamily="var(--font-heading)">PARIS 1898</text>
              {/* Twine Bow */}
              <circle cx="110" cy="110" r="8" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 110 110 Q 80 90 70 110 Q 90 125 110 110" fill="none" stroke={ribbonColor} strokeWidth="3" />
              <path d="M 110 110 Q 140 90 150 110 Q 130 125 110 110" fill="none" stroke={ribbonColor} strokeWidth="3" />
            </svg>
          </div>
        );

      case 'vase':
        return (
          <div style={{ position: 'relative', width: '220px', margin: '0 auto' }}>
            <svg width="220" height="240" viewBox="0 0 220 240" className="hand-drawn-svg">
              {/* Water Fill inside Glass */}
              <path d="M 62 70 Q 110 75 158 70 L 148 200 Q 110 208 72 200 Z" fill="rgba(56, 189, 248, 0.22)" />
              {/* Glass Rim & Outline */}
              <ellipse cx="110" cy="30" rx="55" ry="12" fill="rgba(255,255,255,0.4)" stroke="var(--border-sketch)" strokeWidth="2.5" />
              <path d="M 55 30 C 45 100, 60 190, 70 210 Q 110 220 150 210 C 160 190, 175 100, 165 30" fill="rgba(255,255,255,0.2)" stroke="var(--border-sketch)" strokeWidth="2.5" />
              <ellipse cx="110" cy="210" rx="40" ry="10" fill="none" stroke="var(--border-sketch)" strokeWidth="2" />
              {/* Water Surface Line */}
              <path d="M 62 70 Q 110 78 158 70" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
            </svg>
          </div>
        );

      case 'celestial':
        return (
          <div style={{ position: 'relative', width: '220px', margin: '0 auto' }}>
            <svg width="220" height="240" viewBox="0 0 220 240" className="hand-drawn-svg">
              <path d="M 25 0 L 195 0 L 165 220 L 55 220 Z" fill="#1e1b4b" stroke="var(--border-sketch)" strokeWidth="2.5" />
              {/* Gold Foil Stars */}
              {[{x:60, y:40}, {x:140, y:60}, {x:90, y:90}, {x:160, y:140}, {x:70, y:170}].map((pt, idx) => (
                <path key={idx} d={`M ${pt.x} ${pt.y - 6} L ${pt.x + 2} ${pt.y - 2} L ${pt.x + 6} ${pt.y} L ${pt.x + 2} ${pt.y + 2} L ${pt.x} ${pt.y + 6} L ${pt.x - 2} ${pt.y + 2} L ${pt.x - 6} ${pt.y} L ${pt.x - 2} ${pt.y - 2} Z`} fill="#fbbf24" />
              ))}
              {/* Golden Ribbon */}
              <circle cx="110" cy="110" r="14" fill="#fbbf24" stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 110 110 Q 70 80 50 110 Q 70 130 110 110" fill="#fbbf24" stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 110 110 Q 150 80 170 110 Q 150 130 110 110" fill="#fbbf24" stroke="var(--border-sketch)" strokeWidth="2" />
            </svg>
          </div>
        );

      case 'kraft':
      default:
        return (
          <div style={{ position: 'relative', width: '220px', margin: '0 auto' }}>
            <svg width="220" height="240" viewBox="0 0 220 240" className="hand-drawn-svg">
              {/* Kraft Paper Envelope Cone */}
              <path d="M 20 0 L 200 0 L 165 220 L 55 220 Z" fill="#d4a373" stroke="var(--border-sketch)" strokeWidth="2.5" />
              <path d="M 20 0 L 110 220 L 200 0" fill="#bc8a5f" stroke="var(--border-sketch)" strokeWidth="1.8" />
              <path d="M 55 220 L 110 0 L 165 220" fill="rgba(0,0,0,0.06)" stroke="var(--border-sketch)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Twine Bow */}
              <circle cx="110" cy="110" r="12" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 110 110 Q 65 85 50 110 Q 70 135 110 110" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 110 110 Q 155 85 170 110 Q 150 135 110 110" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
              <path d="M 105 122 Q 90 170 80 200" fill="none" stroke={ribbonColor} strokeWidth="5" strokeLinecap="round" />
              <path d="M 115 122 Q 130 170 140 200" fill="none" stroke={ribbonColor} strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
        );
    }
  };

  const selectedFlower = flowers.find((f) => f.id === selectedFlowerId);

  return (
    <div
      className="sketch-box"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '560px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '2rem',
        overflow: 'hidden',
        background: 'var(--bg-card)'
      }}
    >
      {/* Background Studio Guidelines & Top Canvas Actions (Only in Studio Mode) */}
      {mode === 'studio' && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 30,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-secondary)',
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid var(--bg-card-border)',
              pointerEvents: 'auto'
            }}
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>
              {flowers.length} Bloom{flowers.length === 1 ? '' : 's'} • {flowersWithNotes} with secret note{flowersWithNotes === 1 ? '' : 's'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'auto' }}>
            {onOpenDedicationModal && (
              <button
                onClick={onOpenDedicationModal}
                className="sketch-button"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.45rem 0.85rem',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Edit To, From, Distance & Dedication note"
              >
                <Tag size={13} color="var(--primary)" /> Edit Names & Tag
              </button>
            )}

            {flowers.length > 0 && onOpenShare && (
              <button
                onClick={onOpenShare}
                className="sketch-button sketch-button-primary"
                style={{
                  fontSize: '0.85rem',
                  padding: '0.45rem 1rem',
                  boxShadow: '0 4px 12px rgba(200,90,84,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Share2 size={14} /> Finish Bouquet & Share 💌
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recipient Airmail Delivery Banner */}
      {mode === 'preview' && (
        <div
          className="animate-bounce-gentle"
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            maxWidth: '560px',
            margin: '0 auto',
            textAlign: 'center',
            background: 'var(--primary-light)',
            padding: '0.75rem 1.25rem',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            border: '2px solid var(--border-sketch)',
            boxShadow: 'var(--shadow-soft)',
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>
            <span>✈️ Airmail Bouquet Delivery Across The Miles</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '2px', fontWeight: 500 }}>
            {tagFrom && tagTo ? (
              <span>Sent with devotion from <strong>{tagFrom}</strong> to <strong>{tagTo}</strong> {tagDistance ? `(${tagDistance})` : ''}</span>
            ) : (
              <span>Handcrafted for you with secret love notes hidden in each blossom</span>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px', fontStyle: 'italic', fontWeight: 600 }}>
            ✨ Click any flower below to uncover its secret love note!
          </div>
        </div>
      )}

      {/* Empty State Instruction */}
      {flowers.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            transform: 'translateY(-50%)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            maxWidth: '300px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1rem auto',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '2px dashed var(--border-sketch)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}
          >
            <Sparkles size={32} />
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Your Bouquet is Empty</h3>
          <p style={{ fontSize: '0.85rem' }}>Select blooms from the left palette to begin handcrafting your floral gift!</p>
        </div>
      )}

      {/* Flower Stems Layer (Rendered underneath blooms running down into wrapper) */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5
        }}
      >
        {flowers.map((flower) => {
          const startX = (flower.position.x / 100) * 500;
          const startY = (flower.position.y / 100) * 450;
          const endX = 250; // Center stem bundle into wrapper
          const endY = 420;

          return (
            <path
              key={`stem-${flower.id}`}
              d={`M ${startX} ${startY} Q ${(startX + endX) / 2 + (flower.position.x > 50 ? 25 : -25)} ${(startY + endY) / 2} ${endX} ${endY}`}
              fill="none"
              stroke="#4d7c0f"
              strokeWidth={Math.max(3, (flower.scale || 1) * 3.5)}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Greenery Fillers Layer */}
      <div style={{ position: 'absolute', bottom: '150px', zIndex: 6, display: 'flex', gap: '80px', pointerEvents: 'none' }}>
        <GreenerySvg type="eucalyptus" height={160} />
        <GreenerySvg type="babysbreath" height={170} />
        <GreenerySvg type="eucalyptus" height={150} />
      </div>

      {/* Flowers Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10
        }}
      >
        {flowers.map((flower) => {
          const isSelected = selectedFlowerId === flower.id;
          const hasMessage = Boolean(flower.message && flower.message.trim());

          return (
            <div
              key={flower.id}
              onClick={(e) => {
                e.stopPropagation();
                handleFlowerClick(flower);
              }}
              className={mode === 'preview' ? 'animate-sway' : ''}
              style={{
                position: 'absolute',
                left: `${flower.position.x}%`,
                top: `${flower.position.y}%`,
                transform: `translate(-50%, -50%) rotate(${flower.rotation || 0}deg) scale(${flower.scale || 1})`,
                cursor: 'pointer',
                transition: mode === 'studio' ? 'transform 0.1s ease, filter 0.2s ease' : 'filter 0.2s ease',
                zIndex: isSelected ? 25 : 15,
                filter: isSelected ? 'drop-shadow(0 0 12px rgba(200,90,84,0.6))' : 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))'
              }}
            >
              <FlowerSvg type={flower.type} color={flower.color} size={110} />

              {/* Message Indicator Badge */}
              {hasMessage && (
                <div
                  className={mode === 'preview' ? 'animate-pulse-note note-badge' : 'note-badge'}
                  title="Has secret note!"
                >
                  <MessageCircle size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Wrapper & Gift Tag Layer */}
      <div style={{ position: 'relative', zIndex: 18, marginTop: 'auto' }}>
        {renderWrapper()}

        {/* Gift Tag Badge (Directly clickable to edit in Studio mode) */}
        {(mode === 'studio' || tagTo || tagFrom || tagDistance || tagMessage) && (
          <div
            onClick={mode === 'studio' ? onOpenDedicationModal : undefined}
            className="sketch-box font-handwriting"
            title={mode === 'studio' ? "Click to edit To, From, Distance & Dedication" : undefined}
            style={{
              position: 'absolute',
              bottom: '25px',
              right: '-45px',
              transform: 'rotate(-8deg)',
              background: '#fef3c7',
              color: '#342a22',
              padding: '0.65rem 0.95rem',
              maxWidth: '205px',
              fontSize: '1rem',
              lineHeight: '1.25',
              border: '2px solid var(--border-sketch)',
              boxShadow: mode === 'studio' ? '3px 5px 0px var(--border-sketch)' : '2px 4px 0px var(--border-sketch)',
              zIndex: 22,
              cursor: mode === 'studio' ? 'pointer' : 'default',
              userSelect: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', fontSize: '0.72rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Tag size={12} /> AIRMAIL TAG</span>
              {mode === 'studio' && (
                <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.68rem', fontWeight: 700, background: 'rgba(200,90,84,0.12)', padding: '1px 5px', borderRadius: '4px' }}>
                  <Edit3 size={10} /> Edit
                </span>
              )}
            </div>
            <div><strong>To:</strong> {tagTo || (mode === 'studio' ? <span style={{ opacity: 0.55, fontStyle: 'italic' }}>Click to type</span> : 'My Love')}</div>
            <div><strong>From:</strong> {tagFrom || (mode === 'studio' ? <span style={{ opacity: 0.55, fontStyle: 'italic' }}>Click to type</span> : 'With Love')}</div>
            {(tagDistance || mode === 'studio') && (
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                <Plane size={11} /> {tagDistance || (mode === 'studio' ? <span style={{ opacity: 0.55, fontStyle: 'italic', fontSize: '0.75rem' }}>+ Add distance</span> : 'Miles Apart')}
              </div>
            )}
            {tagMessage && <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '3px', color: '#92400e' }}>"{tagMessage}"</div>}
          </div>
        )}
      </div>

      {/* Selected Flower Quick Controls Toolbar (Studio Mode Only) */}
      {mode === 'studio' && selectedFlower && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            border: '2px solid var(--border-sketch)',
            zIndex: 35
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginRight: '4px' }}>
            Bloom Actions:
          </span>

          <button
            onClick={() => onOpenMessageModal(selectedFlower)}
            className="sketch-button sketch-button-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Edit3 size={14} /> Secret Note
          </button>

          <button
            onClick={() => onUpdateFlower(selectedFlower.id, { rotation: ((selectedFlower.rotation || 0) + 15) % 360 })}
            className="sketch-button"
            title="Rotate flower stem"
            style={{ padding: '0.35rem 0.6rem' }}
          >
            <RotateCw size={14} />
          </button>

          <button
            onClick={() => onUpdateFlower(selectedFlower.id, { scale: Math.min(1.6, (selectedFlower.scale || 1) + 0.1) })}
            className="sketch-button"
            title="Enlarge flower"
            style={{ padding: '0.35rem 0.6rem' }}
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={() => onUpdateFlower(selectedFlower.id, { scale: Math.max(0.6, (selectedFlower.scale || 1) - 0.1) })}
            className="sketch-button"
            title="Shrink flower"
            style={{ padding: '0.35rem 0.6rem' }}
          >
            <ZoomOut size={14} />
          </button>

          <button
            onClick={() => onDeleteFlower(selectedFlower.id)}
            className="sketch-button"
            style={{ padding: '0.35rem 0.6rem', color: '#e11d48' }}
            title="Remove from bouquet"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
