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

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('in-clinic');

  // Normalize: strip trailing slash so /admin/login/ matches the same as /admin/login
  const rawPath = window.location.pathname;
  const path = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;

  // Redirect short-form admin/client/doctor paths to the canonical dashboard URL.
  // Must run in useEffect so it never fires inside the React render phase.
  useEffect(() => {
    const isShortPath =
      path === '/admin' ||
      path === '/client' ||
      path === '/doctor';
    if (isShortPath) {
      window.location.replace('/doctor/dashboard');
    }
  }, [path]);

  if (path === '/admin/login') {
    return <AdminLogin />;
  }

  if (path === '/admin/gallery') {
    return <AdminGallery />;
  }

  if (path === '/doctor/dashboard' || path === '/client/dashboard' || path === '/admin/dashboard') {
    return <DoctorDashboard />;
  }

  // Short-form redirect paths — render nothing while the useEffect redirect fires
  if (path === '/admin' || path === '/client' || path === '/doctor') {
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
