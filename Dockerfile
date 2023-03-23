# Get the base image of Node version 16
FROM node:16

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:focal

# Set the work directory for the application
WORKDIR /app

# COPY the needed files to the app folder in Docker image
COPY ./ /app/

# Install the dependencies in Node environment
RUN npm install

# Install the browser
RUN npx playwright install chrome
RUN npm run update:spanshots

# now Run on terminal:
# docker build -t playwright-docker .
# docker run -it playwright-docker:latest npm run test:line