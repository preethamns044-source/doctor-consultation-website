import React from 'react';
import Container from '../layout/Container';
import Card from '../common/Card';
import { DOCTOR_PROFILE } from '../../data/doctor';
import { GraduationCap, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ExperienceSection() {
  const { education, certifications } = DOCTOR_PROFILE;

  return (
    <section id="experience" className="py-12 sm:py-20 bg-white border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Qualifications & Accreditations
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Education & Board Certifications
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Comprehensive academic and clinical training in orthopaedic surgery, with postgraduate qualifications, subspecialty fellowships, and internationally recognised certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Post-Graduate Training Timeline */}
          <Card className="border border-slate-200/90 p-5 sm:p-8" hoverEffect={false}>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-teal-800 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Medical Training & Fellowships</h3>
                <p className="text-xs text-slate-500">Post-graduate residency and specialty fellowships</p>
              </div>
            </div>

            <div className="space-y-7 relative before:absolute before:inset-0 before:left-3.5 before:w-[2px] before:bg-slate-200/80">
              {education.map((item, idx) => (
                <div key={idx} className="relative pl-9 space-y-1">
                  <span className="absolute left-[9px] top-1.5 w-3.5 h-3.5 rounded-full bg-teal-800 ring-4 ring-white" />
                  <span className="text-xs font-bold text-teal-800 block">
                    {item.years}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {item.degree}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {item.institution}
                  </p>
                  {item.honor && (
                    <span className="inline-block mt-1 text-[11px] font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      ★ {item.honor}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Board Certifications & Professional Honors */}
          <Card className="border border-slate-200/90 p-5 sm:p-8 flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-teal-800 flex items-center justify-center">
                  <Award className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Qualifications &amp; Certifications</h3>
                  <p className="text-xs text-slate-500">Academic and professional credentials</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {cert}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Active credential • Verified by Medical Board
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Assurance Verification */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <span>Active medical registration with valid orthopaedic qualifications and ongoing professional development.</span>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
