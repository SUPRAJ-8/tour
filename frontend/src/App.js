import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/routing/ScrollToTop';
import './assets/css/App.css';
import './assets/css/AdminLayout.css';
import './assets/css/theme.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Protected Route Component
import PrivateRoute from './components/routing/PrivateRoute';

// Context
import { DataProvider } from './context/DataContext';
import WhatsAppButton from './components/WhatsAppButton';

// Pages — lazy-loaded so each route ships its own JS chunk instead of
// bundling every page (including admin) into one multi-hundred-KB file.
const Home = lazy(() => import('./pages/Home'));
const Tours = lazy(() => import('./pages/Tours'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const WorkingVisaDetails = lazy(() => import('./pages/WorkingVisaDetails'));

const TourDetail = lazy(() => import('./pages/TourDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BookingForm = lazy(() => import('./pages/BookingForm'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Countries = lazy(() => import('./pages/Countries'));
const AsianCountries = lazy(() => import('./pages/AsianCountries'));
const EuropeanCountries = lazy(() => import('./pages/EuropeanCountries'));
const CountryDetail = lazy(() => import('./pages/CountryDetail'));
const CountryDetails = lazy(() => import('./pages/CountryDetails'));

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
  return (
    <div className="app">
      <DataProvider>
        {/* Reset scroll position on each route change */}
        <ScrollToTop />
        {/* No fallback here — each page already renders its own skeleton
            loading state once mounted, so a competing spinner would just
            flash before the page's own skeleton takes over. */}
        <Suspense fallback={null}>
        <Routes>
        {/* Admin routes without navbar and footer */}
        <Route path="/admin" element={
          <AdminLayout>
            <AdminLogin />
          </AdminLayout>
        } />
        {/* Admin dashboard protected route */}
        <Route path="/admin-dashboard" element={
          <PrivateRoute>
            {({ user }) => user.role === 'admin' ? (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ) : <NotFound />}
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute redirectTo="/login">
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
<Route path="/working-visa/:id" element={<MainLayout><WorkingVisaDetails /></MainLayout>} />
        
          
        <Route path="/countries" element={<MainLayout><Countries /></MainLayout>} />
        <Route path="/countries/asia" element={<MainLayout><AsianCountries /></MainLayout>} />
        <Route path="/countries/europe" element={<MainLayout><EuropeanCountries /></MainLayout>} />
        <Route path="/countries/asia/:countryId" element={<MainLayout><CountryDetail category="asia" /></MainLayout>} />
        <Route path="/countries/europe/:countryId" element={<MainLayout><CountryDetail category="europe" /></MainLayout>} />
        <Route path="/countries/asia/:countryId/tours/:tourId" element={<MainLayout><TourDetail /></MainLayout>} />
        <Route path="/countries/europe/:countryId/tours/:tourId" element={<MainLayout><TourDetail /></MainLayout>} />
        <Route path="/countries/:regionKey/:countryName/tour/:id" element={<MainLayout><TourDetails /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/book/:tourId" element={<MainLayout><BookingForm /></MainLayout>} />
        <Route path="/countries/:continent/:countryName" element={<MainLayout><CountryDetails /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
        </Suspense>
        <WhatsAppButton />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </DataProvider>
    </div>
  );
}

export default App;
