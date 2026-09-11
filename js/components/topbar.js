/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - TOPBAR COMPONENT
 */
import { store } from '../state/store.js';
import { USERS, DEVICE_TYPES } from '../state/permissionEngine.js';

export function renderTopBar(container) {
  const user = store.currentUser;
  const deviceId = store.currentDevice;
  const activeDeviceObj = DEVICE_TYPES.find(d => d.id === deviceId) || DEVICE_TYPES[0];

  container.innerHTML = `
    <div class="topbar">
      <div class="topbar-left">
        <button class="toggle-sidebar-btn" id="btn-toggle-sidebar" title="Toggle Navigation">
          <i data-lucide="menu"></i>
        </button>
        <div class="global-search-container">
          <i data-lucide="search" class="global-search-icon"></i>
          <input 
            type="text" 
            class="global-search-input" 
            placeholder="Search patients, phone, records, invoice #..." 
            value="${store.searchQuery}"
            id="global-search-input"
          />
        </div>
      </div>

      <div class="topbar-right">
        <!-- Device Indicator Badge -->
        <div class="device-badge">
          <i data-lucide="${activeDeviceObj.icon}"></i>
          <span>${activeDeviceObj.label} Mode</span>
        </div>

        <!-- Notification Bell -->
        <button class="topbar-action-icon" title="Notifications" id="btn-notifications">
          <i data-lucide="bell"></i>
          <span class="notification-badge"></span>
        </button>

        <!-- User Profile Dropdown Widget -->
        <div class="user-profile-widget">
          <div class="avatar-circle">${user.avatar}</div>
          <div class="user-info">
            <span class="user-name">${user.name}</span>
            <span class="user-role-tag">${user.role}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Events
  const searchInput = container.querySelector('#global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.searchQuery = e.target.value;
      if (store.currentView === 'patients') {
        store.notify();
      }
    });
  }

  const toggleBtn = container.querySelector('#btn-toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.toggle('collapsed');
      }
    });
  }

  // Refresh Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
