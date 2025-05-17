#!/bin/bash

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the application
npm run build

# Move build files to the root of the project
mv build/* ../ 