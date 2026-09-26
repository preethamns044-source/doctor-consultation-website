// supabase/functions/notify-appointment/index.ts
// Supabase Edge Function: receives appointment status change notifications
// and securely delegates email sending to Google Apps Script + Gmail.
//
// Expected payload shape (JSON):
// {
//   "email": "patient@example.com",
//   "patient_name": "Jane Doe",
//   "new_status": "confirmed" | "rejected",
//   "appointment_id": "APT-12345",
//   "preferred_date": "2026-10-01",
//   "preferred_time": "10:00 AM",
//   "doctor_name": "Dr. Dheekshith MR"
// }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationPayload {
  email: string;
  patient_name?: string;
  new_status: string;
  appointment_id?: string;
  preferred_date?: string;
  preferred_time?: string;
  doctor_name?: string;
}

/** Sends appointment notification via Google Apps Script Web App (Gmail) */
async function sendEmailViaGoogleAppsScript(payload: NotificationPayload) {
  const gasUrl = Deno.env.get("GOOGLE_APPS_SCRIPT_URL") || Deno.env.get("GAS_WEBAPP_URL");
  if (!gasUrl) {
    console.error("GOOGLE_APPS_SCRIPT_URL not configured in Supabase environment secrets");
    return new Response(
      JSON.stringify({
        error: "Missing Google Apps Script configuration",
        details: "Please set GOOGLE_APPS_SCRIPT_URL in Supabase Function secrets.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Append payload to URL parameters to preserve data if HTTP 302 redirect transforms POST -> GET
    const targetUrl = new URL(gasUrl);
    targetUrl.searchParams.set("payload", JSON.stringify(payload));

    const resp = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "Unknown error from Google Apps Script");
      console.error("Google Apps Script HTTP error:", resp.status, errorText);
      return new Response(
        JSON.stringify({ error: "Google Apps Script error", details: errorText }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json().catch(() => ({ success: true }));

    if (data && data.success === false) {
      console.error("Google Apps Script logic error:", data.error);
      return new Response(
        JSON.stringify({ error: "Google Apps Script failed to send email", details: data.error || "Execution failed in Apps Script" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully via Google Apps Script + Gmail", data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to connect to Google Apps Script:", message);
    return new Response(
      JSON.stringify({ error: "Network error calling Google Apps Script", details: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let data: NotificationPayload;
  try {
    data = await req.json();
  } catch (_) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const {
    email,
    patient_name,
    new_status,
    appointment_id,
    preferred_date,
    preferred_time,
    doctor_name,
  } = data;

  if (!email || !new_status) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: email and new_status" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Only send emails for confirmed and rejected status changes
  const allowed = ["confirmed", "rejected"];
  if (!allowed.includes(new_status)) {
    return new Response(
      JSON.stringify({ message: "No email notification configured for status: " + new_status }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return await sendEmailViaGoogleAppsScript({
    email,
    patient_name,
    new_status,
    appointment_id,
    preferred_date,
    preferred_time,
    doctor_name,
  });
});
