# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

ENV VIPS_CONCURRENCY=1
# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "src/index.js"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]
