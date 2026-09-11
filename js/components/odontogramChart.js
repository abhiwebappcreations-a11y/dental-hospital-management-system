/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - INTERACTIVE ODONTOGRAM CHART
 */
import { store } from '../state/store.js';
import { ModalManager } from './modalManager.js';

export function renderOdontogramChart(container, patientId = store.selectedPatientId) {
  const patientTeeth = store.teethData[patientId] || {};
  const patient = store.patients.find(p => p.id === patientId) || store.patients[0];

  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  function renderSingleToothSvg(num, toothData) {
    const condition = toothData?.condition || 'healthy';
    
    // Five surfaces SVG (Center = Occlusal, Top = Buccal, Bottom = Lingual, Left = Mesial/Distal, Right = Distal/Mesial)
    return `
      <div class="tooth-item ${condition !== 'healthy' ? 'has-condition' : ''}" data-tooth="${num}" data-condition="${condition}">
        <span class="tooth-number">#${num}</span>
        <div class="tooth-svg-box">
          <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <!-- Crown / Root Outline -->
            <path d="M 20,40 C 20,10 80,10 80,40 L 75,90 C 70,115 60,115 50,115 C 40,115 30,115 25,90 Z" fill="#ffffff" stroke="#64748b" stroke-width="2"/>
            
            <!-- Surface Top (Buccal) -->
            <polygon points="25,25 75,25 65,40 35,40" class="tooth-surface surface-buccal" data-surface="buccal"/>
            <!-- Surface Bottom (Lingual) -->
            <polygon points="35,60 65,60 75,75 25,75" class="tooth-surface surface-lingual" data-surface="lingual"/>
            <!-- Surface Left (Mesial) -->
            <polygon points="25,25 35,40 35,60 25,75" class="tooth-surface surface-mesial" data-surface="mesial"/>
            <!-- Surface Right (Distal) -->
            <polygon points="75,25 65,40 65,60 75,75" class="tooth-surface surface-distal" data-surface="distal"/>
            <!-- Surface Center (Occlusal) -->
            <polygon points="35,40 65,40 65,60 35,60" class="tooth-surface surface-occlusal" data-surface="occlusal"/>

            ${condition === 'missing' || condition === 'extraction' ? `
              <line x1="15" y1="15" x2="85" y2="105" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
              <line x1="85" y1="15" x2="15" y2="105" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
            ` : ''}

            ${condition === 'implant' ? `
              <rect x="42" y="70" width="16" height="40" fill="#10b981" rx="3"/>
              <line x1="38" y1="80" x2="62" y2="80" stroke="#ffffff" stroke-width="2"/>
              <line x1="38" y1="90" x2="62" y2="90" stroke="#ffffff" stroke-width="2"/>
              <line x1="38" y1="100" x2="62" y2="100" stroke="#ffffff" stroke-width="2"/>
            ` : ''}

            ${condition === 'fracture' ? `
              <path d="M 30,30 L 45,50 L 35,70 L 60,90" fill="none" stroke="#ea580c" stroke-width="4"/>
            ` : ''}
          </svg>
        </div>
        <span class="tooth-condition-badge badge-${getConditionBadgeClass(condition)}">
          ${condition}
        </span>
      </div>
    `;
  }

  function getConditionBadgeClass(cond) {
    switch (cond) {
      case 'caries': return 'danger';
      case 'filling': return 'primary';
      case 'crown': return 'warning';
      case 'rootcanal': return 'info';
      case 'implant': return 'success';
      default: return 'info';
    }
  }

  container.innerHTML = `
    <div class="odontogram-wrapper">
      <div class="odontogram-toolbar">
        <div>
          <h3 class="card-title">Interactive Adult Odontogram</h3>
          <p class="card-subtitle">Patient: <strong>${patient.name} (${patient.id})</strong> - Click any tooth to record clinical conditions or planned procedures.</p>
        </div>
        <div class="condition-legend">
          <div class="legend-item"><span class="legend-dot dot-caries"></span> Caries</div>
          <div class="legend-item"><span class="legend-dot dot-filling"></span> Filling</div>
          <div class="legend-item"><span class="legend-dot dot-crown"></span> Crown</div>
          <div class="legend-item"><span class="legend-dot dot-rootcanal"></span> Root Canal</div>
          <div class="legend-item"><span class="legend-dot dot-missing"></span> Missing</div>
          <div class="legend-item"><span class="legend-dot dot-implant"></span> Implant</div>
          <div class="legend-item"><span class="legend-dot dot-fracture"></span> Fracture</div>
        </div>
      </div>

      <div class="arch-container">
        <div>
          <div class="arch-title">Upper Arch (Maxillary Teeth 18-28)</div>
          <div class="teeth-grid">
            ${upperTeeth.map(num => renderSingleToothSvg(num, patientTeeth[num])).join('')}
          </div>
        </div>

        <div>
          <div class="arch-title">Lower Arch (Mandibular Teeth 48-38)</div>
          <div class="teeth-grid">
            ${lowerTeeth.map(num => renderSingleToothSvg(num, patientTeeth[num])).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Clicks on Teeth
  const toothItems = container.querySelectorAll('.tooth-item');
  toothItems.forEach(item => {
    item.addEventListener('click', () => {
      const toothNum = item.getAttribute('data-tooth');
      openToothDetailModal(patientId, toothNum, patientTeeth[toothNum]);
    });
  });
}

function openToothDetailModal(patientId, toothNum, existingData) {
  const currentCondition = existingData?.condition || 'healthy';
  const currentNotes = existingData?.notes || '';

  const bodyHtml = `
    <div class="tooth-detail-card">
      <div class="tooth-header-summary">
        <div class="tooth-big-num">#${toothNum}</div>
        <div>
          <h4 style="font-size:1.05rem; font-weight:700;">Tooth Details & Clinical Record</h4>
          <p style="font-size:0.85rem; color:var(--text-muted);">Select condition to record on dental chart:</p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Tooth Condition:</label>
        <div class="condition-selector-grid" id="condition-btn-group">
          <button class="condition-btn ${currentCondition === 'healthy' ? 'active' : ''}" data-val="healthy">Healthy</button>
          <button class="condition-btn ${currentCondition === 'caries' ? 'active' : ''}" data-val="caries">Caries</button>
          <button class="condition-btn ${currentCondition === 'filling' ? 'active' : ''}" data-val="filling">Filling</button>
          <button class="condition-btn ${currentCondition === 'crown' ? 'active' : ''}" data-val="crown">Crown</button>
          <button class="condition-btn ${currentCondition === 'rootcanal' ? 'active' : ''}" data-val="rootcanal">Root Canal</button>
          <button class="condition-btn ${currentCondition === 'missing' ? 'active' : ''}" data-val="missing">Missing</button>
          <button class="condition-btn ${currentCondition === 'implant' ? 'active' : ''}" data-val="implant">Implant</button>
          <button class="condition-btn ${currentCondition === 'fracture' ? 'active' : ''}" data-val="fracture">Fracture</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Clinical Notes / History:</label>
        <textarea class="form-control" id="tooth-notes-input" rows="3" placeholder="Enter findings, restoration materials, or treatment notes...">${currentNotes}</textarea>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-cancel-modal">Cancel</button>
    <button class="btn btn-primary btn-confirm-modal" id="save-tooth-btn">Save Tooth Record</button>
  `;

  ModalManager.open({
    title: `Tooth #${toothNum} Clinical Record`,
    bodyHtml,
    footerHtml,
    onConfirm: (modalEl) => {
      const activeBtn = modalEl.querySelector('#condition-btn-group .condition-btn.active');
      const selectedCond = activeBtn ? activeBtn.getAttribute('data-val') : 'healthy';
      const notes = modalEl.querySelector('#tooth-notes-input').value;

      return store.updateToothCondition(patientId, toothNum, selectedCond, notes);
    }
  });

  // Attach button toggle handlers in modal
  setTimeout(() => {
    const btns = document.querySelectorAll('#condition-btn-group .condition-btn');
    btns.forEach(b => {
      b.addEventListener('click', () => {
        btns.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });
  }, 50);
}
