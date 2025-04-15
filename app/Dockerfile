# Build stage
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production && \
  npm cache clean --force && \
  rm -rf /tmp/*
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main"]