/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - DASHBOARD VIEW
 */
import { store } from '../state/store.js';

export function renderDashboardView(container) {
  const user = store.currentUser;
  const device = store.currentDevice;

  const totalPatients = store.patients.length;
  const todayAppointments = store.appointments.filter(a => a.date === '2026-09-11');
  const labCasesInProd = store.labCases.filter(c => c.status === 'IN PRODUCTION' || c.status === 'SENT').length;
  const lowStockCount = store.inventory.filter(i => i.status === 'LOW' || i.status === 'CRITICAL').length;

  const canViewBilling = store.hasActionPermission('billing', 'view');
  const totalRevenueToday = canViewBilling ? '₹ 18,450' : '🔒 Protected';
  const pendingPaymentsTotal = canViewBilling ? '₹ 16,250' : '🔒 Protected';

  container.innerHTML = `
    <div class="view-container">
      <!-- WELCOME HERO BANNER -->
      <div class="card" style="background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%); color: #ffffff; padding: 2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 style="font-size:1.6rem; color:#ffffff; margin-bottom:0.3rem;">Welcome back, ${user.name}!</h2>
            <p style="opacity:0.9; font-size:0.95rem;">You are currently logged in on <strong style="text-decoration:underline;">${device.toUpperCase()}</strong> as <strong>${user.role}</strong>.</p>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-secondary" id="dash-btn-new-patient" style="background:#ffffff; color:#0284c7; border:none;">
              <i data-lucide="user-plus"></i> New Patient
            </button>
            <button class="btn btn-primary" id="dash-btn-book-apt" style="background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.4);">
              <i data-lucide="calendar"></i> Book Appointment
            </button>
          </div>
        </div>
      </div>

      <!-- METRICS GRID -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        <div class="card" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="card-subtitle">Today's Appointments</span>
              <h3 style="font-size:1.8rem; margin-top:0.2rem; font-family:var(--font-heading);">${todayAppointments.length}</h3>
            </div>
            <div style="width:42px; height:42px; border-radius:10px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center;">
              <i data-lucide="calendar"></i>
            </div>
          </div>
          <div style="margin-top:0.8rem; font-size:0.8rem; color:#15803d; font-weight:600;">
            <i data-lucide="clock" style="width:14px; height:14px; vertical-align:middle;"></i> 2 Patients currently waiting
          </div>
        </div>

        <div class="card" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="card-subtitle">Total Registered Patients</span>
              <h3 style="font-size:1.8rem; margin-top:0.2rem; font-family:var(--font-heading);">${totalPatients}</h3>
            </div>
            <div style="width:42px; height:42px; border-radius:10px; background:#ccfbf1; color:#0d9488; display:flex; align-items:center; justify-content:center;">
              <i data-lucide="users"></i>
            </div>
          </div>
          <div style="margin-top:0.8rem; font-size:0.8rem; color:var(--text-muted);">
            +4 new registrations this week
          </div>
        </div>

        <div class="card" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="card-subtitle">Today's Revenue</span>
              <h3 style="font-size:1.8rem; margin-top:0.2rem; font-family:var(--font-heading);">${totalRevenueToday}</h3>
            </div>
            <div style="width:42px; height:42px; border-radius:10px; background:#fef08a; color:#b45309; display:flex; align-items:center; justify-content:center;">
              <i data-lucide="dollar-sign"></i>
            </div>
          </div>
          <div style="margin-top:0.8rem; font-size:0.8rem; color:var(--text-muted);">
            Pending Collections: <strong>${pendingPaymentsTotal}</strong>
          </div>
        </div>

        <div class="card" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="card-subtitle">Lab Cases In-Flight</span>
              <h3 style="font-size:1.8rem; margin-top:0.2rem; font-family:var(--font-heading);">${labCasesInProd}</h3>
            </div>
            <div style="width:42px; height:42px; border-radius:10px; background:#f3e8ff; color:#7e22ce; display:flex; align-items:center; justify-content:center;">
              <i data-lucide="flask-conical"></i>
            </div>
          </div>
          <div style="margin-top:0.8rem; font-size:0.8rem; color:var(--text-muted);">
            Inventory Alerts: <span class="badge badge-danger">${lowStockCount} Items Low</span>
          </div>
        </div>
      </div>

      <!-- MAIN DASHBOARD CONTENT GRID -->
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:1.5rem; align-items:start;">
        <!-- LEFT: APPOINTMENTS & REVENUE ANALYTICS -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title"><i data-lucide="trending-up"></i> Patient & Appointment Activity Trends</h3>
                <p class="card-subtitle">Weekly patient visits across doctors</p>
              </div>
              <span class="badge badge-primary">Current Week</span>
            </div>
            
            <!-- SVG Analytics Bar Chart -->
            <div style="width:100%; height:220px; position:relative; padding-top:1rem;">
              <svg viewBox="0 0 500 180" style="width:100%; height:100%;">
                <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" stroke-width="2"/>
                <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>
                <line x1="40" y1="40" x2="480" y2="40" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>
                
                <!-- Bars Mon-Sat -->
                <!-- Mon -->
                <rect x="70" y="60" width="30" height="80" rx="4" fill="#0ea5e9"/>
                <text x="85" y="160" text-anchor="middle" font-size="12" fill="#64748b">Mon</text>
                <!-- Tue -->
                <rect x="140" y="45" width="30" height="95" rx="4" fill="#0ea5e9"/>
                <text x="155" y="160" text-anchor="middle" font-size="12" fill="#64748b">Tue</text>
                <!-- Wed -->
                <rect x="210" y="70" width="30" height="70" rx="4" fill="#0ea5e9"/>
                <text x="225" y="160" text-anchor="middle" font-size="12" fill="#64748b">Wed</text>
                <!-- Thu -->
                <rect x="280" y="30" width="30" height="110" rx="4" fill="#14b8a6"/>
                <text x="295" y="160" text-anchor="middle" font-size="12" fill="#64748b">Thu</text>
                <!-- Fri (Today) -->
                <rect x="350" y="50" width="30" height="90" rx="4" fill="#0284c7"/>
                <text x="365" y="160" text-anchor="middle" font-size="12" fill="#0284c7" font-weight="bold">Today</text>
                <!-- Sat -->
                <rect x="420" y="90" width="30" height="50" rx="4" fill="#0ea5e9"/>
                <text x="435" y="160" text-anchor="middle" font-size="12" fill="#64748b">Sat</text>
              </svg>
            </div>
          </div>

          <!-- TODAY'S SCHEDULE TABLE -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title"><i data-lucide="clock"></i> Today's Clinical Schedule</h3>
              <button class="btn btn-sm btn-secondary" id="dash-view-all-apts">View Full Calendar</button>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient Name</th>
                    <th>Assigned Doctor</th>
                    <th>Procedure Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${todayAppointments.map(apt => `
                    <tr>
                      <td><strong>${apt.time}</strong></td>
                      <td><a href="#" class="patient-link" data-id="${apt.patientId}">${apt.patientName}</a></td>
                      <td>${apt.dentistName}</td>
                      <td>${apt.type}</td>
                      <td><span class="badge badge-${getAptBadge(apt.status)}">${apt.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- RIGHT: AUDIT FEED & QUICK ACTIONS -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title" style="font-size:1rem;"><i data-lucide="activity"></i> Recent Activity Stream</h3>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.85rem; font-size:0.82rem;">
              ${store.auditLogs.slice(0, 5).map(log => `
                <div style="padding-bottom:0.6rem; border-bottom:1px solid var(--border-light);">
                  <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
                    <strong>${log.userName}</strong>
                    <span>${log.timestamp.split(' ')[1]}</span>
                  </div>
                  <div style="color:var(--text-main); margin-top:0.2rem;">${log.action}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card" style="background:var(--primary-50); border-color:var(--primary-200);">
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--primary-900); margin-bottom:0.5rem;">
              <i data-lucide="shield"></i> Active Permission Security
            </h4>
            <p style="font-size:0.8rem; color:var(--primary-800); line-height:1.4;">
              Logged as <strong>${user.name}</strong> on <strong>${device.toUpperCase()}</strong>.
              ${device === 'mobile' ? 'Mobile restricted features (e.g. Invoicing) are dynamically disabled.' : 'Full workstation capabilities enabled.'}
            </p>
            <button class="btn btn-sm btn-primary" id="dash-btn-access-matrix" style="margin-top:0.75rem;">
              Manage Access Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  function getAptBadge(status) {
    if (status === 'In Progress') return 'primary';
    if (status === 'Confirmed') return 'success';
    if (status === 'Waiting') return 'warning';
    return 'info';
  }

  // Bind buttons
  const newPatientBtn = container.querySelector('#dash-btn-new-patient');
  if (newPatientBtn) {
    newPatientBtn.addEventListener('click', () => store.setCurrentView('patients'));
  }

  const bookAptBtn = container.querySelector('#dash-btn-book-apt');
  if (bookAptBtn) {
    bookAptBtn.addEventListener('click', () => store.setCurrentView('appointments'));
  }

  const accessMatrixBtn = container.querySelector('#dash-btn-access-matrix');
  if (accessMatrixBtn) {
    accessMatrixBtn.addEventListener('click', () => store.setCurrentView('access_control'));
  }

  const viewAllApts = container.querySelector('#dash-view-all-apts');
  if (viewAllApts) {
    viewAllApts.addEventListener('click', () => store.setCurrentView('appointments'));
  }

  if (window.lucide) window.lucide.createIcons();
}
