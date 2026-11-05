import React from 'react';

/**
 * Hand-drawn Vector SVGs for Flowers & Greenery
 * Features sketch stroke overlays, organic curves, and customizable color tinting.
 */
export const FLOWER_TYPES = [
  { id: 'rose', name: 'Rose', defaultColor: '#e11d48', desc: 'Symbol of love & passion' },
  { id: 'tulip', name: 'Tulip', defaultColor: '#fb7185', desc: 'Symbol of perfect affection' },
  { id: 'sunflower', name: 'Sunflower', defaultColor: '#f59e0b', desc: 'Symbol of warmth & endless joy' },
  { id: 'daisy', name: 'Daisy', defaultColor: '#ffffff', desc: 'Symbol of cheerful memories & sweetness' },
  { id: 'lavender', name: 'Lavender', defaultColor: '#8b5cf6', desc: 'Symbol of devotion, serenity & calm' },
  { id: 'peony', name: 'Peony', defaultColor: '#f472b6', desc: 'Symbol of romance & beauty' },
  { id: 'lily', name: 'Lily', defaultColor: '#fde047', desc: 'Symbol of pure devotion & elegance' },
  { id: 'cherry', name: 'Cherry Blossom', defaultColor: '#fbcfe8', desc: 'Symbol of precious love & tender moments' },
  { id: 'hydrangea', name: 'Hydrangea', defaultColor: '#38bdf8', desc: 'Symbol of heartfelt understanding' },
  { id: 'wildflower', name: 'Bluebell', defaultColor: '#6366f1', desc: 'Symbol of everlasting love across distance' }
];

