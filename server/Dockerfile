# Use an official Node image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and lockfile
COPY ./package*.json ./

RUN ls -la

# Install dependencies
RUN yarn install

# Copy the rest of your server code
COPY . .

# Expose the port your server listens on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
