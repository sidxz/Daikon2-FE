# Stage 1: Build the React application
FROM node:25 AS builder

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

# The image must be deployment-neutral: settings come from /config.js at runtime.
# .dockerignore keeps public/config.js out; this catches anything that slips past it.
RUN if [ -e dist/config.js ]; then \
      echo "dist/config.js found: deployment settings would be baked into the image." >&2; \
      echo "Remove it from public/ (see README, Deployment configuration)." >&2; \
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

# Writes /config.js and the /api proxy from DAIKON_* env vars at container start
COPY --chmod=755 docker/40-daikon-config.sh /docker-entrypoint.d/
RUN mkdir -p /etc/nginx/daikon

# Expose port 80
EXPOSE 3000

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
