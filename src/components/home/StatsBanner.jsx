import React from 'react';
import Container from '../layout/Container';
import { Award, Users, HeartPulse, ShieldCheck } from 'lucide-react';
import { DOCTOR_PROFILE } from '../../data/doctor';

export default function StatsBanner() {
  const { experienceYears } = DOCTOR_PROFILE;

  const stats = [
    {
      icon: Award,
      value: `${experienceYears}+ Years`,
      label: 'Clinical Experience',
      subtext: 'Orthopaedic Surgery & Musculoskeletal Care'
    },
    {
      icon: ShieldCheck,
      value: 'MS & DNB',
      label: 'Orthopaedics',
      subtext: 'Postgraduate Surgical Qualifications'
    },
    {
      icon: HeartPulse,
      value: 'Fellowship',
      label: 'Joint Replacement',
      subtext: 'Subspecialty Surgical Training'
    },
    {
      icon: Users,
      value: 'FIFA Diploma',
      label: 'Football Medicine',
      subtext: 'Internationally Accredited Certification'
    },
  ];


  return (
    <section className="bg-slate-50 border-b border-slate-200/80 py-8 sm:py-10">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 lg:divide-x lg:divide-slate-200/80">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center px-1 sm:px-4"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 text-teal-800 flex items-center justify-center mb-2 shadow-2xs">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-base sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {item.value}
                </span>
                <span className="text-[11px] sm:text-sm font-bold text-slate-800 mt-0.5">
                  {item.label}
                </span>
                <span className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {item.subtext}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
