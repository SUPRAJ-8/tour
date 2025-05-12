// Country data for the travel website
// In a real application, this would come from an API or database

// Asian Countries Data
export const getAsianCountries = () => [
  {
    id: 'japan',
    name: 'Japan',
    description: 'Experience a unique blend of ancient traditions and cutting-edge technology in the Land of the Rising Sun.',
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
    region: 'East Asia',
    language: 'Japanese',
    currency: 'Japanese Yen (JPY)',
    highlights: ['Tokyo', 'Kyoto', 'Mount Fuji', 'Osaka', 'Hiroshima'],
    bestTimeToVisit: 'March-May (Spring) and October-November (Fall)',
    travelTips: [
      'Public transportation is excellent and punctual',
      'Cash is still widely used, so have some on hand',
      'Bow when greeting people as a sign of respect'
    ]
  },
  {
    id: 'thailand',
    name: 'Thailand',
    description: 'Discover tropical beaches, opulent royal palaces, ancient ruins and ornate temples displaying Buddha figures.',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Southeast Asia',
    language: 'Thai',
    currency: 'Thai Baht (THB)',
    highlights: ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi', 'Ayutthaya'],
    bestTimeToVisit: 'November-March (dry season)',
    travelTips: [
      'Remove shoes before entering temples and homes',
      'Respect the Thai royal family',
      'Haggling is expected at markets'
    ]
  },
  {
    id: 'india',
    name: 'India',
    description: 'Explore a land of remarkable diversity with ancient temples, colorful festivals, and flavorful cuisine.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
    region: 'South Asia',
    language: 'Hindi, English, and many regional languages',
    currency: 'Indian Rupee (INR)',
    highlights: ['Taj Mahal', 'Jaipur', 'Varanasi', 'Kerala Backwaters', 'Delhi'],
    bestTimeToVisit: 'October-March (cooler, drier months)',
    travelTips: [
      'Dress modestly, especially at religious sites',
      'Be prepared for spicy food',
      'Expect to remove shoes at temples'
    ]
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    description: 'Experience stunning landscapes, bustling cities, and a rich cultural heritage in this Southeast Asian gem.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Southeast Asia',
    language: 'Vietnamese',
    currency: 'Vietnamese Dong (VND)',
    highlights: ['Ha Long Bay', 'Ho Chi Minh City', 'Hanoi', 'Hoi An', 'Mekong Delta'],
    bestTimeToVisit: 'February-April and August-October',
    travelTips: [
      'Learn basic Vietnamese phrases',
      'Traffic is chaotic - be careful when crossing streets',
      'Bargaining is common in markets'
    ]
  },
  {
    id: 'china',
    name: 'China',
    description: 'Discover ancient wonders, modern marvels, and diverse landscapes in the world\'s most populous country.',
    image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'East Asia',
    language: 'Mandarin Chinese',
    currency: 'Chinese Yuan (CNY)',
    highlights: ['Great Wall', 'Forbidden City', 'Terracotta Army', 'Shanghai', 'Guilin'],
    bestTimeToVisit: 'April-May and September-October',
    travelTips: [
      'Many websites are blocked - consider a VPN',
      'Learn basic Mandarin phrases',
      'Cash is still important despite mobile payments'
    ]
  },
  {
    id: 'singapore',
    name: 'Singapore',
    description: 'Experience a futuristic city-state with stunning architecture, diverse cultures, and world-class cuisine.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
    region: 'Southeast Asia',
    language: 'English, Mandarin, Malay, Tamil',
    currency: 'Singapore Dollar (SGD)',
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Orchard Road', 'Chinatown'],
    bestTimeToVisit: 'Year-round (February-April slightly drier)',
    travelTips: [
      'Strict laws against littering and chewing gum',
      'Public transportation is excellent',
      'Tipping is not expected'
    ]
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    description: 'Discover a multicultural country with rainforests, beaches, and vibrant cities.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Southeast Asia',
    language: 'Malay, English, Chinese dialects, Tamil',
    currency: 'Malaysian Ringgit (MYR)',
    highlights: ['Kuala Lumpur', 'Penang', 'Langkawi', 'Borneo', 'Malacca'],
    bestTimeToVisit: 'March-October (varies by region)',
    travelTips: [
      'Remove shoes before entering homes and some businesses',
      'Respect local customs during Ramadan',
      'Use right hand for eating and giving/receiving items'
    ]
  }
];

