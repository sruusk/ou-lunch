# Use the official Node.js image as the base image
FROM node:20 AS build

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the application code
COPY . .

# Install dependencies
RUN npm ci

# Build the NuxtJS application
RUN npm run build

# Start a new stage from the base image
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the application code
COPY --from=build /usr/src/app/.output .

# Start the NuxtJS server
CMD ["node", "server/index.mjs"]
