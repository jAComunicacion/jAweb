// SEO Structured Data for Organization - jA Comunicacion
const schemaData = {
  "@context": "https://schema.org/",
  "@type": "Organization",
  "url": "https://jadesignmarketing.ar/",
  "logo": "https://jadesignmarketing.ar/assets/images/logo.png",
  "sameAs": [
    "https://www.facebook.com/jadesignmarketing/",
    "https://www.instagram.com/jadesignmarketing/",
    "https://www.linkedin.com/company/jadesignmarketing-co",
    "https://dribbble.com/jadesignmarketing"
  ],
  "name": "jA Design&Marketing",
  "email": "jadesignmarketing@gmail.com",
  "description": "Agencia de diseño y desarrollo de productos de ciclo completo.",
  "address": {
    "@type": "PostalAddress",
    "postalCode": "1409",
    "streetAddress": "Pasaje Russel 4957B",
    "addressCountry": "AR",
    "addressRegion": "Capital Federal",
    "addressLocality": "Buenos Aires"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "ratingCount": "53",
    "reviewCount": "53",
    "bestRating": "5.0",
    "worstRating": "5.0"
  }
};

// Inject the schema data into the page
document.addEventListener('DOMContentLoaded', function() {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'application/ld+json';
  scriptTag.textContent = JSON.stringify(schemaData);
  document.head.appendChild(scriptTag);
});