// European Countries Data
export const getEuropeanCountries = () => [
  {
    id: 'italy',
    name: 'Italy',
    description: 'Experience ancient history, world-renowned art, delicious cuisine, and stunning landscapes in this Mediterranean gem.',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Southern Europe',
    language: 'Italian',
    currency: 'Euro (EUR)',
    highlights: ['Rome', 'Venice', 'Florence', 'Amalfi Coast', 'Tuscany'],
    bestTimeToVisit: 'April-June and September-October',
    travelTips: [
      'Learn basic Italian phrases',
      'Be aware of tourist scams in major cities',
      'Validate train tickets before boarding'
    ]
  },
  {
    id: 'france',
    name: 'France',
    description: 'Discover world-class art, architecture, food, and fashion in this culturally rich European nation.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
    region: 'Western Europe',
    language: 'French',
    currency: 'Euro (EUR)',
    highlights: ['Paris', 'French Riviera', 'Provence', 'Loire Valley', 'Mont Saint-Michel'],
    bestTimeToVisit: 'April-June and September-October',
    travelTips: [
      'Learn basic French phrases',
      'Dress well, especially in Paris',
      'Tipping is not required but appreciated'
    ]
  },
  {
    id: 'spain',
    name: 'Spain',
    description: 'Explore vibrant cities, beautiful beaches, and rich cultural heritage in this diverse Mediterranean country.',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Southern Europe',
    language: 'Spanish',
    currency: 'Euro (EUR)',
    highlights: ['Barcelona', 'Madrid', 'Seville', 'Granada', 'Ibiza'],
    bestTimeToVisit: 'April-June and September-October',
    travelTips: [
      'Expect late dinners (after 9 PM)',
      'Siesta time is real in smaller towns',
      'Learn basic Spanish phrases'
    ]
  },
  {
    id: 'greece',
    name: 'Greece',
    description: 'Experience ancient ruins, stunning islands, and Mediterranean cuisine in the cradle of Western civilization.',
    image: 'https://images.unsplash.com/photo-1503152394-c571994fd383?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Southern Europe',
    language: 'Greek',
    currency: 'Euro (EUR)',
    highlights: ['Athens', 'Santorini', 'Mykonos', 'Crete', 'Meteora'],
    bestTimeToVisit: 'April-June and September-October',
    travelTips: [
      'Island hopping requires planning',
      'Cash is preferred on smaller islands',
      'Learn a few Greek phrases'
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    description: 'Discover historic landmarks, charming countryside, and vibrant cities across England, Scotland, Wales, and Northern Ireland.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Northern Europe',
    language: 'English',
    currency: 'Pound Sterling (GBP)',
    highlights: ['London', 'Edinburgh', 'Lake District', 'Stonehenge', 'Scottish Highlands'],
    bestTimeToVisit: 'May-September',
    travelTips: [
      'Always carry an umbrella',
      'Tipping around 10-15% is customary',
      'Drive on the left side of the road'
    ]
  },
  {
    id: 'germany',
    name: 'Germany',
    description: 'Experience fairytale castles, historic cities, and beautiful landscapes in the heart of Europe.',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Central Europe',
    language: 'German',
    currency: 'Euro (EUR)',
    highlights: ['Berlin', 'Munich', 'Neuschwanstein Castle', 'Black Forest', 'Rhine Valley'],
    bestTimeToVisit: 'May-September, December for Christmas markets',
    travelTips: [
      'Public transportation is excellent',
      'Many places are closed on Sundays',
      'Cash is still widely used'
    ]
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    description: 'Explore stunning Alpine scenery, pristine lakes, and charming villages in this mountainous paradise.',
    image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Central Europe',
    language: 'German, French, Italian, Romansh',
    currency: 'Swiss Franc (CHF)',
    highlights: ['Zurich', 'Geneva', 'Lucerne', 'Interlaken', 'Matterhorn'],
    bestTimeToVisit: 'June-September for hiking, December-March for skiing',
    travelTips: [
      'One of the most expensive countries in Europe',
      'Swiss Travel Pass can save money',
      'Punctuality is highly valued'
    ]
  },
  {
    id: 'portugal',
    name: 'Portugal',
    description: 'Discover beautiful beaches, historic cities, and delicious cuisine in this coastal European nation.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    region: 'Southern Europe',
    language: 'Portuguese',
    currency: 'Euro (EUR)',
    highlights: ['Lisbon', 'Porto', 'Algarve', 'Madeira', 'Sintra'],
    bestTimeToVisit: 'March-May and September-October',
    travelTips: [
      'Learn basic Portuguese phrases',
      'Try the local pastries and wine',
      'Be aware of pickpockets in tourist areas'
    ]
  }
];
