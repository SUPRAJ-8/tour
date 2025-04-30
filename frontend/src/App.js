import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './assets/css/App.css';
import './assets/css/AdminLayout.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import TourDetail from './pages/TourDetail';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import BookingForm from './pages/BookingForm';
import NotFound from './pages/NotFound';
import Countries from './pages/Countries';
import AsianCountries from './pages/AsianCountries';
import EuropeanCountries from './pages/EuropeanCountries';
import CountryDetail from './pages/CountryDetail';
import CountryDetails from './pages/CountryDetails';

// Protected Route Component
import PrivateRoute from './components/routing/PrivateRoute';

// Context
import { useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layout wrapper component to conditionally render navbar and footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">{children}</main>
    <Footer />
  </>
);

// Admin layout without navbar and footer
const AdminLayout = ({ children }) => (
  <main className="main-content admin-content">{children}</main>
);

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <DataProvider>
        <Routes>
        {/* Admin routes without navbar and footer */}
        <Route path="/admin" element={
          <AdminLayout>
            <AdminLogin />
          </AdminLayout>
        } />
        {/* Temporarily allowing direct access to admin dashboard for development */}
        <Route path="/admin-dashboard" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        {/* Original protected route - uncomment when auth is fixed
        <Route path="/admin-dashboard" element={
          <PrivateRoute>
            {({ user }) => user.role === 'admin' ? (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ) : <NotFound />}
          </PrivateRoute>
        } />
        */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            {({ user }) => (
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            )}
          </PrivateRoute>
        } />
        
        {/* Public routes with navbar and footer */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/tours" element={<MainLayout><Tours /></MainLayout>} />
        <Route path="/tours/:id" element={<MainLayout><TourDetails /></MainLayout>} />
        <Route path="/destinations" element={<MainLayout><Destinations /></MainLayout>} />
        <Route path="/countries" element={<MainLayout><Countries /></MainLayout>} />
        <Route path="/countries/asia" element={<MainLayout><AsianCountries /></MainLayout>} />
        <Route path="/countries/europe" element={<MainLayout><EuropeanCountries /></MainLayout>} />
        <Route path="/countries/asia/:countryId" element={<MainLayout><CountryDetail category="asia" /></MainLayout>} />
        <Route path="/countries/europe/:countryId" element={<MainLayout><CountryDetail category="europe" /></MainLayout>} />
        <Route path="/countries/asia/:countryId/tours/:tourId" element={<MainLayout><TourDetail /></MainLayout>} />
        <Route path="/countries/europe/:countryId/tours/:tourId" element={<MainLayout><TourDetail /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/book/:tourId" element={<MainLayout><BookingForm /></MainLayout>} />
        <Route path="/countries/:continent/:countryName" element={<MainLayout><CountryDetails /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </DataProvider>
    </div>
  );
}

export default App;
