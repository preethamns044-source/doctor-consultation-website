import { supabase } from './supabase';

/**
 * Sends an email notification to the particular patient whose appointment status changed.
 * Uses Google Apps Script + Gmail.
 *
 * Security & Reliability:
 * - Patient email is retrieved directly from the appointment record (never hardcoded).
 * - Only sends for 'confirmed' and 'rejected' statuses.
 * - Primary route: Supabase Edge Function 'notify-appointment' (keeps secrets server-side).
 * - Fallback route: Direct call to VITE_GOOGLE_APPS_SCRIPT_URL if configured in .env.local.
 * - No passwords or Gmail credentials are ever exposed in frontend code.
 */
export async function sendAppointmentNotification({
  email,
  patient_name,
  new_status,
  appointment_id,
  preferred_date,
  preferred_time,
  doctor_name,
}) {
  if (!email) {
    console.warn('[EmailService] Skipped: No patient email provided');
    return { success: false, error: 'No patient email provided' };
  }

  if (new_status !== 'confirmed' && new_status !== 'rejected') {
    return { success: false, message: `No email needed for status: ${new_status}` };
  }

  const payload = {
    email,
    patient_name: patient_name || 'Patient',
    new_status,
    appointment_id: appointment_id || '',
    preferred_date: preferred_date || '',
    preferred_time: preferred_time || '',
    doctor_name: doctor_name || 'Dr. Dheekshith MR',
  };

  let edgeError = null;

  // 1. Primary path: Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('notify-appointment', {
      body: payload,
    });

    if (!error && (data?.success || data?.message)) {
      return { success: true, method: 'supabase-edge-function', data };
    }

    if (error) {
      edgeError = error.message;
      console.warn('[EmailService] Supabase Edge Function returned error:', error);
    }
  } catch (err) {
    edgeError = err instanceof Error ? err.message : String(err);
    console.warn('[EmailService] Edge Function unreachable:', err);
  }

  // 2. Direct fallback path: VITE_GOOGLE_APPS_SCRIPT_URL (if set in .env.local)
  const directUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
  if (directUrl) {
    try {
      await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      return { success: true, method: 'google-apps-script-direct' };
    } catch (directErr) {
      console.error('[EmailService] Direct Google Apps Script dispatch failed:', directErr);
      return { success: false, error: directErr.message };
    }
  }

  return {
    success: false,
    error: edgeError || 'Google Apps Script notification endpoint not configured',
  };
}
