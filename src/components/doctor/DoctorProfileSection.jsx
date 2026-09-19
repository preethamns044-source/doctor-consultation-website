import React from 'react';
import Container from '../layout/Container';
import Badge from '../common/Badge';
import Card from '../common/Card';
import { DOCTOR_PROFILE } from '../../data/doctor';
import { 
  HeartHandshake, 
  Stethoscope, 
  CheckCircle2, 
  Award, 
  Building2,
  Sparkles,
  Quote
} from 'lucide-react';

export default function DoctorProfileSection() {
  const { name, degrees, specialty, subSpecialties, bio, affiliations } = DOCTOR_PROFILE;

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-100">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Doctor Profile Card / Clinical Vignette */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-50 rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs">
              {/* Doctor Details Summary */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-xs shrink-0">
                  <img
                    src={DOCTOR_PROFILE.image}
                    alt="Dr. Dheekshith MR, Orthopaedic Surgeon"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                  <p className="text-xs font-semibold text-teal-800">{degrees}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{specialty}</p>
                </div>
              </div>

              {/* Philosophy Quote */}
              <div className="relative p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 mb-6">
                <Quote className="w-6 h-6 text-teal-700/20 fill-current mb-1" />
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{bio.philosophy}"
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">— {name}</span>
                  <span className="text-teal-800 font-medium">Care Philosophy</span>
                </div>
              </div>

              {/* Hospital Affiliations Summary */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Training & Affiliations
                </h4>
                <div className="space-y-2">
                  {affiliations.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Building2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Focus Areas */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-teal-800 text-xs font-semibold">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <span>About Dr. Dheekshith MR</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Expert Orthopaedic Care Built on Comprehensive Training and Patient-Centred Practice
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {bio.intro}
            </p>

            {/* Core Focus Areas */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Areas of Orthopaedic Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {subSpecialties.map((item) => (
                  <span 
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Guiding Principle Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 border border-teal-200/70 text-teal-900 flex items-start gap-3.5">
              <Sparkles className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <strong className="font-bold text-teal-900 block mb-0.5">Clinical Principle:</strong>
                "{bio.quote}"
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
