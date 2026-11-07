# Stage 1: Build the React application
FROM node:26 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install exactly what package-lock.json pins
RUN npm ci

# Copy the rest of your application's code
COPY . .

# Build the application for production
RUN npm run build

# Settings come from src/config at build time; public/config.js is not used and must
# not ship. .dockerignore keeps it out; this catches anything that slips past it.
RUN if [ -e dist/config.js ]; then \
      echo "dist/config.js found: deployment settings would be baked into the image." >&2; \
      echo "Remove it from public/." >&2; \
      exit 1; \
    fi

# Stage 2: Serve the app with Nginx
FROM nginx:1.30-alpine

# Pick up Alpine security fixes released after the base image was built
RUN apk upgrade --no-cache

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Run unprivileged (the image's nginx user, uid 101). nginx writes only its temp files in
# /var/cache/nginx and its pid in /tmp; drop the unused port-80 sample server.
# ponytail: with readOnlyRootFilesystem, mount writable emptyDirs on /tmp and /var/cache/nginx.
RUN chown -R nginx:nginx /var/cache/nginx && rm /etc/nginx/conf.d/default.conf
USER nginx

# Unprivileged, so a port above 1024
EXPOSE 3000

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
