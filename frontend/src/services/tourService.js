import axios from 'axios';

/**
 * Fetches all tours from the API and organizes them by region and country
 * @returns {Promise<Object>} Object containing tours organized by region and country
 */
export const fetchAllTours = async () => {
  try {
    // Try to fetch from the main tour endpoint
    let toursData = [];
    
    try {
      console.log('Fetching from primary API endpoint...');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Fallback to localhost:5000
      const response = await axios.get(`${apiUrl}/api/tours/all`);
      console.log('Tour API Response:', response);
      
      // Handle different possible response structures
      if (response.data && response.data.tours) {
        toursData = response.data.tours;
        console.log('Found tours in response.data.tours:', toursData.length);
      } else if (Array.isArray(response.data)) {
        toursData = response.data;
        console.log('Found tours in array:', toursData.length);
      } else if (response.data && response.data.data && response.data.data.tours) {
        toursData = response.data.data.tours;
        console.log('Found tours in response.data.data.tours:', toursData.length);
      } else if (response.data) {
        // If response.data exists but doesn't match known formats, try to extract tours
        console.log('Unknown response format, trying to extract tours from:', response.data);
        if (typeof response.data === 'object') {
          // Look for any array property that might contain tours
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              console.log(`Found array in response.data.${key}, checking if it contains tours...`);
              const possibleTours = response.data[key];
              // Check if this array contains objects that look like tours
              if (possibleTours.length > 0 && typeof possibleTours[0] === 'object' && 
                  (possibleTours[0].name || possibleTours[0].title || possibleTours[0].destination)) {
                toursData = possibleTours;
                console.log(`Using tours from response.data.${key}:`, toursData.length);
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Error fetching from primary endpoint, trying fallback:', error);
      
      // Try fallback endpoint
      try {
        console.log('Fetching from fallback API endpoint...');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Fallback to localhost:5000
        const fallbackResponse = await axios.get(`${apiUrl}/api/tours`);
        console.log('Fallback API Response:', fallbackResponse);
        
        if (fallbackResponse.data && fallbackResponse.data.data && fallbackResponse.data.data.tours) {
          toursData = fallbackResponse.data.data.tours;
          console.log('Found tours in fallbackResponse.data.data.tours:', toursData.length);
        } else if (Array.isArray(fallbackResponse.data)) {
          toursData = fallbackResponse.data;
          console.log('Found tours in array:', toursData.length);
        } else if (fallbackResponse.data && fallbackResponse.data.tours) {
          toursData = fallbackResponse.data.tours;
          console.log('Found tours in fallbackResponse.data.tours:', toursData.length);
        } else if (fallbackResponse.data) {
          // If response.data exists but doesn't match known formats, try to extract tours
          console.log('Unknown response format, trying to extract tours from:', fallbackResponse.data);
          if (typeof fallbackResponse.data === 'object') {
            // Look for any array property that might contain tours
            for (const key in fallbackResponse.data) {
              if (Array.isArray(fallbackResponse.data[key])) {
                console.log(`Found array in fallbackResponse.data.${key}, checking if it contains tours...`);
                const possibleTours = fallbackResponse.data[key];
                // Check if this array contains objects that look like tours
                if (possibleTours.length > 0 && typeof possibleTours[0] === 'object' && 
                    (possibleTours[0].name || possibleTours[0].title || possibleTours[0].destination)) {
                  toursData = possibleTours;
                  console.log(`Using tours from fallbackResponse.data.${key}:`, toursData.length);
                  break;
                }
              }
            }
          }
        }
      } catch (fallbackError) {
        console.error('All API endpoints failed:', fallbackError);
      }
    }
    
    // If no tours found, use sample data for development
    if (!toursData || toursData.length === 0) {
      console.log('No tours found in database, using sample data for development');
      return processSampleTours(); // Return sample data for development
    }
    
    console.log('Tours data before processing:', toursData);
    
    // Organize tours by region and country
    const regions = {
      asia: { name: 'Asia', countries: {} },
      europe: { name: 'Europe', countries: {} }
    };
    
    const allCountries = new Set();
    
    toursData.forEach(tour => {
      // Determine the country and region for this tour
      let country = '';
      let region = '';
      
      // Extract country from tour data
      if (tour.country) {
        country = tour.country;
      } else if (tour.destination && tour.destination.country) {
        country = tour.destination.country;
      } else if (tour.startLocation && tour.startLocation.description) {
        country = tour.startLocation.description.split(',')[0].trim();
      } else if (tour.location) {
        country = typeof tour.location === 'string' ? 
          tour.location.split(',')[0].trim() : 
          tour.location.description ? tour.location.description.split(',')[0].trim() : 'Other';
      } else {
        country = 'Other';
      }
      
      // Determine region based on country or destination
      if (tour.destination && tour.destination.continent) {
        region = tour.destination.continent.toLowerCase();
      } else if (tour.continent) {
        region = tour.continent.toLowerCase();
      } else {
        // Map country to region based on common knowledge
        // This is a simplified mapping and might need to be expanded
        const asianCountries = [
          'Thailand', 'Japan', 'China', 'India', 'Vietnam', 'Indonesia', 
          'Malaysia', 'Singapore', 'Philippines', 'South Korea', 'Nepal', 
          'Bhutan', 'Sri Lanka', 'Maldives', 'Cambodia', 'Laos', 'Myanmar'
        ];
        
        const europeanCountries = [
          'United Kingdom', 'France', 'Italy', 'Spain', 'Germany', 'Greece',
          'Switzerland', 'Austria', 'Netherlands', 'Belgium', 'Portugal',
          'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Iceland'
        ];
        
        if (asianCountries.includes(country)) {
          region = 'asia';
        } else if (europeanCountries.includes(country)) {
          region = 'europe';
        } else {
          // Default to Asia if region can't be determined
          region = 'asia';
        }
      }
      
      // Only process tours for Asia and Europe regions
      if (region === 'asia' || region === 'europe') {
        // Add country to the set of all countries
        allCountries.add(country);
        
        // Initialize country in region if it doesn't exist
        if (!regions[region].countries[country]) {
          regions[region].countries[country] = [];
        }
        
        // Add tour to the appropriate region and country
        regions[region].countries[country].push(tour);
      }
    });
    
    // Sort countries within each region
    const sortedRegions = { ...regions };
    Object.keys(sortedRegions).forEach(region => {
      const countriesObj = sortedRegions[region].countries;
      const sortedCountriesArray = Object.keys(countriesObj).sort();
      
      const sortedCountriesObj = {};
      sortedCountriesArray.forEach(country => {
        sortedCountriesObj[country] = countriesObj[country];
      });
      
      sortedRegions[region].countries = sortedCountriesObj;
    });
    
    console.log('Processed regions:', sortedRegions);
    
    return {
      regions: sortedRegions,
      countries: Array.from(allCountries).sort()
    };
  } catch (error) {
    console.error('Error in fetchAllTours:', error);
    return processSampleTours(); // Return sample data as fallback in case of error
  }
};

/**
 * Generates a URL for a tour based on its region and country
 * @param {string} region - The region (e.g., 'asia', 'europe')
 * @param {string} country - The country name
 * @param {string} tourId - The tour ID
 * @returns {string} The URL for the tour
 */
export const getTourUrl = (region, country, tourId) => {
  const formattedRegion = region.toLowerCase();
  const formattedCountry = country.toLowerCase().replace(/\s+/g, '-');
  
  return `/countries/${formattedRegion}/${formattedCountry}/tour/${tourId}`;
};

/**
 * Returns sample tour data for development and testing
 * @returns {Array} Array of sample tour objects
 */
export const getSampleTours = () => {
  return [
    {
      id: 'tour-1',
      name: 'Explore Bangkok',
      summary: 'Experience the vibrant culture and stunning temples of Thailand\'s capital',
      description: 'Discover the beauty of Bangkok with this comprehensive tour. Visit the Grand Palace, Wat Arun, and enjoy authentic Thai cuisine.',
      imageCover: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
      duration: 3,
      price: 299,
      ratingsAverage: 4.7,
      ratingsQuantity: 23,
      country: 'Thailand',
      continent: 'Asia',
      popularTour: true,
      hottestTour: false
    },
    {
      id: 'tour-2',
      name: 'Kyoto Cultural Tour',
      summary: 'Immerse yourself in traditional Japanese culture and history',
      description: 'Explore ancient temples, beautiful gardens, and traditional tea houses in the historic city of Kyoto.',
      imageCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
      duration: 5,
      price: 599,
      ratingsAverage: 4.9,
      ratingsQuantity: 18,
      country: 'Japan',
      continent: 'Asia',
      popularTour: false,
      hottestTour: true
    },
    {
      id: 'tour-3',
      name: 'Paris Highlights',
      summary: 'Discover the magic of the City of Light',
      description: 'Visit the Eiffel Tower, Louvre Museum, Notre Dame Cathedral, and enjoy French cuisine in charming cafes.',
      imageCover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
      duration: 4,
      price: 499,
      ratingsAverage: 4.8,
      ratingsQuantity: 32,
      country: 'France',
      continent: 'Europe'
    },
    {
      id: 'tour-4',
      name: 'Rome Ancient History',
      summary: 'Walk through the footsteps of the Roman Empire',
      description: 'Explore the Colosseum, Roman Forum, Vatican City, and enjoy authentic Italian cuisine.',
      imageCover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
      duration: 6,
      price: 649,
      ratingsAverage: 4.6,
      ratingsQuantity: 27,
      country: 'Italy',
      continent: 'Europe'
    },
    {
      id: 'tour-5',
      name: 'Vietnam Heritage Trail',
      summary: 'Discover the natural beauty and rich history of Vietnam',
      description: 'From bustling Hanoi to serene Ha Long Bay, experience the diverse landscapes and cultures of Vietnam.',
      imageCover: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
      duration: 8,
      price: 799,
      ratingsAverage: 4.8,
      ratingsQuantity: 15,
      country: 'Vietnam',
      continent: 'Asia',
      popularTour: true,
      hottestTour: false
    },
    {
      id: 'tour-6',
      name: 'Swiss Alps Adventure',
      summary: 'Experience the breathtaking beauty of the Swiss mountains',
      description: 'Hike through stunning alpine landscapes, visit charming mountain villages, and enjoy Swiss chocolate and cheese.',
      imageCover: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
      duration: 7,
      price: 899,
      ratingsAverage: 4.9,
      ratingsQuantity: 21,
      country: 'Switzerland',
      continent: 'Europe'
    }
  ];
};

/**
 * Processes sample tour data into the required format
 * @returns {Object} Object containing processed sample tour data
 */
export const processSampleTours = () => {
  const sampleTours = getSampleTours();
  
  // Organize tours by region and country
  const regions = {
    asia: { name: 'Asia', countries: {} },
    europe: { name: 'Europe', countries: {} }
  };
  
  const allCountries = new Set();
  
  sampleTours.forEach(tour => {
    const country = tour.country;
    const region = tour.continent.toLowerCase();
    
    // Add country to the set of all countries
    allCountries.add(country);
    
    // Initialize country in region if it doesn't exist
    if (!regions[region].countries[country]) {
      regions[region].countries[country] = [];
    }
    
    // Add tour to the appropriate region and country
    regions[region].countries[country].push(tour);
  });
  
  // Sort countries within each region
  const sortedRegions = { ...regions };
  Object.keys(sortedRegions).forEach(region => {
    const countriesObj = sortedRegions[region].countries;
    const sortedCountriesArray = Object.keys(countriesObj).sort();
    
    const sortedCountriesObj = {};
    sortedCountriesArray.forEach(country => {
      sortedCountriesObj[country] = countriesObj[country];
    });
    
    sortedRegions[region].countries = sortedCountriesObj;
  });
  
  return {
    regions: sortedRegions,
    countries: Array.from(allCountries).sort()
  };
};
