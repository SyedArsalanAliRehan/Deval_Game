 # Use an official Node.js runtime as the base image
FROM node:16-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if they exist)
COPY package*.json ./

# Install any dependencies if needed
RUN npm install

# Copy the entire project into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Command to run the app
CMD [ "node", "server.js" ]

