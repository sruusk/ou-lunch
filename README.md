# Oulu University Lunch Menu Backend

This backend application fetches and updates lunch menus from various restaurant APIs on the Oulu University campus. The menus are stored in a MongoDB database and can be accessed via an API endpoint.

## Features

- Fetches lunch menus from multiple restaurant APIs.
- Periodically updates the menus in the MongoDB database.
- Provides an API endpoint to retrieve the compiled list of menus.

## Environment

| Variable | Description            | Default                   |
|----------|------------------------|---------------------------|
| DBURL    | MongoDB connection URL | mongodb://127.0.0.1:27017 |
| DBNAME   | MongoDB database name  | ou-lunch                  |

## API Endpoints

### Get Compiled Menus

- **URL:** `/api/menu`
- **Method:** `GET`
- **Description:** Retrieves the compiled list of lunch menus from the database.

## Frontend

The frontend for this project is hosted at [ouf.fi](https://ouf.fi).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
