import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, ChevronRight, CheckCircle2, Feather, Send, RotateCcw } from 'lucide-react';
import FlowerSvg, { FLOWER_TYPES } from './FlowerSvg';
import confetti from 'canvas-confetti';

export default function MessagePopupCard({
  flower,
  onClose,
  onNext,
  totalFlowersCount,
  currentIndex,
  onReplyBouquet
}) {
  if (!flower) return null;

  const [displayedText, setDisplayedText] = useState('');
  const [celebrated, setCelebrated] = useState(false);
  const messageText = flower.message && flower.message.trim() ? flower.message : 'A blossom of love sent across the miles... missing you always! 🌸';
  const flowerInfo = FLOWER_TYPES.find((f) => f.id === flower.type) || FLOWER_TYPES[0];

  // Typewriter effect on opening card
  useEffect(() => {
    setDisplayedText('');
    setCelebrated(false);
    let index = 0;
    const timer = setInterval(() => {
      if (index < messageText.length) {
        setDisplayedText((prev) => prev + messageText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [flower, messageText]);

  const handleNextClick = () => {
    if (onNext) {
      onNext();
    }
  };

  const handleCelebration = () => {
    setCelebrated(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        zIndex: 120
      }}
    >
      <div
        className="sketch-box animate-bounce-gentle"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2rem',
          position: 'relative',
          background:
            flower.cardTheme === 'rose' ? '#ffe4e6' :
            flower.cardTheme === 'pressed' ? '#f0fdf4' :
            flower.cardTheme === 'night' ? '#1e1b4b' :
            flower.cardTheme === 'gold' ? '#fffbeb' : '#fef3c7',
          color: flower.cardTheme === 'night' ? '#f3f4f6' : '#342a22',
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
            color: flower.cardTheme === 'night' ? '#94a3b8' : 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* Flower Symbol Header with Long Distance Airmail Tag */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              border: '2px stroke var(--border-sketch)',
              marginBottom: '0.5rem'
            }}
          >
            <FlowerSvg type={flower.type} color={flower.color} size={64} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
            <span>✈️ Airmail Secret Note</span>
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.4rem' }}>
            {flowerInfo.name}
          </h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{flowerInfo.desc}</p>
        </div>

        {/* Secret Note Container */}
        <div
          style={{
            padding: '1.4rem 1.25rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.45)',
            border: '1.5px dashed var(--border-sketch)',
            minHeight: '125px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <p className="font-handwriting" style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>
            "{displayedText}"
          </p>
        </div>

        {/* Celebration Banner when completed */}
        {celebrated && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid var(--border-sketch)',
              textAlign: 'center',
              marginBottom: '1rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--primary)'
            }}
          >
            💕 All blooms unveiled! Miles cannot keep your hearts apart.
          </div>
        )}

        {/* Navigation / Next Flower Note / Reply */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>
            Bloom {currentIndex + 1} of {totalFlowersCount}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {onNext && currentIndex < totalFlowersCount - 1 ? (
              <button
                onClick={handleNextClick}
                className="sketch-button sketch-button-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                Next Secret Note <ChevronRight size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleCelebration}
                  className="sketch-button sketch-button-primary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  <Sparkles size={16} /> Celebrate Bouquet!
                </button>
                {onReplyBouquet && (
                  <button
                    onClick={onReplyBouquet}
                    className="sketch-button"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#ffffff' }}
                    title="Design a return bouquet for your loved one"
                  >
                    <Send size={15} color="var(--primary)" /> Send One Back!
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
