import React, { useState, useEffect } from 'react';
import { X, Tag, Heart, Plane, Save, Sparkles } from 'lucide-react';

export default function DedicationModal({ isOpen, onClose, bouquet, onUpdateBouquet }) {
  if (!isOpen) return null;

  const [to, setTo] = useState(bouquet.tagTo || '');
  const [from, setFrom] = useState(bouquet.tagFrom || '');
  const [distance, setDistance] = useState(bouquet.tagDistance || '');
  const [message, setMessage] = useState(bouquet.tagMessage || '');

  // Keep in sync if bouquet prop changes
  useEffect(() => {
    setTo(bouquet.tagTo || '');
    setFrom(bouquet.tagFrom || '');
    setDistance(bouquet.tagDistance || '');
    setMessage(bouquet.tagMessage || '');
  }, [bouquet]);

  const handleSave = () => {
    onUpdateBouquet({
      tagTo: to,
      tagFrom: from,
      tagDistance: distance,
      tagMessage: message
    });
    onClose();
  };

  const DISTANCE_SUGGESTIONS = [
    'Miles Apart ✈️',
    'Across the Ocean 🌊',
    'Different Time Zones 🌙',
    'Close in Heart 💕',
    'Together Soon ✈️'
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 115
      }}
    >
      <div
        className="sketch-box"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '1.75rem',
          position: 'relative',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Close Button */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '2px solid var(--border-sketch)'
            }}
          >
            <Tag size={22} />
          </div>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.3rem' }}>
              Edit Dedication & Names
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Personalize who this bouquet is for, who it is from, and your distance
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* To Field */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              To (Loved One's Name / City):
            </label>
            <input
              type="text"
              placeholder="e.g. My Dearest, Sarah, Alex in Paris..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="font-handwriting"
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                fontSize: '1.15rem',
                borderRadius: '8px',
                border: '1.5px solid var(--border-sketch)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          {/* From Field */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              From (Your Name / City):
            </label>
            <input
              type="text"
              placeholder="e.g. Yours Always, Liam, Sam in Tokyo..."
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="font-handwriting"
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                fontSize: '1.15rem',
                borderRadius: '8px',
                border: '1.5px solid var(--border-sketch)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          {/* Distance Field */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Distance / Airmail Note:
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Optional</span>
            </div>
            <input
              type="text"
              placeholder="e.g. 3,450 Miles, Across the Pacific, 6 Hours Apart..."
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: '1.5px solid var(--border-sketch)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                outline: 'none',
                marginBottom: '6px'
              }}
            />
            {/* Quick suggestion tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {DISTANCE_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setDistance(sug)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid var(--bg-card-border)',
                    background: distance === sug ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: distance === sug ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Note / Dedication */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              Short Dedication Message:
            </label>
            <input
              type="text"
              placeholder="e.g. 'Distance means nothing when you mean everything.'"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="font-handwriting"
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                fontSize: '1.05rem',
                borderRadius: '8px',
                border: '1.5px solid var(--border-sketch)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="sketch-button">
            Cancel
          </button>
          <button onClick={handleSave} className="sketch-button sketch-button-primary">
            <Save size={16} /> Save Dedication Tag
          </button>
        </div>
      </div>
    </div>
  );
}
