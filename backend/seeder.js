const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load models
const User = require('./models/User');
const Tour = require('./models/Tour');
const Destination = require('./models/Destination');
const Review = require('./models/Review');
const Booking = require('./models/Booking');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

const destinations = [
  {
    name: 'Kathmandu Valley',
    country: 'Nepal',
    continent: 'Asia',
    description: 'The cultural and historical heart of Nepal, featuring ancient temples, palaces, and vibrant city life.',
    coverImage: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
    images: [
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
      'https://images.unsplash.com/photo-1605640486552-8ad92e02acf7',
      'https://images.unsplash.com/photo-1605640486094-5f5e8f00fe4e'
    ],
    attractions: [
      'Pashupatinath Temple',
      'Boudhanath Stupa',
      'Swayambhunath (Monkey Temple)',
      'Kathmandu Durbar Square',
      'Patan Durbar Square'
    ],
    featured: true
  },
  {
    name: 'Pokhara',
    country: 'Nepal',
    continent: 'Asia',
    description: 'A picturesque lakeside city with stunning views of the Annapurna mountain range, perfect for adventure activities.',
    coverImage: 'https://images.unsplash.com/photo-1605640486094-5f5e8f00fe4e',
    images: [
      'https://images.unsplash.com/photo-1605640486094-5f5e8f00fe4e',
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
      'https://images.unsplash.com/photo-1605640486552-8ad92e02acf7'
    ],
    attractions: [
      'Phewa Lake',
      'World Peace Pagoda',
      'Sarangkot',
      'Davis Falls',
      'Mahendra Cave'
    ],
    featured: true
  },
  {
    name: 'Chitwan National Park',
    country: 'Nepal',
    continent: 'Asia',
    description: 'A UNESCO World Heritage site known for its rich wildlife, including Bengal tigers, rhinos, and diverse bird species.',
    coverImage: 'https://images.unsplash.com/photo-1605640486552-8ad92e02acf7',
    images: [
      'https://images.unsplash.com/photo-1605640486552-8ad92e02acf7',
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
      'https://images.unsplash.com/photo-1605640486094-5f5e8f00fe4e'
    ],
    attractions: [
      'Jungle Safari',
      'Elephant Breeding Center',
      'Canoe Ride',
      'Tharu Cultural Program',
      'Bird Watching'
    ],
    featured: false
  },
  {
    name: 'Everest Region',
    country: 'Nepal',
    continent: 'Asia',
    description: 'Home to the world\'s highest peak, Mount Everest, offering spectacular trekking routes and breathtaking mountain views.',
    coverImage: 'https://images.unsplash.com/photo-1605640486094-5f5e8f00fe4e',
    images: [
      'https://images.unsplash.com/photo-1605640486094-5f5e8f00fe4e',
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
      'https://images.unsplash.com/photo-1605640486552-8ad92e02acf7'
    ],
    attractions: [
      'Mount Everest Base Camp',
      'Kala Patthar',
      'Namche Bazaar',
      'Tengboche Monastery',
      'Gokyo Lakes'
    ],
    featured: true
  },
  {
    name: 'Lumbini',
    country: 'Nepal',
    continent: 'Asia',
    description: 'The birthplace of Lord Buddha and a UNESCO World Heritage site, featuring numerous monasteries and the sacred Mayadevi Temple.',
    coverImage: 'https://images.unsplash.com/photo-1605640486552-8ad92e02acf7',
    images: [
      'https://images.unsplash.com/photo-1605640486552-8ad92e02acf7',
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
      'https://images.unsplash.com/photo-1605640486094-5f5e8f00fe4e'
    ],
    attractions: [
      'Mayadevi Temple',
      'World Peace Pagoda',
      'Lumbini Monastic Zone',
      'Ashoka Pillar',
      'Myanmar Golden Temple'
    ],
    featured: false
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Destination.deleteMany();
    await Tour.deleteMany();
    await Review.deleteMany();
    await Booking.deleteMany();

    console.log('Data cleared...'.red.inverse);

    // Create users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    console.log('Users created...'.green.inverse);

    // Create destinations
    const createdDestinations = await Destination.create(destinations);
    console.log('Destinations created...'.green.inverse);

    // Create tours for each destination
    const tours = [];

    for (const destination of createdDestinations) {
      // Create 2 tours for each destination
      const destinationTours = [
        {
          title: `${destination.name} Explorer - ${destination.country}`,
          description: `Explore the beautiful ${destination.name} in ${destination.country}. This tour offers an immersive experience with local culture, cuisine, and natural wonders.`,
          destination: destination._id,
          duration: Math.floor(Math.random() * 10) + 3, // 3-12 days
          price: Math.floor(Math.random() * 100000) + 50000, // NPR 50,000-150,000
          currency: 'NPR',
          maxGroupSize: Math.floor(Math.random() * 10) + 5, // 5-15 people
          difficulty: ['easy', 'medium', 'difficult'][Math.floor(Math.random() * 3)],
          ratingsAverage: (Math.random() * 2) + 3, // 3-5 rating
          ratingsQuantity: Math.floor(Math.random() * 50) + 5, // 5-55 reviews
          coverImage: destination.coverImage,
          images: destination.images,
          startDates: [
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months from now
          ],
          itinerary: [
            {
              day: 1,
              title: 'Arrival and Welcome',
              description: 'Arrive at the destination, transfer to hotel, and attend welcome dinner.',
              activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner']
            },
            {
              day: 2,
              title: 'Sightseeing Day',
              description: `Explore the main attractions of ${destination.name}.`,
              activities: ['Guided tour', 'Local lunch', 'Cultural show']
            },
            {
              day: 3,
              title: 'Adventure Day',
              description: 'Participate in adventure activities suitable for the location.',
              activities: ['Hiking', 'Photography', 'Local interaction']
            }
          ],
          includes: [
            'Accommodation',
            'Transportation',
            'Professional guide',
            'Meals as per itinerary',
            'Entrance fees'
          ],
          excludes: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Tips for guides',
            'Alcoholic beverages'
          ],
          featured: Math.random() > 0.5,
          createdBy: adminUser
        },
        {
          title: `${destination.name} Discovery - ${destination.country}`,
          description: `Discover the hidden gems of ${destination.name} in ${destination.country}. This tour focuses on off-the-beaten-path experiences and authentic local encounters.`,
          destination: destination._id,
          duration: Math.floor(Math.random() * 10) + 3, // 3-12 days
          price: Math.floor(Math.random() * 100000) + 50000, // NPR 50,000-150,000
          currency: 'NPR',
          maxGroupSize: Math.floor(Math.random() * 10) + 5, // 5-15 people
          difficulty: ['easy', 'medium', 'difficult'][Math.floor(Math.random() * 3)],
          ratingsAverage: (Math.random() * 2) + 3, // 3-5 rating
          ratingsQuantity: Math.floor(Math.random() * 50) + 5, // 5-55 reviews
          coverImage: destination.images[1] || destination.coverImage,
          images: destination.images,
          startDates: [
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 1.5 months from now
            new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // 4 months from now
          ],
          itinerary: [
            {
              day: 1,
              title: 'Arrival Day',
              description: 'Arrive at the destination and transfer to accommodation.',
              activities: ['Airport pickup', 'Hotel check-in', 'Orientation meeting']
            },
            {
              day: 2,
              title: 'Local Experience',
              description: `Immerse in the local culture of ${destination.name}.`,
              activities: ['Local market visit', 'Cooking class', 'Traditional dinner']
            },
            {
              day: 3,
              title: 'Nature Day',
              description: 'Explore the natural beauty of the region.',
              activities: ['Nature walk', 'Picnic lunch', 'Sunset viewing']
            }
          ],
          includes: [
            'Accommodation',
            'Transportation',
            'Professional guide',
            'Meals as per itinerary',
            'Activities mentioned'
          ],
          excludes: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Tips for guides',
            'Optional activities'
          ],
          featured: Math.random() > 0.5,
          createdBy: adminUser
        }
      ];

      tours.push(...destinationTours);
    }

    const createdTours = await Tour.create(tours);
    console.log('Tours created...'.green.inverse);

    // Create reviews for tours
    const reviews = [];
    const reviewTracker = new Map(); // Track which users have reviewed which tours

    for (const tour of createdTours) {
      // Create reviews for each tour (up to number of non-admin users)
      const maxReviews = Math.min(createdUsers.length - 1, 3); // Max 3 reviews per tour
      
      // Create a shuffled array of user indices (excluding admin at index 0)
      const userIndices = [];
      for (let i = 1; i < createdUsers.length; i++) {
        userIndices.push(i);
      }
      
      // Fisher-Yates shuffle algorithm
      for (let i = userIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [userIndices[i], userIndices[j]] = [userIndices[j], userIndices[i]];
      }
      
      // Take only the first maxReviews users
      const selectedUserIndices = userIndices.slice(0, maxReviews);
      
      for (const userIndex of selectedUserIndices) {
        const tourUserKey = `${tour._id}-${createdUsers[userIndex]._id}`;
        
        // Skip if this user has already reviewed this tour
        if (reviewTracker.has(tourUserKey)) {
          continue;
        }
        
        // Mark this tour as reviewed by this user
        reviewTracker.set(tourUserKey, true);
        
        reviews.push({
          review: [
            'Amazing experience! Highly recommended for anyone visiting Nepal.',
            'The tour was well organized and our guide was very knowledgeable.',
            'Beautiful scenery and great cultural experiences. Would book again!',
            'Good value for money. The itinerary was perfect.',
            'The tour exceeded my expectations. The staff was very professional.'
          ][Math.floor(Math.random() * 5)],
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
          tour: tour._id,
          user: createdUsers[userIndex]._id
        });
      }
    }

    await Review.create(reviews);
    console.log('Reviews created...'.green.inverse);

    // Create sample bookings
    const bookings = [];

    // Create 1-2 bookings for each user (except admin)
    for (let i = 1; i < createdUsers.length; i++) {
      const numBookings = Math.floor(Math.random() * 2) + 1;
      
      for (let j = 0; j < numBookings; j++) {
        const tourIndex = Math.floor(Math.random() * createdTours.length);
        const tour = createdTours[tourIndex];
        const numberOfPeople = Math.floor(Math.random() * 3) + 1;
        
        bookings.push({
          tour: tour._id,
          user: createdUsers[i]._id,
          price: tour.price,
          currency: tour.currency,
          startDate: tour.startDates[Math.floor(Math.random() * tour.startDates.length)],
          numberOfPeople: numberOfPeople,
          totalAmount: tour.price * numberOfPeople,
          status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)],
          paymentMethod: ['credit_card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
          paymentStatus: ['pending', 'paid'][Math.floor(Math.random() * 2)],
          specialRequests: Math.random() > 0.5 ? 'Please arrange airport pickup and drop-off.' : ''
        });
      }
    }

    await Booking.create(bookings);
    console.log('Bookings created...'.green.inverse);

    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Destination.deleteMany();
    await Tour.deleteMany();
    await Review.deleteMany();
    await Booking.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Check command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
