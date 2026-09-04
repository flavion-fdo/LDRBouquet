import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FlowerCatalog from './components/FlowerCatalog';
import BouquetCanvas from './components/BouquetCanvas';
import WrapperCustomizer from './components/WrapperCustomizer';
import MessageEditorModal from './components/MessageEditorModal';
import MessagePopupCard from './components/MessagePopupCard';
import ShareModal from './components/ShareModal';
import DedicationModal from './components/DedicationModal';
import PetalCanvas from './components/PetalCanvas';
import { PRESET_BOUQUETS, decodeHashToBouquet } from './utils/bouquetEncoder';
import { Sparkles, Flower2, Package, Plus, Share2 } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('studio'); // 'studio' | 'preview'
  const [theme, setTheme] = useState('rose');
  const [mobileTab, setMobileTab] = useState('canvas'); // 'canvas' | 'flowers' | 'wrapper'
  const [bouquet, setBouquet] = useState(PRESET_BOUQUETS[0]);
  const [selectedFlowerId, setSelectedFlowerId] = useState(null);
  const [editingFlower, setEditingFlower] = useState(null);
  const [recipientPopupFlower, setRecipientPopupFlower] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDedicationModalOpen, setIsDedicationModalOpen] = useState(false);

  // Check URL Hash on Load for Share Links
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 5) {
      const sharedBouquet = decodeHashToBouquet(hash);
      if (sharedBouquet) {
        setBouquet(sharedBouquet);
        setMode('preview'); // Recipient direct presentation mode
        if (sharedBouquet.theme) setTheme(sharedBouquet.theme);
      }
    }
  }, []);

  // Update Theme in DOM body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Flower Add / Edit / Remove Handlers
  const handleAddFlower = (flowerData) => {
    const newId = `f-${Date.now()}`;
    const count = bouquet.flowers.length;
    // Organic spread around bouquet top
    const spreadX = 50 + ((count % 5) - 2) * 14;
    const spreadY = 30 + Math.floor(count / 5) * 12;

    const newFlower = {
      id: newId,
      type: flowerData.type,
      color: flowerData.color,
      scale: 1,
      rotation: (Math.random() - 0.5) * 30,
      position: {
        x: Math.max(25, Math.min(75, spreadX)),
        y: Math.max(25, Math.min(65, spreadY))
      },
      message: flowerData.message || '',
      cardTheme: flowerData.cardTheme || 'parchment'
    };

    setBouquet((prev) => ({
      ...prev,
      flowers: [...prev.flowers, newFlower]
    }));
    setSelectedFlowerId(newId);

    // On mobile devices, smoothly return user to canvas tab so they immediately see the bloom added
    setMobileTab('canvas');
  };

  const handleUpdateFlower = (id, updates) => {
    setBouquet((prev) => ({
      ...prev,
      flowers: prev.flowers.map((f) => (f.id === id ? { ...f, ...updates } : f))
    }));
  };

  const handleDeleteFlower = (id) => {
    setBouquet((prev) => ({
      ...prev,
      flowers: prev.flowers.filter((f) => f.id !== id)
    }));
    if (selectedFlowerId === id) setSelectedFlowerId(null);
  };

  const handleUpdateBouquet = (updates) => {
    setBouquet((prev) => ({ ...prev, ...updates }));
  };

  const handleClearBouquet = () => {
    if (window.confirm('Are you sure you want to clear all flowers from the bouquet?')) {
      setBouquet((prev) => ({ ...prev, flowers: [] }));
      setSelectedFlowerId(null);
    }
  };

  const handleLoadPreset = () => {
    const nextIndex = (PRESET_BOUQUETS.findIndex((p) => p.id === bouquet.id) + 1) % PRESET_BOUQUETS.length;
    const preset = PRESET_BOUQUETS[nextIndex];
    setBouquet(preset);
    if (preset.theme) setTheme(preset.theme);
    setSelectedFlowerId(null);
    setMobileTab('canvas');
  };

  // Recipient Note Popups
  const handleFlowerClickRecipient = (flower) => {
    setRecipientPopupFlower(flower);
  };

  const handleNextRecipientNote = () => {
    if (!recipientPopupFlower) return;
    const currentIndex = bouquet.flowers.findIndex((f) => f.id === recipientPopupFlower.id);
    if (currentIndex < bouquet.flowers.length - 1) {
      setRecipientPopupFlower(bouquet.flowers[currentIndex + 1]);
    }
  };

  const handleReplyBouquet = () => {
    setBouquet({
      id: `reply-${Date.now()}`,
      title: 'Return Bouquet With Love',
      wrapperStyle: 'satin',
      ribbonColor: '#e11d48',
      tagTo: bouquet.tagFrom || 'My Dearest',
      tagFrom: bouquet.tagTo || 'With all my love',
      tagDistance: bouquet.tagDistance || 'Miles Apart',
      tagMessage: 'Sending my heart and flowers right back across the miles! ✈️💌',
      theme: 'rose',
      flowers: []
    });
    setMode('studio');
    setMobileTab('canvas');
    setRecipientPopupFlower(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Ambient Falling Petals Canvas Background */}
      <PetalCanvas enabled={true} count={18} theme={theme} />

      {/* Navbar Header */}
      <Navbar
        mode={mode}
        setMode={setMode}
        theme={theme}
        setTheme={setTheme}
        onOpenShare={() => setIsShareModalOpen(true)}
        onClearBouquet={handleClearBouquet}
        onLoadPreset={handleLoadPreset}
      />

      {/* Main Studio / Preview Grid Layout */}
      <main
        className="main-content"
        style={{
          flex: 1,
          padding: '0 1.5rem 2rem 1.5rem',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {mode === 'studio' ? (
          <div>
            {/* Mobile / Tablet View Switcher Tabs (Only visible on screens <= 1024px) */}
            <div className="mobile-studio-tabs">
              <button
                type="button"
                className={`mobile-studio-tab-btn ${mobileTab === 'canvas' ? 'active' : ''}`}
                onClick={() => setMobileTab('canvas')}
              >
                <Sparkles size={15} /> <span>Bouquet ({bouquet.flowers.length})</span>
              </button>
              <button
                type="button"
                className={`mobile-studio-tab-btn ${mobileTab === 'flowers' ? 'active' : ''}`}
                onClick={() => setMobileTab('flowers')}
              >
                <Flower2 size={15} /> <span>Pick Blooms</span>
              </button>
              <button
                type="button"
                className={`mobile-studio-tab-btn ${mobileTab === 'wrapper' ? 'active' : ''}`}
                onClick={() => setMobileTab('wrapper')}
              >
                <Package size={15} /> <span>Wrap & Tag</span>
              </button>
            </div>

            {/* Studio Workspace Layout */}
            <div className="app-grid">
              {/* Column 1: Flower Catalog */}
              <div className={`mobile-tab-content ${mobileTab === 'flowers' ? 'active' : ''}`}>
                <FlowerCatalog onAddFlower={handleAddFlower} />
              </div>

              {/* Column 2: Bouquet Canvas Workspace */}
              <div className={`mobile-tab-content ${mobileTab === 'canvas' ? 'active' : ''}`}>
                <BouquetCanvas
                  bouquet={bouquet}
                  mode={mode}
                  selectedFlowerId={selectedFlowerId}
                  setSelectedFlowerId={setSelectedFlowerId}
                  onUpdateFlower={handleUpdateFlower}
                  onDeleteFlower={handleDeleteFlower}
                  onOpenMessageModal={(flower) => setEditingFlower(flower)}
                  onFlowerClickRecipient={handleFlowerClickRecipient}
                  onOpenShare={() => setIsShareModalOpen(true)}
                  onOpenDedicationModal={() => setIsDedicationModalOpen(true)}
                />
              </div>

              {/* Column 3: Wrapper & Gift Tag Controls */}
              <div className={`mobile-tab-content ${mobileTab === 'wrapper' ? 'active' : ''}`}>
                <WrapperCustomizer bouquet={bouquet} onUpdateBouquet={handleUpdateBouquet} />
              </div>
            </div>

            {/* Mobile Canvas Actions Bar (Below canvas on mobile screens) */}
            <div className="mobile-canvas-actions">
              <button
                type="button"
                onClick={() => setMobileTab('flowers')}
                className="sketch-button sketch-button-primary"
                style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem 0.75rem' }}
              >
                <Plus size={16} /> Add Bloom
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('wrapper')}
                className="sketch-button"
                style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem 0.75rem', background: 'var(--bg-card)' }}
              >
                <Package size={16} /> Wrap & Tag
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="sketch-button"
                style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)' }}
              >
                <Share2 size={16} /> Share 💌
              </button>
            </div>
          </div>
        ) : (
          /* Presentation / Recipient Full Screen View */
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}
          >
            <BouquetCanvas
              bouquet={bouquet}
              mode={mode}
              selectedFlowerId={selectedFlowerId}
              setSelectedFlowerId={setSelectedFlowerId}
              onUpdateFlower={handleUpdateFlower}
              onDeleteFlower={handleDeleteFlower}
              onOpenMessageModal={(flower) => setEditingFlower(flower)}
              onFlowerClickRecipient={handleFlowerClickRecipient}
              onOpenDedicationModal={() => setIsDedicationModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '1.25rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--bg-card-border)',
          background: 'var(--bg-glass)'
        }}
      >
        <p className="font-handwriting" style={{ fontSize: '1.1rem' }}>
          Crafted with love & petals for your special someone 🌸
        </p>
      </footer>

      {/* Modals */}
      {editingFlower && (
        <MessageEditorModal
          flower={editingFlower}
          onClose={() => setEditingFlower(null)}
          onSave={(id, updates) => {
            handleUpdateFlower(id, updates);
            setEditingFlower(null);
          }}
        />
      )}

      {recipientPopupFlower && (
        <MessagePopupCard
          flower={recipientPopupFlower}
          onClose={() => setRecipientPopupFlower(null)}
          onNext={handleNextRecipientNote}
          totalFlowersCount={bouquet.flowers.length}
          currentIndex={bouquet.flowers.findIndex((f) => f.id === recipientPopupFlower.id)}
          onReplyBouquet={handleReplyBouquet}
        />
      )}

      {isShareModalOpen && (
        <ShareModal
          bouquet={bouquet}
          onClose={() => setIsShareModalOpen(false)}
          onUpdateBouquet={handleUpdateBouquet}
        />
      )}

      <DedicationModal
        isOpen={isDedicationModalOpen}
        onClose={() => setIsDedicationModalOpen(false)}
        bouquet={bouquet}
        onUpdateBouquet={handleUpdateBouquet}
      />
    </div>
  );
}
