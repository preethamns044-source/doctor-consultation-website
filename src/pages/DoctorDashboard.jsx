import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DOCTOR_PROFILE } from '../data/doctor';
import Button from '../components/common/Button';
import GalleryManager from '../components/admin/GalleryManager';
import { sendAppointmentNotification } from '../lib/emailService';
import {
  Loader2,
  LayoutDashboard,
  CalendarDays,
  User,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  ChevronRight,
  Phone,
  Mail,
  Video,
  Building2,
  Calendar,
  Filter,
  RefreshCw,
  Stethoscope,
  AlertCircle,
  CheckCheck,
  Eye,
  X,
  TrendingUp,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-800 border border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-rose-50 text-rose-800 border border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-50 text-blue-800 border border-blue-200',
    dot: 'bg-blue-500',
    icon: CheckCheck,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-800 border border-red-200',
    dot: 'bg-red-400',
    icon: Ban,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCreatedAt(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr + 'T00:00');
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00');
  return d > today;
}

function isPast(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00');
  return d < today;
}

// ─────────────────────────────────────────────
// Appointment Detail Modal
// ─────────────────────────────────────────────

function AppointmentDetailModal({ appointment, onClose, onStatusChange, updating }) {
  if (!appointment) return null;

  const actions = [];
  if (appointment.status === 'pending') {
    actions.push({ label: 'Confirm', newStatus: 'confirmed', variant: 'primary', icon: CheckCircle2 });
    actions.push({ label: 'Reject', newStatus: 'rejected', variant: 'danger', icon: XCircle });
  }
  if (appointment.status === 'confirmed') {
    actions.push({ label: 'Mark Completed', newStatus: 'completed', variant: 'primary', icon: CheckCheck });
    actions.push({ label: 'Cancel', newStatus: 'cancelled', variant: 'danger', icon: Ban });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-base font-bold text-slate-900">Appointment Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ref: {appointment.request_id || appointment.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <StatusBadge status={appointment.status} />
            <span className="text-xs text-slate-400">Booked {formatCreatedAt(appointment.created_at)}</span>
          </div>

          {/* Patient Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Patient Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="text-sm font-semibold text-slate-900">{appointment.patient_name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-700 shrink-0" />
                <a href={`tel:${appointment.phone}`} className="text-sm text-slate-700 hover:text-teal-700 transition-colors">
                  {appointment.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-700 shrink-0" />
                <a href={`mailto:${appointment.email}`} className="text-sm text-slate-700 hover:text-teal-700 transition-colors truncate">
                  {appointment.email}
                </a>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Type</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  {appointment.consultation_type === 'telehealth' ? (
                    <><Video className="w-4 h-4 text-blue-600" /> Online</>
                  ) : (
                    <><Building2 className="w-4 h-4 text-teal-700" /> In-Clinic</>
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Preferred Date</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(appointment.preferred_date)}
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-slate-500 block mb-0.5">Preferred Time</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {appointment.preferred_time || '—'}
                </div>
              </div>
            </div>
            {appointment.reason && (
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-xs text-slate-500 block mb-1">Reason / Symptoms</span>
                <p className="text-sm text-slate-800 italic leading-relaxed">"{appointment.reason}"</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {actions.map((action) => (
                <Button
                  key={action.newStatus}
                  variant={action.variant}
                  size="md"
                  icon={action.icon}
                  disabled={updating}
                  onClick={() => onStatusChange(appointment.id, action.newStatus)}
                  className="flex-1 justify-center"
                >
                  {updating ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Updating...</> : action.label}
                </Button>
              ))}
            </div>
          )}

          {(appointment.status === 'completed' || appointment.status === 'cancelled' || appointment.status === 'rejected') && (
            <div className="text-center py-2">
              <span className="text-xs text-slate-400">This appointment is {appointment.status}.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Appointment Row
// ─────────────────────────────────────────────

function AppointmentRow({ appt, onSelect, onStatusChange, updating }) {
  const todayFlag = isToday(appt.preferred_date);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-sm transition-all duration-150 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-sm text-slate-900 truncate">{appt.patient_name}</span>
            <StatusBadge status={appt.status} />
            {todayFlag && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold">
                <Activity className="w-3 h-3" /> Today
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(appt.preferred_date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {appt.preferred_time ? appt.preferred_time.split('(')[0].trim() : '—'}
            </span>
            <span className="flex items-center gap-1">
              {appt.consultation_type === 'telehealth' ? (
                <><Video className="w-3 h-3 text-blue-500" /> Online</>
              ) : (
                <><Building2 className="w-3 h-3 text-teal-600" /> In-Clinic</>
              )}
            </span>
            {appt.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {appt.phone}
              </span>
            )}
          </div>
          {appt.reason && (
            <p className="text-xs text-slate-400 mt-1.5 italic truncate max-w-sm">"{appt.reason}"</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick inline actions */}
          {appt.status === 'pending' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onStatusChange(appt.id, 'confirmed')}
                disabled={updating}
                title="Confirm Appointment"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Confirm</span>
              </button>
              <button
                onClick={() => onStatusChange(appt.id, 'rejected')}
                disabled={updating}
                title="Reject Appointment"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reject</span>
              </button>
            </div>
          )}
          {appt.status === 'confirmed' && (
            <button
              onClick={() => onStatusChange(appt.id, 'completed')}
              disabled={updating}
              title="Mark Completed"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Complete</span>
            </button>
          )}
          <button
            onClick={() => onSelect(appt)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition-colors border border-slate-200/60"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stats Card
// ─────────────────────────────────────────────

function StatCard({ label, count, icon: Icon, colorClass, bgClass }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
      <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-tight">{count}</p>
        <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FILTER OPTIONS
// ─────────────────────────────────────────────

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'unassigned', label: 'Unassigned' },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function DoctorDashboard() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'appointments' | 'gallery' | 'profile'
  const [activeFilter, setActiveFilter] = useState('all');

  const [selectedAppt, setSelectedAppt] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const checkAdminStatus = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
    setAuthLoading(false);
  }, []);

  // ── Auth check ─────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        window.location.href = '/admin/login?redirect=/doctor/dashboard';
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        window.location.href = '/admin/login?redirect=/doctor/dashboard';
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus]);

  // ── Fetch appointments (only runs when allowed) ────────────
  const fetchAppointments = useCallback(async () => {
    setFetching(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFetchError(error.message);
    } else {
      setAppointments(data || []);
    }
    setFetching(false);
  }, []);

  useEffect(() => {
    if (isAllowed) {
      fetchAppointments();
    }
  }, [isAllowed, fetchAppointments]);

  // ── Realtime subscription for instant new booking alerts ───
  useEffect(() => {
    if (!isAllowed) return;

    const channel = supabase
      .channel('doctor-dashboard-appointments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload) => {
          setAppointments((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'appointments' },
        (payload) => {
          setAppointments((prev) =>
            prev.map((a) => (a.id === payload.new.id ? payload.new : a))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAllowed]);

  // ── Status update & Patient Email ──────────────────────────
  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Status updated to "${newStatus}".`);
      // Reflect locally for instant UI update
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
      );
      // Also update selected appointment in modal if open
      if (selectedAppt?.id === appointmentId) {
        setSelectedAppt((prev) => ({ ...prev, status: newStatus }));
      }
      // Auto-dismiss success after 4 seconds
      setTimeout(() => setUpdateSuccess(null), 4000);

      // Trigger email notification for confirmed or rejected status
      if (newStatus === 'confirmed' || newStatus === 'rejected') {
        const appt = appointments.find((a) => a.id === appointmentId) || selectedAppt;
        if (appt?.email) {
          try {
            const emailResult = await sendAppointmentNotification({
              email: appt.email,
              patient_name: appt.patient_name,
              new_status: newStatus,
              appointment_id: appt.request_id || appt.id,
              preferred_date: appt.preferred_date,
              preferred_time: appt.preferred_time,
              doctor_name: DOCTOR_PROFILE.name,
            });

            if (!emailResult.success) {
              console.warn('[Notification notice]', emailResult.error);
            } else {
              console.log('[Notification success] Email dispatched to patient:', appt.email);
            }
          } catch (fnErr) {
            console.error('Could not invoke email notification:', fnErr);
          }
        }
      }
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  // ── Computed stats ─────────────────────────────────────────
  const stats = {
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    rejected: appointments.filter((a) => a.status === 'rejected').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    today: appointments.filter((a) => isToday(a.preferred_date)).length,
    upcoming: appointments.filter((a) => isUpcoming(a.preferred_date) && !isToday(a.preferred_date)).length,
  };

  // ── Filtered list ──────────────────────────────────────────
  const filteredAppointments = appointments.filter((a) => {
    switch (activeFilter) {
      case 'pending': return a.status === 'pending';
      case 'confirmed': return a.status === 'confirmed';
      case 'rejected': return a.status === 'rejected';
      case 'completed': return a.status === 'completed';
      case 'cancelled': return a.status === 'cancelled';
      case 'today': return isToday(a.preferred_date);
      case 'upcoming': return isUpcoming(a.preferred_date) && !isToday(a.preferred_date);
      case 'past': return isPast(a.preferred_date);
      case 'unassigned': return a.doctor_id === null;
      default: return true;
    }
  });

  // ─────────────── LOADING STATE ────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
      </div>
    );
  }

  // ─────────────── ACCESS DENIED STATE ─────────────────────
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm border border-slate-200">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your account is not authorized to access the doctor dashboard.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleLogout} variant="danger" className="w-full justify-center">
              Log Out
            </Button>
            <a href="/" className="text-sm text-slate-400 hover:text-teal-700 transition-colors mt-2">
              &larr; Back to website
            </a>
          </div>
        </div>
      </div>
    );
  }

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  const todayAndUpcoming = appointments
    .filter((a) => (isToday(a.preferred_date) || isUpcoming(a.preferred_date)) && a.status !== 'cancelled' && a.status !== 'rejected')
    .sort((a, b) => new Date(a.preferred_date) - new Date(b.preferred_date))
    .slice(0, 5);

  // ─────────────── MAIN DASHBOARD ──────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Doctor Dashboard</h1>
            <p className="hidden sm:block text-xs text-slate-400 leading-tight">Dr. Dheekshith MR • Orthopaedic Surgeon</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/" className="hidden sm:inline-block text-xs font-medium text-teal-700 hover:underline">
            View Live Site
          </a>
          <Button onClick={handleLogout} variant="outline" size="sm" icon={LogOut} className="text-xs">
            <span className="hidden sm:inline">Log Out</span>
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) */}
        <nav className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 py-6 px-3 gap-1 shrink-0">
          {[
            { key: 'overview', label: 'Overview', icon: LayoutDashboard },
            { key: 'appointments', label: 'Appointments', icon: CalendarDays, badge: stats.pending },
            { key: 'gallery', label: 'Gallery', icon: ImageIcon },
            { key: 'profile', label: 'My Account', icon: User },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left ${
                activeTab === key
                  ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {badge}
                </span>
              )}
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-slate-100 px-1">
            <p className="text-[11px] text-slate-400 truncate" title={session?.user?.email}>
              {session?.user?.email}
            </p>
          </div>
        </nav>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex md:hidden z-30">
          {[
            { key: 'overview', label: 'Overview', icon: LayoutDashboard },
            { key: 'appointments', label: 'Appointments', icon: CalendarDays, badge: stats.pending },
            { key: 'gallery', label: 'Gallery', icon: ImageIcon },
            { key: 'profile', label: 'Account', icon: User },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors relative ${
                activeTab === key ? 'text-teal-700' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[14px] text-center leading-none">
                    {badge}
                  </span>
                )}
              </div>
              {label}
            </button>
          ))}
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">

          {/* Global status toasts */}
          {updateSuccess && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {updateSuccess}
            </div>
          )}
          {updateError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              {updateError}
              <button onClick={() => setUpdateError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Practice Overview</h2>
                <p className="text-sm text-slate-500 mt-0.5">Summary of patient appointments and clinical requests.</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard label="Pending Review" count={stats.pending} icon={Clock} colorClass="text-amber-600" bgClass="bg-amber-50" />
                <StatCard label="Confirmed" count={stats.confirmed} icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
                <StatCard label="Today's Appts" count={stats.today} icon={Activity} colorClass="text-purple-600" bgClass="bg-purple-50" />
                <StatCard label="Upcoming" count={stats.upcoming} icon={TrendingUp} colorClass="text-teal-700" bgClass="bg-teal-50" />
              </div>

              {/* Today & Upcoming */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-teal-700" />
                    Today &amp; Upcoming Appointments
                  </h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs text-teal-700 font-medium hover:underline flex items-center gap-1"
                  >
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {fetching ? (
                    <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-teal-700" /></div>
                  ) : todayAndUpcoming.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm">No upcoming appointments.</div>
                  ) : (
                    todayAndUpcoming.map((appt) => (
                      <div
                        key={appt.id}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors"
                        onClick={() => { setSelectedAppt(appt); }}
                      >
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          {appt.consultation_type === 'telehealth'
                            ? <Video className="w-4 h-4 text-blue-600" />
                            : <Building2 className="w-4 h-4 text-teal-700" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{appt.patient_name}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {formatDate(appt.preferred_date)} · {appt.preferred_time ? appt.preferred_time.split('(')[0].trim() : '—'}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <StatusBadge status={appt.status} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent bookings */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    Recent Bookings
                  </h3>
                  <button
                    onClick={fetchAppointments}
                    disabled={fetching}
                    className="text-slate-400 hover:text-teal-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {fetching ? (
                    <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-teal-700" /></div>
                  ) : recentAppointments.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm">No appointments yet.</div>
                  ) : (
                    recentAppointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors"
                        onClick={() => setSelectedAppt(appt)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-900 truncate">{appt.patient_name}</span>
                            <StatusBadge status={appt.status} />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Booked {formatCreatedAt(appt.created_at)} · {appt.consultation_type === 'telehealth' ? 'Online' : 'In-Clinic'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── APPOINTMENTS TAB ─── */}
          {activeTab === 'appointments' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Appointments Management</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{filteredAppointments.length} appointments listed · Confirm or Reject requests</p>
                </div>
                <button
                  onClick={fetchAppointments}
                  disabled={fetching}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-teal-700 transition-colors p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200"
                >
                  <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      activeFilter === f.key
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                    {f.key === 'pending' && stats.pending > 0 && (
                      <span className={`ml-1.5 px-1 py-0.5 rounded text-[9px] font-bold ${activeFilter === 'pending' ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-700'}`}>
                        {stats.pending}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Fetch Error */}
              {fetchError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Could not load appointments.</strong> {fetchError}
                    <br />
                    <span className="text-xs text-red-500 mt-1 block">
                      Make sure the Supabase RLS policies from <code>doctor-dashboard-schema.sql</code> have been applied.
                    </span>
                  </div>
                </div>
              )}

              {/* Appointments List */}
              {fetching && appointments.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-700 mb-3" />
                  <p className="text-sm font-medium">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                  <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No appointments found</p>
                  <p className="text-xs text-slate-400 mt-1">Try selecting a different filter.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredAppointments.map((appt) => (
                    <AppointmentRow
                      key={appt.id}
                      appt={appt}
                      onSelect={setSelectedAppt}
                      onStatusChange={handleStatusChange}
                      updating={updating}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── GALLERY TAB ─── */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Clinic Photo Gallery</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Upload, view, and delete photos displayed in the public website gallery.
                  </p>
                </div>
                <a
                  href="/admin/gallery"
                  className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors inline-flex items-center gap-1 w-fit"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Full-Screen Gallery Manager &rarr;
                </a>
              </div>

              <GalleryManager />
            </div>
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Account</h2>
                <p className="text-sm text-slate-500 mt-0.5">Your doctor dashboard account details.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 flex items-center gap-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-slate-50">
                  <div className="w-14 h-14 rounded-2xl bg-teal-700 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {session?.user?.email?.[0]?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Dr. Dheekshith MR</p>
                    <p className="text-sm text-slate-500">Orthopaedic Surgeon</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Account Email</label>
                    <div className="flex items-center gap-2.5 text-sm text-slate-800">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      {session?.user?.email || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Role</label>
                    <div className="flex items-center gap-2.5 text-sm text-slate-800">
                      <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
                      Authorized Doctor / Admin
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Dashboard Access</label>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Full Access
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100">
                  <Button onClick={handleLogout} variant="danger" size="md" icon={LogOut} className="w-full justify-center">
                    Log Out
                  </Button>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-teal-700" /> Patient Email Notification System
                </p>
                <p className="leading-relaxed">
                  When an appointment status is updated to <strong>Confirmed</strong> or <strong>Rejected</strong>,
                  an email is automatically sent to the patient's registered email using <strong>Google Apps Script + Gmail</strong>.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
}
