import axios from 'axios';
import { getSampleTours, processSampleTours } from './tourService';

// Check if the app is running on GitHub Pages
const isGitHubPages = () => {
  return window.location.hostname === 'supraj-8.github.io' || 
         window.location.href.includes('github.io/tour');
};

// Configure axios interceptors
if (isGitHubPages()) {
  console.log('Running on GitHub Pages - Using sample data');
  
  // Intercept all API requests
  axios.interceptors.request.use(config => {
    // Log the intercepted request
    console.log('Intercepted request:', config.url);
    return config;
  });

  // Intercept all API responses
  axios.interceptors.response.use(
    response => response,
    error => {
      // Only handle network errors or 404s from API calls
      if (!error.response || error.response.status === 404) {
        const url = error.config.url;
        const method = error.config.method;
        console.log('Intercepting failed request:', method, url);
        
        // Handle POST and PATCH requests for tours
        if (method === 'post' && url.includes('/api/tours')) {
          console.log('Handling tour creation request');
          const tourData = JSON.parse(error.config.data);
          // Generate a random ID for the new tour
          const newTourId = 'sample_' + Math.random().toString(36).substr(2, 9);
          const newTour = {
            ...tourData,
            _id: newTourId,
            id: newTourId
          };
          console.log('Created mock tour:', newTour);
          return Promise.resolve({ data: newTour });
        }
        
        // Handle PATCH requests for updating tours
        if (method === 'patch' && url.match(/\/api\/tours\/[\w-]+/)) {
          console.log('Handling tour update request for URL:', url);
          try {
            const tourId = url.split('/').pop();
            const tourData = JSON.parse(error.config.data);
            console.log('Updating tour with ID:', tourId);
            console.log('Update data:', tourData);
            
            // Get existing tours to find the one we're updating
            const allTours = getSampleTours();
            const existingTour = allTours.find(t => t._id === tourId || t.id === tourId);
            
            const updatedTour = {
              ...(existingTour || {}),
              ...tourData,
              _id: tourId,
              id: tourId
            };
            console.log('Updated mock tour:', updatedTour);
            return Promise.resolve({ data: updatedTour });
          } catch (e) {
            console.error('Error in tour update interceptor:', e);
            // Still return a successful response to prevent the app from showing errors
            const tourId = url.split('/').pop();
            return Promise.resolve({ 
              data: { 
                _id: tourId, 
                id: tourId,
                ...JSON.parse(error.config.data)
              } 
            });
          }
        }
        
        // Handle POST and PATCH requests for destinations
        if ((method === 'post' || method === 'patch') && url.includes('/api/destinations')) {
          console.log('Handling destination save/update request');
          const destData = JSON.parse(error.config.data);
          // Generate a random ID for the new destination
          const newDestId = 'sample_dest_' + Math.random().toString(36).substr(2, 9);
          const newDest = {
            ...destData,
            _id: newDestId,
            id: newDestId
          };
          console.log('Created/updated mock destination:', newDest);
          return Promise.resolve({ data: newDest });
        }
        
        // Return mock data based on the URL pattern for GET requests
        if (url.includes('/api/tours/all') || url.includes('/api/tours')) {
          console.log('Returning sample tours data');
          return Promise.resolve({ 
            data: { tours: getSampleTours() } 
          });
        }
        
        if (url.includes('/api/countries')) {
          console.log('Returning sample countries data');
          const processedData = processSampleTours();
          return Promise.resolve({ 
            data: processedData.countries 
          });
        }

        // For country-specific tour requests
        if (url.match(/\/api\/tours\/country\/[\w-]+/)) {
          console.log('Returning country-specific sample tour data');
          const countryName = url.split('/').pop().toLowerCase();
          const allTours = getSampleTours();
          const countryTours = allTours.filter(tour => 
            tour.country.toLowerCase() === countryName
          );
          return Promise.resolve({ data: countryTours });
        }
      }
      
      // If not handled, continue with the error
      return Promise.reject(error);
    }
  );
}

export default axios;