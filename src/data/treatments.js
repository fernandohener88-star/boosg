// Treatment data – single source of truth.
// price: null → shows "Preis auf Anfrage"
// duration: null → omitted from UI
// TODO: fill in prices, durations and images from studio owner

export const treatments = [
  {
    id: 'gesicht',
    category: 'Gesicht',
    title: 'Gesichtsbehandlung',
    text: 'Tiefenreinigende, revitalisierende Treatments für spürbar frischere und strahlendere Haut. Individuell auf Ihren Hauttyp abgestimmt.',
    duration: null, // TODO
    price: null,    // TODO
    priceFrom: false,
    image: '/img/studio-room.png', // TODO: replace with real treatment photo
  },
  {
    id: 'manikuere',
    category: 'Hände',
    title: 'Maniküre',
    text: 'Hochwertige Nagelpflege und -gestaltung. Perfektion bis in die letzte Fingerkuppe.',
    duration: null, // TODO
    price: null,    // TODO
    priceFrom: false,
    image: '/img/nails-magenta.png',
  },
  {
    id: 'nageldesign',
    category: 'Hände',
    title: 'Nagel-Design',
    text: 'Kreative Lackierungen und Nageldesigns – langanhaltend und individuell nach Ihren Wünschen.',
    duration: null, // TODO
    price: null,    // TODO
    priceFrom: false,
    image: '/img/nails-mauve.png',
  },
  {
    id: 'pediküre',
    category: 'Füße',
    title: 'Pediküre',
    text: 'Samtweiche Füße, gepflegte Nägel. Ein Verwöhnprogramm für Ihre Füße.',
    duration: null, // TODO
    price: null,    // TODO
    priceFrom: false,
    image: '/img/nails-lilac.png',
  },
  {
    id: 'augenbrauen',
    category: 'Augenbrauen',
    title: 'Augenbrauen',
    text: 'Präzises Formen und professionelles Färben für ausdrucksstarke Augenbrauen.',
    duration: null, // TODO
    price: null,    // TODO
    priceFrom: false,
    image: '/img/logo-wall.png', // TODO: replace with real photo
  },
];

export const faq = [
  {
    q: 'Wie buche ich einen Termin?',
    a: 'Sie können uns telefonisch unter 0176 80540425 erreichen oder uns eine Nachricht per WhatsApp schicken. Wir melden uns schnellstmöglich zurück.',
  },
  {
    q: 'Wie lange dauert eine Behandlung?',
    a: null, // TODO: confirm with owner
  },
  {
    q: 'Wie kann ich bezahlen?',
    a: null, // TODO: confirm with owner
  },
  {
    q: 'Was passiert, wenn ich einen Termin absagen muss?',
    a: null, // TODO: confirm with owner
  },
  {
    q: 'Wo kann ich parken?',
    a: null, // TODO: confirm with owner
  },
  {
    q: 'Ich habe empfindliche Haut. Ist das ein Problem?',
    a: 'Wir stimmen jede Behandlung individuell auf Ihre Haut und Ihre Bedürfnisse ab. Teilen Sie uns beim Termin gerne mit, wenn Sie empfindliche Haut haben.',
  },
];
