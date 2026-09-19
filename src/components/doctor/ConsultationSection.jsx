import React, { useState } from 'react';
import Container from '../layout/Container';
import Button from '../common/Button';
import { supabase } from '../../lib/supabase';
import { DOCTOR_PROFILE } from '../../data/doctor';
import { 
  Video, 
  Building2, 
  Clock, 
  Check, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send,
  Info,
  AlertCircle
} from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default function ConsultationSection({ onBookClick }) {
  const { clinic, consultationOptions } = DOCTOR_PROFILE;
  const [selectedMode, setSelectedMode] = useState('telehealth');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    preferredDate: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (formData.preferredDate) {
      const selected = new Date(formData.preferredDate + 'T00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) errs.preferredDate = 'Please select a future date.';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const generatedRequestId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          request_id: generatedRequestId,
          patient_name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          consultation_type: selectedMode,
          preferred_date: formData.preferredDate || null,
          preferred_time: null,
          reason: formData.reason.trim() || null,
          status: 'pending'
        }]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error('ConsultationSection: Supabase insert failed:', err);
      setSubmitError(err.message || 'Failed to send request. Please try again or contact the clinic directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="py-20 bg-white">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Appointments & Consultations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consultation Options & Clinic Information
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Choose between an online consultation or an in-clinic visit with Dr. Dheekshith MR for orthopaedic assessment and guidance.
          </p>
        </div>

        {/* Consultation Options Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {consultationOptions.map((opt) => {
            const isSelected = selectedMode === opt.id;
            const isVideo = opt.id === 'telehealth';

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedMode(opt.id)}
                className={`relative rounded-3xl p-5 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-800 bg-teal-50/20 shadow-md ring-1 ring-teal-800/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-3 right-6 bg-teal-800 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Selected Option
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isVideo ? 'bg-sky-50 text-sky-800 border border-sky-100' : 'bg-teal-50 text-teal-800 border border-teal-100'
                    }`}>
                      {isVideo ? <Video className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{opt.title}</h3>
                      <p className="text-xs text-slate-500">{opt.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xs font-semibold text-teal-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {opt.duration}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 mb-6">
                    <strong className="text-slate-800">Best for: </strong>{opt.recommendedFor}
                  </div>

                  <div className="space-y-2 mb-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Included in Session:
                    </h4>
                    {opt.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    size="md"
                    className="w-full justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookClick) {
                        onBookClick(opt.id);
                      }
                    }}
                  >
                    {isSelected ? 'Proceed with This Option' : 'Select This Mode'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Practice Details & Direct Appointment Inquiry Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Clinic Information Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-5 sm:p-8 space-y-6">
            {clinic.name && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
                  Clinic Location
                </span>
                <h3 className="text-xl font-bold text-white">{clinic.name}</h3>
                {clinic.suite && <p className="text-xs text-slate-300 mt-1">{clinic.suite}</p>}
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-300">
              {clinic.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{clinic.address}{clinic.city ? `, ${clinic.city}` : ''}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:+917022108860" className="hover:text-white">Office: <strong className="text-white">{clinic.phone}</strong></a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:dheekshithmrnikhi@gmail.com" className="hover:text-white break-all">{clinic.email}</a>
              </div>
            </div>

            {/* Quick Call Button inside card */}
            <div className="pt-2 space-y-3">
              <a href="https://wa.me/917022108860?text=Hello%20Dr.%20Dheekshith%20MR%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation." target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  variant="outline" 
                  size="md" 
                  icon={WhatsAppIcon} 
                  className="w-full justify-center bg-green-600/10 text-green-400 border-green-500/30 hover:bg-green-600/20 hover:border-green-500/50"
                >
                  WhatsApp Us
                </Button>
              </a>
              <a href="tel:+917022108860" className="block">
                <Button 
                  variant="outline" 
                  size="md" 
                  icon={PhoneCall} 
                  className="w-full justify-center bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                >
                  Call Clinic: {clinic.phone}
                </Button>
              </a>
            </div>

            {clinic.hours && clinic.hours.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                  Office Consultation Hours
                </span>
                {clinic.hours.map((h, i) => (
                  <div key={i} className="flex items-start justify-between text-xs gap-2">
                    <span className="text-slate-300">{h.days}</span>
                    <span className="font-semibold text-white text-right">{h.time}</span>
                  </div>
                ))}
              </div>
            )}


          </div>

          {/* Consultation Request Form Preview */}
          <div className="lg:col-span-7 bg-slate-50/80 rounded-3xl p-5 sm:p-8 border border-slate-200">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Appointment Request Received</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Dr. Dheekshith MR's team will contact you at <strong>{formData.phone || formData.email}</strong> to confirm your consultation slot.
                </p>
                <div className="pt-4">
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Submit Another Request
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Request an Appointment with Dr. Dheekshith MR
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selected Mode: <strong className="text-teal-800 uppercase">{selectedMode === 'telehealth' ? 'Online Consultation' : 'In-Clinic Consultation'}</strong>. Complete the details below.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (validationErrors.name) setValidationErrors({ ...validationErrors, name: null });
                      }}
                      placeholder="e.g. Ramesh Sharma"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800 ${
                        validationErrors.name ? 'border-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: null });
                      }}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800 ${
                        validationErrors.phone ? 'border-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.email) setValidationErrors({ ...validationErrors, email: null });
                      }}
                      placeholder="patient@example.com"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800 ${
                        validationErrors.email ? 'border-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Consultation Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={formData.preferredDate}
                      onChange={(e) => {
                        setFormData({ ...formData, preferredDate: e.target.value });
                        if (validationErrors.preferredDate) setValidationErrors({ ...validationErrors, preferredDate: null });
                      }}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800 ${
                        validationErrors.preferredDate ? 'border-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.preferredDate && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.preferredDate}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit / Symptoms</label>
                  <textarea
                    rows="3"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Briefly describe your symptoms, recent checkup results, or questions..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800"
                  />
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <strong className="font-semibold block text-rose-800 mb-0.5">Unable to Submit Request</strong>
                      <span>{submitError}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3 flex-wrap">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={Send}
                    disabled={isSubmitting}
                    className="flex-1 justify-center sm:min-w-[200px]"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Appointment Request'}
                  </Button>
                  <a href="https://wa.me/917022108860?text=Hello%20Dr.%20Dheekshith%20MR%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation." target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      icon={WhatsAppIcon}
                      className="w-full justify-center border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400"
                    >
                      WhatsApp
                    </Button>
                  </a>
                  <a href="tel:+917022108860" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      icon={PhoneCall}
                      className="w-full justify-center border-slate-300"
                    >
                      Call Desk
                    </Button>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
