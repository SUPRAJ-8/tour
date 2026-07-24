import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Enhanced SEO component with full meta tag support.
 * Usage:
 *   <SEO 
 *     title="Page Title" 
 *     description="Page description" 
 *     canonical="https://goldenhopetravels.com/page"
 *     image="https://goldenhopetravels.com/images/page-image.jpg"
 *     type="website"
 *     keywords="keyword1, keyword2"
 *   />
 */
const SEO = ({
  title = 'Golden Hope Travels - Discover Amazing Travel Destinations',
  description = 'Explore the world with Golden Hope Travels. Book exclusive travel packages, guided tours, and unforgettable experiences across multiple countries.',
  canonical = 'https://goldenhopetravels.com/',
  image = 'https://goldenhopetravels.com/images/logo.png',
  type = 'website',
  keywords = 'travel tours, tour packages, vacation packages, travel destinations, guided tours',
  noIndex = false
}) => {
  const siteTitle = title.includes('Golden Hope Travels') ? title : `${title} | Golden Hope Travels`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? 'noindex, follow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Golden Hope Travels" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
