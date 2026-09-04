import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FlowerCatalog from './components/FlowerCatalog';
import BouquetCanvas from './components/BouquetCanvas';
import WrapperCustomizer from './components/WrapperCustomizer';
import MessageEditorModal from './components/MessageEditorModal';
import MessagePopupCard from './components/MessagePopupCard';
import ShareModal from './components/ShareModal';
import PetalCanvas from './components/PetalCanvas';
import { PRESET_BOUQUETS, decodeHashToBouquet } from './utils/bouquetEncoder';
import { Sparkles, Layers, RefreshCcw } from 'lucide-react';

export default function App() {
  const [bouquet, setBouquet] = useState(PRESET_BOUQUETS[0]);
  const [mode, setMode] = useState('studio'); // 'studio' | 'preview'
  const [theme, setTheme] = useState('parchment'); // 'parchment' | 'rose' | 'sage' | 'midnight'
  const [selectedFlowerId, setSelectedFlowerId] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'wrapper' (for mobile / responsive tab switching)

  // Modals
  const [editingFlower, setEditingFlower] = useState(null);
  const [recipientPopupFlower, setRecipientPopupFlower] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Check URL Hash on Load for Share Links
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const decoded = decodeHashToBouquet(window.location.hash);
      if (decoded && decoded.flowers && decoded.flowers.length > 0) {
        setBouquet(decoded);
        setMode('preview'); // Automatically open recipient preview mode!
        if (decoded.theme) setTheme(decoded.theme);
      }
    }
  }, []);

  // Synchronize body data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Flower Actions
  const handleAddFlower = (flowerData) => {
    const newId = `flower-${Date.now()}`;
    // Position flower in center arc fan shape
    const flowerCount = bouquet.flowers.length;
    const spreadX = 50 + (flowerCount % 2 === 0 ? 1 : -1) * Math.ceil(flowerCount / 2) * 12;
    const spreadY = 35 + (flowerCount % 3) * 10;

    const newFlower = {
      id: newId,
      type: flowerData.type,
      color: flowerData.color,
      scale: 1.0,
      rotation: Math.round((Math.random() - 0.5) * 30),
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
        style={{
          flex: 1,
          padding: '0 1.5rem 2rem 1.5rem',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {mode === 'studio' ? (
          <div
            className="app-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr 320px',
              gap: '1.5rem',
              alignItems: 'start'
            }}
          >
            {/* Left Column: Flower Catalog */}
            <FlowerCatalog onAddFlower={handleAddFlower} />

            {/* Middle Column: Bouquet Canvas Workspace */}
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
            />

            {/* Right Column: Wrapper & Gift Tag Controls */}
            <WrapperCustomizer bouquet={bouquet} onUpdateBouquet={handleUpdateBouquet} />
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
        <ShareModal bouquet={bouquet} onClose={() => setIsShareModalOpen(false)} />
      )}
    </div>
  );
}
