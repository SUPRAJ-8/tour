import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSuitcaseRolling, FaChevronRight } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import SEO from '../components/SEO';
import './Countries.css';

// Neutral gray placeholder, inline so it can never 404 like a missing/broken file would.
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23ccc'/%3E%3C/svg%3E";

const Categories = () => {
  const { countries } = useData();
  const [allTours, setAllTours] = useState([]);

  // useData().tours isn't usable here: DataContext runs it through
  // processSampleTours(), which ignores its argument and returns mock
  // {regions, countries} data instead of the real tour list. Fetch directly.
  // The Tours page also folds working-visa packages into its "Packages" count
  // (they show up in the same grid), so fetch and merge those too for parity.
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    Promise.all([
      axios.get(`${apiUrl}/api/tours?limit=1000`).then(res => res.data?.data || []).catch(() => []),
      axios.get(`${apiUrl}/api/visas`).then(res => res.data?.data?.data || res.data?.data || []).catch(() => []),
    ]).then(([tours, visas]) => setAllTours([...tours, ...visas]));
  }, []);

  // Count tours+visas per country. Regular tours link to a country by name via
  // `destination` (an object, from a separate model than `Country`); visas use
  // a flat `destination` string. Neither links by id, so match on name.
  const countryTourCount = (country) => {
    const name = country.name?.toLowerCase();
    return allTours.filter(item => {
      const dest = item.destination;
      const destName = typeof dest === 'string' ? dest : (dest?.name || dest?.country || '');
      return destName.toLowerCase() === name;
    }).length;
  };

  // Some country records have junk image data (Google "imgres" search-result
  // links instead of direct image URLs, or short placeholder strings like "sd").
  // Filter those out up front instead of relying solely on onError round-trips.
  const isUsableImage = (url) =>
    typeof url === 'string' && url.length > 20 && !url.includes('google.com/imgres');

  const countryImage = (country) => {
    // Prefer the admin "Hero Image Path" field; fall back to the main image.
    if (isUsableImage(country.heroImage)) return country.heroImage;
    if (isUsableImage(country.image)) return country.image;
    return PLACEHOLDER_IMAGE;
  };

  // Some country names are stored in ALL CAPS (e.g. "JAPAN"). Title-case them
  // for display only — the raw name is still used for the /tours filter link,
  // which matches tour data case-sensitively.
  const displayName = (name) => {
    if (!name || name !== name.toUpperCase()) return name;
    return name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Show every country — countryImage() already falls back to a placeholder
  // for the handful with broken image data, so there's no need to hide them.
  const popularCountries = Array.isArray(countries)
    ? [...countries].sort((a, b) => displayName(a.name).localeCompare(displayName(b.name)))
    : [];
  
  return (
    <div className="countries-page">
      <SEO
        title="Explore Countries"
        description="Discover every destination Golden Hope Travels covers, from bustling Asian capitals to iconic European landmarks, and find tour packages by country."
        canonical="https://goldenhopetravels.com/countries"
      />
      {/* Popular Destinations Section (countries only, no cities) */}
      {popularCountries.length > 0 && (
        <div className="popular-destinations-section">
          <div className="popular-destinations-header">
            <span className="pd-eyebrow">Global Collection</span>
            <h2>Popular Destinations</h2>
            <p>Discover our most sought-after countries, hand-picked for their unique culture, breathtaking landscapes, and unparalleled hospitality.</p>
          </div>
          <div className="popular-destinations-grid">
            {popularCountries.map((country) => (
              <Link
                to={`/tours?country=${encodeURIComponent(country.name)}`}
                className="pd-card"
                key={country._id}
              >
                <img
                  src={countryImage(country)}
                  alt={displayName(country.name)}
                  onError={(e) => {
                    if (e.target.src !== PLACEHOLDER_IMAGE) {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
                <div className="pd-badge">
                  <FaSuitcaseRolling /> {countryTourCount(country)} Package{countryTourCount(country) === 1 ? '' : 's'}
                </div>
                <div className="pd-hover">
                  <span>Explore Packages <FaChevronRight /></span>
                </div>
                <div className="pd-overlay">
                  <h3>{displayName(country.name)}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA Section */}
      <div className="custom-journey-cta">
        <h2>Can't find your perfect journey?</h2>
        <p>Our travel designers are experts in creating bespoke itineraries tailored specifically to your preferences and pace.</p>
        <Link to="/contact" className="cta-button primary">Contact for New Package</Link>
      </div>
    </div>
  );
};

export default Categories;
