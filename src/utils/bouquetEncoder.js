// Bouquet State Serializer & Long Distance Couple Presets

export const PRESET_BOUQUETS = [
  {
    id: 'preset-romantic',
    title: 'Across The Ocean Love',
    wrapperStyle: 'kraft',
    ribbonColor: '#e11d48',
    tagTo: 'My Dearest',
    tagFrom: 'With all my love',
    tagDistance: 'Miles Apart ✈️',
    tagMessage: 'Distance means so little when someone means so much.',
    theme: 'rose',
    flowers: [
      { id: 'f-1', type: 'rose', color: '#e11d48', scale: 1.1, rotation: -12, position: { x: 50, y: 35 }, message: 'No matter the miles, you are my very first thought each morning. 🌹', cardTheme: 'parchment' },
      { id: 'f-2', type: 'peony', color: '#f472b6', scale: 1.15, rotation: 8, position: { x: 38, y: 42 }, message: 'Counting down every hour until our next airport hug! 💕', cardTheme: 'rose' },
      { id: 'f-3', type: 'tulip', color: '#fb7185', scale: 1.0, rotation: -22, position: { x: 62, y: 45 }, message: 'Remember: we are falling asleep under the exact same moon tonight. 🌙', cardTheme: 'night' },
      { id: 'f-4', type: 'cherry', color: '#fbcfe8', scale: 0.95, rotation: 18, position: { x: 30, y: 55 }, message: 'Here is a little petal kiss sent across the oceans. 🌸', cardTheme: 'pressed' },
      { id: 'f-5', type: 'hydrangea', color: '#a78bfa', scale: 1.05, rotation: -5, position: { x: 70, y: 58 }, message: 'Thank you for making every time zone feel easy with your love.', cardTheme: 'parchment' },
      { id: 'f-6', type: 'daisy', color: '#fef08a', scale: 0.9, rotation: 12, position: { x: 48, y: 62 }, message: 'Never forget how deeply and constantly you are loved! 😊', cardTheme: 'gold' }
    ]
  },
  {
    id: 'preset-timezones',
    title: 'Time Zones & Sunshine',
    wrapperStyle: 'newsprint',
    ribbonColor: '#d97706',
    tagTo: 'My Soulmate',
    tagFrom: 'Yours Always',
    tagDistance: 'Across the Miles ✈️',
    tagMessage: 'Good morning to you, good night to me!',
    theme: 'parchment',
    flowers: [
      { id: 'fg-1', type: 'sunflower', color: '#f59e0b', scale: 1.2, rotation: 0, position: { x: 50, y: 32 }, message: 'You bring bright sunshine into my darkest late nights. ☀️', cardTheme: 'gold' },
      { id: 'fg-2', type: 'daisy', color: '#ffffff', scale: 1.0, rotation: -15, position: { x: 35, y: 46 }, message: 'Our 3-hour video calls will always be the highlight of my day! 😂', cardTheme: 'parchment' },
      { id: 'fg-3', type: 'wildflower', color: '#3b82f6', scale: 0.95, rotation: 16, position: { x: 65, y: 48 }, message: 'Everlasting love across every single continent and ocean. 💙', cardTheme: 'pressed' },
      { id: 'fg-4', type: 'lavender', color: '#8b5cf6', scale: 1.05, rotation: -8, position: { x: 28, y: 60 }, message: 'Sending sweet calm and peace until I can hold your hand again. 🌿', cardTheme: 'parchment' },
      { id: 'fg-5', type: 'lily', color: '#fde047', scale: 1.1, rotation: 10, position: { x: 72, y: 62 }, message: 'Cheering for you and missing you endlessly from miles away.', cardTheme: 'gold' }
    ]
  },
  {
    id: 'preset-midnight',
    title: 'Under The Same Stars',
    wrapperStyle: 'celestial',
    ribbonColor: '#fbbf24',
    tagTo: 'My Favorite Star Gazer',
    tagFrom: 'Your Constant Dreamer',
    tagDistance: 'Miles Apart, Always Close',
    tagMessage: 'Written beneath the quiet night sky...',
    theme: 'midnight',
    flowers: [
      { id: 'fm-1', type: 'lily', color: '#e0e7ff', scale: 1.15, rotation: -6, position: { x: 50, y: 34 }, message: 'Like starlight piercing the distance, your love lights up my soul. ✨', cardTheme: 'night' },
      { id: 'fm-2', type: 'lavender', color: '#a78bfa', scale: 1.05, rotation: 14, position: { x: 36, y: 45 }, message: 'Sweet dreams across the miles. Meet me in our dreams tonight. 🌌', cardTheme: 'night' },
      { id: 'fm-3', type: 'rose', color: '#f43f5e', scale: 1.1, rotation: -18, position: { x: 64, y: 48 }, message: 'Every single mile between us is going to make our reunion sweeter.', cardTheme: 'pressed' },
      { id: 'fm-4', type: 'hydrangea', color: '#38bdf8', scale: 1.0, rotation: 9, position: { x: 44, y: 60 }, message: 'Sending you boundless comfort and warmth through these petals.', cardTheme: 'parchment' }
    ]
  }
];

export function encodeBouquetToHash(bouquet) {
  try {
    const compactData = {
      t: bouquet.title || 'Long Distance Bouquet',
      w: bouquet.wrapperStyle || 'kraft',
      r: bouquet.ribbonColor || '#e11d48',
      to: bouquet.tagTo || '',
      fr: bouquet.tagFrom || '',
      dis: bouquet.tagDistance || '',
      tm: bouquet.tagMessage || '',
      th: bouquet.theme || 'parchment',
      f: (bouquet.flowers || []).map(flower => ({
        id: flower.id,
        t: flower.type,
        c: flower.color,
        s: flower.scale,
        r: flower.rotation,
        x: Math.round(flower.position.x),
        y: Math.round(flower.position.y),
        m: flower.message || '',
        ct: flower.cardTheme || 'parchment'
      }))
    };

    const jsonStr = JSON.stringify(compactData);
    // encode to base64 safely for URL
    const b64 = btoa(encodeURIComponent(jsonStr));
    return b64;
  } catch (err) {
    console.error('Failed to encode bouquet state:', err);
    return '';
  }
}

export function decodeHashToBouquet(hashString) {
  if (!hashString) return null;
  try {
    const cleanHash = hashString.replace(/^#/, '');
    const jsonStr = decodeURIComponent(atob(cleanHash));
    const compact = JSON.parse(jsonStr);

    return {
      title: compact.t || 'Long Distance Bouquet',
      wrapperStyle: compact.w || 'kraft',
      ribbonColor: compact.r || '#e11d48',
      tagTo: compact.to || '',
      tagFrom: compact.fr || '',
      tagDistance: compact.dis || '',
      tagMessage: compact.tm || '',
      theme: compact.th || 'parchment',
      flowers: (compact.f || []).map(flower => ({
        id: flower.id,
        type: flower.t,
        color: flower.c,
        scale: flower.s || 1,
        rotation: flower.r || 0,
        position: { x: flower.x || 50, y: flower.y || 50 },
        message: flower.m || '',
        cardTheme: flower.ct || 'parchment'
      }))
    };
  } catch (err) {
    console.error('Failed to decode bouquet hash:', err);
    return null;
  }
}
