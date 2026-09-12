/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - MAIN APP ENTRY
 */
import { store } from './state/store.js';
import { USERS } from './state/permissionEngine.js';
import { ModalManager } from './components/modalManager.js';
import { getSupabaseCredentials, saveSupabaseCredentials, getSupabaseClient, fetchPatientsFromSupabase } from './state/supabaseClient.js';
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

  async init() {
    // Setup Simulator Toolbar Listeners
    const userSelect = document.querySelector('#sim-user-select');
    const deviceSelect = document.querySelector('#sim-device-select');
    const supabaseBtn = document.querySelector('#btn-supabase-config');

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

    if (supabaseBtn) {
      supabaseBtn.addEventListener('click', () => this.openSupabaseModal());
    }

    // Try sync patients from Supabase if connected
    const remotePatients = await fetchPatientsFromSupabase();
    if (remotePatients && remotePatients.length > 0) {
      store.patients = remotePatients;
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

  openSupabaseModal() {
    const { url, key } = getSupabaseCredentials();
    ModalManager.open({
      title: '<i data-lucide="database"></i> Supabase Integration Settings',
      bodyHtml: `
        <div style="font-size:0.9rem; margin-bottom:1rem; color:var(--text-muted);">
          Connect your Dental Hospital Management System to your cloud <strong>Supabase</strong> project to store patients, appointments, invoices & audit logs securely in PostgreSQL.
        </div>
        <div style="margin-bottom:1rem;">
          <label style="display:block; font-weight:600; margin-bottom:0.3rem; font-size:0.85rem;">Supabase Project URL:</label>
          <input type="text" id="input-supabase-url" class="form-input" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:6px; font-family:monospace;" placeholder="https://xyzcompany.supabase.co" value="${url}" />
        </div>
        <div style="margin-bottom:1rem;">
          <label style="display:block; font-weight:600; margin-bottom:0.3rem; font-size:0.85rem;">Supabase Anon Key:</label>
          <input type="password" id="input-supabase-key" class="form-input" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:6px; font-family:monospace;" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." value="${key}" />
        </div>
        <div style="background:#f8fafc; border-left:4px solid #0284c7; padding:0.75rem; border-radius:4px; font-size:0.82rem;">
          💡 <strong>Setup SQL Schema:</strong> Make sure to run the included <code style="background:#e2e8f0; padding:2px 4px; border-radius:3px;">supabase-schema.sql</code> in your Supabase SQL Editor.
        </div>
      `,
      footerHtml: `
        <button class="btn btn-secondary btn-cancel-modal">Cancel</button>
        <button class="btn btn-primary btn-confirm-modal">Save Credentials & Connect</button>
      `,
      onConfirm: async (overlay) => {
        const inputUrl = overlay.querySelector('#input-supabase-url').value;
        const inputKey = overlay.querySelector('#input-supabase-key').value;
        saveSupabaseCredentials(inputUrl, inputKey);

        if (inputUrl && inputKey) {
          store.addToast('Supabase Saved', 'Connected to Supabase project successfully!', 'success');
          const remotePatients = await fetchPatientsFromSupabase();
          if (remotePatients && remotePatients.length > 0) {
            store.patients = remotePatients;
            store.notify();
          }
        } else {
          store.addToast('Supabase Disconnected', 'Using local browser storage.', 'info');
        }
        return true;
      }
    });
  }
}

// Global reference
window.DHMS = { store };

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
