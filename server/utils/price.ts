/* eslint-disable no-useless-escape,no-irregular-whitespace */
// noinspection SpellCheckingInspection

export const updateRestaurantPrices = async (): Promise<void> => {
  const restaurants = await getMenus({});
  const juvenes = restaurants.filter(restaurant => restaurant.provider === Provider.juvenes);
  for (const restaurant of juvenes) {
    const prices = await getJuvenesPrices(restaurant.url);
    await updatePrices(restaurant.name, prices);
  }

  const uniresta = restaurants.filter(restaurant => restaurant.provider === Provider.uniresta && restaurant.url.includes('uniresta.fi'));
  const prices = getUnirestaPrices();
  for (const restaurant of uniresta) {
    await updatePrices(restaurant.name, prices);
  }
};

const getJuvenesPrices = async (url: string): Promise<Price[]> => {
  const pricesRegexes = [
    /(?:<div class="hinnasto-rivi"><strong>|<div class="kuvaus"><p>)(\b[ A-ZÖÄÅ\-&;]+)(?:: |<\/strong><br><div class="kuvaus"><p>)(\d+,\d+ ?€).+?(\d+,\d+ ?€).+?(\d+,\d+ ?€)/gi, // Oulu Uni Restaurants
    /<strong>.+?>([a-zöäå\- ]+)(?:.|\n)+?(?:Opiskelijat|Students).+?(\d+,\d+ ?€)(?:.|\n)+?(?:Henkilökunta|Staff).+?(\d+,\d+ ?€)(?:.|\n)+?(?:(?=<strong>)|(?:Vierailijat|Visitors).+?(\d+,\d+ ?€))/gi, // Konehuone
    /<strong>(LOUNAS|LUNCH)(?:.|\n)+?(\d+,\d+ ?€(?:\/\d+,\d+ ?€)?)(?:.|\n)+?(\d+,\d+ ?€(?:\/\d+,\d+ ?€)?)(?:.|\n)+?(?:Muut|Others)(?:.|\n)+?(\d+,\d+ ?€(?:\/\d+,\d+ ?€)?)/gi, // Newton
  ];
  const res = await fetch(url).then(res => res.text());
  const resEng = await fetch(url.replace('juvenes.fi/', 'juvenes.fi/en/')).then(res => res.text());
  const prices: Price[] = [];

  for (const r of pricesRegexes) {
    const matches = res.matchAll(r);
    const matchesEng = resEng.matchAll(r);
    for (const match of matches) {
      if (match.length < 3) continue;
      const [, name, student, staff, other] = match;
      if (prices.some(price => price.title_fi === name)) continue; // Skip duplicates
      const next = matchesEng?.next();
      const nameEng = next?.value?.[1];
      prices.push({
        title_fi: name,
        title_en: nameEng || name,
        student: student,
        staff: staff,
        other: other,
      });
    }
    if (prices.length > 0) break;
  }
  if (prices.length === 0) console.error('No prices found for', url);
  return prices;
};

// TODO: Dynamically fetch prices from Uniresta
const getUnirestaPrices = (): Price[] => {
  return [{
    title_fi: 'Lounas',
    title_en: 'Lunch',
    student: '2,95 €',
    staff: '5,89 €',
    other: '12,10 €',
  }, {
    title_fi: 'Herkkulounas',
    title_en: 'Herkku lunch',
    student: '5,25 €',
    staff: '9,60 €',
    other: '12,10 €',
  }, {
    title_fi: 'Erikoislounas',
    title_en: 'Special lunch',
    student: '5,60 €',
    staff: '11,10 €',
    other: '13,60 €',
  }];
};
