import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Sparkles,
  ChevronRight,
  Send,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Mic,
  Video as VideoIcon,
  Image as ImageIcon,
  Disc
} from 'lucide-react';
import FlowerSvg, { FLOWER_TYPES } from './FlowerSvg';
import confetti from 'canvas-confetti';
import { parseVideoUrl, formatTime } from '../utils/mediaUtils';

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
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  const messageText =
    flower.message && flower.message.trim()
      ? flower.message
      : 'A blossom of love sent across the miles... missing you always! 🌸';
  const flowerInfo = FLOWER_TYPES.find((f) => f.id === flower.type) || FLOWER_TYPES[0];

  // Reset & Typewriter effect on flower change
  useEffect(() => {
    setDisplayedText('');
    setCelebrated(false);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);

    let index = 0;
    const timer = setInterval(() => {
      if (index < messageText.length) {
        setDisplayedText((prev) => prev + messageText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [flower, messageText]);

  // Audio controls
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.error('Audio play error:', err));
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setAudioCurrentTime(cur);
    setAudioProgress((cur / dur) * 100);
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioSeek = (e) => {
    if (!audioRef.current) return;
    const clickX = e.nativeEvent.offsetX;
    const totalWidth = e.currentTarget.clientWidth;
    const newPercent = clickX / totalWidth;
    const newTime = newPercent * (audioDuration || 1);
    audioRef.current.currentTime = newTime;
    setAudioCurrentTime(newTime);
    setAudioProgress(newPercent * 100);
  };

  const handleNextClick = () => {
    if (audioRef.current) audioRef.current.pause();
    if (onNext) onNext();
  };

  const handleCelebration = () => {
    setCelebrated(true);
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.6 }
    });
  };

  const parsedVideo = flower.mediaVideo ? parseVideoUrl(flower.mediaVideo) : null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.65)',
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
            maxWidth: '520px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '1.75rem',
            position: 'relative',
            background:
              flower.cardTheme === 'rose'
                ? '#ffe4e6'
                : flower.cardTheme === 'pressed'
                ? '#f0fdf4'
                : flower.cardTheme === 'night'
                ? '#1e1b4b'
                : flower.cardTheme === 'gold'
                ? '#fffbeb'
                : '#fef3c7',
            color: flower.cardTheme === 'night' ? '#f3f4f6' : '#342a22',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              onClose();
            }}
            type="button"
            aria-label="Close Note"
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
                padding: '0.65rem',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.4)',
                border: '2px solid var(--border-sketch)',
                marginBottom: '0.4rem'
              }}
            >
              <FlowerSvg type={flower.type} color={flower.color} size={58} />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'var(--primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px'
              }}
            >
              <span>✈️ Airmail Secret Note</span>
            </div>
            <h3 className="font-heading" style={{ fontSize: '1.35rem' }}>
              {flowerInfo.name}
            </h3>
            <p style={{ fontSize: '0.82rem', opacity: 0.85 }}>{flowerInfo.desc}</p>
          </div>

          {/* Secret Note Container */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.55)',
              border: '1.5px dashed var(--border-sketch)',
              minHeight: '90px',
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <p className="font-handwriting" style={{ fontSize: '1.45rem', lineHeight: '1.35' }}>
              "{displayedText}"
            </p>
          </div>

          {/* ATTACHED PHOTO MEMORY (Polaroid Look) */}
          {flower.mediaImage && (
            <div
              style={{
                marginBottom: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                onClick={() => setIsImageZoomed(true)}
                title="Click to view full photo"
                style={{
                  background: '#ffffff',
                  padding: '10px 10px 28px 10px',
                  borderRadius: '3px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                  transform: 'rotate(-1.5deg)',
                  cursor: 'pointer',
                  maxWidth: '280px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  position: 'relative',
                  transition: 'transform 0.2s ease'
                }}
              >
                {/* Vintage Tape Accent on top */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '16px',
                    background: 'rgba(254, 240, 138, 0.75)',
                    border: '1px dashed rgba(0,0,0,0.15)',
                    borderRadius: '2px'
                  }}
                />
                <img
                  src={flower.mediaImage}
                  alt="Secret flower memory"
                  style={{
                    width: '100%',
                    height: '210px',
                    objectFit: 'cover',
                    borderRadius: '2px',
                    display: 'block'
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontStyle: 'italic'
                  }}
                >
                  <Maximize2 size={11} /> Tap to zoom memory
                </div>
              </div>
            </div>
          )}

          {/* ATTACHED VOICE / AUDIO NOTE (Vintage Cassette Style Player) */}
          {flower.mediaAudio && (
            <div
              style={{
                marginBottom: '1.2rem',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1.5px solid var(--border-sketch)',
                borderRadius: '12px',
                padding: '0.9rem 1rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
              }}
            >
              <audio
                ref={audioRef}
                src={flower.mediaAudio}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioLoadedMetadata}
                onEnded={() => setIsPlayingAudio(false)}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: isPlayingAudio ? 'spin 4s linear infinite' : 'none'
                    }}
                  >
                    <Disc size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Voice Note From Your Love
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {isPlayingAudio ? 'Playing romantic note...' : 'Tap play to listen'}
                    </div>
                  </div>
                </div>

                {/* Animated Equalizer Wave Bars */}
                {isPlayingAudio && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '16px' }}>
                    {[12, 16, 8, 14, 10].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          width: '3px',
                          height: `${h}px`,
                          background: 'var(--primary)',
                          borderRadius: '2px',
                          animation: `bounce 0.8s ease infinite alternate ${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div
                onClick={handleAudioSeek}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: '6px'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${audioProgress}%`,
                    background: 'var(--primary)',
                    borderRadius: '4px',
                    transition: 'width 0.1s linear'
                  }}
                />
              </div>

              {/* Player Controls & Timers */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="sketch-button sketch-button-primary"
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause size={13} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={13} /> Listen to Voice Note
                    </>
                  )}
                </button>

                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
                </div>
              </div>
            </div>
          )}

          {/* ATTACHED VIDEO CLIP */}
          {flower.mediaVideo && (
            <div
              style={{
                marginBottom: '1.2rem',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1.5px solid var(--border-sketch)',
                background: '#000000',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
              }}
            >
              {parsedVideo && parsedVideo.type === 'youtube' ? (
                <iframe
                  src={parsedVideo.embedUrl}
                  title="Couples video note"
                  style={{ width: '100%', height: '230px', border: 'none', display: 'block' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : parsedVideo && parsedVideo.type === 'vimeo' ? (
                <iframe
                  src={parsedVideo.embedUrl}
                  title="Couples video note"
                  style={{ width: '100%', height: '230px', border: 'none', display: 'block' }}
                  allowFullScreen
                />
              ) : (
                <video
                  src={flower.mediaVideo}
                  controls
                  playsInline
                  style={{ width: '100%', maxHeight: '250px', display: 'block' }}
                />
              )}
            </div>
          )}

          {/* Celebration Banner when completed */}
          {celebrated && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>
              Bloom {currentIndex + 1} of {totalFlowersCount}
            </span>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {onNext && currentIndex < totalFlowersCount - 1 ? (
                <button
                  type="button"
                  onClick={handleNextClick}
                  className="sketch-button sketch-button-primary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  Next Secret Note <ChevronRight size={16} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCelebration}
                    className="sketch-button sketch-button-primary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    <Sparkles size={16} /> Celebrate Bouquet!
                  </button>
                  {onReplyBouquet && (
                    <button
                      type="button"
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

      {/* FULL PHOTO LIGHTBOX OVERLAY */}
      {isImageZoomed && flower.mediaImage && (
        <div
          onClick={() => setIsImageZoomed(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            cursor: 'zoom-out',
            padding: '1rem'
          }}
        >
          <button
            type="button"
            onClick={() => setIsImageZoomed(false)}
            aria-label="Close zoom"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              padding: '0.5rem',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
          <img
            src={flower.mediaImage}
            alt="Full size memory"
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      )}
    </>
  );
}
