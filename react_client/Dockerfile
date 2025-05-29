# Use Node.js 20 for compatibility with npm@latest and Expo 53
FROM node:20

# Set Node environment (default to development for hot reloading)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Set default port for Expo web
ARG PORT=19006
ENV PORT=$PORT
EXPOSE $PORT

# Install global dependencies
RUN npm install -g npm@latest expo-cli@latest

# Create and set working directory
WORKDIR /app

# Clear any existing node_modules to avoid conflicts
RUN rm -rf node_modules package-lock.json

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app source code
COPY . .

# Start the Expo web server
CMD ["npx", "expo", "start", "--web", "--port", "19006"]

# Run dit om de Docker container te bouwen en te starten:
# Zorg ervoor dat je in de map bent waar dit bestand staat
# docker build --no-cache -t react_client .
# docker run -p 19006:19006 react_client