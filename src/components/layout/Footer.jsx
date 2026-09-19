import React from 'react';
import Container from './Container';
import { Stethoscope, Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { DOCTOR_PROFILE } from '../../data/doctor';

const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const { name, degrees, clinic } = DOCTOR_PROFILE;

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center">
                <Stethoscope className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block">
                  {name}
                </span>
                <span className="text-xs text-teal-400 font-semibold">{degrees}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                      Private practice specialising in joint replacement, sports and football injuries, fracture care, and general orthopaedic consultation.
                    </p>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>MS &amp; DNB Orthopaedics • Fellowship in Joint Replacement • FIFA Diploma</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Doctor</a></li>
              <li><a href="#treatments" className="hover:text-white transition-colors">Treatments</a></li>
              <li><a href="#experience" className="hover:text-white transition-colors">Credentials</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#consultation" className="hover:text-white transition-colors">Consultations</a></li>
            </ul>
          </div>

          {/* Clinical Focus */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Specialized Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="#treatments" className="hover:text-white transition-colors">Joint Replacement</a></li>
              <li><a href="#treatments" className="hover:text-white transition-colors">Sports &amp; Football Injuries</a></li>
              <li><a href="#treatments" className="hover:text-white transition-colors">Arthritis &amp; Joint Pain</a></li>
              <li><a href="#treatments" className="hover:text-white transition-colors">Fracture &amp; Trauma Care</a></li>
              <li><a href="#treatments" className="hover:text-white transition-colors">Knee, Hip &amp; Shoulder</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Clinic Office
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {clinic.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{clinic.address}{clinic.suite ? `, ${clinic.suite}` : ''}</span>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <a href="tel:+917022108860" className="hover:text-white">Office: {clinic.phone}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <a href="mailto:dheekshithmrnikhi@gmail.com" className="hover:text-white break-all">{clinic.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <a href={clinic.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  @{clinic.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Advisory Note */}
        <div className="border-t border-slate-800/80 pt-8 pb-4">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Medical Notice:</strong> Information on this website is for educational and consultation scheduling purposes and does not constitute urgent medical intervention. In the event of a serious injury, suspected fracture, acute joint trauma, or a medical emergency, please call emergency services or go to the nearest emergency department immediately.
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} {name}, {degrees}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2">
            <a href="#" className="hover:text-slate-400">Privacy Notice</a>
            <a href="#" className="hover:text-slate-400">Telehealth Consent</a>
            <a href="#" className="hover:text-slate-400">Terms of Practice</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
