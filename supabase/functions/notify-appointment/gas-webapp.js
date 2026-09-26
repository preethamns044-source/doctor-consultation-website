/**
 * Google Apps Script Web App — Appointment Email Notifications
 * ─────────────────────────────────────────────────────────────
 * HOW TO DEPLOY:
 *  1. Go to https://script.google.com and create a new project.
 *  2. Paste this entire file (replace the default code).
 *  3. Click "Deploy" -> "New deployment".
 *  4. Choose type "Web app".
 *  5. "Execute as" -> Me  (the Gmail account that will send emails).
 *  6. "Who has access" -> Anyone.
 *     (The URL is a secret kept server-side in Supabase; it is NEVER exposed
 *      in frontend code.)
 *  7. Click "Deploy" and authorize Gmail permissions when prompted.
 *  8. Copy the Web App URL  (https://script.google.com/macros/s/.../exec).
 *  9. In Supabase Dashboard -> Edge Functions -> notify-appointment -> Secrets,
 *     add:  GOOGLE_APPS_SCRIPT_URL = <the URL from step 8>
 *
 * SECURITY NOTES:
 *  - No Gmail password or API key is needed - Apps Script uses OAuth.
 *  - The Web App URL must stay server-side only (Supabase secret).
 *  - The doPost function validates required fields before sending any email.
 */

// -- Clinic configuration - update these before deploying --------------------
var CLINIC_NAME    = "Dr. Dheekshith MR - Orthopaedic Surgeon";
var CLINIC_WEBSITE = "https://yourdomain.com"; // update with real domain

// -- Entry points for POST and GET requests -----------------------------------
function handleRequest(e) {
  try {
    var payload = null;

    // 1. Try reading postData contents from POST request
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (pErr) {
        payload = null;
      }
    }

    // 2. Try reading parameters from query string (GET fallback or redirected GET)
    if (!payload && e && e.parameter) {
      if (e.parameter.payload) {
        try {
          payload = JSON.parse(e.parameter.payload);
        } catch (pErr2) {
          payload = null;
        }
      } else if (e.parameter.email) {
        payload = {
          email: e.parameter.email,
          patient_name: e.parameter.patient_name,
          new_status: e.parameter.new_status,
          appointment_id: e.parameter.appointment_id,
          preferred_date: e.parameter.preferred_date,
          preferred_time: e.parameter.preferred_time,
          doctor_name: e.parameter.doctor_name,
        };
      }
    }

    if (!payload) {
      return jsonResponse({ status: "ok", service: "appointment-email-notifier", message: "No email payload received" });
    }

    var email       = (payload.email          || "").trim();
    var patientName = (payload.patient_name   || "Patient").trim();
    var newStatus   = (payload.new_status     || "").trim().toLowerCase();
    var apptId      = (payload.appointment_id || "").trim();
    var prefDate    = (payload.preferred_date  || "").trim();
    var prefTime    = (payload.preferred_time  || "").trim();
    var doctorName  = (payload.doctor_name    || "Dr. Dheekshith MR").trim();

    if (!email) {
      return jsonResponse({ success: false, error: "Missing patient email" });
    }

    if (newStatus !== "confirmed" && newStatus !== "rejected") {
      return jsonResponse({ success: true, message: "No email needed for status: " + newStatus });
    }

    var subject = buildSubject(newStatus, apptId);
    var htmlBody = buildHtmlBody(newStatus, patientName, apptId, prefDate, prefTime, doctorName);

    GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody, name: CLINIC_NAME });

    return jsonResponse({ success: true, message: "Email sent to " + email });

  } catch (err) {
    Logger.log("handleRequest error: " + err.message);
    return jsonResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

// -- helpers ------------------------------------------------------------------

function buildSubject(status, apptId) {
  var ref = apptId ? " [Ref: " + apptId + "]" : "";
  if (status === "confirmed") {
    return "Your Appointment is Confirmed" + ref + " - " + CLINIC_NAME;
  }
  return "Appointment Update" + ref + " - " + CLINIC_NAME;
}

function buildHtmlBody(status, patientName, apptId, prefDate, prefTime, doctorName) {
  var isConfirmed = (status === "confirmed");
  var accentColor = isConfirmed ? "#0f766e" : "#dc2626";
  var statusLabel = isConfirmed ? "Confirmed" : "Rejected";
  var headerBg    = isConfirmed ? "#ccfbf1"  : "#fee2e2";
  var statusIcon  = isConfirmed ? "CONFIRMED" : "UPDATE";

  var detailsRows = "";
  if (prefDate) {
    detailsRows += "<tr><td style='padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;width:40%'>Date</td>"
                 + "<td style='padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#0f172a'>" + prefDate + "</td></tr>";
  }
  if (prefTime) {
    detailsRows += "<tr><td style='padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b'>Time</td>"
                 + "<td style='padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#0f172a'>" + prefTime + "</td></tr>";
  }
  if (apptId) {
    detailsRows += "<tr><td style='padding:8px 0;font-size:14px;color:#64748b'>Reference</td>"
                 + "<td style='padding:8px 0;font-size:14px;font-weight:600;color:#0f172a;font-family:monospace'>" + apptId + "</td></tr>";
  }
  var detailsTable = detailsRows
    ? "<table style='width:100%;border-collapse:collapse;margin-top:16px'>" + detailsRows + "</table>"
    : "";

  var bodyText = isConfirmed
    ? "<p style='font-size:15px;color:#334155;line-height:1.7;margin:16px 0 0'>Your appointment with <strong>" + doctorName + "</strong> has been <strong style='color:" + accentColor + "'>confirmed</strong>. Please arrive 10 minutes early. To reschedule, please contact the clinic.</p>"
    : "<p style='font-size:15px;color:#334155;line-height:1.7;margin:16px 0 0'>We are sorry - your appointment request could not be accommodated at this time. Please contact the clinic to book an alternative slot.</p>";

  return "<!DOCTYPE html><html><head><meta charset='utf-8'></head>"
    + "<body style='margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif'>"
    + "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#f1f5f9;padding:32px 16px'>"
    + "<tr><td align='center'>"
    + "<table role='presentation' width='100%' style='max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)'>"
    + "<tr><td style='background:" + headerBg + ";padding:28px 32px;text-align:center'>"
    + "<p style='margin:0;font-size:13px;font-weight:700;letter-spacing:2px;color:" + accentColor + "'>" + statusIcon + "</p>"
    + "<h1 style='margin:8px 0 0;font-size:22px;color:" + accentColor + ";font-weight:700'>Appointment " + statusLabel + "</h1>"
    + "</td></tr>"
    + "<tr><td style='padding:28px 32px'>"
    + "<p style='font-size:15px;color:#334155;line-height:1.6;margin:0'>Dear <strong>" + patientName + "</strong>,</p>"
    + bodyText
    + detailsTable
    + "</td></tr>"
    + "<tr><td style='padding:20px 32px;border-top:1px solid #e2e8f0;background:#f8fafc;text-align:center'>"
    + "<p style='font-size:12px;color:#94a3b8;margin:0'>" + CLINIC_NAME + "</p>"
    + "<p style='font-size:12px;color:#94a3b8;margin:4px 0 0'>This is an automated message - please do not reply.</p>"
    + "<p style='font-size:12px;color:#94a3b8;margin:4px 0 0'><a href='" + CLINIC_WEBSITE + "' style='color:#0f766e'>" + CLINIC_WEBSITE + "</a></p>"
    + "</td></tr>"
    + "</table></td></tr></table></body></html>";
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
