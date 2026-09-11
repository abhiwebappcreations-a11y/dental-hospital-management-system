/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - LABORATORY KANBAN VIEW
 */
import { store } from '../state/store.js';
import { ModalManager } from '../components/modalManager.js';

export function renderLaboratoryView(container) {
  const labCases = store.labCases;
  const stages = ['CREATED', 'SENT', 'IN PRODUCTION', 'RECEIVED', 'DELIVERED', 'COMPLETED'];
  const canEdit = store.hasActionPermission('laboratory', 'edit');

  container.innerHTML = `
    <div class="view-container">
      <div class="card" style="margin-bottom:1rem;">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i data-lucide="flask-conical"></i> Dental Laboratory Case Tracking</h3>
            <p class="card-subtitle">Crown, bridge, denture & implant prosthetic lab workflow management</p>
          </div>
          <button class="btn btn-primary" id="btn-create-lab-case" ${!canEdit ? 'disabled' : ''}>
            <i data-lucide="plus"></i> Create Lab Order
          </button>
        </div>
      </div>

      <!-- KANBAN BOARD -->
      <div class="kanban-board">
        ${stages.map(stg => {
          const casesInStage = labCases.filter(c => c.status === stg);
          return `
            <div class="kanban-column">
              <div class="kanban-column-header">
                <span class="kanban-column-title">${stg}</span>
                <span class="kanban-count-badge">${casesInStage.length}</span>
              </div>
              <div class="kanban-cards-container">
                ${casesInStage.map(item => `
                  <div class="kanban-card">
                    <div class="kanban-card-title">${item.workRequired}</div>
                    <div class="kanban-card-meta">
                      <span><strong>Patient:</strong> ${item.patientName}</span>
                    </div>
                    <div class="kanban-card-meta">
                      <span><strong>Lab:</strong> ${item.labName}</span>
                      <span style="color:var(--primary-600); font-weight:700;">₹ ${item.cost}</span>
                    </div>
                    <div class="kanban-card-meta" style="font-size:0.72rem;">
                      <span>Sent: ${item.sentDate}</span>
                      <span>Exp: ${item.expectedDate}</span>
                    </div>
                    <div class="kanban-actions">
                      ${stages.indexOf(stg) > 0 ? `
                        <button class="btn btn-sm btn-secondary btn-move-stage" data-id="${item.id}" data-target="${stages[stages.indexOf(stg) - 1]}" title="Move Back">
                          <i data-lucide="chevron-left"></i>
                        </button>
                      ` : '<div></div>'}
                      ${stages.indexOf(stg) < stages.length - 1 ? `
                        <button class="btn btn-sm btn-primary btn-move-stage" data-id="${item.id}" data-target="${stages[stages.indexOf(stg) + 1]}" title="Advance Stage">
                          <i data-lucide="chevron-right"></i> Next Stage
                        </button>
                      ` : '<span class="badge badge-success">Done</span>'}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Bind Move Stage Buttons
  container.querySelectorAll('.btn-move-stage').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const targetStage = btn.getAttribute('data-target');
      store.updateLabCaseStatus(id, targetStage);
      renderLaboratoryView(container);
    });
  });

  // Bind Create Lab Order
  const createBtn = container.querySelector('#btn-create-lab-case');
  if (createBtn && canEdit) {
    createBtn.addEventListener('click', () => openCreateLabModal());
  }

  if (window.lucide) window.lucide.createIcons();
}

function openCreateLabModal() {
  const bodyHtml = `
    <div class="form-group">
      <label class="form-label">Patient Name *</label>
      <select class="form-control" id="lab-patient-name">
        ${store.patients.map(p => `<option>${p.name}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Dental Laboratory Vendor</label>
      <input type="text" class="form-control" id="lab-vendor-input" value="Apex Dental Craft Lab" />
    </div>

    <div class="form-group">
      <label class="form-label">Work Required & Tooth #</label>
      <input type="text" class="form-control" id="lab-work-input" placeholder="e.g. Zirconia Crown - Tooth #36 (A3 Shade)" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Expected Return Date</label>
        <input type="date" class="form-control" id="lab-exp-date" value="2026-09-18" />
      </div>
      <div class="form-group">
        <label class="form-label">Estimated Lab Cost (₹)</label>
        <input type="number" class="form-control" id="lab-cost-input" value="3500" />
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-cancel-modal">Cancel</button>
    <button class="btn btn-primary btn-confirm-modal">Send Lab Order</button>
  `;

  ModalManager.open({
    title: 'Create Dental Laboratory Order',
    bodyHtml,
    footerHtml,
    onConfirm: (modalEl) => {
      const patientName = modalEl.querySelector('#lab-patient-name').value;
      const labName = modalEl.querySelector('#lab-vendor-input').value;
      const workRequired = modalEl.querySelector('#lab-work-input').value;
      const expectedDate = modalEl.querySelector('#lab-exp-date').value;
      const cost = Number(modalEl.querySelector('#lab-cost-input').value) || 0;

      const newCase = {
        id: `LAB-${500 + store.labCases.length + 1}`,
        patientName,
        dentistName: store.currentUser.name,
        labName,
        workRequired,
        sentDate: new Date().toISOString().split('T')[0],
        expectedDate,
        actualDate: '',
        status: 'CREATED',
        cost,
        notes: 'Submitted via lab portal.'
      };

      store.labCases.unshift(newCase);
      store.saveToStorage('dhms_lab_cases', store.labCases);
      store.logAudit('Create Lab Case', `Created Lab Case ${newCase.id} for ${patientName}`, 'laboratory');
      store.addToast('Lab Order Created', `Order ${newCase.id} created for ${labName}`, 'success');
      store.notify();
      return true;
    }
  });
}
