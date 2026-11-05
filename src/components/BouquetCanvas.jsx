import React, { useState, useRef, useEffect } from 'react';
import FlowerSvg, { GreenerySvg } from './FlowerSvg';
import { Trash2, Edit3, RotateCw, ZoomIn, ZoomOut, Sparkles, MessageCircle, Tag, Share2, Plane, Move, Camera, Mic, Film } from 'lucide-react';

export default function BouquetCanvas({
  bouquet,
  mode,
  selectedFlowerId,
  setSelectedFlowerId,
  selectedGreeneryId,
  setSelectedGreeneryId,
  onUpdateFlower,
  onDeleteFlower,
  onUpdateGreenery,
  onDeleteGreenery,
  onOpenMessageModal,
  onFlowerClickRecipient,
  onOpenShare,
  onOpenDedicationModal
}) {
  const {
    flowers = [],
    greenery = [],
    wrapperStyle = 'kraft',
    ribbonColor = '#e11d48',
    tagTo,
    tagFrom,
    tagDistance,
    tagMessage
  } = bouquet;

  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 560, height: 580 });
  const [draggingId, setDraggingId] = useState(null);
  const [draggingType, setDraggingType] = useState(null); // 'flower' | 'greenery'
  const dragRef = useRef(null);

  // Responsive Canvas Size Tracking via ResizeObserver
  useEffect(() => {
    if (!canvasRef.current) return;
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 50) {
          setCanvasSize({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvasRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const isMobile = canvasSize.width < 540;

  // Geometry calculations for wrapper & stem gathering point
  const wrapperWidth = Math.min(240, Math.max(170, canvasSize.width * 0.48));
  const wrapperHeight = isMobile ? 210 : 235;
  const wrapperBottom = isMobile ? 12 : 18;
  const wrapperLeft = (canvasSize.width - wrapperWidth) / 2;
  const wrapperTop = canvasSize.height - wrapperBottom - wrapperHeight;
  const wrapperCenterX = canvasSize.width / 2;
  const stemGatherX = wrapperCenterX;
  const stemGatherY = wrapperTop + (isMobile ? 90 : 105);
  const wrapperRimY = wrapperTop + (isMobile ? 12 : 15);

  const flowersWithNotes = flowers.filter((f) => (f.message && f.message.trim()) || f.mediaImage || f.mediaAudio || f.mediaVideo).length;

  // Drag-and-drop pointer handling with touch support (for flowers & greenery)
  const handlePointerDownItem = (e, item, type) => {
    if (mode !== 'studio') return;
    e.stopPropagation();

    dragRef.current = {
      type,
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: item.position.x,
      origY: item.position.y,
      hasMoved: false
    };

    if (type === 'flower') {
      setSelectedFlowerId(item.id);
      if (setSelectedGreeneryId) setSelectedGreeneryId(null);
    } else {
      if (setSelectedGreeneryId) setSelectedGreeneryId(item.id);
      setSelectedFlowerId(null);
    }

    const onPointerMove = (moveEvent) => {
      if (!dragRef.current || dragRef.current.id !== item.id) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;

      if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 3) {
        dragRef.current.hasMoved = true;
        setDraggingId(item.id);
        setDraggingType(type);
      }

      if (dragRef.current.hasMoved && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const percentDx = (dx / rect.width) * 100;
        const percentDy = (dy / rect.height) * 100;

        const clampedX = Math.round(Math.max(10, Math.min(90, dragRef.current.origX + percentDx)) * 10) / 10;
        const clampedY = Math.round(Math.max(10, Math.min(type === 'greenery' ? 75 : 65, dragRef.current.origY + percentDy)) * 10) / 10;

        if (type === 'flower') {
          onUpdateFlower(item.id, {
            position: { x: clampedX, y: clampedY }
          });
        } else if (onUpdateGreenery) {
          onUpdateGreenery(item.id, {
            position: { x: clampedX, y: clampedY }
          });
        }
      }
    };

    const onPointerUp = () => {
      if (dragRef.current) {
        setDraggingId(null);
        setDraggingType(null);
        dragRef.current = null;
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleFlowerClick = (flower) => {
    if (mode === 'preview') {
      onFlowerClickRecipient(flower);
    } else {
      setSelectedFlowerId(flower.id);
      if (setSelectedGreeneryId) setSelectedGreeneryId(null);
    }
  };

  // Back Wrapper Layer
  const renderBackWrapper = () => {
    switch (wrapperStyle) {
      case 'satin':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path
              d="M 15 25 Q 120 40 225 25 L 175 235 L 65 235 Z"
              fill="#9f1239"
              stroke="var(--border-sketch)"
              strokeWidth="2.5"
            />
            <path
              d="M 40 30 Q 120 45 200 30"
              fill="none"
              stroke="#881337"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
        );

      case 'newsprint':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path
              d="M 10 20 L 230 20 L 180 235 L 60 235 Z"
              fill="#e5dec9"
              stroke="var(--border-sketch)"
              strokeWidth="2.5"
            />
            {[35, 50, 65, 80].map((y, idx) => (
              <line key={idx} x1="30" y1={y} x2="210" y2={y} stroke="rgba(52, 42, 34, 0.25)" strokeWidth="1.5" strokeDasharray="5 3" />
            ))}
          </svg>
        );

      case 'celestial':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path
              d="M 10 20 L 230 20 L 180 235 L 60 235 Z"
              fill="#0f172a"
              stroke="var(--border-sketch)"
              strokeWidth="2.5"
            />
            {[{x: 40, y: 35}, {x: 80, y: 55}, {x: 150, y: 40}, {x: 195, y: 50}].map((pt, idx) => (
              <circle key={idx} cx={pt.x} cy={pt.y} r="2" fill="#fbbf24" opacity="0.85" />
            ))}
          </svg>
        );

      case 'vase':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <ellipse cx="120" cy="30" rx="60" ry="14" fill="rgba(255,255,255,0.4)" stroke="var(--border-sketch)" strokeWidth="2.5" />
            <path d="M 68 70 Q 120 76 172 70 L 162 205 Q 120 214 78 205 Z" fill="rgba(56, 189, 248, 0.15)" />
          </svg>
        );

      case 'kraft':
      default:
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path
              d="M 10 20 L 230 20 L 180 235 L 60 235 Z"
              fill="#c89565"
              stroke="var(--border-sketch)"
              strokeWidth="2.5"
            />
            <line x1="20" y1="28" x2="220" y2="28" stroke="#e11d48" strokeWidth="2" strokeDasharray="8 6" />
            <line x1="20" y1="34" x2="220" y2="34" stroke="#2563eb" strokeWidth="2" strokeDasharray="8 6" />
          </svg>
        );
    }
  };

  // Front Wrapper Layer
  const renderFrontWrapper = () => {
    switch (wrapperStyle) {
      case 'satin':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path d="M 25 25 L 215 25 L 175 235 L 65 235 Z" fill="#e11d48" stroke="var(--border-sketch)" strokeWidth="2.5" />
            <path d="M 25 25 L 120 235 L 65 235 Z" fill="#be123c" stroke="var(--border-sketch)" strokeWidth="1.8" />
            <path d="M 120 235 L 215 25 L 175 235 Z" fill="#f43f5e" stroke="var(--border-sketch)" strokeWidth="1.8" />
            <path d="M 60 25 L 120 160 L 180 25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <circle cx="120" cy="115" r="16" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 120 115 Q 75 85 55 115 Q 75 135 120 115" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 120 115 Q 165 85 185 115 Q 165 135 120 115" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 115 130 Q 95 180 85 220" fill="none" stroke={ribbonColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 125 130 Q 145 180 155 220" fill="none" stroke={ribbonColor} strokeWidth="6" strokeLinecap="round" />
          </svg>
        );

      case 'newsprint':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path d="M 20 25 L 220 25 L 180 235 L 60 235 Z" fill="#f5f0e6" stroke="var(--border-sketch)" strokeWidth="2.5" />
            <path d="M 20 25 L 120 235" fill="none" stroke="var(--border-sketch)" strokeWidth="1.8" />
            <path d="M 220 25 L 120 235" fill="none" stroke="var(--border-sketch)" strokeWidth="1.8" />
            {[45, 65, 85, 145, 165, 185].map((y, idx) => (
              <line key={idx} x1="50" y1={y} x2="190" y2={y} stroke="rgba(52, 42, 34, 0.3)" strokeWidth="2" strokeDasharray="6 4" />
            ))}
            <circle cx="120" cy="125" r="24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" />
            <text x="120" y="130" textAnchor="middle" fill="var(--primary)" fontSize="9" fontWeight="700" fontFamily="var(--font-heading)">AIRMAIL 1924</text>
            <circle cx="120" cy="115" r="9" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 120 115 Q 85 95 75 115 Q 95 130 120 115" fill="none" stroke={ribbonColor} strokeWidth="3.5" />
            <path d="M 120 115 Q 155 95 165 115 Q 145 130 120 115" fill="none" stroke={ribbonColor} strokeWidth="3.5" />
            <path d="M 115 125 Q 95 170 85 200" fill="none" stroke={ribbonColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M 125 125 Q 145 170 155 200" fill="none" stroke={ribbonColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'celestial':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path d="M 20 25 L 220 25 L 180 235 L 60 235 Z" fill="#1e1b4b" stroke="var(--border-sketch)" strokeWidth="2.5" />
            <path d="M 20 25 L 120 235" fill="none" stroke="#312e81" strokeWidth="2" />
            <path d="M 220 25 L 120 235" fill="none" stroke="#312e81" strokeWidth="2" />
            {[{x: 65, y: 65}, {x: 155, y: 75}, {x: 95, y: 145}, {x: 165, y: 155}].map((pt, idx) => (
              <path key={idx} d={`M ${pt.x} ${pt.y - 7} L ${pt.x + 2} ${pt.y - 2} L ${pt.x + 7} ${pt.y} L ${pt.x + 2} ${pt.y + 2} L ${pt.x} ${pt.y + 7} L ${pt.x - 2} ${pt.y + 2} L ${pt.x - 7} ${pt.y} L ${pt.x - 2} ${pt.y - 2} Z`} fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            ))}
            <circle cx="120" cy="115" r="14" fill="#fbbf24" stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 120 115 Q 75 85 55 115 Q 75 135 120 115" fill="#fbbf24" stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 120 115 Q 165 85 185 115 Q 165 135 120 115" fill="#fbbf24" stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 115 125 Q 95 175 85 210" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <path d="M 125 125 Q 145 175 155 210" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'vase':
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path d="M 68 70 Q 120 76 172 70 L 162 205 Q 120 214 78 205 Z" fill="rgba(56, 189, 248, 0.25)" />
            <path d="M 68 70 Q 120 78 172 70" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="5 2" />
            <path
              d="M 60 30 C 50 100, 65 190, 75 210 Q 120 220 165 210 C 175 190, 190 100, 180 30"
              fill="rgba(255,255,255,0.22)"
              stroke="var(--border-sketch)"
              strokeWidth="2.5"
            />
            <ellipse cx="120" cy="30" rx="60" ry="14" fill="none" stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 85 50 Q 80 130 90 190" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'kraft':
      default:
        return (
          <svg width={wrapperWidth} height={wrapperHeight} viewBox="0 0 240 240" className="hand-drawn-svg">
            <path d="M 15 25 L 225 25 L 180 235 L 60 235 Z" fill="#d4a373" stroke="var(--border-sketch)" strokeWidth="2.5" />
            <path d="M 15 25 L 120 235 L 60 235 Z" fill="#bc8a5f" stroke="var(--border-sketch)" strokeWidth="1.8" />
            <path d="M 225 25 L 120 235 L 180 235 Z" fill="#c89565" stroke="var(--border-sketch)" strokeWidth="1.8" />
            <path d="M 60 235 L 120 25 L 180 235" fill="rgba(0,0,0,0.05)" stroke="var(--border-sketch)" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="120" cy="115" r="13" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 120 115 Q 70 85 52 115 Q 72 140 120 115" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 120 115 Q 170 85 188 115 Q 168 140 120 115" fill={ribbonColor} stroke="var(--border-sketch)" strokeWidth="2" />
            <path d="M 112 128 Q 95 175 85 210" fill="none" stroke={ribbonColor} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 128 128 Q 145 175 155 210" fill="none" stroke={ribbonColor} strokeWidth="5.5" strokeLinecap="round" />
          </svg>
        );
    }
  };

  const selectedFlower = flowers.find((f) => f.id === selectedFlowerId);
  const selectedGreenery = (greenery || []).find((g) => g.id === selectedGreeneryId);

  return (
    <div
      ref={canvasRef}
      className="sketch-box"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        minHeight: isMobile ? '460px' : '560px',
        height: isMobile ? '510px' : '590px',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* Studio Header Bar & Guidelines */}
      {mode === 'studio' && (
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.4rem',
            zIndex: 30,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-secondary)',
              padding: '5px 10px',
              borderRadius: '20px',
              border: '1px solid var(--bg-card-border)',
              pointerEvents: 'auto',
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            <Sparkles size={13} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>
              {flowers.length} Bloom{flowers.length === 1 ? '' : 's'}
            </span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Move size={11} /> Drag to place
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', pointerEvents: 'auto' }}>
            {onOpenDedicationModal && (
              <button
                type="button"
                onClick={onOpenDedicationModal}
                className="sketch-button"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.4rem 0.75rem',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Edit To, From, Distance & Dedication note"
              >
                <Tag size={12} color="var(--primary)" /> Edit Tag
              </button>
            )}

            {flowers.length > 0 && onOpenShare && (
              <button
                type="button"
                onClick={onOpenShare}
                className="sketch-button sketch-button-primary"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.85rem',
                  boxShadow: '0 3px 10px rgba(200,90,84,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Share2 size={13} /> Share 💌
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recipient Delivery Banner */}
      {mode === 'preview' && (
        <div
          className="animate-bounce-gentle"
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            maxWidth: '520px',
            margin: '0 auto',
            textAlign: 'center',
            background: 'var(--primary-light)',
            padding: '0.65rem 1rem',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            border: '2px solid var(--border-sketch)',
            boxShadow: 'var(--shadow-soft)',
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem' }}>
            <span>✈️ Airmail Bouquet Delivery Across The Miles</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '2px', fontWeight: 500 }}>
            {tagFrom && tagTo ? (
              <span>From <strong>{tagFrom}</strong> to <strong>{tagTo}</strong> {tagDistance ? `(${tagDistance})` : ''}</span>
            ) : (
              <span>Handcrafted with secret notes hidden inside blossoms</span>
            )}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--primary)', marginTop: '2px', fontStyle: 'italic', fontWeight: 600 }}>
            ✨ Tap any blossom to uncover its secret love note!
          </div>
        </div>
      )}

      {/* Empty State */}
      {flowers.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            maxWidth: '280px',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 0.75rem auto',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '2px dashed var(--border-sketch)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}
          >
            <Sparkles size={28} />
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.05rem', marginBottom: '3px' }}>Your Bouquet is Empty</h3>
          <p style={{ fontSize: '0.82rem' }}>Tap "Pick Blooms" to add flowers and drag them into your bespoke arrangement!</p>
        </div>
      )}

      {/* LAYER 1: Back Wrapper Paper */}
      <div
        style={{
          position: 'absolute',
          left: `${wrapperLeft}px`,
          top: `${wrapperTop}px`,
          width: `${wrapperWidth}px`,
          height: `${wrapperHeight}px`,
          zIndex: 4,
          pointerEvents: 'none'
        }}
      >
        {renderBackWrapper()}
      </div>

      {/* LAYER 2: Moveable Foliage Greenery Fillers */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 7,
          pointerEvents: 'none'
        }}
      >
        {(greenery || []).map((green) => {
          const isSelected = selectedGreeneryId === green.id;
          const isDragging = draggingId === green.id && draggingType === 'greenery';
          const stemHeight = isMobile ? 125 : 150;

          return (
            <div
              key={green.id}
              onPointerDown={(e) => handlePointerDownItem(e, green, 'greenery')}
              onClick={(e) => {
                e.stopPropagation();
                if (mode === 'studio') {
                  if (setSelectedGreeneryId) setSelectedGreeneryId(green.id);
                  setSelectedFlowerId(null);
                }
              }}
              style={{
                position: 'absolute',
                left: `${green.position.x}%`,
                top: `${green.position.y}%`,
                width: '65px',
                height: `${stemHeight}px`,
                transform: `translate(-50%, -85%) rotate(${green.rotation || 0}deg) scale(${
                  isDragging ? (green.scale || 1) * 1.08 : isSelected ? (green.scale || 1) * 1.04 : (green.scale || 1)
                })`,
                transformOrigin: '50% 85%',
                cursor: mode === 'studio' ? (isDragging ? 'grabbing' : 'grab') : 'default',
                pointerEvents: mode === 'studio' ? 'auto' : 'none',
                touchAction: 'none',
                zIndex: isDragging ? 36 : isSelected ? 30 : 7,
                transition: isDragging ? 'none' : 'transform 0.12s ease, filter 0.15s ease',
                filter: isDragging
                  ? 'drop-shadow(0 12px 20px rgba(0,0,0,0.22))'
                  : isSelected
                  ? 'drop-shadow(0 0 12px rgba(45,106,79,0.85))'
                  : 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))'
              }}
            >
              <GreenerySvg type={green.type} color={green.color} height={stemHeight} />

              {/* Selection Border on Greenery */}
              {mode === 'studio' && isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '16px',
                    border: '2px dashed #2d6a4f',
                    pointerEvents: 'none',
                    opacity: 0.9
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* LAYER 3: Stems SVG Layer */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 8,
          overflow: 'visible'
        }}
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
      >
        <defs>
          <filter id="stem-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="rgba(0,0,0,0.15)" />
          </filter>
        </defs>

        {flowers.map((flower) => {
          const fx = (flower.position.x / 100) * canvasSize.width;
          const fy = (flower.position.y / 100) * canvasSize.height;

          const stemStartX = fx;
          const stemStartY = fy + (flower.scale || 1) * (isMobile ? 22 : 26);

          const spreadOffset = ((flower.position.x - 50) / 50) * (isMobile ? 16 : 22);
          const stemEndX = stemGatherX + spreadOffset;
          const stemEndY = stemGatherY + (wrapperStyle === 'vase' ? (isMobile ? 32 : 42) : 0);

          const cp1X = stemStartX + (stemEndX - stemStartX) * 0.15;
          const cp1Y = stemStartY + (stemEndY - stemStartY) * 0.45;
          const cp2X = stemEndX + (stemStartX - stemEndX) * 0.12;
          const cp2Y = stemEndY - (stemEndY - stemStartY) * 0.25;

          const t = 0.42;
          const leafX = (1 - t) * (1 - t) * (1 - t) * stemStartX + 3 * (1 - t) * (1 - t) * t * cp1X + 3 * (1 - t) * t * t * cp2X + t * t * t * stemEndX;
          const leafY = (1 - t) * (1 - t) * (1 - t) * stemStartY + 3 * (1 - t) * (1 - t) * t * cp1Y + 3 * (1 - t) * t * t * cp2Y + t * t * t * stemEndY;
          const isLeft = flower.position.x < 50;
          const leafAngle = isLeft ? -35 : 35;

          const isSelected = selectedFlowerId === flower.id;
          const isDragging = draggingFlowerId === flower.id;

          return (
            <g key={`stem-group-${flower.id}`}>
              <path
                d={`M ${stemStartX} ${stemStartY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${stemEndX} ${stemEndY}`}
                fill="none"
                stroke={isSelected || isDragging ? 'var(--primary)' : '#4d7c0f'}
                strokeWidth={Math.max(2.8, (flower.scale || 1) * (isMobile ? 3.2 : 3.8))}
                strokeLinecap="round"
                filter="url(#stem-shadow)"
              />

              <path
                d={`M ${stemStartX} ${stemStartY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${stemEndX} ${stemEndY}`}
                fill="none"
                stroke={isSelected || isDragging ? '#fca5a5' : '#84cc16'}
                strokeWidth={Math.max(1, (flower.scale || 1) * 1.4)}
                strokeLinecap="round"
                opacity="0.75"
              />

              <g transform={`translate(${leafX}, ${leafY}) rotate(${leafAngle})`}>
                <ellipse
                  cx={isLeft ? -8 : 8}
                  cy="0"
                  rx={isMobile ? 8 : 10}
                  ry={isMobile ? 4 : 5}
                  fill="#4d7c0f"
                  stroke="var(--border-sketch)"
                  strokeWidth="1.3"
                />
              </g>

              <g transform={`translate(${stemStartX}, ${stemStartY - 2})`}>
                <path
                  d="M -7 0 Q 0 7 7 0 Q 0 3 -7 0 Z"
                  fill="#3f6212"
                  stroke="var(--border-sketch)"
                  strokeWidth="1.3"
                />
              </g>
            </g>
          );
        })}
      </svg>

      {/* LAYER 4: Draggable Flower Blooms */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 14,
          pointerEvents: 'none'
        }}
      >
        {flowers.map((flower) => {
          const isSelected = selectedFlowerId === flower.id;
          const isDragging = draggingId === flower.id && draggingType === 'flower';
          const hasMessage = Boolean(flower.message && flower.message.trim());
          const hasImage = Boolean(flower.mediaImage);
          const hasAudio = Boolean(flower.mediaAudio);
          const hasVideo = Boolean(flower.mediaVideo);
          const hasAnyAttachment = hasMessage || hasImage || hasAudio || hasVideo;
          const bloomSize = isMobile ? 95 : 110;

          return (
            <div
              key={flower.id}
              onPointerDown={(e) => handlePointerDownItem(e, flower, 'flower')}
              onClick={(e) => {
                e.stopPropagation();
                handleFlowerClick(flower);
              }}
              style={{
                position: 'absolute',
                left: `${flower.position.x}%`,
                top: `${flower.position.y}%`,
                width: `${bloomSize}px`,
                height: `${bloomSize}px`,
                transform: `translate(-50%, -50%) rotate(${flower.rotation || 0}deg) scale(${isDragging ? (flower.scale || 1) * 1.08 : isSelected ? (flower.scale || 1) * 1.04 : (flower.scale || 1)})`,
                cursor: mode === 'studio' ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                pointerEvents: 'auto',
                touchAction: 'none',
                transition: isDragging ? 'none' : 'transform 0.12s ease, filter 0.15s ease',
                zIndex: isDragging ? 35 : isSelected ? 28 : 15,
                filter: isDragging
                  ? 'drop-shadow(0 14px 24px rgba(0,0,0,0.22))'
                  : isSelected
                  ? 'drop-shadow(0 0 14px rgba(200,90,84,0.75))'
                  : 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))'
              }}
            >
              <FlowerSvg type={flower.type} color={flower.color} size={bloomSize} />

              {/* Move Indicator Grip Ring */}
              {mode === 'studio' && isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-6px',
                    borderRadius: '50%',
                    border: '2px dashed var(--primary)',
                    pointerEvents: 'none',
                    opacity: 0.85,
                    animation: 'spin 18s linear infinite'
                  }}
                />
              )}

              {/* Message & Media Indicator Badge */}
              {hasAnyAttachment && (
                <div
                  className={mode === 'preview' ? 'animate-pulse-note note-badge' : 'note-badge'}
                  title={
                    hasImage || hasAudio || hasVideo
                      ? 'Has attached photo, audio, or video note!'
                      : 'Has secret love letter!'
                  }
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: hasImage || hasAudio || hasVideo ? '2px 6px' : '0',
                    width: hasImage || hasAudio || hasVideo ? 'auto' : isMobile ? '22px' : '26px',
                    height: isMobile ? '22px' : '26px',
                    borderRadius: '14px',
                    zIndex: 10
                  }}
                >
                  {hasAudio ? (
                    <Mic size={isMobile ? 11 : 13} />
                  ) : hasImage ? (
                    <Camera size={isMobile ? 11 : 13} />
                  ) : hasVideo ? (
                    <Film size={isMobile ? 11 : 13} />
                  ) : (
                    <MessageCircle size={isMobile ? 11 : 13} />
                  )}
                  {(hasImage && hasAudio) || (hasImage && hasVideo) || (hasAudio && hasVideo) ? (
                    <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>+</span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* LAYER 5: Front Wrapper Cone / Cuff & Ribbon */}
      <div
        style={{
          position: 'absolute',
          left: `${wrapperLeft}px`,
          top: `${wrapperTop}px`,
          width: `${wrapperWidth}px`,
          height: `${wrapperHeight}px`,
          zIndex: 20,
          pointerEvents: 'none'
        }}
      >
        {renderFrontWrapper()}
      </div>

      {/* LAYER 6: Gift Tag Badge */}
      {(mode === 'studio' || tagTo || tagFrom || tagDistance || tagMessage) && (
        <div
          onClick={mode === 'studio' ? onOpenDedicationModal : undefined}
          className="sketch-box font-handwriting"
          title={mode === 'studio' ? "Click to edit To, From, Distance & Dedication" : undefined}
          style={{
            position: 'absolute',
            left: `${wrapperLeft + wrapperWidth - (isMobile ? 55 : 65)}px`,
            top: `${wrapperTop + (isMobile ? 75 : 95)}px`,
            transform: 'rotate(-7deg)',
            background: '#fef3c7',
            color: '#342a22',
            padding: isMobile ? '0.5rem 0.7rem' : '0.65rem 0.95rem',
            maxWidth: isMobile ? '160px' : '205px',
            fontSize: isMobile ? '0.86rem' : '1rem',
            lineHeight: '1.25',
            border: '2px solid var(--border-sketch)',
            boxShadow: mode === 'studio' ? '2px 4px 0px var(--border-sketch)' : '2px 3px 0px var(--border-sketch)',
            zIndex: 25,
            cursor: mode === 'studio' ? 'pointer' : 'default',
            userSelect: 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Tag size={11} /> AIRMAIL TAG</span>
            {mode === 'studio' && (
              <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(200,90,84,0.12)', padding: '1px 4px', borderRadius: '4px' }}>
                <Edit3 size={9} /> Edit
              </span>
            )}
          </div>
          <div><strong>To:</strong> {tagTo || (mode === 'studio' ? <span style={{ opacity: 0.55, fontStyle: 'italic' }}>Click to type</span> : 'My Love')}</div>
          <div><strong>From:</strong> {tagFrom || (mode === 'studio' ? <span style={{ opacity: 0.55, fontStyle: 'italic' }}>Click to type</span> : 'With Love')}</div>
          {(tagDistance || mode === 'studio') && (
            <div style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
              <Plane size={10} /> {tagDistance || (mode === 'studio' ? <span style={{ opacity: 0.55, fontStyle: 'italic', fontSize: '0.72rem' }}>+ Add distance</span> : 'Miles Apart')}
            </div>
          )}
          {tagMessage && <div style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '2px', color: '#92400e' }}>"{tagMessage}"</div>}
        </div>
      )}

      {/* Selected Flower Quick Controls Toolbar */}
      {mode === 'studio' && selectedFlower && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.35rem' : '0.5rem',
            padding: isMobile ? '0.35rem 0.65rem' : '0.45rem 0.9rem',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            border: '2px solid var(--border-sketch)',
            zIndex: 38,
            boxShadow: 'var(--shadow-sketch)',
            maxWidth: '96%',
            overflowX: 'auto'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginRight: '2px', whiteSpace: 'nowrap' }}>
            Bloom:
          </span>

          <button
            type="button"
            onClick={() => onOpenMessageModal(selectedFlower)}
            className="sketch-button sketch-button-primary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
          >
            <Edit3 size={13} /> Note & Media
          </button>

          <button
            type="button"
            onClick={() => onUpdateFlower(selectedFlower.id, { rotation: ((selectedFlower.rotation || 0) + 15) % 360 })}
            className="sketch-button"
            title="Rotate flower stem"
            style={{ padding: '0.3rem 0.55rem' }}
          >
            <RotateCw size={13} />
          </button>

          <button
            type="button"
            onClick={() => onUpdateFlower(selectedFlower.id, { scale: Math.min(1.6, (selectedFlower.scale || 1) + 0.1) })}
            className="sketch-button"
            title="Enlarge flower"
            style={{ padding: '0.3rem 0.55rem' }}
          >
            <ZoomIn size={13} />
          </button>

          <button
            type="button"
            onClick={() => onUpdateFlower(selectedFlower.id, { scale: Math.max(0.6, (selectedFlower.scale || 1) - 0.1) })}
            className="sketch-button"
            title="Shrink flower"
            style={{ padding: '0.3rem 0.55rem' }}
          >
            <ZoomOut size={13} />
          </button>

          <button
            type="button"
            onClick={() => onDeleteFlower(selectedFlower.id)}
            className="sketch-button"
            style={{ padding: '0.3rem 0.55rem', color: '#e11d48' }}
            title="Remove from bouquet"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {/* Selected Greenery Quick Controls Toolbar (Pure Design: Rotate, Scale, Delete) */}
      {mode === 'studio' && selectedGreenery && !selectedFlower && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.35rem' : '0.5rem',
            padding: isMobile ? '0.35rem 0.65rem' : '0.45rem 0.9rem',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            border: '2px solid var(--border-sketch)',
            zIndex: 38,
            boxShadow: 'var(--shadow-sketch)',
            maxWidth: '96%',
            overflowX: 'auto'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2d6a4f', marginRight: '2px', whiteSpace: 'nowrap' }}>
            🌿 Foliage:
          </span>

          <button
            type="button"
            onClick={() => onUpdateGreenery(selectedGreenery.id, { rotation: ((selectedGreenery.rotation || 0) + 15) % 360 })}
            className="sketch-button"
            title="Rotate greenery stem"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
          >
            <RotateCw size={13} /> Rotate
          </button>

          <button
            type="button"
            onClick={() => onUpdateGreenery(selectedGreenery.id, { scale: Math.min(1.8, (selectedGreenery.scale || 1) + 0.1) })}
            className="sketch-button"
            title="Enlarge greenery"
            style={{ padding: '0.3rem 0.55rem' }}
          >
            <ZoomIn size={13} />
          </button>

          <button
            type="button"
            onClick={() => onUpdateGreenery(selectedGreenery.id, { scale: Math.max(0.6, (selectedGreenery.scale || 1) - 0.1) })}
            className="sketch-button"
            title="Shrink greenery"
            style={{ padding: '0.3rem 0.55rem' }}
          >
            <ZoomOut size={13} />
          </button>

          <button
            type="button"
            onClick={() => onDeleteGreenery(selectedGreenery.id)}
            className="sketch-button"
            style={{ padding: '0.3rem 0.55rem', color: '#e11d48' }}
            title="Remove foliage stem"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
