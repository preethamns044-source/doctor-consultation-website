import React, { useState, useEffect } from 'react';
import { DOCTOR_PROFILE } from '../../data/doctor';
import Button from '../common/Button';
import { supabase } from '../../lib/supabase';
import { 
  X, 
  Video, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  AlertCircle, 
  Send, 
  Stethoscope, 
  ShieldCheck,
  User,
  Phone,
  Mail
} from 'lucide-react';

export default function AppointmentModal({ isOpen, onClose, initialType = 'in-clinic' }) {
  const { name, degrees, specialty, clinic, consultationOptions } = DOCTOR_PROFILE;

  const [consultationType, setConsultationType] = useState(initialType);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: 'Morning (09:00 AM – 12:00 PM)',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Sync initialType when modal opens
  useEffect(() => {
    if (isOpen) {
      setConsultationType(initialType);
      setErrors({});
      setSubmitError(null);
      setSubmittedData(null);
    }
  }, [isOpen, initialType]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const timeSlots = [
    'Morning (09:00 AM – 12:00 PM)',
    'Afternoon (12:00 PM – 03:00 PM)',
    'Late Afternoon (03:00 PM – 05:30 PM)'
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient full name is required.';
    } else if (formData.patientName.trim().length < 2) {
      newErrors.patientName = 'Please enter a valid full name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for appointment confirmation.';
    } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred consultation date.';
    } else {
      // Parse as local midnight (appending T00:00 prevents UTC interpretation)
      const selected = new Date(formData.preferredDate + 'T00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.preferredDate = 'Please select a future date.';
      }
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time slot.';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a brief reason or primary symptoms for the visit.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        .insert([
          {
            request_id: generatedRequestId,
            patient_name: formData.patientName.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            consultation_type: consultationType,
            preferred_date: formData.preferredDate || null,
            preferred_time: formData.preferredTime || null,
            reason: formData.reason.trim() || null,
            status: 'pending'
          }
        ]);

      if (error) {
        throw error;
      }

      setSubmittedData({
        ...formData,
        consultationType,
        requestId: generatedRequestId
      });
    } catch (err) {
      console.error('Failed to submit appointment to Supabase:', err);
      setSubmitError(err.message || 'Failed to submit appointment request. Please try again or contact the clinic directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      patientName: '',
      phone: '',
      email: '',
      preferredDate: '',
      preferredTime: 'Morning (09:00 AM – 12:00 PM)',
      reason: ''
    });
    setErrors({});
    setSubmitError(null);
    setSubmittedData(null);
  };

  // Min date for date picker (today formatted YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 flex min-h-full items-start sm:items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 my-auto sm:my-8 flex flex-col max-h-[calc(100dvh-1rem)] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="p-4 sm:p-6 bg-slate-50/90 border-b border-slate-200/80 flex items-start justify-between gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[150px] min-[360px]:max-w-[200px] sm:max-w-none">{name}</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/70 shrink-0">
                  {degrees}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                {specialty}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus:outline-none shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 lg:p-7 overflow-y-auto space-y-5 sm:space-y-6">
          {submittedData ? (
            /* Success Confirmation UI (Strictly Non-Confirmed Request) */
            <div className="space-y-6 py-2">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                    Request Received • Reference #{submittedData.requestId}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Appointment Request Submitted
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                    Thank you, <strong>{submittedData.patientName}</strong>. Your consultation request has been sent to Dr. Dheekshith MR's team.
                  </p>
                </div>
              </div>

              {/* Crucial Non-Confirmation Clinical Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-900 block mb-0.5">
                    Please Note: Your appointment is not yet confirmed.
                  </strong>
                  Dr. Dheekshith MR's team will contact you at <strong>{submittedData.phone}</strong> or <strong>{submittedData.email}</strong> to verify the time slot and share preparation instructions.
                </div>
              </div>

              {/* Request Details Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Request Details Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 block">Consultation Type:</span>
                    <strong className="text-slate-900 capitalize">
                      {submittedData.consultationType === 'telehealth' ? 'Online Consultation' : 'In-Clinic Consultation'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Requested Date:</span>
                    <strong className="text-slate-900">{submittedData.preferredDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Preferred Time:</span>
                    <strong className="text-slate-900">{submittedData.preferredTime}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact Phone:</span>
                    <strong className="text-slate-900">{submittedData.phone}</strong>
                  </div>
                </div>
                {submittedData.reason && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-slate-500 block mb-0.5">Reason for Visit:</span>
                    <p className="text-slate-800 italic">"{submittedData.reason}"</p>
                  </div>
                )}
              </div>

              {/* Fast Direct Contact Alternatives */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-medium">Need immediate clarification?</span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a href="tel:+917022108860" className="flex-1 sm:flex-initial">
                    <Button variant="outline" size="sm" icon={PhoneCall} className="w-full text-xs">
                      Call Desk
                    </Button>
                  </a>
                  {clinic.whatsappUrl && (
                    <a 
                      href="https://wa.me/917022108860" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial"
                    >
                      <Button variant="outline" size="sm" icon={MessageSquare} className="w-full text-xs text-emerald-800 border-emerald-300 bg-emerald-50/50">
                        WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  variant="outline" 
                  size="md" 
                  onClick={handleReset}
                  className="flex-1 justify-center"
                >
                  Submit Another Request
                </Button>
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={onClose}
                  className="flex-1 justify-center"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            /* Appointment Request Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Modal Intro Title */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Request a Consultation
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Fill in your details below. Dr. Dheekshith MR's team will contact you promptly to finalize your appointment.
                </p>
              </div>

              {/* Instant Call / WhatsApp Alternatives Strip */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <PhoneCall className="w-4 h-4 text-teal-800 shrink-0" />
                  <span>Prefer immediate clinic assistance?</span>
                </div>
                <div className="flex flex-col min-[340px]:flex-row items-center gap-2 w-full sm:w-auto">
                  <a href="tel:+917022108860" className="w-full min-[340px]:w-auto flex-1 sm:flex-initial">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-teal-800 shrink-0" />
                      <span className="truncate">Call {clinic.phone}</span>
                    </button>
                  </a>
                  {clinic.whatsappUrl && (
                    <a 
                      href="https://wa.me/917022108860" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full min-[340px]:w-auto flex-1 sm:flex-initial"
                    >
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>WhatsApp</span>
                      </button>
                    </a>
                  )}
                </div>
              </div>

              {/* Field 1: Preferred Consultation Type Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Preferred Consultation Mode *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* In-Clinic Option */}
                  <div
                    onClick={() => setConsultationType('in-clinic')}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      consultationType === 'in-clinic'
                        ? 'border-teal-800 bg-teal-50/25 ring-1 ring-teal-800/10 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      consultationType === 'in-clinic' ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">In-Clinic Visit</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        In-person orthopaedic evaluation
                      </p>
                    </div>
                  </div>

                  {/* Telehealth Video Option */}
                  <div
                    onClick={() => setConsultationType('telehealth')}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      consultationType === 'telehealth'
                        ? 'border-teal-800 bg-teal-50/25 ring-1 ring-teal-800/10 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      consultationType === 'telehealth' ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">Online Video Consult</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Video or messaging consultation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Contact Information Fields */}
              <div className="space-y-3.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Patient Contact Details *
                </label>

                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => {
                        setFormData({ ...formData, patientName: e.target.value });
                        if (errors.patientName) setErrors({ ...errors, patientName: null });
                      }}
                      placeholder="e.g. Eleanor Vance"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                        errors.patientName
                          ? 'border-rose-300 focus:ring-2 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800'
                      }`}
                    />
                  </div>
                  {errors.patientName && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.patientName}
                    </p>
                  )}
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        placeholder="(555) 000-0000"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                          errors.phone
                            ? 'border-rose-300 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        placeholder="patient@example.com"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-rose-300 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Preference Fields */}
              <div className="space-y-3.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Preferred Schedule *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        min={todayStr}
                        value={formData.preferredDate}
                        onChange={(e) => {
                          setFormData({ ...formData, preferredDate: e.target.value });
                          if (errors.preferredDate) setErrors({ ...errors, preferredDate: null });
                        }}
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                          errors.preferredDate
                            ? 'border-rose-300 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800'
                        }`}
                      />
                    </div>
                    {errors.preferredDate && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.preferredDate}
                      </p>
                    )}
                  </div>

                  {/* Preferred Time Window */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Time Window <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => {
                          setFormData({ ...formData, preferredTime: e.target.value });
                          if (errors.preferredTime) setErrors({ ...errors, preferredTime: null });
                        }}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800 cursor-pointer"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason for Consultation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  4. Reason for Consultation & Symptoms <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={formData.reason}
                  onChange={(e) => {
                    setFormData({ ...formData, reason: e.target.value });
                    if (errors.reason) setErrors({ ...errors, reason: null });
                  }}
                  placeholder="Briefly describe your orthopaedic concern, symptoms, relevant imaging, or questions for Dr. Dheekshith MR..."
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                    errors.reason
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-2 focus:ring-teal-800/20 focus:border-teal-800'
                  }`}
                />
                {errors.reason ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.reason}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Information shared is strictly confidential and reviewed only by Dr. Dheekshith MR's clinical team.
                  </p>
                )}
              </div>

              {/* Submission Error Banner */}
              {submitError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="font-semibold block text-rose-800 mb-0.5">Unable to Submit Request</strong>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              {/* Action Button: Strictly "Request Appointment" */}
              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Send}
                  disabled={isSubmitting}
                  className="w-full justify-center text-sm sm:text-base font-semibold"
                >
                  {isSubmitting ? 'Sending Request...' : 'Request Appointment'}
                </Button>

                <p className="text-center text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 inline text-teal-800 mr-1" />
                  This submits an appointment request. No payment is processed at this stage. Our team will contact you to confirm the time.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
