/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - APPOINTMENTS & CALENDAR VIEW
 */
import { store } from '../state/store.js';
import { ModalManager } from '../components/modalManager.js';

export function renderAppointmentsView(container) {
  const appointments = store.appointments;
  let activeTab = 'list';

  container.innerHTML = `
    <div class="view-container">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i data-lucide="calendar"></i> Appointment Scheduling & Waiting List</h3>
            <p class="card-subtitle">Manage doctor schedules, walk-ins, and patient waiting room</p>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-secondary" id="btn-walkin-register">
              <i data-lucide="user-check"></i> Register Walk-in
            </button>
            <button class="btn btn-primary" id="btn-book-new-apt">
              <i data-lucide="plus"></i> Book Appointment
            </button>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
          <div class="tabs-header" style="margin-bottom:0; border-bottom:none;">
            <button class="tab-btn active" id="apt-tab-list">List View</button>
            <button class="tab-btn" id="apt-tab-calendar">Calendar Grid</button>
            <button class="tab-btn" id="apt-tab-waiting">Waiting Room (2)</button>
          </div>

          <div style="display:flex; gap:0.5rem;">
            <span class="badge badge-info">Today: 11-Sep-2026</span>
          </div>
        </div>

        <div id="apt-display-area"></div>
      </div>
    </div>
  `;

  function renderListView() {
    const displayEl = container.querySelector('#apt-display-area');
    if (!displayEl) return;

    displayEl.innerHTML = `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Apt ID</th>
              <th>Date & Time</th>
              <th>Patient Name</th>
              <th>Assigned Dentist</th>
              <th>Procedure</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(apt => `
              <tr>
                <td><strong>${apt.id}</strong></td>
                <td><strong>${apt.date}</strong> at ${apt.time}</td>
                <td><a href="#" class="patient-link" data-id="${apt.patientId}">${apt.patientName}</a></td>
                <td>${apt.dentistName}</td>
                <td>${apt.type}</td>
                <td>${apt.duration}</td>
                <td><span class="badge badge-${getAptStatusClass(apt.status)}">${apt.status}</span></td>
                <td>
                  <div style="display:flex; gap:0.35rem;">
                    ${apt.status !== 'Completed' ? `
                      <button class="btn btn-sm btn-primary btn-complete-apt" data-id="${apt.id}">Complete</button>
                      <button class="btn btn-sm btn-secondary btn-cancel-apt" data-id="${apt.id}">Cancel</button>
                    ` : '<span style="color:var(--text-muted); font-size:0.8rem;">Done</span>'}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Complete / Cancel bindings
    displayEl.querySelectorAll('.btn-complete-apt').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const apt = store.appointments.find(a => a.id === id);
        if (apt) {
          apt.status = 'Completed';
          store.logAudit('Complete Appointment', `Marked appointment ${id} completed for ${apt.patientName}`, 'appointments');
          store.addToast('Appointment Completed', `Appointment ${id} completed.`, 'success');
          renderListView();
        }
      });
    });

    displayEl.querySelectorAll('.btn-cancel-apt').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const apt = store.appointments.find(a => a.id === id);
        if (apt) {
          apt.status = 'Cancelled';
          store.logAudit('Cancel Appointment', `Cancelled appointment ${id} for ${apt.patientName}`, 'appointments');
          store.addToast('Appointment Cancelled', `Appointment ${id} cancelled.`, 'warning');
          renderListView();
        }
      });
    });
  }

  function getAptStatusClass(status) {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress') return 'primary';
    if (status === 'Waiting') return 'warning';
    if (status === 'Cancelled') return 'danger';
    return 'info';
  }

  // Bind top buttons
  const bookBtn = container.querySelector('#btn-book-new-apt');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => openBookAptModal());
  }

  renderListView();
  if (window.lucide) window.lucide.createIcons();
}

function openBookAptModal() {
  const bodyHtml = `
    <div class="form-group">
      <label class="form-label">Select Patient *</label>
      <select class="form-control" id="apt-patient-id">
        ${store.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
      </select>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Assigned Dentist</label>
        <select class="form-control" id="apt-dentist-name">
          <option>Dr. Rahul Sharma</option>
          <option>Dr. Priya Patel</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Procedure / Reason</label>
        <input type="text" class="form-control" id="apt-type-input" value="Dental Consultation & Checkup" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-control" id="apt-date-input" value="2026-09-12" />
      </div>
      <div class="form-group">
        <label class="form-label">Time</label>
        <input type="text" class="form-control" id="apt-time-input" value="11:30 AM" />
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-cancel-modal">Cancel</button>
    <button class="btn btn-primary btn-confirm-modal">Confirm Appointment</button>
  `;

  ModalManager.open({
    title: 'Schedule New Appointment',
    bodyHtml,
    footerHtml,
    onConfirm: (modalEl) => {
      const pId = modalEl.querySelector('#apt-patient-id').value;
      const patient = store.patients.find(p => p.id === pId);
      const dentist = modalEl.querySelector('#apt-dentist-name').value;
      const type = modalEl.querySelector('#apt-type-input').value;
      const date = modalEl.querySelector('#apt-date-input').value;
      const time = modalEl.querySelector('#apt-time-input').value;

      const newApt = {
        id: `APT-${800 + store.appointments.length + 1}`,
        patientId: pId,
        patientName: patient?.name || 'Walk-in Patient',
        dentistId: 'usr_101',
        dentistName: dentist,
        date,
        time,
        duration: '30 mins',
        type,
        status: 'Scheduled',
        notes: 'Booked via front desk portal.'
      };

      store.appointments.unshift(newApt);
      store.saveToStorage('dhms_appointments', store.appointments);
      store.logAudit('Book Appointment', `Scheduled appointment ${newApt.id} for ${newApt.patientName}`, 'appointments');
      store.addToast('Appointment Booked', `Appointment ${newApt.id} scheduled for ${date}`, 'success');
      store.notify();
      return true;
    }
  });
}
