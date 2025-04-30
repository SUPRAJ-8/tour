import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

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
        // Fetch countries and tours in parallel
        const [countriesRes, toursRes] = await Promise.allSettled([
          axios.get("/api/countries"),
          axios.get("/api/tours"),
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
  const refreshData = () => {
    setLastUpdated(Date.now());
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

      const res = await axios.post("/api/tours", tourData);
      setTours([...tours, res.data]);
      return res.data;
    } catch (err) {
      console.error("Error adding tour:", err);
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

      const res = await axios.patch(`/api/tours/${id}`, tourData);
      setTours(tours.map((tour) => (tour._id === id ? res.data : tour)));
      return res.data;
    } catch (err) {
      console.error("Error updating tour:", err);
      throw err;
    }
  };

  const deleteTour = async (id) => {
    try {
      // Delete the tour from the API
      await axios.delete(`/api/tours/${id}`);

      // Remove the tour from the local state
      setTours(tours.filter((tour) => tour._id !== id));

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
