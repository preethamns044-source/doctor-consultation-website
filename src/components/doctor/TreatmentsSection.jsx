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
  ArrowRight 
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
  const { treatments } = DOCTOR_PROFILE;

  return (
    <section id="treatments" className="py-12 sm:py-20 bg-slate-50/60 border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Medical Expertise
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Areas of Expertise &amp; Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Expert consultation across a broad range of orthopaedic conditions. These represent areas of expertise and consultation — not a guarantee that every listed procedure is performed.
          </p>
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((item) => {
            const Icon = ICON_MAP[item.icon] || HeartPulse;

            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between h-full bg-white border border-slate-200/90 hover:border-teal-700/40 transition-all shadow-xs hover:shadow-md"
                padding="default"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-teal-800 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Key Areas of Focus:
                  </h4>
                  <ul className="space-y-2">
                    {item.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Direct CTA */}
        <div className="mt-12 text-center">
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
