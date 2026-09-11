/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - X-RAY & DOCUMENTS VIEW
 */
import { store } from '../state/store.js';
import { ModalManager } from '../components/modalManager.js';

export function renderDocumentsView(container) {
  const patient = store.patients.find(p => p.id === store.selectedPatientId) || store.patients[0];
  const canUpload = store.hasActionPermission('xrays', 'create');

  const documents = [
    { id: 'DOC-101', name: 'Intraoral X-Ray Tooth #46 (IOPA)', category: 'Dental X-Ray', date: '2026-09-11', type: 'iopa', size: '2.4 MB', author: 'Dr. Rahul Sharma' },
    { id: 'DOC-102', name: 'Orthopantomogram Full Arch (OPG)', category: 'Panoramic X-Ray', date: '2026-08-28', type: 'opg', size: '8.1 MB', author: 'Dr. Priya Patel' },
    { id: 'DOC-103', name: 'Root Canal Consent Form Signed', category: 'Consent Document', date: '2026-09-02', type: 'pdf', size: '512 KB', author: 'Sarah Jenkins' },
    { id: 'DOC-104', name: 'Pre-Operative Clinical Photograph', category: 'Photograph', date: '2026-09-02', type: 'photo', size: '3.8 MB', author: 'Dr. Rahul Sharma' }
  ];

  container.innerHTML = `
    <div class="view-container">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i data-lucide="image"></i> Digital Radiography & Document Vault</h3>
            <p class="card-subtitle">Patient: <strong>${patient.name} (${patient.id})</strong> - Dental X-Rays, CBCT scans & consents</p>
          </div>
          <button class="btn btn-primary" id="btn-upload-doc" ${!canUpload ? 'disabled' : ''}>
            <i data-lucide="upload"></i> Upload X-Ray / File
          </button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:1.25rem;">
          ${documents.map(doc => `
            <div class="card" style="margin-bottom:0; cursor:pointer;" class="doc-card-item" data-id="${doc.id}">
              <div style="height:140px; background:#0f172a; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:#38bdf8; margin-bottom:0.75rem; position:relative; overflow:hidden;">
                ${doc.type === 'iopa' || doc.type === 'opg' ? `
                  <!-- Simulated High-Res Dental Radiography Graphic -->
                  <svg viewBox="0 0 200 120" style="width:90%; height:90%;">
                    <rect width="200" height="120" fill="#050811"/>
                    <!-- Jawbone shadow -->
                    <path d="M 10,90 Q 100,120 190,90 L 190,110 L 10,110 Z" fill="#334155" opacity="0.6"/>
                    <!-- Teeth radiopaque shapes -->
                    <rect x="30" y="40" width="22" height="40" fill="#e2e8f0" rx="4"/>
                    <rect x="60" y="35" width="25" height="45" fill="#e2e8f0" rx="4"/>
                    <rect x="92" y="30" width="28" height="50" fill="#ffffff" rx="4"/> <!-- RCT tooth radiopaque fill -->
                    <line x1="106" y1="30" x2="106" y2="78" stroke="#0ea5e9" stroke-width="4"/> <!-- Gutta percha RCT filling line -->
                    <rect x="128" y="35" width="24" height="45" fill="#e2e8f0" rx="4"/>
                    <rect x="158" y="40" width="20" height="40" fill="#cbd5e1" rx="4"/>
                  </svg>
                ` : `
                  <i data-lucide="${doc.type === 'pdf' ? 'file-text' : 'camera'}" style="width:48px; height:48px; color:var(--primary-400);"></i>
                `}
                <span class="badge badge-primary" style="position:absolute; top:8px; right:8px;">${doc.category}</span>
              </div>
              <h4 style="font-size:0.9rem; font-weight:700; color:var(--text-main); line-height:1.3;">${doc.name}</h4>
              <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.4rem; display:flex; justify-content:space-between;">
                <span>Uploaded: ${doc.date}</span>
                <span>${doc.size}</span>
              </div>
              <button class="btn btn-sm btn-secondary open-xray-modal" data-id="${doc.id}" style="width:100%; margin-top:0.75rem;">
                <i data-lucide="eye"></i> Launch Radiography Visualizer
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind Radiography Visualizer Modal
  container.querySelectorAll('.open-xray-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const doc = documents.find(d => d.id === id);
      if (doc) openXRayVisualizerModal(doc);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function openXRayVisualizerModal(doc) {
  const bodyHtml = `
    <div style="font-family:var(--font-body);">
      <div class="xray-viewer-canvas" id="xray-canvas-box">
        <svg viewBox="0 0 400 240" style="width:90%; height:90%; filter: contrast(100%) brightness(100%); transition:all 0.2s ease;" id="xray-svg-element">
          <rect width="400" height="240" fill="#020617"/>
          <!-- Jawbone & alveolar crest -->
          <path d="M 20,180 Q 200,230 380,180 L 380,235 L 20,235 Z" fill="#1e293b"/>
          <!-- Tooth #46 Radiograph Detail -->
          <g transform="translate(140, 40)">
            <!-- Crown -->
            <path d="M 10,30 C 10,5 110,5 110,30 L 105,100 C 100,140 85,150 60,150 C 35,150 20,140 15,100 Z" fill="#f8fafc" stroke="#475569" stroke-width="3"/>
            <!-- Pulp Chamber -->
            <path d="M 40,40 C 40,30 80,30 80,40 L 75,90 C 70,120 60,120 60,120 C 60,120 50,120 45,90 Z" fill="#090d16"/>
            <!-- Gutta Percha Obturation lines -->
            <line x1="53" y1="45" x2="53" y2="115" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
            <line x1="67" y1="45" x2="67" y2="115" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
            <!-- Caries lesion radiolucency -->
            <circle cx="28" cy="35" r="12" fill="#0f172a" opacity="0.8"/>
          </g>
        </svg>
      </div>

      <div class="xray-toolbar">
        <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
          <label>Contrast:</label>
          <input type="range" id="xray-contrast" min="50" max="200" value="100" />
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
          <label>Brightness:</label>
          <input type="range" id="xray-brightness" min="50" max="200" value="100" />
        </div>
        <button class="btn btn-sm btn-secondary" id="btn-reset-xray">Reset Filter</button>
      </div>
    </div>
  `;

  ModalManager.open({
    title: `Radiography Visualizer: ${doc.name}`,
    bodyHtml,
    footerHtml: `<button class="btn btn-secondary btn-cancel-modal">Close Visualizer</button>`
  });

  setTimeout(() => {
    const svgEl = document.querySelector('#xray-svg-element');
    const contrastInput = document.querySelector('#xray-contrast');
    const brightnessInput = document.querySelector('#xray-brightness');
    const resetBtn = document.querySelector('#btn-reset-xray');

    const updateFilter = () => {
      if (svgEl) {
        svgEl.style.filter = `contrast(${contrastInput.value}%) brightness(${brightnessInput.value}%)`;
      }
    };

    if (contrastInput) contrastInput.addEventListener('input', updateFilter);
    if (brightnessInput) brightnessInput.addEventListener('input', updateFilter);
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        contrastInput.value = 100;
        brightnessInput.value = 100;
        updateFilter();
      });
    }
  }, 50);
}