export default function FlowerSvg({ type, color = '#e11d48', size = 120, className = '' }) {
  const strokeColor = 'var(--border-sketch)';

  const renderFlowerContent = () => {
    switch (type) {
      case 'rose':
        return (
          <g>
            {/* Outer Petals */}
            <path
              d="M 50 25 C 20 15, 10 45, 30 65 C 10 80, 40 100, 50 95 C 60 100, 90 80, 70 65 C 90 45, 80 15, 50 25 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Inner Spiral Petals */}
            <path
              d="M 50 35 C 35 30, 25 50, 40 65 C 30 75, 55 85, 62 70 C 75 55, 65 35, 50 35 Z"
              fill="rgba(0,0,0,0.12)"
              stroke={strokeColor}
              strokeWidth="2"
            />
            <path
              d="M 50 42 C 42 38, 38 48, 45 56 C 40 62, 54 68, 58 58 C 64 48, 56 40, 50 42 Z"
              fill="rgba(255,255,255,0.25)"
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* Rose Core Spiral Sketch */}
            <path
              d="M 47 48 Q 50 44 53 48 Q 55 52 49 53 Q 45 50 48 46"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        );

      case 'tulip':
        return (
          <g>
            {/* Left Petal */}
            <path
              d="M 50 85 C 25 80, 15 50, 22 25 C 32 30, 42 45, 50 85 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Right Petal */}
            <path
              d="M 50 85 C 75 80, 85 50, 78 25 C 68 30, 58 45, 50 85 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Center Main Cup */}
            <path
              d="M 30 35 C 40 18, 60 18, 70 35 C 78 60, 65 85, 50 90 C 35 85, 22 60, 30 35 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Center Petal highlight */}
            <path
              d="M 42 32 C 48 22, 52 22, 58 32 C 60 55, 50 82, 50 82 C 50 82, 40 55, 42 32 Z"
              fill="rgba(255,255,255,0.22)"
              stroke={strokeColor}
              strokeWidth="1.8"
            />
          </g>
        );

      case 'sunflower':
        return (
          <g>
            {/* Petal Ring */}
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (i * 360) / 14;
              return (
                <path
                  key={i}
                  d="M 50 50 C 44 25, 48 5, 50 5 C 52 5, 56 25, 50 50 Z"
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth="1.8"
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
            {/* Center Seed Disc */}
            <circle cx="50" cy="50" r="22" fill="#4a2e16" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="16" fill="#36200d" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="8" fill="#5c3a1e" stroke={strokeColor} strokeWidth="1.2" />
          </g>
        );

      case 'daisy':
        return (
          <g>
            {/* White/Pastel Petals */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              return (
                <path
                  key={i}
                  d="M 50 50 C 43 28, 47 10, 50 10 C 53 10, 57 28, 50 50 Z"
                  fill={color === '#ffffff' ? '#fcfbf7' : color}
                  stroke={strokeColor}
                  strokeWidth="2"
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
            {/* Bright Yellow Core */}
            <circle cx="50" cy="50" r="16" fill="#fbbf24" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="10" fill="#f59e0b" stroke={strokeColor} strokeWidth="1.5" />
          </g>
        );

      case 'lavender':
        return (
          <g>
            {/* Slender Stem */}
            <path d="M 50 95 Q 49 50 50 10" fill="none" stroke="#4d7c0f" strokeWidth="3" />
            {/* Stacked Blossom Clusters */}
            {[
              { y: 20, r: 10 },
              { y: 32, r: 12 },
              { y: 44, r: 13 },
              { y: 56, r: 14 },
              { y: 68, r: 12 },
              { y: 80, r: 9 }
            ].map((node, idx) => (
              <g key={idx}>
                <ellipse cx="43" cy={node.y} rx={node.r} ry={node.r * 0.6} fill={color} stroke={strokeColor} strokeWidth="1.8" transform={`rotate(-15 43 ${node.y})`} />
                <ellipse cx="57" cy={node.y} rx={node.r} ry={node.r * 0.6} fill={color} stroke={strokeColor} strokeWidth="1.8" transform={`rotate(15 57 ${node.y})`} />
                <ellipse cx="50" cy={node.y - 4} rx={node.r * 0.8} ry={node.r * 0.5} fill="rgba(255,255,255,0.3)" stroke={strokeColor} strokeWidth="1.5" />
              </g>
            ))}
          </g>
        );

      case 'peony':
        return (
          <g>
            {/* Ruffled Peony Layers */}
            <circle cx="50" cy="50" r="42" fill={color} stroke={strokeColor} strokeWidth="2.5" />
            <path d="M 15 50 C 20 20, 80 20, 85 50 C 80 80, 20 80, 15 50 Z" fill="rgba(0,0,0,0.06)" stroke={strokeColor} strokeWidth="2" />
            <path d="M 22 45 C 30 25, 70 25, 78 45 C 70 68, 30 68, 22 45 Z" fill="rgba(255,255,255,0.2)" stroke={strokeColor} strokeWidth="2" />
            <path d="M 30 42 C 38 30, 62 30, 70 42 C 62 58, 38 58, 30 42 Z" fill={color} stroke={strokeColor} strokeWidth="1.8" />
            {/* Inner Ruffles */}
            <path d="M 38 48 Q 50 38 62 48 Q 50 58 38 48 Z" fill="#fef08a" stroke={strokeColor} strokeWidth="1.5" />
          </g>
        );

      case 'lily':
        return (
          <g>
            {/* Trumpet Petals */}
            <path d="M 50 50 L 50 5 C 35 15, 30 35, 50 50 Z" fill={color} stroke={strokeColor} strokeWidth="2" />
            <path d="M 50 50 L 85 20 C 75 35, 60 45, 50 50 Z" fill={color} stroke={strokeColor} strokeWidth="2" />
            <path d="M 50 50 L 95 55 C 80 65, 60 60, 50 50 Z" fill={color} stroke={strokeColor} strokeWidth="2" />
            <path d="M 50 50 L 60 90 C 45 80, 40 65, 50 50 Z" fill={color} stroke={strokeColor} strokeWidth="2" />
            <path d="M 50 50 L 15 80 C 15 60, 30 55, 50 50 Z" fill={color} stroke={strokeColor} strokeWidth="2" />
            <path d="M 50 50 L 10 30 C 25 25, 40 38, 50 50 Z" fill={color} stroke={strokeColor} strokeWidth="2" />
            {/* Stamens */}
            <path d="M 50 50 Q 40 30 35 25" stroke={strokeColor} strokeWidth="2" fill="none" />
            <circle cx="35" cy="25" r="3" fill="#b45309" />
            <path d="M 50 50 Q 55 25 60 20" stroke={strokeColor} strokeWidth="2" fill="none" />
            <circle cx="60" cy="20" r="3" fill="#b45309" />
            <path d="M 50 50 Q 50 20 48 15" stroke={strokeColor} strokeWidth="2" fill="none" />
            <circle cx="48" cy="15" r="3" fill="#b45309" />
          </g>
        );

      case 'cherry':
        return (
          <g>
            {/* 5 Notched Petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 50 50)`}>
                <path
                  d="M 50 50 C 35 30, 38 12, 46 10 C 50 14, 50 14, 54 10 C 62 12, 65 30, 50 50 Z"
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
              </g>
            ))}
            {/* Center Filament Pistils */}
            <circle cx="50" cy="50" r="7" fill="#f43f5e" stroke={strokeColor} strokeWidth="1.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, j) => (
              <line
                key={j}
                x1="50"
                y1="50"
                x2={50 + 12 * Math.cos((ang * Math.PI) / 180)}
                y2={50 + 12 * Math.sin((ang * Math.PI) / 180)}
                stroke="#fbbf24"
                strokeWidth="1.8"
              />
            ))}
          </g>
        );

      case 'hydrangea':
        return (
          <g>
            {/* Main Pom-Pom Background */}
            <circle cx="50" cy="50" r="42" fill={color} stroke={strokeColor} strokeWidth="2" />
            {/* Cluster of 4-Petal Florets */}
            {[
              { x: 35, y: 35 }, { x: 65, y: 35 }, { x: 50, y: 50 },
              { x: 30, y: 60 }, { x: 70, y: 60 }, { x: 50, y: 25 }, { x: 50, y: 72 }
            ].map((floret, k) => (
              <g key={k} transform={`translate(${floret.x - 50}, ${floret.y - 50})`}>
                <circle cx="50" cy="44" r="5" fill="rgba(255,255,255,0.7)" stroke={strokeColor} strokeWidth="1.2" />
                <circle cx="56" cy="50" r="5" fill="rgba(255,255,255,0.7)" stroke={strokeColor} strokeWidth="1.2" />
                <circle cx="50" cy="56" r="5" fill="rgba(255,255,255,0.7)" stroke={strokeColor} strokeWidth="1.2" />
                <circle cx="44" cy="50" r="5" fill="rgba(255,255,255,0.7)" stroke={strokeColor} strokeWidth="1.2" />
                <circle cx="50" cy="50" r="2" fill="#fbbf24" />
              </g>
            ))}
          </g>
        );

      case 'wildflower':
      default:
        return (
          <g>
            {/* Bell-shaped Wildflower */}
            <path
              d="M 50 15 C 30 20, 20 50, 25 80 Q 38 85 50 75 Q 62 85 75 80 C 80 50, 70 20, 50 15 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Bell Scalloped Edges */}
            <path
              d="M 25 80 Q 35 90 45 78 Q 50 88 55 78 Q 65 90 75 80"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
            />
            <path
              d="M 40 25 C 45 40, 45 60, 48 72"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
          </g>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`hand-drawn-svg ${className}`}
      style={{ overflow: 'visible' }}
    >
      {renderFlowerContent()}
    </svg>
  );
}

