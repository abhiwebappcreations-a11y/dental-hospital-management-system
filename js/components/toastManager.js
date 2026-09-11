/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - TOAST MANAGER
 */
import { store } from '../state/store.js';

export function renderToasts(container) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toasts = store.toastQueue;
  toastContainer.innerHTML = toasts.map(t => `
    <div class="toast toast-${t.type}">
      <div class="toast-content">
        <div class="toast-title">${t.title}</div>
        <div class="toast-message">${t.message}</div>
      </div>
    </div>
  `).join('');
}
