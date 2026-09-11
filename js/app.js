/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - MAIN APP ENTRY
 */
import { store } from './state/store.js';
import { USERS } from './state/permissionEngine.js';
import { renderTopBar } from './components/topbar.js';
import { renderSidebar } from './components/sidebar.js';
import { renderToasts } from './components/toastManager.js';

import { renderDashboardView } from './views/dashboardView.js';
import { renderPatientsView } from './views/patientsView.js';
import { renderOdontogramChart } from './components/odontogramChart.js';
import { renderAppointmentsView } from './views/appointmentsView.js';
import { renderConsultationView } from './views/consultationView.js';
import { renderLaboratoryView } from './views/laboratoryView.js';
import { renderDocumentsView } from './views/documentsView.js';
import { renderBillingView } from './views/billingView.js';
import { renderAccessControlView } from './views/accessControlView.js';

class App {
  constructor() {
    this.sidebarContainer = document.querySelector('#sidebar-container');
    this.topbarContainer = document.querySelector('#topbar-container');
    this.viewContainer = document.querySelector('#view-container');
  }

  init() {
    // Setup Simulator Toolbar Listeners
    const userSelect = document.querySelector('#sim-user-select');
    const deviceSelect = document.querySelector('#sim-device-select');

    if (userSelect) {
      userSelect.value = store.currentUser.id;
      userSelect.addEventListener('change', (e) => {
        const u = USERS.find(x => x.id === e.target.value);
        if (u) store.setCurrentUser(u);
      });
    }

    if (deviceSelect) {
      deviceSelect.value = store.currentDevice;
      deviceSelect.addEventListener('change', (e) => {
        store.setCurrentDevice(e.target.value);
      });
    }

    // Subscribe store changes to UI re-rendering
    store.subscribe(() => this.render());

    // Initial Render
    this.render();
  }

  render() {
    // Render Layout shell
    renderTopBar(this.topbarContainer);
    renderSidebar(this.sidebarContainer);
    renderToasts();

    // Route view rendering
    const viewId = store.currentView;

    switch (viewId) {
      case 'dashboard':
        renderDashboardView(this.viewContainer);
        break;

      case 'patients':
        renderPatientsView(this.viewContainer);
        break;

      case 'odontogram':
        this.viewContainer.innerHTML = '<div class="view-container"><div id="main-odontogram-holder"></div></div>';
        renderOdontogramChart(this.viewContainer.querySelector('#main-odontogram-holder'));
        break;

      case 'appointments':
        renderAppointmentsView(this.viewContainer);
        break;

      case 'consultations':
        renderConsultationView(this.viewContainer);
        break;

      case 'laboratory':
        renderLaboratoryView(this.viewContainer);
        break;

      case 'xrays':
        renderDocumentsView(this.viewContainer);
        break;

      case 'billing':
        renderBillingView(this.viewContainer);
        break;

      case 'access_control':
        renderAccessControlView(this.viewContainer);
        break;

      default:
        this.renderGenericView(viewId);
        break;
    }

    // Refresh Lucide Icons globally
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderGenericView(viewId) {
    const title = viewId.replace('_', ' ').toUpperCase();
    this.viewContainer.innerHTML = `
      <div class="view-container">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i data-lucide="layers"></i> ${title} Module</h3>
              <p class="card-subtitle">Active User: <strong>${store.currentUser.name}</strong> | Device: <strong>${store.currentDevice.toUpperCase()}</strong></p>
            </div>
            <span class="badge badge-success">Active & Operational</span>
          </div>

          <div style="padding:2rem 1rem; text-align:center;">
            <div style="width:64px; height:64px; border-radius:50%; background:var(--primary-50); color:var(--primary-600); display:inline-flex; align-items:center; justify-content:center; margin-bottom:1rem;">
              <i data-lucide="check-circle-2" style="width:36px; height:36px;"></i>
            </div>
            <h4>${title} Workflow Active</h4>
            <p style="color:var(--text-muted); font-size:0.9rem; max-width:500px; margin:0.5rem auto 1.5rem auto;">
              All records for ${title} are synchronized with the central database and permission rules.
            </p>
            <button class="btn btn-primary" onclick="window.DHMS.store.setCurrentView('dashboard')">
              Back to Main Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Global reference
window.DHMS = { store };

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
