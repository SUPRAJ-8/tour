import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Structured Data component for rich search results
 * Adds JSON-LD schema markup for better Google understanding
 */
const StructuredData = ({ type = 'organization', data = {} }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": "Zypher Tours",
          "description": "Discover amazing travel destinations and tour packages with Zypher Tours. We offer exclusive deals on adventure, cultural, and luxury tours worldwide.",
          "url": "https://zyphertours.com",
          "logo": "https://zyphertours.com/images/logo.png",
          "image": "https://zyphertours.com/images/logo.png",
          "telephone": data.telephone || "",
          "email": data.email || "info@zyphertours.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": data.country || "US"
          },
          "sameAs": [
            data.facebook || "",
            data.twitter || "",
            data.instagram || ""
          ].filter(Boolean),
          "priceRange": "$$",
          "aggregateRating": data.rating ? {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "reviewCount": data.reviewCount || 0
          } : undefined
        };

      case 'tour':
        return {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": data.name,
          "description": data.description,
          "image": data.image,
          "touristType": "Leisure",
          "itinerary": {
            "@type": "ItemList",
            "itemListElement": data.itinerary || []
          },
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": data.currency || "USD",
            "availability": "https://schema.org/InStock",
            "url": data.url,
            "validFrom": data.validFrom
          },
          "provider": {
            "@type": "TravelAgency",
            "name": "Zypher Tours",
            "url": "https://zyphertours.com"
          }
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items?.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          })) || []
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Zypher Tours",
          "url": "https://zyphertours.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://zyphertours.com/tours?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
