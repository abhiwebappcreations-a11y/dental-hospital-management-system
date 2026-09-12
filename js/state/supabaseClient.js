/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - SUPABASE CONNECTOR
 * Dynamically handles database persistence via Supabase when configured,
 * with fallback to LocalStorage.
 */

// Retrieve credentials from localStorage or fallback
export function getSupabaseCredentials() {
  const url = localStorage.getItem('dhms_supabase_url') || '';
  const key = localStorage.getItem('dhms_supabase_key') || '';
  return { url, key };
}

export function saveSupabaseCredentials(url, key) {
  localStorage.setItem('dhms_supabase_url', url.trim());
  localStorage.setItem('dhms_supabase_key', key.trim());
}

let supabaseInstance = null;

export function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (window.supabase && window.supabase.createClient) {
    if (!supabaseInstance) {
      supabaseInstance = window.supabase.createClient(url, key);
    }
    return supabaseInstance;
  }
  return null;
}

// ----------------------------------------------------
// DATABASE SYNC API METHODS
// ----------------------------------------------------

export async function fetchPatientsFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('patients').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetchPatients error:', error);
      return null;
    }
    return data.map(p => ({
      id: p.id,
      name: p.name,
      age: p.age,
      dob: p.dob,
      gender: p.gender,
      phone: p.phone,
      email: p.email,
      address: p.address,
      lastVisit: p.last_visit,
      nextAppointment: p.next_appointment,
      treatmentStatus: p.treatment_status,
      outstandingBalance: Number(p.outstanding_balance || 0),
      medicalHistory: p.medical_history || [],
      allergies: p.allergies || [],
      currentMedications: p.current_medications || [],
      dentalHistory: p.dental_history || ''
    }));
  } catch (e) {
    console.error('Supabase fetch error:', e);
    return null;
  }
}

export async function syncPatientToSupabase(patient) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('patients').upsert({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      dob: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      last_visit: patient.lastVisit,
      next_appointment: patient.nextAppointment,
      treatment_status: patient.treatmentStatus,
      outstanding_balance: patient.outstandingBalance,
      medical_history: patient.medicalHistory,
      allergies: patient.allergies,
      current_medications: patient.currentMedications,
      dental_history: patient.dentalHistory
    });
  } catch (e) {
    console.error('Supabase syncPatient error:', e);
  }
}

export async function deletePatientFromSupabase(patientId) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('patients').delete().eq('id', patientId);
  } catch (e) {
    console.error('Supabase deletePatient error:', e);
  }
}

export async function syncAuditLogToSupabase(logEntry) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('audit_logs').insert({
      id: logEntry.id,
      timestamp: new Date().toISOString(),
      user_id: logEntry.userId,
      user_name: logEntry.userName,
      device: logEntry.device,
      module: logEntry.module,
      action: logEntry.action,
      details: logEntry.details
    });
  } catch (e) {
    console.error('Supabase syncAuditLog error:', e);
  }
}
