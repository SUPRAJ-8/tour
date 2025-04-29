# 🌍 Tour and Travel Website

A full-stack tour and travel website built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Experience seamless tour booking and destination exploration with our modern, responsive platform.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### For Users 👥
- **User Authentication** - Secure login/signup system with JWT
- **Tour Exploration** 
  - Browse tours by continent and country
  - Advanced filtering and search functionality
  - Detailed tour information with images
- **Interactive UI**
  - Responsive design for all devices
  - Modern Material-UI components
  - Intuitive navigation
- **User Dashboard**
  - View booking history
  - Manage profile settings
  - Track upcoming tours

### For Admins 👨‍💼
- **Comprehensive Admin Panel**
  - Manage tours and destinations
  - Handle user bookings
  - View analytics and reports
- **Content Management**
  - Add/Edit tour packages
  - Manage country information
  - Upload and manage images

## 🛠️ Tech Stack

### Frontend
- **React.js** - v18.2.0
- **Material-UI** - v7.0.2 for modern UI components
- **React Router** - For seamless navigation
- **Formik & Yup** - Form handling and validation
- **Axios** - API requests
- **React Slick** - Carousel components

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB with Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password security
- **Multer** - File uploads
- **Express Validator** - Input validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tour Endpoints
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour details
- `POST /api/tours` - Create new tour (Admin)
- `PUT /api/tours/:id` - Update tour (Admin)
- `DELETE /api/tours/:id` - Delete tour (Admin)

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings` - Get all bookings (Admin)

## 🔒 Security Features
- JWT based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure HTTP-only cookies
- XSS protection

## 📈 Project Structure

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

## 🚀 Deployment

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
   ```bash
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

## 📝 Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=https://yourdomain.com
```

## 🚫 Security Best Practices
1. Use HTTPS for your production website
2. Store sensitive information in environment variables
3. Implement rate limiting for API endpoints
4. Sanitize user inputs
5. Implement proper error handling
6. Regularly update dependencies

## 📜 License
This project is licensed under the MIT License.
