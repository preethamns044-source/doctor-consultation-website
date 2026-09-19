import React from 'react';
import Container from '../layout/Container';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { DOCTOR_PROFILE } from '../../data/doctor';
import { 
  ShieldCheck, 
  Calendar, 
  PhoneCall, 
  Star, 
  Award, 
  Clock, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default function HeroSection({ onBookClick }) {
  const { name, title, degrees, experienceYears, image, clinic } = DOCTOR_PROFILE;

  return (
    <section className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Doctor Identity, Title & Primary CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clinical Credential Pill */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-slate-800 text-[11px] sm:text-xs font-semibold max-w-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="leading-snug break-words">MS &amp; DNB Orthopaedics • Fellowship in Joint Replacement • FIFA Diploma</span>
            </div>

            {/* Doctor Name & Specialty */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  {name}
                </h1>
                <span className="text-sm sm:text-lg font-bold text-teal-800">
                  {degrees}
                </span>
              </div>
              <p className="text-base sm:text-xl font-semibold text-teal-800/90 tracking-tight">
                {title}
              </p>
            </div>

            {/* Core Practice Headline & Description */}
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-800 leading-snug">
                Expert Orthopaedic Consultation for Joints, Sports Injuries &amp; Musculoskeletal Conditions
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Dr. Dheekshith MR is an Orthopaedic Surgeon with {experienceYears}+ years of clinical training, holding an MS, DNB in Orthopaedics, a Fellowship in Joint Replacement, and a FIFA Diploma in Football Medicine. Available for both online and in-clinic orthopaedic consultations.
              </p>
            </div>

            {/* Action CTAs: Book Consultation + Call Now */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                icon={Calendar} 
                className="w-full sm:w-auto shadow-sm"
                onClick={() => onBookClick && onBookClick('in-clinic')}
              >
                Book Consultation
              </Button>
              <a href="https://wa.me/917022108860?text=Hello%20Dr.%20Dheekshith%20MR%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation." target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="lg" 
                  icon={WhatsAppIcon} 
                  className="w-full sm:w-auto border-transparent text-white hover:opacity-90"
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                >
                  WhatsApp
                </Button>
              </a>
              <a href="tel:+917022108860">
                <Button 
                  variant="outline" 
                  size="lg" 
                  icon={PhoneCall} 
                  className="w-full sm:w-auto border-slate-300 hover:border-slate-400 text-slate-800 bg-white"
                >
                  Call Now ({clinic.phone})
                </Button>
              </a>
            </div>

            {/* Elegant Trust Highlights Strip */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{experienceYears}+ Years</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 pl-5 sm:pl-5.5">Orthopaedic Surgery</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs sm:text-sm">
                  <Award className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>FIFA Diploma</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 pl-5 sm:pl-5.5">Football Medicine</p>
              </div>

              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Online &amp; In-Clinic</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 pl-5 sm:pl-5.5">Consultations Available</p>
              </div>
            </div>
          </div>

          {/* Right Column: Large Doctor Portrait with Elegant Framing */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Doctor Portrait Card */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-lg shadow-slate-900/5 aspect-4/5">
                <img
                  src={image}
                  alt="Dr. Dheekshith MR, Orthopaedic Surgeon"
                  className="w-full h-full object-cover object-top"
                />

                {/* Subtle gradient vignette at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Status Pill */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-semibold shadow-sm backdrop-blur-xs border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-emerald" />
                    Accepting New Patients
                  </span>
                </div>

                {/* Bottom Identity Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-base sm:text-lg font-bold tracking-tight">{name}, {degrees}</p>
                  <p className="text-[11px] sm:text-xs text-slate-200">Orthopaedic Surgeon • Joint Replacement &amp; Sports Medicine</p>
                </div>
              </div>

              {/* Float Seal Badge */}
              <div className="absolute -bottom-4 left-2 sm:left-4 bg-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2.5 sm:gap-3 max-w-[calc(100%-1rem)] sm:max-w-none">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Joint Replacement</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">Fellowship Trained Surgeon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
