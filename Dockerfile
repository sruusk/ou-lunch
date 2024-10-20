# Use the official Node.js image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the application code
COPY . .

# Install dependencies
RUN npm ci

# Build the NuxtJS application
RUN npm run build

# Start the NuxtJS server
CMD ["node", ".output/server/index.mjs"]
