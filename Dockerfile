# Use the official lightweight Node.js base image.
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock files
COPY package*.json ./
COPY yarn*.lock ./

# Install dependencies
RUN npm install # or use yarn

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Run your app
CMD ["npm", "start"]
