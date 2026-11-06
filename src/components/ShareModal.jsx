import React, { useState, useEffect } from 'react';
import { X, Copy, Check, MessageCircle, Send, Mail, Plane, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { encodeBouquetToHash } from '../utils/bouquetEncoder';
import { createShortLink } from '../utils/urlShortener';

export default function ShareModal({ bouquet, onClose, onUpdateBouquet }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [showFullLink, setShowFullLink] = useState(false);

  // Compute base direct hash URL
  const hash = encodeBouquetToHash(bouquet);
  const directUrl = `${window.location.origin}${window.location.pathname}#${hash}`;

  const [shareUrl, setShareUrl] = useState(directUrl);
  const [isShortening, setIsShortening] = useState(true);

  // Automatically generate clean short link
  useEffect(() => {
    let isMounted = true;
    setIsShortening(true);

    createShortLink(directUrl)
      .then((short) => {
        if (!isMounted) return;
        if (short) {
          setShareUrl(short);
        }
        setIsShortening(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsShortening(false);
      });

    return () => {
      isMounted = false;
    };
  }, [directUrl]);

  const activeUrl = showFullLink ? directUrl : shareUrl;

  const notesCount = (bouquet.flowers || []).filter((f) => (f.message && f.message.trim()) || f.mediaImage || f.mediaAudio || f.mediaVideo).length;
  const totalCount = (bouquet.flowers || []).length;

  const romanticMessage = `I handcrafted a virtual flower bouquet with secret notes hidden inside just for you across the miles! 🌸\n\nOpen each flower to unveil my secret notes:\n${activeUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTestOpen = () => {
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(romanticMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(romanticMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(activeUrl)}&text=${encodeURIComponent('I made a virtual flower bouquet with secret notes for you across the miles! 💌')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('A Handcrafted Bouquet With Secret Notes 💐');
    const body = encodeURIComponent(`My love,\n\nI handcrafted a special bouquet of virtual flowers for you across the miles. Each flower contains a hidden secret note written just for you.\n\nOpen each blossom here to read them:\n${activeUrl}\n\nWith all my love`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 110
      }}
    >
      <div
        className="sketch-box"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
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
            top: '1.1rem',
            right: '1.1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0.65rem',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '2px solid var(--border-sketch)'
            }}
          >
            <Plane size={24} />
          </div>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.35rem' }}>
              Send Bouquet Across The Miles ✈️
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Share your finished bouquet and hidden secret notes with your loved one
            </p>
          </div>
        </div>

        {/* Long Distance Summary Card */}
        <div
          style={{
            background: 'var(--primary-light)',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            border: '1.5px dashed var(--primary)',
            marginBottom: '1.25rem',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                💌 {bouquet.tagFrom || 'You'} ✈️ {bouquet.tagTo || 'Your Love'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {bouquet.tagDistance || 'Miles Apart'} • {totalCount} Bloom{totalCount === 1 ? '' : 's'} ({notesCount} Secret Note{notesCount === 1 ? '' : 's'})
              </div>
            </div>

            {onUpdateBouquet && (
              <button
                type="button"
                onClick={() => setIsEditingTag(!isEditingTag)}
                className="sketch-button"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', background: '#ffffff' }}
              >
                {isEditingTag ? 'Close Edit' : 'Edit Names / Details'}
              </button>
            )}
          </div>

          {/* Inline Edit Fields in Share Modal */}
          {isEditingTag && onUpdateBouquet && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--primary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                    To (Loved One):
                  </label>
                  <input
                    type="text"
                    value={bouquet.tagTo || ''}
                    placeholder="e.g. Sarah, My Love"
                    onChange={(e) => onUpdateBouquet({ tagTo: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-sketch)',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                    From (You):
                  </label>
                  <input
                    type="text"
                    value={bouquet.tagFrom || ''}
                    placeholder="e.g. Liam, Yours Always"
                    onChange={(e) => onUpdateBouquet({ tagFrom: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-sketch)',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                  Distance / Airmail Note:
                </label>
                <input
                  type="text"
                  value={bouquet.tagDistance || ''}
                  placeholder="e.g. 500 Miles Apart, Across the Ocean"
                  onChange={(e) => onUpdateBouquet({ tagDistance: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.6rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-sketch)',
                    background: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Clean, Simple Short Link Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Bouquet Gift Link:
            </label>
            <button
              type="button"
              onClick={() => setShowFullLink(!showFullLink)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.73rem',
                color: 'var(--primary)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {showFullLink ? 'Show Short Link' : 'Show Full Link'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              readOnly
              value={activeUrl}
              style={{
                flex: '1 1 200px',
                padding: '0.6rem 0.85rem',
                fontSize: '0.85rem',
                fontFamily: showFullLink ? 'monospace' : 'inherit',
                borderRadius: '8px',
                border: '1px solid var(--bg-card-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                outline: 'none',
                textOverflow: 'ellipsis'
              }}
            />
            <button
              onClick={handleCopyLink}
              className="sketch-button sketch-button-primary"
              style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleTestOpen}
              className="sketch-button"
              title="Test open your bouquet link in a new tab"
              style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ExternalLink size={15} />
              Open Preview
            </button>
          </div>

          {copiedLink ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-sage)', marginTop: '4px', fontWeight: 600 }}>
              ✨ Gift link copied! Send it in your chat with your loved one.
            </p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {isShortening ? (
                <span>Generating compact short link...</span>
              ) : (
                <span>✨ Compact link ready to text or DM across the miles!</span>
              )}
            </div>
          )}
        </div>

        {/* One-Click Social Share Buttons for Long-Distance Couples */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Send Directly to Your Partner:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {/* WhatsApp */}
            <button
              onClick={shareViaWhatsApp}
              className="sketch-button"
              style={{
                padding: '0.6rem 0.5rem',
                fontSize: '0.82rem',
                background: '#25D366',
                color: '#ffffff',
                border: '2px solid var(--border-sketch)'
              }}
            >
              <MessageCircle size={16} /> WhatsApp
            </button>

            {/* Telegram */}
            <button
              onClick={shareViaTelegram}
              className="sketch-button"
              style={{
                padding: '0.6rem 0.5rem',
                fontSize: '0.82rem',
                background: '#229ED9',
                color: '#ffffff',
                border: '2px solid var(--border-sketch)'
              }}
            >
              <Send size={16} /> Telegram
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="sketch-button"
              style={{
                padding: '0.6rem 0.5rem',
                fontSize: '0.82rem',
                background: '#ea4335',
                color: '#ffffff',
                border: '2px solid var(--border-sketch)'
              }}
            >
              <Mail size={16} /> Email
            </button>
          </div>
        </div>

        {/* Copy Ready-to-Send Romantic Message */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            onClick={handleCopyMessage}
            className="sketch-button"
            style={{
              width: '100%',
              padding: '0.6rem',
              fontSize: '0.85rem',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {copiedMessage ? <Check size={16} color="var(--accent-sage)" /> : <Copy size={16} />}
            {copiedMessage ? 'Copied Full Note with Link!' : 'Copy Sweet Message with Link (for iMessage / Instagram / Discord)'}
          </button>
        </div>

        {/* How it works for long-distance partner */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px dashed var(--border-sketch)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="var(--primary)" /> How your loved one will receive it:
          </div>
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>When opening the link, they immediately enter the romantic airmail presentation view.</li>
            <li>Each bloom sways gently with a hidden secret note attached.</li>
            <li>Clicking each flower reveals your handwritten secret note with smooth typewriter text!</li>
            <li>After reading, they can celebrate and even send a return bouquet right back to you!</li>
          </ul>
        </div>

        {/* Close Action */}
        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button onClick={onClose} className="sketch-button sketch-button-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
