// ─────────────────────────────────────────────────────────────
// Store details — fill these in. Anything left empty falls back
// to a sensible display ("Price on request", hidden link, etc).
// ─────────────────────────────────────────────────────────────
export const store = {
  name: 'Kai Store',
  since: 2021,
  // Currency prefix shown before prices, e.g. 'KSh ', '$', '£'.
  currency: '',
  // WhatsApp number in international format, digits only (e.g. '254712345678').
  // When set, orders and support messages open WhatsApp pre-filled.
  whatsapp: '',
  phone: '[PHONE]',
  email: '[EMAIL]',
  address: '[STORE ADDRESS]',
  city: '[CITY]',
  hours: [
    ['Mon – Fri', '[HOURS]'],
    ['Saturday', '[HOURS]'],
    ['Sunday', '[HOURS]'],
  ],
};

// ─────────────────────────────────────────────────────────────
// Products. `price` is a number (no currency) or null.
// Swap `img` for photos of the actual stock in /public/img.
// ─────────────────────────────────────────────────────────────
export const products = [
  {
    id: 'iphone-15-pro-max',
    brand: 'apple',
    brandLabel: 'Apple',
    name: 'iPhone 15 Pro Max',
    condition: 'new',
    img: 'img/iphone15promax-front.jpg',
    fit: 'contain',
    colors: [
      { name: 'Natural Titanium', hex: '#BDB6A8' },
      { name: 'Black Titanium', hex: '#3B3B3D' },
      { name: 'Blue Titanium', hex: '#3E4A5C' },
      { name: 'White Titanium', hex: '#E6E4DF' },
    ],
    storage: ['256 GB', '512 GB', '1 TB'],
    price: null,
  },
  {
    id: 'iphone-15-pro',
    brand: 'apple',
    brandLabel: 'Apple',
    name: 'iPhone 15 Pro',
    condition: 'new',
    img: 'img/iphone15pro-pair.jpg',
    colors: [
      { name: 'Natural Titanium', hex: '#BDB6A8' },
      { name: 'Blue Titanium', hex: '#3E4A5C' },
      { name: 'Black Titanium', hex: '#3B3B3D' },
    ],
    storage: ['128 GB', '256 GB', '512 GB'],
    price: null,
  },
  {
    id: 'iphone-14-pro',
    brand: 'apple',
    brandLabel: 'Apple',
    name: 'iPhone 14 Pro',
    condition: 'pre-owned',
    img: 'img/iphone14pro-purple.jpg',
    colors: [
      { name: 'Deep Purple', hex: '#4B3F5C' },
      { name: 'Space Black', hex: '#2E2E30' },
      { name: 'Silver', hex: '#E3E3E1' },
    ],
    storage: ['128 GB', '256 GB'],
    price: null,
  },
  {
    id: 'galaxy-s24-ultra',
    brand: 'samsung',
    brandLabel: 'Samsung',
    name: 'Galaxy S24 Ultra',
    condition: 'new',
    img: 'img/s24u-pen.jpg',
    colors: [
      { name: 'Titanium Gray', hex: '#8C8B88' },
      { name: 'Titanium Black', hex: '#2F2F31' },
      { name: 'Titanium Violet', hex: '#5C5470' },
    ],
    storage: ['256 GB', '512 GB'],
    price: null,
  },
  {
    id: 'galaxy-s23-ultra',
    brand: 'samsung',
    brandLabel: 'Samsung',
    name: 'Galaxy S23 Ultra',
    condition: 'pre-owned',
    img: 'img/galaxy-s23-ultra.png',
    colors: [
      { name: 'Lavender', hex: '#C9B8D6' },
      { name: 'Phantom Black', hex: '#2B2B2D' },
      { name: 'Green', hex: '#5E6B5A' },
    ],
    storage: ['256 GB', '512 GB'],
    price: null,
  },
  {
    id: 'galaxy-z-flip3',
    brand: 'samsung',
    brandLabel: 'Samsung',
    name: 'Galaxy Z Flip3',
    condition: 'pre-owned',
    img: 'img/zflip3.jpg',
    colors: [
      { name: 'Lavender', hex: '#BFA9D4' },
      { name: 'Cream', hex: '#EDE6D6' },
      { name: 'Phantom Black', hex: '#2B2B2D' },
    ],
    storage: ['128 GB', '256 GB'],
    price: null,
  },
];

export const repairs = [
  { name: 'Screen replacement', note: 'Cracked, flickering or unresponsive', icon: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM9 6l3 4-2 2 4 5' },
  { name: 'Battery', note: 'Drains fast or shuts down early', icon: 'M3 8h15a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM22 11v2M6 11v2M9 11v2' },
  { name: 'Charging port', note: 'Loose cable or won’t charge', icon: 'M9 2v5M15 2v5M7 7h10v4a5 5 0 0 1-10 0V7zM12 16v6' },
  { name: 'Water damage', note: 'Free diagnosis, data first', icon: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z' },
  { name: 'Back glass & camera', note: 'Shattered back or blurry lens', icon: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM10 8a2 2 0 1 0 0-.01M10 13a2 2 0 1 0 0-.01' },
  { name: 'Software & data', note: 'Setup, transfers, updates', icon: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4' },
];

// Photo credits — required by the Creative Commons licences.
export const credits = [
  ['Samsung Galaxy S24 Ultra with dark Background', 'SimonWaldherr', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_S24_Ultra_with_dark_Background.jpg'],
  ['Samsung Galaxy S24 Ultra Backside', 'SimonWaldherr', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_S24_Ultra_Backside.jpg'],
  ['Samsung Galaxy S24 Ultra and Pen with grey Background', 'SimonWaldherr', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_S24_Ultra_and_Pen_with_grey_Background.jpg'],
  ['Apple iPhone 15 Pro', 'IPHONE 15', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Apple_iPhone_15_Pro.jpg'],
  ['iPhone 15 Pro & iPhone 15 Pro Max', 'IPHONE 15', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:IPhone_15_Pro_%26_iPhone_15_Pro_Max.jpg'],
  ['Front of iPhone 15 Pro Max', 'Ayamano2021', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Front_of_iPhone_15_Pro_Max.jpg'],
  ['iPhone 14 Pro Deep Purple (cropped)', 'iGeeksBlog', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:IPhone_14_Pro_Deep_Purple.jpg'],
  ['iPhone 14 Pro (cropped)', 'iGeeksBlog', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:IPhone_14_Pro.jpg'],
  ['Samsung Galaxy S23 Ultra, Lavender', 'PantheraLeo1359531', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_S23_Ultra,_512_GB,_Lavender_20230416_HOF00318_RAW-Export_cens.png'],
  ['Samsung Galaxy Z Flip 3', 'Ka Kit Pang / Google LLC', 'CC BY 3.0', 'https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_Z_Flip_3.jpg'],
];

export const formatPrice = (price) =>
  typeof price === 'number' ? `${store.currency}${price.toLocaleString()}` : 'Price on request';
