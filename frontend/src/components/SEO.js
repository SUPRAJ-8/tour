import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Enhanced SEO component with full meta tag support.
 * Usage:
 *   <SEO 
 *     title="Page Title" 
 *     description="Page description" 
 *     canonical="https://zyphertours.com/page"
 *     image="https://zyphertours.com/images/page-image.jpg"
 *     type="website"
 *     keywords="keyword1, keyword2"
 *   />
 */
const SEO = ({ 
  title = 'Zypher Tours - Discover Amazing Travel Destinations', 
  description = 'Explore the world with Zypher Tours. Book exclusive travel packages, guided tours, and unforgettable experiences across multiple countries.',
  canonical = 'https://zyphertours.com/',
  image = 'https://zyphertours.com/images/logo.png',
  type = 'website',
  keywords = 'travel tours, tour packages, vacation packages, travel destinations, guided tours'
}) => {
  const siteTitle = title.includes('Zypher Tours') ? title : `${title} | Zypher Tours`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Zypher Tours" />
      
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
