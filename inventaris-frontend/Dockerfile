# Stage 1: Build the React application
FROM node:20-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
# VITE_API_BASE_URL will be provided during the docker-compose setup
# For now, we can build it with a placeholder or default if needed
# But typically, you'd want to pass this as a build arg or env var for the frontend build
# This will be handled by docker-compose environment settings during the build process
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine as production-stage

# Copy the build output from the build-stage to Nginx's public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration for your frontend if needed
# For a basic static site, the default Nginx config is often fine
# If your Nginx config for frontend should handle routing for SPAs (like React), you might need this:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx's default)
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]