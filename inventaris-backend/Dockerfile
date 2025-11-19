# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# This allows caching of dependencies
COPY package.json package-lock.json ./

# Install application dependencies
# Use --omit=dev to avoid installing devDependencies in the production image
RUN npm install --omit=dev

# Copy the rest of the application source code
COPY . .

# Generate Prisma client
# This is crucial for Prisma to work correctly in the deployed application
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5001

# Define the command to run the app
CMD ["node", "server.js"]