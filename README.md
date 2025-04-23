<p style="text-align: center; padding: 20px;">
  <img src="assets/ouf-high-resolution-logo-transparent.webp" height="200">
</p>

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Nuxtjs](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxt&logoColor=#00DC82)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![WebStorm](https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=black)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Debian](https://img.shields.io/badge/Debian-D70A53?style=for-the-badge&logo=debian&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05032.svg?style=for-the-badge&logo=git&logoColor=white)
<img src="https://cdn.hetzner.com/assets/Uploads/Hetzner-Logo-slogan_white_space-red.jpg" alt="Hetzner" height="28"/>

This repository contains the NuxtJS frontend and Nitro backend for fetching, updating, and displaying lunch menus from
various restaurant APIs on the Oulu University campus. The menus are stored in a MongoDB database and can be accessed
via an API endpoint.

## Features

- Fetches lunch menus from multiple restaurant APIs.
- Periodically updates the menus in the MongoDB database.
- Provides an API endpoint to retrieve the compiled list of menus.
- Displays the lunch menus on a NuxtJS frontend.

## Environment

| Variable           | Description                  | Default                   |
|--------------------|------------------------------|---------------------------|
| NUXT_DB_URL        | MongoDB connection URL       | mongodb://127.0.0.1:27017 |
| NUXT_DB_NAME       | MongoDB database name        | ou-lunch                  |
| NUXT_HERO_CORE_URL | Url to a hero cloud instance | 127.0.0.1:1818            |
| OPENAI_API_KEY     | OpenAI API key               |                           |

## API

### GET /api/menu

Retrieves a list of restaurants with their menus for today and future dates.
[view in browser](https://ouf.fi/api/menu?city=Oulu&campus=Linnanmaa)

#### Query Parameters

| Parameter | Type   | Required | Description                                                                                                |
|-----------|--------|----------|------------------------------------------------------------------------------------------------------------|
| city      | string | No       | Filter restaurants by city. If provided, campus must also be provided.                                     |
| campus    | string | No       | Filter restaurants by campus. If provided, city must also be provided.                                     |

#### Response

Returns a JSON array of restaurant objects. For the detailed type definition, 
see [server/utils/types.ts](server/utils/types.ts).

#### Error Responses

- **404 Not Found**: No restaurants found with the given parameters.
- **500 Internal Server Error**: Failed to get menus.

## Frontend

The frontend for this project is built with NuxtJS and is hosted at [ouf.fi](https://ouf.fi).

## Development

Parts marked with `*` are only needed if developing the non-normal opening hours feature.

- Run `npm install` in the root directory to install the dependencies.
- *Run `npm run start:cloud` to start the Ulixee Cloud instance.
- Run `npm run start:db` to start the MongoDB database on Docker. You must have Docker installed.
- Run `npm run dev` to start the NuxtJS frontend in development mode.
- *To update the opening hours, visit `localhost:3000/_nitro/tasks/updateHours` in your browser.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT Licence. See the [LICENCE](LICENSE) file for details.
