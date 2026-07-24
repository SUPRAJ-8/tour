require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Tour = require('../models/Tour');
const Country = require('../models/Country');
const WorkingVisa = require('../models/visaModel');

const SITE = 'https://goldenhopetravels.com';
const OUTPUT_PATH = path.join(__dirname, '../../frontend/public/sitemap.xml');

// Static pages that don't come from the database. Admin/auth-gated pages
// (/admin, /admin-dashboard, /dashboard, /book/:tourId) are intentionally
// excluded — they carry no public SEO value and are noindexed on-page.
const STATIC_ROUTES = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.8' },
  { loc: '/tours', changefreq: 'daily', priority: '0.9' },
  { loc: '/countries', changefreq: 'weekly', priority: '0.9' },
  { loc: '/countries/asia', changefreq: 'weekly', priority: '0.8' },
  { loc: '/countries/europe', changefreq: 'weekly', priority: '0.8' },
  { loc: '/login', changefreq: 'yearly', priority: '0.5' },
  { loc: '/register', changefreq: 'yearly', priority: '0.5' }
];

function urlEntry(loc, changefreq, priority, lastmod) {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function generate() {
  await connectDB();

  const today = new Date().toISOString().split('T')[0];

  const entries = STATIC_ROUTES.map((r) => urlEntry(r.loc, r.changefreq, r.priority, today));

  // Each active tour's canonical, DB-backed detail page.
  const tours = await Tour.find({ status: 'active' }).select('_id createdAt');
  tours.forEach((tour) => {
    const lastmod = (tour.createdAt || new Date()).toISOString().split('T')[0];
    entries.push(urlEntry(`/tours/${tour._id}`, 'weekly', '0.7', lastmod));
  });

  // Each active working-visa package.
  const visas = await WorkingVisa.find({ status: 'active' }).select('_id createdAt');
  visas.forEach((visa) => {
    const lastmod = (visa.createdAt || new Date()).toISOString().split('T')[0];
    entries.push(urlEntry(`/working-visa/${visa._id}`, 'weekly', '0.7', lastmod));
  });

  // Each country's detail page, matching the /countries/:continent/:countryName
  // route shape the frontend actually links to (name, not id — see CountryDetail.js).
  const countries = await Country.find({}).select('name continent createdAt');
  countries.forEach((country) => {
    const lastmod = (country.createdAt || new Date()).toISOString().split('T')[0];
    entries.push(
      urlEntry(
        `/countries/${country.continent}/${encodeURIComponent(country.name.toLowerCase())}`,
        'weekly',
        '0.7',
        lastmod
      )
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`Sitemap written to ${OUTPUT_PATH} with ${entries.length} URLs.`);

  await mongoose.connection.close();
}

generate().catch((err) => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});
