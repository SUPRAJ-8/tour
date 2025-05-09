const mongoose = require('mongoose');
const Country = require('../models/Country');
require('dotenv').config();

const countries = [
  // Asian Countries
  {
    name: "Japan",
    continent: "asia",
    description: "A fascinating blend of ancient traditions and cutting-edge technology, Japan offers visitors a unique experience with its rich culture, stunning temples, and modern cities.",
    capital: "Tokyo",
    language: "Japanese",
    currency: "Japanese Yen (JPY)",
    timeZone: "UTC+9",
    image: "/images/countries/japan.jpg",
    flagImage: "/images/flags/japan.jpg",
    popularDestinations: [
      "Tokyo",
      "Kyoto",
      "Mount Fuji",
      "Osaka",
      "Hiroshima"
    ],
    bestTimeToVisit: "March to May (Spring) and October to November (Autumn)",
    travelTips: [
      "Get a Japan Rail Pass for convenient travel",
      "Learn basic Japanese phrases",
      "Try the local cuisine",
      "Visit temples early in the morning",
      "Book accommodations in advance during peak seasons"
    ]
  },
  {
    name: "Thailand",
    continent: "asia",
    description: "Known for its tropical beaches, opulent royal palaces, ancient ruins, and ornate temples, Thailand offers a perfect mix of culture, cuisine, and natural beauty.",
    capital: "Bangkok",
    language: "Thai",
    currency: "Thai Baht (THB)",
    timeZone: "UTC+7",
    image: "/images/countries/thailand.jpg",
    flagImage: "/images/flags/thailand.jpg",
    popularDestinations: [
      "Bangkok",
      "Phuket",
      "Chiang Mai",
      "Ayutthaya",
      "Krabi"
    ],
    bestTimeToVisit: "November to March (Cool and Dry season)",
    travelTips: [
      "Respect temple dress codes",
      "Learn basic Thai greetings",
      "Try street food",
      "Negotiate prices at markets",
      "Stay hydrated in hot weather"
    ]
  },
  {
    name: "Vietnam",
    continent: "asia",
    description: "Vietnam captivates visitors with its bustling cities, breathtaking natural landscapes, rich history, and amazing street food culture.",
    capital: "Hanoi",
    language: "Vietnamese",
    currency: "Vietnamese Dong (VND)",
    timeZone: "UTC+7",
    image: "/images/countries/vietnam.jpg",
    flagImage: "/images/flags/vietnam.jpg",
    popularDestinations: [
      "Ha Long Bay",
      "Hanoi",
      "Ho Chi Minh City",
      "Hoi An",
      "Sapa"
    ],
    bestTimeToVisit: "February to April and August to October",
    travelTips: [
      "Learn to cross the street safely",
      "Try Vietnamese coffee",
      "Bargain at local markets",
      "Take overnight trains for long distances",
      "Respect local customs"
    ]
  },
  {
    name: "China",
    continent: "asia",
    description: "The world's most populous country offers an incredible mix of ancient wonders, modern cities, diverse landscapes, and rich cultural experiences.",
    capital: "Beijing",
    language: "Mandarin Chinese",
    currency: "Chinese Yuan (CNY)",
    timeZone: "UTC+8",
    image: "/images/countries/china.jpg",
    flagImage: "/images/flags/china.jpg",
    popularDestinations: [
      "Great Wall of China",
      "Beijing",
      "Shanghai",
      "Xi'an",
      "Chengdu"
    ],
    bestTimeToVisit: "September to October (Autumn) and March to May (Spring)",
    travelTips: [
      "Download translation apps",
      "Get a VPN before arrival",
      "Learn to use chopsticks",
      "Carry cash as many places don't accept cards",
      "Book train tickets in advance"
    ]
  },
  {
    name: "Singapore",
    continent: "asia",
    description: "A modern city-state that combines urban sophistication with tropical gardens, diverse culture, and world-renowned cuisine.",
    capital: "Singapore",
    language: "English, Malay, Mandarin, Tamil",
    currency: "Singapore Dollar (SGD)",
    timeZone: "UTC+8",
    image: "/images/countries/singapore.jpg",
    flagImage: "/images/flags/singapore.jpg",
    popularDestinations: [
      "Marina Bay Sands",
      "Gardens by the Bay",
      "Sentosa Island",
      "Orchard Road",
      "Chinatown"
    ],
    bestTimeToVisit: "February to April (Dry season)",
    travelTips: [
      "Follow strict cleanliness laws",
      "Use public transport",
      "Try local hawker centers",
      "Get a Singapore Tourist Pass",
      "Visit during the Singapore Food Festival"
    ]
  },
  {
    name: "Malaysia",
    continent: "asia",
    description: "A multicultural country offering diverse experiences from modern cities to ancient rainforests, beautiful beaches, and rich cultural heritage.",
    capital: "Kuala Lumpur",
    language: "Malay, English",
    currency: "Malaysian Ringgit (MYR)",
    timeZone: "UTC+8",
    image: "/images/countries/malaysia.jpg",
    flagImage: "/images/flags/malaysia.jpg",
    popularDestinations: [
      "Kuala Lumpur",
      "Penang",
      "Malacca",
      "Langkawi",
      "Borneo"
    ],
    bestTimeToVisit: "December to April (Dry season)",
    travelTips: [
      "Respect local customs and dress codes",
      "Try diverse local cuisine",
      "Use grab for transportation",
      "Visit during cultural festivals",
      "Explore both peninsular and Borneo Malaysia"
    ]
  },

  // European Countries
  {
    name: "Italy",
    continent: "europe",
    region: "Southern Europe",
    description: "Home to many of the world's greatest works of art, architecture and gastronomy, Italy offers an unforgettable mix of history, culture, and cuisine.",
    capital: "Rome",
    language: "Italian",
    currency: "Euro (EUR)",
    timeZone: "UTC+1",
    image: "/images/countries/italy.jpg",
    flagImage: "/images/flags/italy.jpg",
    popularDestinations: [
      "Rome",
      "Venice",
      "Florence",
      "Milan",
      "Amalfi Coast"
    ],
    bestTimeToVisit: "April to June or September to October",
    travelTips: [
      "Learn basic Italian phrases",
      "Book major attractions in advance",
      "Try regional specialties",
      "Be aware of siesta times",
      "Validate train tickets before boarding"
    ]
  },
  {
    name: "France",
    continent: "europe",
    region: "Western Europe",
    description: "A country that captivates visitors with its culture, gastronomy, fashion, and art, France offers everything from iconic landmarks to charming countryside.",
    capital: "Paris",
    language: "French",
    currency: "Euro (EUR)",
    timeZone: "UTC+1",
    image: "/images/countries/france.jpg",
    flagImage: "/images/flags/france.jpg",
    popularDestinations: [
      "Paris",
      "French Riviera",
      "Loire Valley",
      "Provence",
      "Mont Saint-Michel"
    ],
    bestTimeToVisit: "April to October (Spring to Fall)",
    travelTips: [
      "Learn basic French phrases",
      "Book museums in advance",
      "Try local wines and cheeses",
      "Use public transportation in cities",
      "Experience local markets"
    ]
  },
  {
    name: "Spain",
    continent: "europe",
    region: "Southern Europe",
    description: "Known for its rich history, vibrant culture, beautiful beaches, and amazing food, Spain offers a perfect blend of tradition and modernity.",
    capital: "Madrid",
    language: "Spanish",
    currency: "Euro (EUR)",
    timeZone: "UTC+1",
    image: "/images/countries/spain.jpg",
    flagImage: "/images/flags/spain.jpg",
    popularDestinations: [
      "Barcelona",
      "Madrid",
      "Seville",
      "Granada",
      "Valencia"
    ],
    bestTimeToVisit: "March to May or September to November",
    travelTips: [
      "Adjust to Spanish meal times",
      "Book Alhambra tickets early",
      "Try tapas and local wines",
      "Use high-speed trains between cities",
      "Watch for siesta hours"
    ]
  },
  {
    name: "Greece",
    continent: "europe",
    region: "Southern Europe",
    description: "The cradle of Western civilization, Greece offers ancient ruins, stunning islands, delicious cuisine, and warm Mediterranean hospitality.",
    capital: "Athens",
    language: "Greek",
    currency: "Euro (EUR)",
    timeZone: "UTC+2",
    image: "/images/countries/greece.jpg",
    flagImage: "/images/flags/greece.jpg",
    popularDestinations: [
      "Athens",
      "Santorini",
      "Mykonos",
      "Crete",
      "Meteora"
    ],
    bestTimeToVisit: "April to October (peak season June to September)",
    travelTips: [
      "Island hop by ferry",
      "Try local Greek dishes",
      "Visit ancient sites early",
      "Learn basic Greek phrases",
      "Respect Orthodox church dress codes"
    ]
  },
  {
    name: "United Kingdom",
    continent: "europe",
    region: "Northern Europe",
    description: "A diverse country rich in history, culture, and tradition, offering everything from historic castles to modern art galleries and beautiful countryside.",
    capital: "London",
    language: "English",
    currency: "British Pound (GBP)",
    timeZone: "UTC+0",
    image: "/images/countries/uk.jpg",
    flagImage: "/images/flags/uk.jpg",
    popularDestinations: [
      "London",
      "Edinburgh",
      "Bath",
      "Lake District",
      "Scottish Highlands"
    ],
    bestTimeToVisit: "May to September",
    travelTips: [
      "Get an Oyster card in London",
      "Book train tickets in advance",
      "Try traditional pub food",
      "Pack for variable weather",
      "Drive on the left side"
    ]
  },
  {
    name: "Germany",
    continent: "europe",
    region: "Western Europe",
    description: "A country of fairytale castles, vibrant cities, beautiful forests, and world-class beer, Germany offers something for every type of traveler.",
    capital: "Berlin",
    language: "German",
    currency: "Euro (EUR)",
    timeZone: "UTC+1",
    image: "/images/countries/germany.jpg",
    flagImage: "/images/flags/germany.jpg",
    popularDestinations: [
      "Berlin",
      "Munich",
      "Black Forest",
      "Neuschwanstein Castle",
      "Hamburg"
    ],
    bestTimeToVisit: "May to September, December for Christmas markets",
    travelTips: [
      "Use efficient public transport",
      "Try local beers and sausages",
      "Book Oktoberfest well ahead",
      "Learn basic German phrases",
      "Carry cash as cards aren't always accepted"
    ]
  },
  {
    name: "Switzerland",
    continent: "europe",
    region: "Western Europe",
    description: "A picturesque country known for its stunning Alps, pristine lakes, chocolate, watches, and banking system, offering year-round attractions.",
    capital: "Bern",
    language: "German, French, Italian, Romansh",
    currency: "Swiss Franc (CHF)",
    timeZone: "UTC+1",
    image: "/images/countries/switzerland.jpg",
    flagImage: "/images/flags/switzerland.jpg",
    popularDestinations: [
      "Zurich",
      "Lucerne",
      "Interlaken",
      "Zermatt",
      "Geneva"
    ],
    bestTimeToVisit: "June to September for hiking, December to March for skiing",
    travelTips: [
      "Get a Swiss Travel Pass",
      "Book mountain excursions in advance",
      "Try Swiss chocolate and cheese",
      "Prepare for high costs",
      "Learn basic phrases in multiple languages"
    ]
  },
  {
    name: "Portugal",
    continent: "europe",
    region: "Southern Europe",
    description: "A country of stunning beaches, historic cities, excellent wine, and warm hospitality, Portugal offers a perfect blend of culture and relaxation.",
    capital: "Lisbon",
    language: "Portuguese",
    currency: "Euro (EUR)",
    timeZone: "UTC+0",
    image: "/images/countries/portugal.jpg",
    flagImage: "/images/flags/portugal.jpg",
    popularDestinations: [
      "Lisbon",
      "Porto",
      "Algarve",
      "Madeira",
      "Sintra"
    ],
    bestTimeToVisit: "March to October",
    travelTips: [
      "Try Port wine in Porto",
      "Use public transportation",
      "Learn basic Portuguese phrases",
      "Visit historic neighborhoods",
      "Try fresh seafood"
    ]
  }
];

const seedCountries = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Delete existing countries
    await Country.deleteMany({});
    console.log('Deleted existing countries...');

    // Insert new countries
    await Country.insertMany(countries);
    console.log('Added new countries successfully!');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding countries:', error);
    process.exit(1);
  }
};

seedCountries();
