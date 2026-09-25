import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/home/HeroSection';
import StatsBanner from './components/home/StatsBanner';
import DoctorProfileSection from './components/doctor/DoctorProfileSection';
import TreatmentsSection from './components/doctor/TreatmentsSection';
import ServicesSection from './components/doctor/ServicesSection';
import ExperienceSection from './components/doctor/ExperienceSection';
import PatientTrustSection from './components/doctor/PatientTrustSection';
import HowItWorksSection from './components/home/HowItWorksSection';
import ConsultationSection from './components/doctor/ConsultationSection';
import LocationsSection from './components/doctor/LocationsSection';
import GallerySection from './components/home/GallerySection';
import EmergencyBanner from './components/home/EmergencyBanner';
import AppointmentModal from './components/consultation/AppointmentModal';
import AdminLogin from './pages/AdminLogin';
import AdminGallery from './pages/AdminGallery';
import DoctorDashboard from './pages/DoctorDashboard';

function getCanonicalPath() {
  const pathname = window.location.pathname || '/';
  const hash = window.location.hash || '';
  const fullUrl = pathname + hash;

  // 1. Check for specific routes anywhere in pathname or hash
  if (fullUrl.includes('/admin/login')) {
    return '/admin/login';
  }
  if (fullUrl.includes('/admin/gallery')) {
    return '/admin/gallery';
  }
  if (
    fullUrl.includes('/doctor/dashboard') ||
    fullUrl.includes('/client/dashboard') ||
    fullUrl.includes('/admin/dashboard')
  ) {
    return '/doctor/dashboard';
  }
  if (
    pathname === '/gallery' ||
    pathname === '/gallery/' ||
    hash === '#/gallery' ||
    hash === '#/gallery/' ||
    hash === '#gallery'
  ) {
    return '/gallery';
  }

  // Normalize path
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (cleanPath === '/admin' || cleanPath === '/client' || cleanPath === '/doctor') {
    return '/doctor/dashboard';
  }

  return cleanPath;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCanonicalPath);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('in-clinic');

  // Listen to browser history and hash navigation events
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getCanonicalPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Smooth scroll to gallery section if on /gallery route
  useEffect(() => {
    if (currentPath === '/gallery') {
      const timer = setTimeout(() => {
        const el = document.getElementById('gallery');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  // Redirect short-form admin/client/doctor paths to the canonical dashboard URL.
  useEffect(() => {
    const rawPath = window.location.pathname;
    const cleanPath = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
    if (cleanPath === '/admin' || cleanPath === '/client' || cleanPath === '/doctor') {
      window.location.replace('/doctor/dashboard');
    }
  }, [currentPath]);

  if (currentPath === '/admin/login') {
    return <AdminLogin />;
  }

  if (currentPath === '/admin/gallery') {
    return <AdminGallery />;
  }

  if (currentPath === '/doctor/dashboard') {
    return <DoctorDashboard />;
  }

  // Short-form redirect paths — render nothing while the useEffect redirect fires
  const rawPath = window.location.pathname;
  const cleanPath = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  if (cleanPath === '/admin' || cleanPath === '/client' || cleanPath === '/doctor') {
    return null;
  }

  const handleOpenModal = (type = 'in-clinic') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* Top Clinical Header & Practice Navigation */}
      <Navbar onBookClick={handleOpenModal} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Physician Introduction & Value Proposition */}
        <HeroSection onBookClick={handleOpenModal} />

        {/* Clinical Statistics & Accreditations Banner */}
        <StatsBanner />

        {/* Detailed Doctor Profile, Philosophy & Focus Areas */}
        <DoctorProfileSection />

        {/* Orthopaedic Services */}
        <ServicesSection />

        {/* Specialized Treatments & Clinical Services */}
        <TreatmentsSection />

        {/* Education, Fellowships & Board Certifications */}
        <ExperienceSection />

        {/* Patient Trust, Ratings & Verified Testimonials */}
        <PatientTrustSection />

        {/* Step-by-Step Consultation Journey */}
        <HowItWorksSection />

        {/* Consultation Options (Video vs Clinic), Timings & Request Form */}
        <ConsultationSection onBookClick={handleOpenModal} />

        {/* Clinic Gallery */}
        <GallerySection />

        {/* Consultation Locations */}
        <LocationsSection />

        {/* 24/7 Medical Advisory & Emergency Banner */}
        <EmergencyBanner />
      </main>

      {/* Practice Footer */}
      <Footer />

      {/* Appointment Consultation Request Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialType={modalType}
      />
    </div>
  );
}
