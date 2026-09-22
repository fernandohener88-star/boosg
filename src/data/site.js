// Single source of truth – edit here, never in HTML/CSS directly.
// Fields marked TODO must be confirmed by the studio owner before go-live.

export const site = {
  name: 'ACCENT aesthetic studio',
  address: {
    street: 'Martin-Luther-Str. 18', // non-breaking space
    city: 'Landau in der Pfalz',
    zip: '76829',
    country: 'DE',
  },
  phone: {
    display: '0176 80540425',
    href: 'tel:+4917680540425',
  },
  whatsapp: 'https://wa.me/4917680540425', // TODO: confirm studio uses WhatsApp on this number
  geo: { lat: 49.19606, lng: 8.11356 }, // TODO: verify in Google Maps before go-live
  email: null, // TODO
  instagram: null, // TODO
  ownerName: null, // TODO – required for Impressum (§ 5 DDG)
  googlePlaceId: null, // TODO – needed for review link + Bewertungs-Booster

  rating: {
    score: 5.0,
    count: 10,
    // All 10 reviews are 5-star (as of 09/2026).
    // Keep as a config value – update manually when new reviews come in.
  },

  openingHours: null, // TODO – only known: closes at 18:00. Confirm full schedule.
  // Format once known: [{ days: ['Mo','Di','Mi','Do','Fr','Sa'], open: '09:00', close: '18:00' }]

  url: 'https://www.accent-studio-landau.de',
};

export const reviews = [
  {
    author: 'Marissa E.',
    badge: 'Local Guide',
    stars: 5,
    text: 'Ich habe bereits einige Erfahrungen mit verschiedenen Nagelstudios gesammelt, aber eine solche Qualität habe ich bisher noch nicht erlebt. Für mich absolut perfekt – nach oben ist da eigentlich keine Luft mehr.',
    short: '„Nach oben ist da eigentlich keine Luft mehr.“',
  },
  {
    author: 'Maggie S.',
    badge: 'Local Guide',
    stars: 5,
    text: 'Schon beim Betreten des Studios wurde ich herzlich empfangen. Die Atmosphäre ist sehr sauber, modern und entspannend – man fühlt sich sofort wohl.',
    short: '„Sauber, modern, entspannend – man fühlt sich sofort wohl.“',
  },
  {
    author: 'Lisa E.',
    badge: null,
    stars: 5,
    text: 'Ich bin mehr als zufrieden mit meinem Besuch bei ACCENT. Ein perfekter Ort, um es sich gut gehen zu lassen.',
    short: '„Ein perfekter Ort, um es sich gut gehen zu lassen.“',
  },
];

// Seasonal hint dates (for gift-card configurator)
export const seasons = {
  christmas: { start: { month: 11, day: 1 }, label: 'Perfekt als Weihnachtsgeschenk' },
  valentines: { start: { month: 2, day: 1 }, end: { month: 2, day: 14 }, label: 'Zum Valentinstag verschenken' },
  mothersDay: { month: 5, label: 'Zum Muttertag verschenken' }, // exact date varies
};

// Gift card denominations (TODO: confirm with owner)
export const giftCardAmounts = [25, 50, 75, 100];
