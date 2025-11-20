FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code, including the prisma schema
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["npm", "start"]
