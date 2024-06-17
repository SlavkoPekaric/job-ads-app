# Stage 1: Build the Angular application
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Copy the built Angular app from Stage 1
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/job-ads-coding-challenge/browser /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




