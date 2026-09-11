/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - PATIENTS VIEW & 11-TAB PROFILE
 */
import { store } from '../state/store.js';
import { ModalManager } from '../components/modalManager.js';
import { renderOdontogramChart } from '../components/odontogramChart.js';

export function renderPatientsView(container) {
  const patients = store.patients;
  const searchQ = store.searchQuery.toLowerCase();

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQ) ||
    p.id.toLowerCase().includes(searchQ) ||
    p.phone.includes(searchQ) ||
    p.email.toLowerCase().includes(searchQ)
  );

  container.innerHTML = `
    <div class="view-container">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i data-lucide="users"></i> Patient Directory & Electronic Health Records</h3>
            <p class="card-subtitle">Manage dental hospital patient records and medical histories</p>
          </div>
          <button class="btn btn-primary" id="btn-add-patient-modal">
            <i data-lucide="user-plus"></i> Add New Patient
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Age / Gender</th>
                <th>Phone Number</th>
                <th>Last Visit</th>
                <th>Next Appointment</th>
                <th>Status</th>
                <th>Outstanding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPatients.map(p => `
                <tr>
                  <td><strong>${p.id}</strong></td>
                  <td>
                    <div style="font-weight:600; color:var(--primary-600); cursor:pointer;" class="open-patient-profile" data-id="${p.id}">
                      ${p.name}
                    </div>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${p.email}</span>
                  </td>
                  <td>${p.age} Yrs / ${p.gender}</td>
                  <td>${p.phone}</td>
                  <td>${p.lastVisit}</td>
                  <td>${p.nextAppointment}</td>
                  <td><span class="badge badge-${p.treatmentStatus === 'Completed' ? 'success' : 'primary'}">${p.treatmentStatus}</span></td>
                  <td><strong style="color:${p.outstandingBalance > 0 ? 'var(--danger-700)' : 'var(--success-700)'}">₹ ${p.outstandingBalance}</strong></td>
                  <td>
                    <div style="display:flex; gap:0.4rem;">
                      <button class="btn btn-sm btn-secondary open-patient-profile" data-id="${p.id}" title="View 11-Tab Profile">
                        <i data-lucide="eye"></i>
                      </button>
                      <button class="btn btn-sm btn-danger btn-delete-patient" data-id="${p.id}" title="Delete Patient">
                        <i data-lucide="trash-2"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- PATIENT PROFILE CONTAINER -->
      <div id="patient-profile-section" style="margin-top:1.5rem;"></div>
    </div>
  `;

  // Bind Add Patient
  const addBtn = container.querySelector('#btn-add-patient-modal');
  if (addBtn) {
    addBtn.addEventListener('click', () => openAddPatientModal());
  }

  // Bind Delete buttons
  const deleteBtns = container.querySelectorAll('.btn-delete-patient');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute('data-id');
      if (confirm(`Are you sure you want to delete patient ${pId}?`)) {
        store.deletePatient(pId);
      }
    });
  });

  // Bind Profile Viewers
  const profileLinks = container.querySelectorAll('.open-patient-profile');
  profileLinks.forEach(link => {
    link.addEventListener('click', () => {
      const pId = link.getAttribute('data-id');
      store.selectedPatientId = pId;
      renderPatientProfileTabs(container.querySelector('#patient-profile-section'), pId);
    });
  });

  // Default render profile for selected patient
  renderPatientProfileTabs(container.querySelector('#patient-profile-section'), store.selectedPatientId);

  if (window.lucide) window.lucide.createIcons();
}

export function renderPatientProfileTabs(container, patientId) {
  const patient = store.patients.find(p => p.id === patientId) || store.patients[0];
  if (!patient || !container) return;

  let activeTab = 'overview';

  function buildTabContent(tab) {
    activeTab = tab;
    const contentEl = container.querySelector('#tab-content-area');
    if (!contentEl) return;

    if (tab === 'overview') {
      contentEl.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">
          <div class="card" style="margin-bottom:0;">
            <h4 class="card-title" style="font-size:1rem;"><i data-lucide="user"></i> Basic Demographics</h4>
            <div style="margin-top:1rem; display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem;">
              <div><strong>Patient ID:</strong> ${patient.id}</div>
              <div><strong>Full Name:</strong> ${patient.name}</div>
              <div><strong>Date of Birth:</strong> ${patient.dob} (${patient.age} years)</div>
              <div><strong>Gender:</strong> ${patient.gender}</div>
              <div><strong>Phone:</strong> ${patient.phone}</div>
              <div><strong>Email:</strong> ${patient.email}</div>
              <div><strong>Address:</strong> ${patient.address}</div>
            </div>
          </div>

          <div class="card" style="margin-bottom:0;">
            <h4 class="card-title" style="font-size:1rem; color:var(--danger-700);"><i data-lucide="alert-triangle"></i> Medical Risk & Allergies</h4>
            <div style="margin-top:1rem; display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem;">
              <div><strong>Allergies:</strong> ${(patient.allergies || []).map(a => `<span class="badge badge-danger">${a}</span>`).join(' ')}</div>
              <div><strong>Medical Conditions:</strong> ${(patient.medicalHistory || []).map(m => `<span class="badge badge-warning">${m}</span>`).join(' ')}</div>
              <div><strong>Current Medications:</strong> ${(patient.currentMedications || []).join(', ')}</div>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'odontogram') {
      contentEl.innerHTML = '<div id="profile-odontogram-holder"></div>';
      renderOdontogramChart(contentEl.querySelector('#profile-odontogram-holder'), patient.id);
    } else if (tab === 'billing') {
      const pInvoices = store.invoices.filter(i => i.patientId === patient.id);
      contentEl.innerHTML = `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${pInvoices.map(inv => `
                <tr>
                  <td><strong>${inv.id}</strong></td>
                  <td>${inv.date}</td>
                  <td>₹ ${inv.subtotal}</td>
                  <td>₹ ${inv.discount}</td>
                  <td><strong>₹ ${inv.grandTotal}</strong></td>
                  <td>₹ ${inv.paidAmount}</td>
                  <td><strong style="color:${inv.balance > 0 ? 'var(--danger-700)' : 'var(--success-700)'}">₹ ${inv.balance}</strong></td>
                  <td><span class="badge badge-${inv.status === 'PAID' ? 'success' : 'warning'}">${inv.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      contentEl.innerHTML = `
        <div class="card" style="margin-bottom:0; text-align:center; padding:3rem 1rem;">
          <i data-lucide="folder-open" style="width:48px; height:48px; color:var(--text-light); margin-bottom:1rem;"></i>
          <h4>${tab.toUpperCase()} Module Records</h4>
          <p style="color:var(--text-muted); font-size:0.9rem;">Patient electronic records for ${tab} linked to ${patient.name}.</p>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title"><i data-lucide="file-text"></i> Patient Record File: ${patient.name}</h3>
          <p class="card-subtitle">Complete Clinical & Financial History</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-print-profile">
          <i data-lucide="printer"></i> Print Record
        </button>
      </div>

      <!-- 11 TABS HEADER -->
      <div class="tabs-header" id="profile-tabs-bar">
        <button class="tab-btn active" data-tab="overview">Overview</button>
        <button class="tab-btn" data-tab="dental_history">Dental History</button>
        <button class="tab-btn" data-tab="odontogram">Odontogram</button>
        <button class="tab-btn" data-tab="consultations">Consultations</button>
        <button class="tab-btn" data-tab="treatment_plans">Treatment Plans</button>
        <button class="tab-btn" data-tab="prescriptions">Prescriptions</button>
        <button class="tab-btn" data-tab="xrays">X-Rays & Docs</button>
        <button class="tab-btn" data-tab="billing">Billing & Invoices</button>
        <button class="tab-btn" data-tab="appointments">Appointments</button>
        <button class="tab-btn" data-tab="followups">Follow-ups</button>
        <button class="tab-btn" data-tab="notes">Notes & Logs</button>
      </div>

      <div id="tab-content-area"></div>
    </div>
  `;

  // Attach Tab switcher events
  const tabBtns = container.querySelectorAll('#profile-tabs-bar .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      buildTabContent(btn.getAttribute('data-tab'));
    });
  });

  buildTabContent('overview');
}

function openAddPatientModal() {
  const bodyHtml = `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Full Name *</label>
        <input type="text" class="form-control" id="new-patient-name" placeholder="e.g. Ramesh Kumar" required />
      </div>
      <div class="form-group">
        <label class="form-label">Date of Birth</label>
        <input type="date" class="form-control" id="new-patient-dob" value="1995-01-01" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Gender</label>
        <select class="form-control" id="new-patient-gender">
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Phone Number *</label>
        <input type="text" class="form-control" id="new-patient-phone" placeholder="+91 98765 00000" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Email Address</label>
      <input type="email" class="form-control" id="new-patient-email" placeholder="patient@example.com" />
    </div>

    <div class="form-group">
      <label class="form-label">Address</label>
      <input type="text" class="form-control" id="new-patient-address" placeholder="Street, City, Pin" />
    </div>

    <div class="form-group">
      <label class="form-label">Medical History / Risk Factors</label>
      <input type="text" class="form-control" id="new-patient-medhistory" placeholder="e.g. Diabetes, Hypertension" />
    </div>

    <div class="form-group">
      <label class="form-label">Known Allergies</label>
      <input type="text" class="form-control" id="new-patient-allergies" placeholder="e.g. Penicillin, Latex" />
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-cancel-modal">Cancel</button>
    <button class="btn btn-primary btn-confirm-modal" id="submit-add-patient">Register Patient</button>
  `;

  ModalManager.open({
    title: 'Register New Patient',
    bodyHtml,
    footerHtml,
    onConfirm: (modalEl) => {
      const name = modalEl.querySelector('#new-patient-name').value;
      const phone = modalEl.querySelector('#new-patient-phone').value;
      const dob = modalEl.querySelector('#new-patient-dob').value;
      const gender = modalEl.querySelector('#new-patient-gender').value;
      const email = modalEl.querySelector('#new-patient-email').value;
      const address = modalEl.querySelector('#new-patient-address').value;
      const medHistory = modalEl.querySelector('#new-patient-medhistory').value;
      const allergies = modalEl.querySelector('#new-patient-allergies').value;

      if (!name || !phone) {
        alert('Please provide patient name and phone number.');
        return false;
      }

      return store.addPatient({
        name,
        phone,
        dob,
        age: new Date().getFullYear() - new Date(dob).getFullYear(),
        gender,
        email,
        address,
        medicalHistory: medHistory ? [medHistory] : [],
        allergies: allergies ? [allergies] : []
      });
    }
  });
}
