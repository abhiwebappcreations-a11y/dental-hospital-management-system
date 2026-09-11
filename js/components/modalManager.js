/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - MODAL MANAGER
 */

export class ModalManager {
  static open({ title, bodyHtml, footerHtml = '', onConfirm = null }) {
    let overlay = document.querySelector('.modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="modal-close-btn" id="modal-close-x">&times;</button>
        </div>
        <div class="modal-body">
          ${bodyHtml}
        </div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;

    setTimeout(() => overlay.classList.add('active'), 10);

    const closeBtn = overlay.querySelector('#modal-close-x');
    const cancelBtn = overlay.querySelector('.btn-cancel-modal');

    const close = () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);

    const confirmBtn = overlay.querySelector('.btn-confirm-modal');
    if (confirmBtn && onConfirm) {
      confirmBtn.addEventListener('click', () => {
        const success = onConfirm(overlay);
        if (success !== false) close();
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  static close() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  }
}
