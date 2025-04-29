# Tour and Travel Website

A full-stack tour and travel website built with React.js, Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Tour listings with filtering and search functionality
- Destination browsing
- Tour booking system
- User dashboard
- Admin panel for managing tours, destinations, and bookings
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- React Icons
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation

## Project Structure

```
toor/
├── frontend/           # React frontend
│   ├── public/         # Public assets
│   └── src/            # Source files
│       ├── assets/     # CSS and images
│       ├── components/ # Reusable components
│       ├── context/    # Context API
│       ├── pages/      # Page components
│       └── utils/      # Utility functions
│
└── backend/            # Node.js backend
    ├── config/         # Configuration files
    ├── controllers/    # Route controllers
    ├── middleware/     # Custom middleware
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    └── uploads/        # Uploaded files
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your MongoDB connection string and JWT secret:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Deployment

### Backend Deployment (Node.js with cPanel)
1. Log in to your cPanel account
2. Navigate to the Node.js Selector
3. Create a new Node.js application:
   - Set the application path to your backend directory
   - Set the application URL to your domain or subdomain
   - Choose Node.js version (14 or higher)
   - Set the application startup file to `server.js`
   - Set environment variables (MONGODB_URI, JWT_SECRET, etc.)
4. Click "Create" to deploy your Node.js application
5. Set up a reverse proxy in cPanel to route API requests to your Node.js application

### Frontend Deployment
1. Build the React application:
   ```
   cd frontend
   npm run build
   ```
2. Upload the contents of the `build` folder to your cPanel's `public_html` directory
3. Configure your web server to serve the React application

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account if you don't have one
2. Create a new cluster
3. Create a database user with read/write privileges
4. Whitelist your server's IP address (0.0.0.0/0 for development)
5. Get your connection string and add it to your `.env` file

## Environment Variables
Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=https://yourdomain.com
```

## Security Best Practices
1. Use HTTPS for your production website
2. Store sensitive information in environment variables
3. Implement rate limiting for API endpoints
4. Sanitize user inputs
5. Implement proper error handling
6. Regularly update dependencies

## License
This project is licensed under the MIT License.
