import React from 'react';
import Container from '../layout/Container';
import Card from '../common/Card';
import RatingStars from '../common/RatingStars';
import { DOCTOR_PROFILE } from '../../data/doctor';
import { Quote, CheckCircle2, Star } from 'lucide-react';

export default function PatientTrustSection() {
  const { testimonials } = DOCTOR_PROFILE;

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-12 sm:py-20 bg-slate-50/70 border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Patient Trust & Reviews
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Patient Experiences & Testimonials
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Patient experiences from those who have consulted with Dr. Dheekshith MR for orthopaedic evaluation and care. Testimonials will be updated as reviews are received.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              className="flex flex-col justify-between h-full bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all"
              padding="default"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                </div>

                <Quote className="w-6 h-6 text-teal-800/15 fill-current mb-2" />

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.author}</h4>
                  <p className="text-[11px] text-teal-800 font-medium truncate">{item.treatment}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
