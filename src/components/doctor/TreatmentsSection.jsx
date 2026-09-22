import React from 'react';
import Container from '../layout/Container';
import Card from '../common/Card';
import { DOCTOR_PROFILE } from '../../data/doctor';
import { 
  HeartPulse, 
  Activity, 
  Zap, 
  Stethoscope, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';

const ICON_MAP = {
  HeartPulse,
  Activity,
  Zap,
  Stethoscope,
  ShieldCheck,
  Sparkles
};

export default function TreatmentsSection() {
  const { treatments, regenerativeTreatments } = DOCTOR_PROFILE;

  return (
    <section id="treatments" className="py-12 sm:py-20 bg-slate-50/60 border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Condition Management & Regenerative Care
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Targeted Treatments & Management
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Comprehensive non-surgical and targeted treatments designed to reduce pain, manage conditions, and improve your daily quality of life.
          </p>
        </div>

        {/* Regenerative Treatments Grid */}
        <div className="mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">Regenerative & Non-Surgical Treatments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regenerativeTreatments.map((item) => {
              const Icon = ICON_MAP[item.icon] || HeartPulse;

              return (
                <Card
                  key={item.id}
                  className="flex flex-col justify-between h-full bg-white border border-slate-200/90 hover:border-teal-700/40 transition-all shadow-xs hover:shadow-md"
                  padding="default"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                      {item.description}
                    </p>
                  </div>

                  {item.points && item.points.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <ul className="space-y-2">
                        {item.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conditions Grid */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">Conditions Treated</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {treatments.map((item) => {
              const Icon = ICON_MAP[item.icon] || HeartPulse;

              return (
                <Card
                  key={item.id}
                  className="flex flex-col bg-white border border-slate-200/90 hover:border-teal-700/40 transition-all shadow-xs hover:shadow-md"
                  padding="sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 max-w-3xl mx-auto flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-slate-600">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p>
            <strong>Medical Disclaimer:</strong> Treatment suitability for any procedure or therapy is determined only after a thorough clinical evaluation and diagnosis by Dr. Dheekshith MR.
          </p>
        </div>

        {/* Bottom Direct CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Have questions about a specific orthopaedic condition or injury?{' '}
            <a href="#consultation" className="text-teal-800 font-bold hover:underline inline-flex items-center gap-1">
              Discuss with Dr. Dheekshith MR <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
