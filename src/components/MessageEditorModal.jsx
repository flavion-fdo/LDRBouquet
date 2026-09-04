import React, { useState } from 'react';
import { X, Sparkles, Heart, Save, RefreshCw, Feather } from 'lucide-react';
import FlowerSvg, { FLOWER_TYPES } from './FlowerSvg';

export default function MessageEditorModal({ flower, onClose, onSave }) {
  if (!flower) return null;

  const [message, setMessage] = useState(flower.message || '');
  const [cardTheme, setCardTheme] = useState(flower.cardTheme || 'parchment');

  const flowerInfo = FLOWER_TYPES.find((f) => f.id === flower.type) || FLOWER_TYPES[0];

  const PROMPTS = [
    'Distance means so little when you mean so much to me. 💌',
    'Counting down every single hour until I get to hold you again. ✈️',
    'Whenever you miss me, open this petal and remember you are deeply loved.',
    'Goodnight my love—we are looking at the exact same moon tonight. 🌙',
    'Sending you the warmest hug across all these miles. 💕',
    'No ocean is wide enough to change how much my heart belongs to you.',
    'You are worth every time zone, every ticket, and every minute apart. ✨'
  ];

  const handleRandomPrompt = () => {
    const random = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setMessage(random);
  };

  const handleSave = () => {
    onSave(flower.id, { message, cardTheme });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 100
      }}
    >
      <div
        className="sketch-box"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '1.75rem',
          position: 'relative',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-sketch)'
            }}
          >
            <FlowerSvg type={flower.type} color={flower.color} size={48} />
          </div>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.3rem' }}>
              Secret Note for {flowerInfo.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Write a hidden note that reveals when the recipient clicks this bloom.
            </p>
          </div>
        </div>

        {/* Note Theme Picker */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Stationery Card Style:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'parchment', name: 'Tea Parchment', bg: '#fef3c7', color: '#451a03' },
              { id: 'rose', name: 'Rose Petal', bg: '#ffe4e6', color: '#881337' },
              { id: 'pressed', name: 'Botanical Linen', bg: '#f0fdf4', color: '#14532d' },
              { id: 'night', name: 'Starry Midnight', bg: '#1e1b4b', color: '#e0e7ff' },
              { id: 'gold', name: 'Gold Foil', bg: '#fffbeb', color: '#78350f' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setCardTheme(t.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '20px',
                  border: cardTheme === t.id ? '2px solid var(--border-sketch)' : '1px solid var(--bg-card-border)',
                  background: t.bg,
                  color: t.color,
                  cursor: 'pointer',
                  transform: cardTheme === t.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea note composer */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <textarea
            rows={5}
            placeholder="Write your secret love note to bridge the miles..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="font-handwriting"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.25rem',
              lineHeight: '1.4',
              borderRadius: '12px',
              border: '2px stroke var(--border-sketch)',
              outline: 'none',
              resize: 'none',
              background:
                cardTheme === 'rose' ? '#ffe4e6' :
                cardTheme === 'pressed' ? '#f0fdf4' :
                cardTheme === 'night' ? '#1e1b4b' :
                cardTheme === 'gold' ? '#fffbeb' : '#fef3c7',
              color: cardTheme === 'night' ? '#f3f4f6' : '#342a22',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'
            }}
          />

          {/* Random Prompt Generator Button */}
          <button
            onClick={handleRandomPrompt}
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-sketch)',
              background: 'var(--bg-card)',
              color: 'var(--primary)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} /> Inspire Me
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="sketch-button">
            Cancel
          </button>

          <button onClick={handleSave} className="sketch-button sketch-button-primary">
            <Save size={16} /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
