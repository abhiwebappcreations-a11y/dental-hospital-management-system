/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - ACCESS CONTROL & SECURITY VIEW
 */
import { store } from '../state/store.js';
import { USERS, DEVICE_TYPES, MODULES } from '../state/permissionEngine.js';

export function renderAccessControlView(container) {
  let selectedUser = store.currentUser.id;
  let selectedDevice = store.currentDevice;

  function renderMatrix() {
    const userObj = USERS.find(u => u.id === selectedUser) || USERS[0];
    const deviceObj = DEVICE_TYPES.find(d => d.id === selectedDevice) || DEVICE_TYPES[0];

    const matrixHtml = MODULES.map(mod => {
      const actions = ['view', 'create', 'edit', 'delete'];
      return `
        <tr>
          <td>
            <strong>${mod.label}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${mod.section} Section</div>
          </td>
          ${actions.map(act => {
            const isAllowed = store.permissionEngine.hasPermission(selectedUser, selectedDevice, mod.id, act);
            return `
              <td style="text-align:center;">
                <input 
                  type="checkbox" 
                  class="perm-toggle-checkbox" 
                  data-module="${mod.id}" 
                  data-action="${act}" 
                  ${isAllowed ? 'checked' : ''} 
                  style="width:18px; height:18px; cursor:pointer;"
                />
              </td>
            `;
          }).join('')}
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="view-container">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title"><i data-lucide="shield-check"></i> Access Control & Device Permission Matrix</h3>
              <p class="card-subtitle">Configure granular <code>USER → DEVICE → MODULE → ACTION</code> access rules</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-reset-perm-matrix">
              <i data-lucide="rotate-ccw"></i> Reset Matrix Defaults
            </button>
          </div>

          <!-- SELECTOR CONTROLS -->
          <div style="display:flex; gap:1.5rem; margin-bottom:1.5rem; background:var(--primary-50); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--primary-200);">
            <div class="form-group" style="margin-bottom:0; flex:1;">
              <label class="form-label">Select User Persona:</label>
              <select class="form-control" id="matrix-user-select">
                ${USERS.map(u => `<option value="${u.id}" ${u.id === selectedUser ? 'selected' : ''}>${u.name} (${u.role})</option>`).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom:0; flex:1;">
              <label class="form-label">Select Device Context:</label>
              <select class="form-control" id="matrix-device-select">
                ${DEVICE_TYPES.map(d => `<option value="${d.id}" ${d.id === selectedDevice ? 'selected' : ''}>${d.label}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- PERMISSION MATRIX GRID TABLE -->
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Application Module</th>
                  <th style="text-align:center;">View Access</th>
                  <th style="text-align:center;">Create Action</th>
                  <th style="text-align:center;">Edit Action</th>
                  <th style="text-align:center;">Delete Action</th>
                </tr>
              </thead>
              <tbody>
                ${matrixHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Bind Selectors
    const userSelect = container.querySelector('#matrix-user-select');
    if (userSelect) {
      userSelect.addEventListener('change', (e) => {
        selectedUser = e.target.value;
        renderMatrix();
      });
    }

    const deviceSelect = container.querySelector('#matrix-device-select');
    if (deviceSelect) {
      deviceSelect.addEventListener('change', (e) => {
        selectedDevice = e.target.value;
        renderMatrix();
      });
    }

    // Bind Checkboxes
    container.querySelectorAll('.perm-toggle-checkbox').forEach(box => {
      box.addEventListener('change', (e) => {
        const modId = box.getAttribute('data-module');
        const act = box.getAttribute('data-action');
        const allow = e.target.checked;

        store.permissionEngine.setPermission(selectedUser, selectedDevice, modId, act, allow);
        store.logAudit('Permission Matrix Update', `Set rule for ${selectedUser} + ${selectedDevice} + ${modId} + ${act} = ${allow}`, 'access_control');
        store.addToast('Permission Matrix Updated', `Updated access rule for ${modId} (${act})`, 'info');
      });
    });

    const resetBtn = container.querySelector('#btn-reset-perm-matrix');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all permission rules to system defaults?')) {
          store.permissionEngine.resetToDefaults();
          store.addToast('Matrix Reset', 'Permission rules reset to defaults.', 'warning');
          renderMatrix();
        }
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderMatrix();
}
