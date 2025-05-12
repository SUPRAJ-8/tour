import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { getSampleTours, processSampleTours } from "../services/tourService";

// API base URL - change this to your actual backend URL when deploying
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Check if the app is running on GitHub Pages
const isGitHubPages = () => {
  return window.location.hostname === 'supraj-8.github.io' || 
         window.location.href.includes('github.io/tour');
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Shared state for the entire application
  const [tours, setTours] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Fetch all data on initial load and when lastUpdated changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if running on GitHub Pages to use sample data
        if (isGitHubPages()) {
          console.log('DataContext: Running on GitHub Pages, using sample data');
          // Import sample data directly
          const tourService = await import('../services/tourService');
          const sampleTours = tourService.getSampleTours();
          const processedData = tourService.processSampleTours();
          
          setTours(sampleTours);
          setCountries(processedData.countries.map(name => ({ name })));
          setLoading(false);
          return;
        }
        
        // Fetch countries and tours in parallel if not on GitHub Pages
        const [countriesRes, toursRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/countries`),
          axios.get(`${API_BASE_URL}/api/tours`),
        ]);

        // Handle countries response
        if (countriesRes.status === "fulfilled") {
          setCountries(countriesRes.value.data);
        } else {
          console.error("Error fetching countries:", countriesRes.reason);
          // Set empty array if request fails to prevent undefined errors
          setCountries([]);
        }

        // Handle tours response
        if (toursRes.status === "fulfilled") {
          setTours(toursRes.value.data);
        } else {
          console.error("Error fetching tours:", toursRes.reason);
          // Set empty array if request fails to prevent undefined errors
          setTours([]);
        }

        // If both requests failed, set an error message
        if (
          countriesRes.status === "rejected" &&
          toursRes.status === "rejected"
        ) {
          setError(
            "Failed to load data. Please check if the backend server is running."
          );
        }
      } catch (err) {
        console.error("Error in data fetching process:", err);
        setError("Failed to load data. Please try again later.");
        // Set empty arrays to prevent undefined errors
        setCountries([]);
        setTours([]);
      } finally {
        // Always set loading to false, even if there were errors
        setLoading(false);
      }
    };

    fetchData();
  }, [lastUpdated]);

  // Functions to update data that will be shared across the application
  const refreshData = async () => {
    try {
      console.log('Refreshing data from API...');
      
      // Fetch fresh data from the API
      const [countriesRes, toursRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/countries`),
        axios.get(`${API_BASE_URL}/api/tours`),
      ]);

      // Handle countries response
      if (countriesRes.status === "fulfilled") {
        console.log('Countries refreshed:', countriesRes.value.data.length);
        setCountries(countriesRes.value.data);
      }

      // Handle tours response
      if (toursRes.status === "fulfilled") {
        const response = toursRes.value;
        console.log('Tours API response:', response.data);
        
        let toursData = [];
        
        // Handle different API response formats
        if (response.data && Array.isArray(response.data)) {
          toursData = response.data;
          console.log('Tours found in array format:', toursData.length);
        } else if (response.data && response.data.data && Array.isArray(response.data.data.tours)) {
          toursData = response.data.data.tours;
          console.log('Tours found in data.data.tours format:', toursData.length);
        } else if (response.data && Array.isArray(response.data.tours)) {
          toursData = response.data.tours;
          console.log('Tours found in data.tours format:', toursData.length);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          toursData = response.data.data;
          console.log('Tours found in data.data format:', toursData.length);
        } else {
          console.log('Could not find tours array in API response:', response.data);
        }
        
        if (toursData.length > 0) {
          console.log('Tours refreshed:', toursData.length);
          setTours(toursData);
        } else {
          console.warn('No tours found in API response');
        }
      }
      
      // Update the timestamp to trigger any useEffect hooks
      setLastUpdated(Date.now());
      return true;
    } catch (error) {
      console.error('Error refreshing data:', error);
      return false;
    }
  };

  // Tour CRUD operations
  const addTour = async (tourData) => {
    try {
      // Format array fields to remove empty entries
      if (tourData.images) {
        tourData.images = tourData.images.filter((item) => item.trim() !== "");
      }

      if (tourData.highlights) {
        tourData.highlights = tourData.highlights.filter(
          (item) => item.trim() !== ""
        );
      }

      if (tourData.included) {
        tourData.included = tourData.included.filter(
          (item) => item.trim() !== ""
        );
      }

      if (tourData.excluded) {
        tourData.excluded = tourData.excluded.filter(
          (item) => item.trim() !== ""
        );
      }

      if (tourData.startDates) {
        tourData.startDates = tourData.startDates.filter(
          (item) => item.trim() !== ""
        );
      }

      // Check if we're on GitHub Pages
      if (isGitHubPages()) {
        console.log('Running on GitHub Pages - Using mock data for tour creation');
        // Create a mock tour with a random ID
        const newTourId = 'sample_' + Math.random().toString(36).substr(2, 9);
        const mockTour = {
          ...tourData,
          _id: newTourId,
          id: newTourId,
          createdAt: new Date().toISOString()
        };
        
        // Update the local state with the new mock tour
        setTours(prevTours => Array.isArray(prevTours) ? [...prevTours, mockTour] : [mockTour]);
        
        console.log('Created mock tour:', mockTour);
        return mockTour;
      } else {
        // Normal API call for non-GitHub Pages environment
        const res = await axios.post("/api/tours", tourData);
        
        // Update the local state with the new tour
        setTours(prevTours => Array.isArray(prevTours) ? [...prevTours, res.data] : [res.data]);
        
        // Force a refresh to ensure all components get the updated data
        await refreshData();
        
        return res.data;
      }
    } catch (err) {
      console.error("Error adding tour:", err);
      
      // If we're on GitHub Pages, create a mock tour even on error
      if (isGitHubPages()) {
        console.log('Error occurred but creating mock tour anyway for GitHub Pages');
        const newTourId = 'sample_' + Math.random().toString(36).substr(2, 9);
        const mockTour = {
          ...tourData,
          _id: newTourId,
          id: newTourId,
          createdAt: new Date().toISOString()
        };
        
        // Update the local state with the new mock tour
        setTours(prevTours => Array.isArray(prevTours) ? [...prevTours, mockTour] : [mockTour]);
        
        console.log('Created mock tour on error:', mockTour);
        return mockTour;
      }
      
      throw err;
    }
  };

  const updateTour = async (id, tourData) => {
    try {
      // Format array fields to remove empty entries
      if (tourData.images) {
        tourData.images = tourData.images.filter((item) => item.trim() !== "");
      }

      if (tourData.highlights) {
        tourData.highlights = tourData.highlights.filter(
          (item) => item.trim() !== ""
        );
      }

      if (tourData.included) {
        tourData.included = tourData.included.filter(
          (item) => item.trim() !== ""
        );
      }

      if (tourData.excluded) {
        tourData.excluded = tourData.excluded.filter(
          (item) => item.trim() !== ""
        );
      }

      if (tourData.startDates) {
        tourData.startDates = tourData.startDates.filter(
          (item) => item.trim() !== ""
        );
      }

      // Check if we're on GitHub Pages
      if (isGitHubPages()) {
        console.log('Running on GitHub Pages - Using mock data for tour update');
        
        // Find the existing tour in our state
        let existingTour = null;
        if (Array.isArray(tours)) {
          existingTour = tours.find(tour => tour._id === id || tour.id === id);
        }
        
        // If we can't find the tour in our state, try to find it in sample data
        if (!existingTour) {
          const sampleTours = getSampleTours();
          existingTour = sampleTours.find(tour => tour._id === id || tour.id === id);
        }
        
        // Create an updated tour by merging existing data with new data
        const updatedTour = {
          ...(existingTour || {}),
          ...tourData,
          _id: id,
          id: id,
          updatedAt: new Date().toISOString()
        };
        
        // Update the local state
        setTours(prevTours => {
          if (!Array.isArray(prevTours)) return [updatedTour];
          return prevTours.map((tour) => ((tour._id === id || tour.id === id) ? updatedTour : tour));
        });
        
        console.log('Updated mock tour:', updatedTour);
        return updatedTour;
      } else {
        // Normal API call for non-GitHub Pages environment
        // Use PUT instead of PATCH and ensure the API endpoint is correct
        console.log('Updating tour with data:', tourData);
        console.log('Popular Tour value in updateTour:', tourData.popularTour, typeof tourData.popularTour);
        
        // Make sure popularTour and other boolean fields are explicitly included in the request
        const dataToSend = {
          ...tourData,
          // Force these fields to be explicit booleans
          popularTour: Boolean(tourData.popularTour),
          hottestTour: Boolean(tourData.hottestTour),
          featured: Boolean(tourData.featured)
        };
        
        console.log('Sending data to API with explicit boolean values:', {
          popularTour: dataToSend.popularTour,
          hottestTour: dataToSend.hottestTour,
          featured: dataToSend.featured
        });
        
        const res = await axios.put(`/api/tours/${id}`, dataToSend);
        
        // Update the local state with the updated tour
        setTours(prevTours => {
          if (!Array.isArray(prevTours)) return [res.data];
          return prevTours.map((tour) => (tour._id === id ? res.data : tour));
        });
        
        // Force a refresh to ensure all components get the updated data
        await refreshData();
        
        return res.data;
      }
    } catch (err) {
      console.error("Error updating tour:", err);
      
      // If we're on GitHub Pages, update the mock tour even on error
      if (isGitHubPages()) {
        console.log('Error occurred but updating mock tour anyway for GitHub Pages');
        
        // Find the existing tour in our state
        let existingTour = null;
        if (Array.isArray(tours)) {
          existingTour = tours.find(tour => tour._id === id || tour.id === id);
        }
        
        // If we can't find the tour in our state, try to find it in sample data
        if (!existingTour) {
          const sampleTours = getSampleTours();
          existingTour = sampleTours.find(tour => tour._id === id || tour.id === id);
        }
        
        // Create an updated tour by merging existing data with new data
        const updatedTour = {
          ...(existingTour || {}),
          ...tourData,
          _id: id,
          id: id,
          updatedAt: new Date().toISOString()
        };
        
        // Update the local state
        setTours(prevTours => {
          if (!Array.isArray(prevTours)) return [updatedTour];
          return prevTours.map((tour) => ((tour._id === id || tour.id === id) ? updatedTour : tour));
        });
        
        console.log('Updated mock tour on error:', updatedTour);
        return updatedTour;
      }
      
      throw err;
    }
  };

  const deleteTour = async (id) => {
    try {
      // Delete the tour from the API
      await axios.delete(`/api/tours/${id}`);

      // Remove the tour from the local state
      // Ensure tours is always an array before updating
      setTours(prevTours => {
        if (!Array.isArray(prevTours)) return [];
        return prevTours.filter((tour) => tour._id !== id);
      });
      
      // Force a refresh to ensure all components get the updated data
      await refreshData();

      return true;
    } catch (err) {
      console.error("Error deleting tour:", err);
      throw err;
    }
  };

  // Country CRUD operations
  const addCountry = async (countryData) => {
    try {
      // Ensure the country has a continent specified
      if (!countryData.continent) {
        countryData.continent = "asia"; // Default to Asia if not specified
      }

      // Format the popularDestinations and travelTips to remove empty entries
      if (countryData.popularDestinations) {
        countryData.popularDestinations =
          countryData.popularDestinations.filter((item) => item.trim() !== "");
      }

      if (countryData.travelTips) {
        countryData.travelTips = countryData.travelTips.filter(
          (item) => item.trim() !== ""
        );
      }

      const res = await axios.post("/api/countries", countryData);
      setCountries([...countries, res.data]);
      return res.data;
    } catch (err) {
      console.error("Error adding country:", err);
      throw err;
    }
  };

  const updateCountry = async (id, countryData) => {
    try {
      // Make sure heroImage is included
      if (!countryData.heroImage && countryData.image) {
        countryData.heroImage = countryData.image;
      }

      // Format the popularDestinations and travelTips to remove empty entries
      if (countryData.popularDestinations) {
        countryData.popularDestinations =
          countryData.popularDestinations.filter((item) => item.trim() !== "");
      }

      if (countryData.travelTips) {
        countryData.travelTips = countryData.travelTips.filter(
          (item) => item.trim() !== ""
        );
      }

      console.log("Updating country with data:", countryData);
      const res = await axios.patch(`/api/countries/${id}`, countryData);
      console.log("Update response:", res.data);

      // Update the countries array with the updated country
      setCountries(
        countries.map((country) => (country._id === id ? res.data : country))
      );

      // Force a refresh of the data
      setLastUpdated(Date.now());

      return res.data;
    } catch (err) {
      console.error("Error updating country:", err);
      throw err;
    }
  };

  const deleteCountry = async (id) => {
    try {
      // Delete the country from the API
      await axios.delete(`/api/countries/${id}`);

      // Remove the country from the local state
      setCountries(countries.filter((country) => country._id !== id));

      // Also filter out any tours associated with this country
      const updatedTours = tours.filter((tour) => tour.country?._id !== id);
      setTours(updatedTours);

      return true;
    } catch (err) {
      console.error("Error deleting country:", err);
      throw err;
    }
  };

  // Filter tours by country
  const getToursByCountry = (countryId) => {
    return tours.filter((tour) => tour.country._id === countryId);
  };

  // Get popular tours (for homepage)
  const getPopularTours = (limit = 6) => {
    return [...tours]
      .sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0))
      .slice(0, limit);
  };

  // Get countries by continent
  const getCountriesByContinent = (continent) => {
    return countries.filter((country) => country.continent === continent);
  };

  return (
    <DataContext.Provider
      value={{
        tours,
        countries,
        loading,
        error,
        refreshData,
        addTour,
        updateTour,
        deleteTour,
        addCountry,
        updateCountry,
        deleteCountry,
        getToursByCountry,
        getPopularTours,
        getCountriesByContinent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
