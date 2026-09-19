import React, { useState } from 'react';
import Container from './Container';
import Button from '../common/Button';
import { PhoneCall, Menu, X, Calendar, Stethoscope } from 'lucide-react';
import { DOCTOR_PROFILE } from '../../data/doctor';

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default function Navbar({ onBookClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { name, degrees, clinic } = DOCTOR_PROFILE;

  const navLinks = [
    { label: 'About Doctor', href: '#about' },
    { label: 'Treatments', href: '#treatments' },
    { label: 'Experience', href: '#experience' },
    { label: 'Patient Reviews', href: '#testimonials' },
    { label: 'Clinic & Fees', href: '#consultation' },
  ];

  const handleBook = (e) => {
    if (onBookClick) {
      e.preventDefault();
      onBookClick('in-clinic');
    }
  };

  return (
    <header className="sticky top-0 z-40 clinic-nav border-b border-slate-200/80 transition-colors">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Doctor Branding */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-900/10 group-hover:bg-teal-900 transition-colors">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-slate-900 truncate max-w-[140px] min-[360px]:max-w-[180px] sm:max-w-none">{name}</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-teal-800 bg-teal-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-teal-200/70 shrink-0">
                  {degrees}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-normal truncate max-w-[180px] min-[400px]:max-w-[260px] sm:max-w-none">
                Orthopaedic Surgeon &amp; Joint Replacement Specialist
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-teal-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs: Secondary Call Now + Primary Book Consultation */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <a 
              href={clinic.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 text-teal-800 hover:bg-teal-50 rounded-xl transition-colors" 
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://wa.me/917022108860?text=Hello%20Dr.%20Dheekshith%20MR%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation." target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                icon={WhatsAppIcon}
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 hidden md:inline-flex"
              >
                WhatsApp
              </Button>
            </a>
            <a href="tel:+917022108860" className="hidden lg:inline-flex">
              <Button
                variant="outline"
                size="sm"
                icon={PhoneCall}
                className="text-slate-700 hover:text-slate-900"
              >
                Call Now
              </Button>
            </a>
            <Button 
              variant="primary" 
              size="sm" 
              icon={Calendar}
              onClick={handleBook}
            >
              Book Consultation
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-1.5 shrink-0">
            <a 
              href={clinic.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sm:hidden p-2 text-teal-800 hover:bg-teal-50 rounded-xl" 
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a href="tel:+917022108860" className="sm:hidden p-2 text-teal-800 hover:bg-teal-50 rounded-xl" aria-label="Call clinic">
              <PhoneCall className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 space-y-3 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-teal-800 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 px-4 flex flex-col gap-2.5 border-t border-slate-100">
              <a href="https://wa.me/917022108860?text=Hello%20Dr.%20Dheekshith%20MR%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation." target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" size="md" className="w-full justify-center text-xs sm:text-sm bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300" icon={WhatsAppIcon}>
                  WhatsApp
                </Button>
              </a>
              <a href="tel:+917022108860" className="w-full">
                <Button variant="outline" size="md" className="w-full justify-center text-xs sm:text-sm" icon={PhoneCall}>
                  Call Clinic ({clinic.phone})
                </Button>
              </a>
              <Button 
                variant="primary" 
                size="md" 
                className="w-full justify-center text-xs sm:text-sm" 
                icon={Calendar}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleBook(e);
                }}
              >
                Book Consultation
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
