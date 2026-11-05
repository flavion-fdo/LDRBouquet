import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Save,
  RefreshCw,
  Image as ImageIcon,
  Mic,
  Video as VideoIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  Square,
  Check
} from 'lucide-react';
import FlowerSvg, { FLOWER_TYPES } from './FlowerSvg';
import { compressImageFile, readFileAsDataUrl, parseVideoUrl, formatTime } from '../utils/mediaUtils';

export default function MessageEditorModal({ flower, onClose, onSave }) {
  if (!flower) return null;

  const [message, setMessage] = useState(flower.message || '');
  const [cardTheme, setCardTheme] = useState(flower.cardTheme || 'parchment');
  const [mediaImage, setMediaImage] = useState(flower.mediaImage || '');
  const [mediaAudio, setMediaAudio] = useState(flower.mediaAudio || '');
  const [mediaVideo, setMediaVideo] = useState(flower.mediaVideo || '');

  const [activeTab, setActiveTab] = useState('note'); // 'note' | 'image' | 'audio' | 'video'
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Preview audio playback state in modal
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPreviewRef = useRef(null);

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

  // Cleanup timers & streams on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleRandomPrompt = () => {
    const random = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setMessage(random);
  };

  // Image File Upload Handlers
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');
    setIsProcessing(true);
    try {
      const compressed = await compressImageFile(file, 800, 0.75);
      setMediaImage(compressed);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not process image file. Please try another image.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleApplyImageUrl = () => {
    if (!urlInput.trim()) return;
    setMediaImage(urlInput.trim());
    setUrlInput('');
  };

  // Voice Recording Handlers
  const handleStartRecording = async () => {
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onload = (evt) => {
          setMediaAudio(evt.target.result);
        };
        reader.readAsDataURL(audioBlob);

        // Release mic stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access failed:', err);
      setErrorMessage(
        'Microphone permission denied or not available. You can upload an audio file or paste a link instead.'
      );
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Audio File Upload
  const handleAudioFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');
    setIsProcessing(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setMediaAudio(dataUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not read audio file. Please choose an MP3, WAV, or M4A file.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleApplyAudioUrl = () => {
    if (!urlInput.trim()) return;
    setMediaAudio(urlInput.trim());
    setUrlInput('');
  };

  // Video Handlers
  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 35 * 1024 * 1024) {
      setErrorMessage('Video file is larger than 35MB. Please choose a shorter clip or paste a YouTube link.');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setMediaVideo(dataUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not read video file.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleApplyVideoUrl = () => {
    if (!urlInput.trim()) return;
    setMediaVideo(urlInput.trim());
    setUrlInput('');
  };

  const handleSave = () => {
    onSave(flower.id, {
      message,
      cardTheme,
      mediaImage,
      mediaAudio,
      mediaVideo
    });
    onClose();
  };

  const parsedVideo = mediaVideo ? parseVideoUrl(mediaVideo) : null;

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
        padding: '1rem',
        zIndex: 100
      }}
    >
      <div
        className="sketch-box"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.6rem',
          position: 'relative',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
          <div
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-sketch)'
            }}
          >
            <FlowerSvg type={flower.type} color={flower.color} size={46} />
          </div>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>
              Secret Note for {flowerInfo.name}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Add a hidden note, photo, voice note, or video for this bloom.
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Note, Photo, Audio, Video) */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            borderBottom: '1px solid var(--bg-card-border)',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('note')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              border: activeTab === 'note' ? '2px solid var(--primary)' : '1px solid var(--bg-card-border)',
              background: activeTab === 'note' ? 'var(--primary-light)' : 'var(--bg-secondary)',
              color: activeTab === 'note' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={14} />
            <span>Letter</span>
            {message.trim() && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              border: activeTab === 'image' ? '2px solid var(--primary)' : '1px solid var(--bg-card-border)',
              background: activeTab === 'image' ? 'var(--primary-light)' : 'var(--bg-secondary)',
              color: activeTab === 'image' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <ImageIcon size={14} />
            <span>Photo</span>
            {mediaImage && (
              <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '1px 5px', borderRadius: '10px' }}>
                1
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              border: activeTab === 'audio' ? '2px solid var(--primary)' : '1px solid var(--bg-card-border)',
              background: activeTab === 'audio' ? 'var(--primary-light)' : 'var(--bg-secondary)',
              color: activeTab === 'audio' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Mic size={14} />
            <span>Voice / Audio</span>
            {mediaAudio && (
              <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '1px 5px', borderRadius: '10px' }}>
                1
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              border: activeTab === 'video' ? '2px solid var(--primary)' : '1px solid var(--bg-card-border)',
              background: activeTab === 'video' ? 'var(--primary-light)' : 'var(--bg-secondary)',
              color: activeTab === 'video' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <VideoIcon size={14} />
            <span>Video</span>
            {mediaVideo && (
              <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '1px 5px', borderRadius: '10px' }}>
                1
              </span>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fef2f2',
              border: '1px solid #f87171',
              color: '#991b1b',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '1rem'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: Handwritten Letter Composer */}
        {activeTab === 'note' && (
          <div>
            {/* Stationery Card Style */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Stationery Card Style:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'parchment', name: 'Tea Parchment', bg: '#fef3c7', color: '#451a03' },
                  { id: 'rose', name: 'Rose Petal', bg: '#ffe4e6', color: '#881337' },
                  { id: 'pressed', name: 'Botanical Linen', bg: '#f0fdf4', color: '#14532d' },
                  { id: 'night', name: 'Starry Midnight', bg: '#1e1b4b', color: '#e0e7ff' },
                  { id: 'gold', name: 'Gold Foil', bg: '#fffbeb', color: '#78350f' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCardTheme(t.id)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      borderRadius: '16px',
                      border: cardTheme === t.id ? '2px solid var(--border-sketch)' : '1px solid var(--bg-card-border)',
                      background: t.bg,
                      color: t.color,
                      cursor: 'pointer',
                      transform: cardTheme === t.id ? 'scale(1.04)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Note text area */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <textarea
                rows={5}
                placeholder="Write your secret note to bridge the miles..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="font-handwriting"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.25rem',
                  lineHeight: '1.4',
                  borderRadius: '12px',
                  border: '2px solid var(--border-sketch)',
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

              <button
                type="button"
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
          </div>
        )}

        {/* TAB 2: Photo / Picture */}
        {activeTab === 'image' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mediaImage ? (
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1.5px dashed var(--border-sketch)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    padding: '8px 8px 24px 8px',
                    borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transform: 'rotate(-1deg)',
                    maxWidth: '240px'
                  }}
                >
                  <img
                    src={mediaImage}
                    alt="Flower attached memory"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '2px' }}
                  />
                  <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                    Photo memory attached
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMediaImage('')}
                  className="sketch-button"
                  style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                  <Trash2 size={14} /> Remove Photo
                </button>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    border: '2px dashed var(--bg-card-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'var(--bg-secondary)',
                    marginBottom: '1rem'
                  }}
                >
                  <ImageIcon size={32} color="var(--primary)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Attach a Photo Memory to this Bloom
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Upload a picture of you two, a vacation memory, or a sweet selfie
                  </p>

                  <label
                    className="sketch-button sketch-button-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    <Upload size={15} /> Choose Photo from Browser
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                      disabled={isProcessing}
                    />
                  </label>
                </div>

                {/* Paste URL */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Or paste an Image Web URL:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--bg-card-border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        fontSize: '0.82rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyImageUrl}
                      className="sketch-button"
                      style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      <LinkIcon size={14} /> Attach Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Voice / Audio */}
        {activeTab === 'audio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mediaAudio ? (
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1.5px dashed var(--border-sketch)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600 }}>
                  <Mic size={18} />
                  <span>Audio Note Attached</span>
                </div>

                <audio
                  ref={audioPreviewRef}
                  src={mediaAudio}
                  onEnded={() => setIsPlayingAudio(false)}
                  style={{ width: '100%', maxWidth: '380px' }}
                  controls
                />

                <button
                  type="button"
                  onClick={() => {
                    if (audioPreviewRef.current) audioPreviewRef.current.pause();
                    setMediaAudio('');
                    setIsPlayingAudio(false);
                  }}
                  className="sketch-button"
                  style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                  <Trash2 size={14} /> Remove Audio
                </button>
              </div>
            ) : (
              <div>
                {/* Voice Recorder Block */}
                <div
                  style={{
                    border: '2px dashed var(--bg-card-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'var(--bg-secondary)',
                    marginBottom: '1rem'
                  }}
                >
                  <Mic size={32} color="var(--primary)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Record a Voice Message Across the Miles
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                    Let your partner hear the warmth of your voice right inside this blossom.
                  </p>

                  {isRecording ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#ef4444',
                          fontWeight: 700,
                          fontSize: '1.1rem'
                        }}
                      >
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            animation: 'pulse 1s infinite'
                          }}
                        />
                        <span>Recording: {formatTime(recordingSeconds)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="sketch-button"
                        style={{
                          background: '#ef4444',
                          color: '#ffffff',
                          borderColor: '#b91c1c',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Square size={15} /> Stop & Save Voice Note
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="sketch-button sketch-button-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Mic size={15} /> 🎙️ Start Mic Recording
                    </button>
                  )}
                </div>

                {/* Upload Audio File */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <label
                    className="sketch-button"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    <Upload size={14} /> Upload Audio File from Browser (MP3 / WAV / M4A)
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      style={{ display: 'none' }}
                      disabled={isProcessing}
                    />
                  </label>
                </div>

                {/* Audio URL */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Or paste an Audio Web URL:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      placeholder="https://example.com/song.mp3"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--bg-card-border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        fontSize: '0.82rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyAudioUrl}
                      className="sketch-button"
                      style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      <LinkIcon size={14} /> Attach Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Video */}
        {activeTab === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mediaVideo ? (
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1.5px dashed var(--border-sketch)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ width: '100%', maxWidth: '420px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-sketch)' }}>
                  {parsedVideo && parsedVideo.type === 'youtube' ? (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title="Attached YouTube Video"
                      style={{ width: '100%', height: '220px', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : parsedVideo && parsedVideo.type === 'vimeo' ? (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title="Attached Vimeo Video"
                      style={{ width: '100%', height: '220px', border: 'none' }}
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={mediaVideo}
                      controls
                      style={{ width: '100%', maxHeight: '240px', background: '#000' }}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setMediaVideo('')}
                  className="sketch-button"
                  style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                  <Trash2 size={14} /> Remove Video
                </button>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    border: '2px dashed var(--bg-card-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'var(--bg-secondary)',
                    marginBottom: '1rem'
                  }}
                >
                  <VideoIcon size={32} color="var(--primary)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Attach a Video Clip or YouTube Video
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Share your favorite couple video, a video greeting, or a special song
                  </p>

                  <label
                    className="sketch-button sketch-button-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    <Upload size={15} /> Upload Video Clip from Browser
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      style={{ display: 'none' }}
                      disabled={isProcessing}
                    />
                  </label>
                </div>

                {/* Paste URL */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Or paste YouTube, Vimeo, or Video URL:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or direct .mp4"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--bg-card-border)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        fontSize: '0.82rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyVideoUrl}
                      className="sketch-button"
                      style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      <LinkIcon size={14} /> Attach Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.25rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--bg-card-border)'
          }}
        >
          {/* Summary Badges of Attachments */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {mediaImage && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.72rem',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}
              >
                <ImageIcon size={11} /> Photo
              </span>
            )}
            {mediaAudio && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.72rem',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}
              >
                <Mic size={11} /> Audio
              </span>
            )}
            {mediaVideo && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.72rem',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}
              >
                <VideoIcon size={11} /> Video
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button type="button" onClick={onClose} className="sketch-button">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="sketch-button sketch-button-primary">
              <Save size={16} /> Save Bloom Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
