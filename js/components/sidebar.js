/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - SIDEBAR COMPONENT
 */
import { store } from '../state/store.js';
import { MODULES } from '../state/permissionEngine.js';

export function renderSidebar(container) {
  const user = store.currentUser;
  const deviceId = store.currentDevice;

  // Group modules by section
  const sections = {};
  MODULES.forEach(mod => {
    const sec = mod.section || 'General';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(mod);
  });

  let navHtml = '';

  for (const [secTitle, mods] of Object.entries(sections)) {
    navHtml += `<div class="nav-section-title">${secTitle}</div>`;
    
    mods.forEach(mod => {
      const isPermitted = store.permissionEngine.hasPermission(user.id, deviceId, mod.id, 'view');
      const isActive = store.currentView === mod.id;

      const activeClass = isActive ? 'active' : '';
      const restrictedClass = !isPermitted ? 'restricted' : '';

      navHtml += `
        <a 
          class="nav-item ${activeClass} ${restrictedClass}" 
          data-module="${mod.id}"
          title="${mod.label} ${!isPermitted ? '(Restricted)' : ''}"
        >
          <span class="nav-item-icon"><i data-lucide="${mod.icon}"></i></span>
          <span class="nav-item-label">${mod.label}</span>
        </a>
      `;
    });
  }

  container.innerHTML = `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="brand-icon">
          <i data-lucide="cross"></i>
        </div>
        <div class="brand-title">
          DENT-CARE
          <span class="brand-subtitle">Dental Hospital SaaS</span>
        </div>
      </div>
      <div class="sidebar-nav">
        ${navHtml}
      </div>
    </div>
  `;

  // Bind Navigation Clicks
  const navLinks = container.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const moduleId = link.getAttribute('data-module');
      store.setCurrentView(moduleId);
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
