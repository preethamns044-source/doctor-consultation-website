import React, { useState } from 'react';
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

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('in-clinic');

  const path = window.location.pathname;

  if (path === '/admin/login') {
    return <AdminLogin />;
  }

  if (path === '/admin/gallery') {
    return <AdminGallery />;
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
