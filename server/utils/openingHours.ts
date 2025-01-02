import OpenAI from 'openai';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import {ConnectionToHeroCore} from "@ulixee/hero";
import Hero from "@ulixee/hero";

const OpeningHours = z.object({
  times: z.array(z.object({
    day: z.string(),
    open: z.object({ hours: z.number(), minutes: z.number() }),
    close: z.object({ hours: z.number(), minutes: z.number() })
  }))
});

export const updateOpeningHours = async (restaurant: Restaurant) => {
  const client = new OpenAI();
  let text;
  switch (restaurant.provider) {
    case Provider.juvenes:
      text = await scrapeTextContent(restaurant.url, 'div.grve-bookmark .grve-element');
      break;
    case Provider.uniresta:
      if(restaurant.url.includes('uniresta.fi'))
        text = await scrapeTextContent(restaurant.url, 'div.rivi.two-columns');
      break;
  }

  if(!text) return;

  const now = new Date();
  const end = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  const completions = await client.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at structured data extraction. ' +
          'You will be given unstructured text from a restaurants webpage and should convert the lunchtimes to the given format.' +
          'Extract the lunchtimes that are valid for the given time period. ' +
          'The date is a ISO 8601 type date string without the time. ' +
          'If the restaurants opening times differ from the lunchtimes, use the lunchtimes.' +
          `The timeperiod is ${now.toISOString()} to ${end.toISOString()}.`
      },
      { role: 'user', content: text }
    ],
    response_format: zodResponseFormat(OpeningHours, 'opening_hours_extraction')
  })

  let openingHours = completions.choices[0].message.parsed?.times;
  if(!openingHours) return;

  openingHours = openingHours.map(time => {
    const day = new Date(time.day).getDay();
    const current = restaurant.openingHours?.find(o => o.day === day);
    if (!current) return;
    // If the opening hours are the same, don't update
    if (time.open.hours === current.open.hours && time.open.minutes === current.open.minutes &&
      time.close.hours === current.close.hours && time.close.minutes === current.close.minutes) {
      return;
    } else return time;
  }).filter(o => o !== undefined) as NonNormalOpeningHours[];

  if (openingHours.length > 0) {
    await updateNonNormalOpeningHours(restaurant.name, openingHours);
  }
}

const scrapeTextContent = async (url: string, selector: string) => {
  const config = useRuntimeConfig();
  const hero = new Hero({
    connectionToCore: ConnectionToHeroCore.remote(config.heroCoreUrl),
    blockedResourceTypes: ['BlockImages', 'BlockMedia', 'BlockFonts'],
  });

  await hero.goto(url);
  // Wait for all content to load or max 10 seconds
  await hero.waitForLoad('AllContentLoaded', {
    timeoutMs: 10000,
  })
  // Wait for the page to load
  await hero.waitForPaintingStable();

  let text;
  try {
    text = await hero.document.querySelector(selector).innerText;
  } catch (err) {
    console.error(`Failed to scrape text content from ${url}`, err);
  }

  await hero.close();
  return text;
}
