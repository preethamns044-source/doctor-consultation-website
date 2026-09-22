import React from 'react';
import Container from '../layout/Container';
import Card from '../common/Card';
import Button from '../common/Button';
import { DOCTOR_PROFILE } from '../../data/doctor';
import { MapPin, Building2, Navigation } from 'lucide-react';

export default function LocationsSection() {
  const { locations } = DOCTOR_PROFILE;

  if (!locations || locations.length === 0) return null;

  return (
    <section id="locations" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Consultation Locations
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit Us
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Dr. Dheekshith MR is available for in-person consultations at the following hospital locations in Ramanagara and Bengaluru.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {locations.map((location) => (
            <Card
              key={location.id}
              className="flex flex-col h-full bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
              padding="default"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{location.name}</h3>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{location.hospital}</p>
                    <p className="text-sm text-slate-600 mt-1">{location.address}</p>
                    <p className="text-sm text-slate-600">{location.city}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full justify-center group" icon={Navigation}>
                    <span className="group-hover:text-teal-800 transition-colors">Get Directions</span>
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
