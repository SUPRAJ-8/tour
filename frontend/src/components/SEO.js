import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Simple reusable SEO component.
 * Usage:
 *   <SEO title="Home" description="..." canonical="https://example.com/" />
 */
const SEO = ({ title, description, canonical }) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);

export default SEO;
