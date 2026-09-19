import React from 'react';
import Container from '../layout/Container';
import Button from '../common/Button';
import { AlertCircle, PhoneCall, ShieldAlert } from 'lucide-react';
import { DOCTOR_PROFILE } from '../../data/doctor';

export default function EmergencyBanner() {
  const { clinic } = DOCTOR_PROFILE;

  return (
    <section id="emergency" className="py-12 bg-slate-50 border-t border-slate-200/70">
      <Container>
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/80">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Emergency Medical Notice
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Experiencing Acute or Critical Symptoms?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Consultation scheduling is intended for non-emergency orthopaedic assessment and follow-up care. In the event of a serious injury, suspected fracture, or acute medical emergency, please <strong>call emergency services or visit the nearest emergency department immediately</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
            <a href="tel:+917022108860" className="w-full sm:w-auto">
              <Button variant="outline" size="md" icon={PhoneCall} className="w-full justify-center border-slate-300">
                Clinic Desk: {clinic.phone}
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
