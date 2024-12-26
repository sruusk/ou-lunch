import OpenAI from 'openai';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import {ConnectionToHeroCore} from "@ulixee/hero";
import Hero from "@ulixee/hero";

const OpeningHours = z.object({
  times: z.array(z.object({
    day: z.number(),
    open: z.object({ hours: z.number(), minutes: z.number() }),
    close: z.object({ hours: z.number(), minutes: z.number() })
  }))
});

export const updateOpeningHours = async (restaurant: { url: string, provider: Provider }) => {
  const client = new OpenAI();
  let text;
  switch (restaurant.provider) {
    case Provider.juvenes:
      text = await scrapeTextContent(restaurant.url, 'div.grve-bookmark');
      break;
    case Provider.uniresta:
      text = await scrapeTextContent(restaurant.url, 'div.rivi.two-columns');
      break;
  }
  console.log(text);
  if(!text) return;
  const completions = await client.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert at structured data extraction. ' +
          'You will be given unstructured text from a restaurants webpage and should convert the lunchtimes to the given format.' +
          'The lunchtimes are per weekday, where day is an integer from 0 to 6, where 0 is Sunday and 6 is Saturday.' +
          'Extract the lunchtimes that are valid for the current week.' +
          'If the restaurants opening times differ from the lunchtimes, use the lunchtimes.' +
          `The current date is ${new Date().toISOString()}.` },
      { role: 'user', content: text }
    ],
    response_format: zodResponseFormat(OpeningHours, 'opening_hours_extraction')
  })

  console.log(completions);

  const openingHours = completions.choices[0].message.parsed;

  console.log(openingHours?.times);
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

  const text = await hero.document.querySelector(selector).innerText;
  await hero.close();
  return text;
}