export const GREENERY_TYPES = [
  { id: 'eucalyptus', name: 'Eucalyptus', defaultColor: '#3f6212', desc: 'Silvery-green rounded leaves on arching stem' },
  { id: 'babysbreath', name: "Baby's Breath", defaultColor: '#65a30d', desc: 'Cloud of delicate tiny white blossom puffs' },
  { id: 'fern', name: 'Forest Fern', defaultColor: '#2d6a4f', desc: 'Lush feathered woodland fronds' },
  { id: 'olive', name: 'Olive Branch', defaultColor: '#4f772d', desc: 'Slender peaceful silver-green leaves' },
  { id: 'ruscus', name: 'Italian Ruscus', defaultColor: '#1b4332', desc: 'Glossy tapered deep garden foliage' }
];

/**
 * Stem & Filler Greenery Component
 */
export function GreenerySvg({ type = 'eucalyptus', color = '#4d7c0f', height = 150, className = '' }) {
  const strokeColor = 'var(--border-sketch)';

  if (type === 'babysbreath') {
    return (
      <svg width="60" height={height} viewBox="0 0 60 150" className={`hand-drawn-svg ${className}`}>
        <path d="M 30 150 Q 28 80 30 10" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 30 110 Q 18 90 12 75" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 30 85 Q 42 68 48 52" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 30 55 Q 20 38 15 25" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 30 35 Q 38 22 42 12" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        
        {/* Tiny White Puffs */}
        {[
          {x: 12, y: 75}, {x: 6, y: 70}, {x: 48, y: 52}, {x: 54, y: 46},
          {x: 15, y: 25}, {x: 8, y: 22}, {x: 30, y: 8}, {x: 42, y: 12},
          {x: 24, y: 45}, {x: 36, y: 35}
        ].map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={i % 3 === 0 ? 5.5 : 4} fill="#ffffff" stroke={strokeColor} strokeWidth="1.2" />
        ))}
      </svg>
    );
  }

  if (type === 'fern') {
    return (
      <svg width="65" height={height} viewBox="0 0 65 150" className={`hand-drawn-svg ${className}`}>
        <path d="M 32 150 Q 30 75 32 5" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        {[
          { y: 130, len: 18 },
          { y: 110, len: 22 },
          { y: 90, len: 24 },
          { y: 70, len: 22 },
          { y: 50, len: 19 },
          { y: 32, len: 15 },
          { y: 16, len: 10 }
        ].map((frond, i) => (
          <g key={i}>
            {/* Left frond */}
            <path
              d={`M 32 ${frond.y} Q ${32 - frond.len * 0.6} ${frond.y - 8} ${32 - frond.len} ${frond.y - 4} Q ${32 - frond.len * 0.5} ${frond.y + 2} 32 ${frond.y}`}
              fill={color}
              stroke={strokeColor}
              strokeWidth="1.4"
            />
            {/* Right frond */}
            <path
              d={`M 32 ${frond.y} Q ${32 + frond.len * 0.6} ${frond.y - 8} ${32 + frond.len} ${frond.y - 4} Q ${32 + frond.len * 0.5} ${frond.y + 2} 32 ${frond.y}`}
              fill={color}
              stroke={strokeColor}
              strokeWidth="1.4"
            />
          </g>
        ))}
      </svg>
    );
  }

  if (type === 'olive') {
    return (
      <svg width="60" height={height} viewBox="0 0 60 150" className={`hand-drawn-svg ${className}`}>
        <path d="M 30 150 Q 31 80 28 8" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {[
          { y: 125, left: true, rx: 17, ry: 7, rot: -30 },
          { y: 102, left: false, rx: 19, ry: 7.5, rot: 30 },
          { y: 78, left: true, rx: 19, ry: 7.5, rot: -32 },
          { y: 54, left: false, rx: 17, ry: 7, rot: 32 },
          { y: 32, left: true, rx: 15, ry: 6, rot: -28 },
          { y: 12, left: false, rx: 12, ry: 5, rot: 25 }
        ].map((leaf, i) => (
          <g key={i}>
            <ellipse
              cx={leaf.left ? 17 : 43}
              cy={leaf.y}
              rx={leaf.rx}
              ry={leaf.ry}
              fill={color}
              stroke={strokeColor}
              strokeWidth="1.6"
              transform={`rotate(${leaf.rot} ${leaf.left ? 17 : 43} ${leaf.y})`}
            />
            {/* Tiny Olive Fruit on a couple nodes */}
            {i === 2 && <circle cx="28" cy="80" r="4" fill="#334155" stroke={strokeColor} strokeWidth="1" />}
            {i === 3 && <circle cx="34" cy="56" r="4" fill="#1e293b" stroke={strokeColor} strokeWidth="1" />}
          </g>
        ))}
      </svg>
    );
  }

  if (type === 'ruscus') {
    return (
      <svg width="60" height={height} viewBox="0 0 60 150" className={`hand-drawn-svg ${className}`}>
        <path d="M 30 150 Q 26 80 30 5" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        {[
          { y: 128, left: true },
          { y: 104, left: false },
          { y: 80, left: true },
          { y: 56, left: false },
          { y: 34, left: true },
          { y: 15, left: false }
        ].map((leaf, i) => (
          <path
            key={i}
            d={
              leaf.left
                ? `M 30 ${leaf.y} C 14 ${leaf.y - 12}, 10 ${leaf.y + 4}, 30 ${leaf.y + 6} Z`
                : `M 30 ${leaf.y} C 46 ${leaf.y - 12}, 50 ${leaf.y + 4}, 30 ${leaf.y + 6} Z`
            }
            fill={color}
            stroke={strokeColor}
            strokeWidth="1.6"
          />
        ))}
      </svg>
    );
  }

  // Default Eucalyptus
  return (
    <svg width="70" height={height} viewBox="0 0 70 150" className={`hand-drawn-svg ${className}`}>
      <path d="M 35 150 Q 34 75 35 5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {[
        { y: 130, left: true, r: 16 },
        { y: 105, left: false, r: 18 },
        { y: 80, left: true, r: 18 },
        { y: 55, left: false, r: 16 },
        { y: 30, left: true, r: 14 },
        { y: 12, left: false, r: 10 }
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.left ? 20 : 50}
          cy={leaf.y}
          rx={leaf.r}
          ry={leaf.r * 0.6}
          fill={color}
          stroke={strokeColor}
          strokeWidth="1.8"
          transform={`rotate(${leaf.left ? -25 : 25} ${leaf.left ? 20 : 50} ${leaf.y})`}
        />
      ))}
    </svg>
  );
}
