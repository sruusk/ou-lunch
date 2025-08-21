export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const mockDiscounts = [
    {
      id: 'kampaamo-liisa',
      business_name: 'Kampaamo Liisa',
      category: 'beauty-health',
      address: 'Rotuaari 12, Oulu',
      discount_type: 'percentage',
      discount_value: 20,
      discount_description_en: '20% discount on all services',
      discount_description_fi: '20% alennus kaikista palveluista',
      phone: '+358 40 123 4567',
      website: 'https://kampaamoliisa.fi',
      coordinates: { lat: 65.0121, lng: 25.4651 }
    },
    {
      id: 'ravintola-pooki',
      business_name: 'Ravintola Pooki',
      category: 'food-restaurants',
      address: 'Pakkahuoneenkatu 14, Oulu',
      discount_type: 'special_offer',
      discount_value: 0,
      discount_description_en: 'Buy lunch, get free coffee',
      discount_description_fi: 'Osta lounas, saat kahvin kaupan päälle',
      phone: '+358 8 123 4567'
    },
    {
      id: 'finnkino-oulu',
      business_name: 'Finnkino Oulu',
      category: 'culture-events',
      address: 'Kauppurienkatu 23, Oulu',
      discount_type: 'fixed_amount',
      discount_value: 3,
      discount_description_en: '3€ discount on movie tickets',
      discount_description_fi: '3€ alennus elokuvalipuista',
      website: 'https://finnkino.fi/oulu'
    }
  ];

  let filtered = mockDiscounts;

  if (query.category && typeof query.category === 'string') {
    filtered = filtered.filter(d => d.category === query.category);
  }

  if (query.search && typeof query.search === 'string') {
    const searchLower = query.search.toLowerCase();
    filtered = filtered.filter(d => (
      d.business_name.toLowerCase().includes(searchLower) ||
      d.discount_description_en.toLowerCase().includes(searchLower) ||
      d.discount_description_fi.toLowerCase().includes(searchLower)
    ));
  }

  return filtered;
});
