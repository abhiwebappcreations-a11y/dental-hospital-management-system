/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - CLINICAL CONSULTATION VIEW
 */
import { store } from '../state/store.js';

export function renderConsultationView(container) {
  const patient = store.patients.find(p => p.id === store.selectedPatientId) || store.patients[0];
  const isPermitted = store.hasActionPermission('consultations', 'create');

  container.innerHTML = `
    <div class="view-container">
      ${!isPermitted ? `
        <div class="permission-denied-banner">
          <i data-lucide="shield-alert" class="icon"></i>
          <div class="text">
            <strong>Action Restricted by Device/User Policy</strong><br/>
            User <em>${store.currentUser.name} (${store.currentUser.role})</em> on <em>${store.currentDevice.toUpperCase()}</em> is not permitted to create or modify clinical consultation records.
          </div>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i data-lucide="stethoscope"></i> Clinical Consultation & Operative Notes</h3>
            <p class="card-subtitle">Record clinical examination findings, diagnosis, treatment plan & prescriptions</p>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <select class="form-control" id="select-consult-patient" style="width:240px;">
              ${store.patients.map(p => `<option value="${p.id}" ${p.id === patient.id ? 'selected' : ''}>${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- PATIENT SUMMARY HEADER BAR -->
        <div style="background:var(--primary-50); border:1px solid var(--primary-200); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-weight:700; font-size:1.05rem; color:var(--primary-900);">${patient.name} (${patient.gender}, ${patient.age} yrs)</div>
            <div style="font-size:0.82rem; color:var(--primary-800); margin-top:0.2rem;">Phone: ${patient.phone} | Last Visit: ${patient.lastVisit}</div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <span class="badge badge-danger">Allergies: ${patient.allergies.join(', ') || 'None'}</span>
            <span class="badge badge-warning">Medical: ${patient.medicalHistory.join(', ') || 'None'}</span>
          </div>
        </div>

        <!-- CONSULTATION FORM -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">
          <div>
            <div class="form-group">
              <label class="form-label">Chief Complaint *</label>
              <textarea class="form-control" id="consult-chief-complaint" rows="3" ${!isPermitted ? 'disabled' : ''} placeholder="e.g. Severe throbbing pain in lower right back tooth (tooth #46) for 3 days, aggravated by cold fluids."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Clinical Examination Notes</label>
              <textarea class="form-control" id="consult-exam-notes" rows="4" ${!isPermitted ? 'disabled' : ''} placeholder="e.g. Deep carious lesion on occlusal surface of #46. Tenderness on vertical percussion. No swelling or sinus tract."></textarea>
            </div>
          </div>

          <div>
            <div class="form-group">
              <label class="form-label">Provisional / Final Diagnosis *</label>
              <input type="text" class="form-control" id="consult-diagnosis" ${!isPermitted ? 'disabled' : ''} value="Symptomatic Irreversible Pulpitis - Tooth #46" />
            </div>

            <div class="form-group">
              <label class="form-label">Recommended Dental Procedures</label>
              <textarea class="form-control" id="consult-procedures" rows="4" ${!isPermitted ? 'disabled' : ''} placeholder="1. Root Canal Treatment (RCT) Tooth #46&#10;2. Post & Core Build-up&#10;3. Zirconia Crown Placement"></textarea>
            </div>
          </div>
        </div>

        <!-- PRESCRIPTION GENERATOR SUB-SECTION -->
        <div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--border-light);">
          <h4 class="card-title" style="font-size:1rem; margin-bottom:1rem;">
            <i data-lucide="pill"></i> Rx Prescription Builder
          </h4>
          <div style="display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr; gap:0.5rem; margin-bottom:0.75rem;">
            <input type="text" class="form-control" id="rx-med-name" placeholder="Medicine (e.g. Amoxicillin 500mg)" ${!isPermitted ? 'disabled' : ''} />
            <input type="text" class="form-control" id="rx-dosage" placeholder="Dosage (1 tab)" ${!isPermitted ? 'disabled' : ''} />
            <input type="text" class="form-control" id="rx-freq" placeholder="Freq (TID / 8h)" ${!isPermitted ? 'disabled' : ''} />
            <input type="text" class="form-control" id="rx-dur" placeholder="Duration (5 days)" ${!isPermitted ? 'disabled' : ''} />
            <button class="btn btn-secondary" id="btn-add-rx-item" ${!isPermitted ? 'disabled' : ''}><i data-lucide="plus"></i> Add Rx Line</button>
          </div>

          <div id="rx-items-list" style="display:flex; flex-direction:column; gap:0.4rem;">
            <div style="padding:0.6rem 0.8rem; background:#f8fafc; border-radius:var(--radius-sm); border:1px solid var(--border-light); display:flex; justify-content:space-between; font-size:0.85rem;">
              <span><strong>Amoxicillin 500mg</strong> - 1 tab (TID / Every 8 hrs) for 5 days</span>
              <span style="color:var(--text-muted);">Take after food</span>
            </div>
            <div style="padding:0.6rem 0.8rem; background:#f8fafc; border-radius:var(--radius-sm); border:1px solid var(--border-light); display:flex; justify-content:space-between; font-size:0.85rem;">
              <span><strong>Ketorolac DT 10mg</strong> - 1 tab (BD / As needed for pain) for 3 days</span>
              <span style="color:var(--text-muted);">Dissolve in water</span>
            </div>
          </div>
        </div>

        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.75rem;">
          <button class="btn btn-secondary" id="btn-save-consult-draft" ${!isPermitted ? 'disabled' : ''}>Save Draft</button>
          <button class="btn btn-primary" id="btn-finalize-consult" ${!isPermitted ? 'disabled' : ''}>
            <i data-lucide="check-circle-2"></i> Finalize Consultation & Treatment Plan
          </button>
        </div>
      </div>
    </div>
  `;

  const patientSelect = container.querySelector('#select-consult-patient');
  if (patientSelect) {
    patientSelect.addEventListener('change', (e) => {
      store.selectedPatientId = e.target.value;
      renderConsultationView(container);
    });
  }

  const finalizeBtn = container.querySelector('#btn-finalize-consult');
  if (finalizeBtn && isPermitted) {
    finalizeBtn.addEventListener('click', () => {
      const diag = container.querySelector('#consult-diagnosis').value;
      store.logAudit('Finalize Consultation', `Consultation recorded for ${patient.name} (${diag})`, 'consultations');
      store.addToast('Consultation Saved', `Consultation & Rx saved for ${patient.name}`, 'success');
      store.setCurrentView('treatment_plans');
    });
  }

  if (window.lucide) window.lucide.createIcons();
}
