import React from 'react';
import Container from '../layout/Container';
import { CalendarCheck2, Video, FileCheck, ClipboardList } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Choose Mode',
      description: 'Select between a virtual video consultation or an in-person clinical visit.',
      icon: ClipboardList
    },
    {
      step: '02',
      title: 'Select Time Slot',
      description: 'Pick an appointment time that aligns with your daily schedule.',
      icon: CalendarCheck2
    },
    {
      step: '03',
      title: 'Consult With Doctor',
      description: 'Discuss your orthopaedic concerns, symptoms, previous imaging or test results in depth with Dr. Dheekshith MR.',
      icon: Video
    },
    {
      step: '04',
      title: 'Care Plan & Guidance',
      description: 'Receive personalized treatment plans, digital prescriptions, and follow-up guidance.',
      icon: FileCheck
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Consultation Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Your Appointment Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A structured, attentive clinical journey designed to provide clarity and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="relative flex flex-col p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-teal-800 flex items-center justify-center shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
