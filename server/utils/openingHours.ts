// noinspection SpellCheckingInspection

import OpenAI from 'openai';
import { z } from 'zod';
import {zodResponseFormat, zodTextFormat} from 'openai/helpers/zod';
import Hero, { ConnectionToHeroCore } from '@ulixee/hero';

const OpeningHours = z.object({
  times: z.array(z.object({
    day: z.string(),
    open: z.object({ hours: z.number(), minutes: z.number() }),
    close: z.object({ hours: z.number(), minutes: z.number() }),
  })),
});

export const updateOpeningHours = async (restaurant: Restaurant) => {
  const client = new OpenAI();
  let text = '';
  switch (restaurant.provider) {
    case Provider.juvenes:
      text = await scrapeTextContent(restaurant.url, [
        'div.elementor-element:has(> div.elementor-element > div.elementor-element > div > div > div.aukiolot)',
      ]);
      break;
    case Provider.uniresta:
      if (restaurant.url.includes('uniresta.fi'))
        text = await scrapeTextContent(restaurant.url, ['div.rivi.two-columns']);
      break;
  }

  if (!text?.length) {
    console.warn(`No text found for ${restaurant.name}`);
    return;
  }

  const now = new Date();
  const end = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  const response = await client.responses.parse({
    model: 'gpt-5-mini',
    input: [
      {
        role: 'system',
        content: 'You are an expert at structured data extraction. '
          + 'You will be given unstructured text from a restaurants webpage and should convert the lunchtimes to the given format.'
          + 'Extract the lunchtimes that are valid for the given time period. '
          + 'The date is a ISO 8601 type date string without the time. '
          + 'If the restaurants opening times differ from the lunchtimes, use the lunchtimes.'
          + `The time period is ${now.toISOString()} to ${end.toISOString()}.`,
      },
      { role: 'user', content: text },
    ],
    text: {
      format: zodTextFormat(OpeningHours, 'opening_hours_extraction'),
    },
  });

  let openingHours = (response.output_parsed as z.infer<typeof OpeningHours> | null)?.times;
  if (!openingHours) return;

  openingHours = openingHours.map((time) => {
    const day = new Date(time.day).getDay();
    const current = restaurant.openingHours?.find(o => o.day === day);
    if (!current) return;
    // If the opening hours are the same, don't update
    if (time.open.hours === current.open.hours && time.open.minutes === current.open.minutes
      && time.close.hours === current.close.hours && time.close.minutes === current.close.minutes) {
      return;
    }
    else return time;
  }).filter(o => o !== undefined) as NonNormalOpeningHours[];

  console.log(`Found ${openingHours.length} non-normal opening hours for ${restaurant.name}`, openingHours);

  await updateNonNormalOpeningHours(restaurant.name, openingHours);
};

const scrapeTextContent = async (url: string, selectors: string[]) => {
  const config = useRuntimeConfig();
  const hero = new Hero({
    connectionToCore: ConnectionToHeroCore.remote(config.heroCoreUrl),
    blockedResourceTypes: ['BlockImages', 'BlockMedia', 'BlockFonts'],
  });

  await hero.goto(url);

  let text = '';
  try {
    await hero.waitForLoad('AllContentLoaded', { timeoutMs: 120000 });
    await hero.waitForPaintingStable();

    // text = await hero.document.querySelector(selector).innerText;
    for (const selector of selectors) {
      const element = await hero.document.querySelector(selector);
      if (element) {
        if (text?.length) text += '\n\n';
        text += await element.innerText;
      }
    }
  }
  catch (err) {
    console.error(`Failed to scrape text content from ${url}`, err);
  }

  await hero.close();
  return text;
};
