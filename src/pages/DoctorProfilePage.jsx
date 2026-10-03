import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AppointmentModal from '../components/consultation/AppointmentModal';
import { DOCTOR_PROFILE } from '../data/doctor';
import { 
  Stethoscope, 
  GraduationCap, 
  Award, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Quote, 
  ArrowLeft,
  ArrowRight,
  Building2,
  Activity,
  HeartPulse,
  Zap,
  Video,
  Clock,
  ExternalLink
} from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function DoctorProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('in-clinic');

  const { 
    name, 
    title, 
    degrees, 
    specialty, 
    subSpecialties, 
    experienceYears, 
    image, 
    clinic, 
    bio, 
    education, 
    certifications, 
    services, 
    treatments, 
    locations, 
    consultationOptions 
  } = DOCTOR_PROFILE;

  const handleOpenModal = (type = 'in-clinic') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "url": "https://doctor-consultation-website-sand.vercel.app/dr-dheekshith-mr",
    "name": "Dr. Dheekshith MR | Orthopaedic Surgeon Profile",
    "description": "Learn about Dr. Dheekshith MR, orthopaedic surgeon, including his professional profile, treatments, consultation information and appointment details.",
    "mainEntity": {
      "@type": "Person",
      "@id": "https://doctor-consultation-website-sand.vercel.app/#physician",
      "name": "Dr. Dheekshith MR",
      "jobTitle": "Orthopaedic Surgeon",
      "image": "https://doctor-consultation-website-sand.vercel.app/og-image.jpg",
      "url": "https://doctor-consultation-website-sand.vercel.app/dr-dheekshith-mr",
      "telephone": "+91-7022108860",
      "email": "dheekshithmrnikhi@gmail.com",
      "description": "Dr. Dheekshith MR is an Orthopaedic Surgeon in Bangalore and Ramanagara holding MBBS, MS (Orthopaedics), DNB (Orthopaedics), Fellowship in Joint Replacement, and Diploma in Football Medicine (FIFA).",
      "sameAs": [
        "https://www.instagram.com/dhee_ortho_care/"
      ],
      "knowsAbout": [
        "Orthopaedic Surgery",
        "Joint Replacement",
        "Knee Replacement",
        "Hip Replacement",
        "Sports Medicine",
        "Football Injuries",
        "Knee Arthroscopy",
        "Fracture & Trauma Care"
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* Dynamic JSON-LD for ProfilePage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Navigation Header */}
      <Navbar onBookClick={handleOpenModal} />

      <main className="flex-1">
        {/* Breadcrumb & Navigation Link */}
        <section className="bg-white border-b border-slate-100 py-3">
          <Container>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <a href="/" className="inline-flex items-center gap-1.5 hover:text-teal-800 transition-colors font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Website
              </a>
              <div className="flex items-center gap-2">
                <a href="/#treatments" className="hover:text-teal-800 transition-colors">Treatments</a>
                <span>•</span>
                <a href="/gallery" className="hover:text-teal-800 transition-colors">Gallery</a>
                <span>•</span>
                <a href="/#consultation" className="hover:text-teal-800 transition-colors">Appointments</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Doctor Header Banner / Introduction */}
        <section className="bg-white py-8 sm:py-14 border-b border-slate-100">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Doctor Image */}
              <div className="lg:col-span-4">
                <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md aspect-4/5">
                  <img
                    src={image}
                    alt="Dr. Dheekshith MR, Orthopaedic Surgeon"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-lg font-bold tracking-tight">{name}</p>
                    <p className="text-xs text-teal-300 font-semibold">{degrees}</p>
                    <p className="text-[11px] text-slate-200 mt-0.5">{specialty}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Details & Intro */}
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-teal-800 text-xs font-semibold">
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                  <span>Official Professional Profile</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                    {name}
                  </h1>
                  <p className="text-lg sm:text-xl font-bold text-teal-800">
                    {title}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {degrees} • Orthopaedic Surgeon in Bangalore &amp; Ramanagara
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                  {bio.intro}
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={Calendar} 
                    className="w-full sm:w-auto shadow-sm"
                    onClick={() => handleOpenModal('in-clinic')}
                  >
                    Book Consultation
                  </Button>
                  <a href="https://wa.me/917022108860?text=Hello%20Dr.%20Dheekshith%20MR%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation." target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      icon={WhatsAppIcon} 
                      className="w-full text-white border-transparent hover:opacity-90"
                      style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                    >
                      WhatsApp Us
                    </Button>
                  </a>
                  <a href="tel:+917022108860" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      icon={PhoneCall} 
                      className="w-full border-slate-300 hover:border-slate-400 text-slate-800 bg-white"
                    >
                      Call Clinic ({clinic.phone})
                    </Button>
                  </a>
                </div>

                {/* Navigation Links Strip */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-teal-800">
                  <a href="#about" className="hover:underline flex items-center gap-1">About Profile <ArrowRight className="w-3 h-3" /></a>
                  <a href="#education" className="hover:underline flex items-center gap-1">Qualifications <ArrowRight className="w-3 h-3" /></a>
                  <a href="#specialties" className="hover:underline flex items-center gap-1">Specialities <ArrowRight className="w-3 h-3" /></a>
                  <a href="#locations" className="hover:underline flex items-center gap-1">Clinic Locations <ArrowRight className="w-3 h-3" /></a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 1: About Dr. Dheekshith MR */}
        <section id="about" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-100">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
                  Physician Profile
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  About Dr. Dheekshith MR
                </h2>
              </div>

              <Card className="bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6" hoverEffect={false}>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Dr. Dheekshith MR is an Orthopaedic Surgeon with {experienceYears}+ years of clinical experience. He holds an MBBS, MS in Orthopaedics, and a DNB in Orthopaedics, along with a Fellowship in Joint Replacement and a Diploma in Football Medicine (FIFA).
                </p>

                {bio.philosophy && (
                  <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200/70 text-teal-900 space-y-2">
                    <Quote className="w-6 h-6 text-teal-700/30 fill-current" />
                    <p className="text-xs sm:text-sm italic text-slate-800 leading-relaxed">
                      "{bio.philosophy}"
                    </p>
                    <p className="text-xs font-bold text-teal-800 pt-1">— Dr. Dheekshith MR, Care Philosophy</p>
                  </div>
                )}

                {bio.quote && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Clinical Principle:</strong>
                      "{bio.quote}"
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </Container>
        </section>

        {/* SECTION 2: Professional Profile & Education */}
        <section id="education" className="py-12 sm:py-16 bg-white border-b border-slate-100">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
                  Credentials &amp; Education
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Qualifications &amp; Board Certifications
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Degrees Timeline */}
                <Card className="bg-slate-50/70 border border-slate-200 p-6 space-y-6" hoverEffect={false}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-teal-800 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Academic Training</h3>
                  </div>

                  <div className="space-y-4">
                    {education.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">{item.degree}</strong>
                          <span className="text-slate-500 text-xs">{item.institution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Verified Certifications */}
                <Card className="bg-slate-50/70 border border-slate-200 p-6 space-y-6" hoverEffect={false}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-teal-800 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Certifications &amp; Fellowships</h3>
                  </div>

                  <div className="space-y-3">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 3: Areas of Orthopaedic Care */}
        <section id="specialties" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-100">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
                  Specialised Care
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Areas of Orthopaedic Care
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subSpecialties.map((item) => (
                  <Card key={item} className="bg-white border border-slate-200/90 p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 4: Treatments & Services Summary */}
        <section id="services" className="py-12 sm:py-16 bg-white border-b border-slate-100">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
                  Clinical Services
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Treatments &amp; Clinical Services
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Comprehensive surgical, non-surgical, and regenerative orthopaedic procedures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((svc) => (
                  <Card key={svc.id} className="bg-slate-50/60 border border-slate-200 p-5 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-700 shrink-0" />
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {svc.description}
                    </p>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-2">
                <a href="/#treatments" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-800 hover:underline">
                  View full list of conditions &amp; treatments on main page <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 5: Consultation Information & Practice Locations */}
        <section id="locations" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-100">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
                  Hospital Locations
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Consultation Information &amp; Clinic Locations
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Dr. Dheekshith MR provides in-person consultations at hospital locations in Ramanagara and Bengaluru, as well as online video consultations.
                </p>
              </div>

              {/* Consultation Locations Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.map((loc) => (
                  <Card key={loc.id} className="bg-white border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{loc.name}</h3>
                        <p className="text-xs font-semibold text-teal-800">{loc.hospital}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p>{loc.address}</p>
                      <p>{loc.city}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Consultation Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {consultationOptions.map((opt) => (
                  <div key={opt.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold text-sm">{opt.title}</strong>
                      <span className="text-[11px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">{opt.duration}</span>
                    </div>
                    <p className="text-slate-600">{opt.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 6: Appointment / Contact CTA */}
        <section id="contact" className="py-12 sm:py-20 bg-slate-900 text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-slate-800 px-3.5 py-1 rounded-full border border-slate-700">
                Book Consultation
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Schedule a Consultation with Dr. Dheekshith MR
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Consult with Dr. Dheekshith MR for joint pain evaluation, sports injury management, knee/hip care, or fracture recovery.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
                <Button 
                  variant="primary" 
                  size="lg" 
                  icon={Calendar} 
                  className="w-full sm:w-auto justify-center"
                  onClick={() => handleOpenModal('in-clinic')}
                >
                  Book Appointment
                </Button>
                <a href="https://wa.me/917022108860?text=Hello%20Dr.%20Dheekshith%20MR%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation." target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    icon={WhatsAppIcon} 
                    className="w-full justify-center text-white border-transparent hover:opacity-90"
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                  >
                    WhatsApp Us
                  </Button>
                </a>
                <a href="tel:+917022108860" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    icon={PhoneCall} 
                    className="w-full justify-center bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                  >
                    Call: {clinic.phone}
                  </Button>
                </a>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400">
                <a href="/" className="hover:text-white transition-colors">Homepage</a>
                <span>•</span>
                <a href="/#treatments" className="hover:text-white transition-colors">Treatments</a>
                <span>•</span>
                <a href="/gallery" className="hover:text-white transition-colors">Clinic Gallery</a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Appointment Consultation Request Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={modalType}
      />
    </div>
  );
}
