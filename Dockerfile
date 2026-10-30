# Stage 1: Build the React application
FROM node:24 AS builder

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

# Stage 2: Serve the app with Nginx
FROM nginx:1.30-alpine

# Pick up Alpine security fixes released after the base image was built
RUN apk upgrade --no-cache

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 3000

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
