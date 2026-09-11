/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - BILLING & INVOICE VIEW
 */
import { store } from '../state/store.js';
import { ModalManager } from '../components/modalManager.js';

export function renderBillingView(container) {
  const invoices = store.invoices;
  const canCreate = store.hasActionPermission('billing', 'create_invoice');

  container.innerHTML = `
    <div class="view-container">
      ${!canCreate ? `
        <div class="permission-denied-banner">
          <i data-lucide="shield-alert" class="icon"></i>
          <div class="text">
            <strong>Permission Blocked by Security Engine</strong><br/>
            User <em>${store.currentUser.name}</em> on <em>${store.currentDevice.toUpperCase()}</em> is prohibited from generating invoices. Please switch device to Desktop or login as Front Desk Coordinator.
          </div>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title"><i data-lucide="receipt"></i> Hospital Billing, Invoices & Collections</h3>
            <p class="card-subtitle">Generate invoices, record payments, apply discounts & process refunds</p>
          </div>
          <button class="btn btn-primary" id="btn-create-new-invoice" ${!canCreate ? 'disabled' : ''}>
            <i data-lucide="file-plus"></i> Create New Invoice
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Patient Name</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Grand Total</th>
                <th>Paid Amount</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => `
                <tr>
                  <td><strong>${inv.id}</strong></td>
                  <td>${inv.date}</td>
                  <td>${inv.patientName}</td>
                  <td>₹ ${inv.subtotal}</td>
                  <td>₹ ${inv.discount}</td>
                  <td><strong>₹ ${inv.grandTotal}</strong></td>
                  <td>₹ ${inv.paidAmount}</td>
                  <td><strong style="color:${inv.balance > 0 ? 'var(--danger-700)' : 'var(--success-700)'}">₹ ${inv.balance}</strong></td>
                  <td><span class="badge badge-${inv.status === 'PAID' ? 'success' : 'warning'}">${inv.status}</span></td>
                  <td>
                    <div style="display:flex; gap:0.35rem;">
                      <button class="btn btn-sm btn-secondary btn-print-inv" data-id="${inv.id}" title="Print Invoice">
                        <i data-lucide="printer"></i> Print
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Bind Create Invoice button
  const createBtn = container.querySelector('#btn-create-new-invoice');
  if (createBtn && canCreate) {
    createBtn.addEventListener('click', () => openCreateInvoiceModal());
  }

  // Bind Print Invoice button
  container.querySelectorAll('.btn-print-inv').forEach(btn => {
    btn.addEventListener('click', () => {
      const invId = btn.getAttribute('data-id');
      const inv = store.invoices.find(i => i.id === invId);
      if (inv) openPrintInvoiceModal(inv);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function openCreateInvoiceModal() {
  const bodyHtml = `
    <div class="form-group">
      <label class="form-label">Select Patient *</label>
      <select class="form-control" id="inv-patient-select">
        ${store.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Line Items & Procedures</label>
      <div style="display:flex; flex-direction:column; gap:0.5rem;" id="inv-items-container">
        <div class="form-row" style="margin-bottom:0;">
          <input type="text" class="form-control item-desc" value="Root Canal Treatment (Tooth #46)" placeholder="Description" />
          <input type="number" class="form-control item-amt" value="4500" placeholder="Amount (₹)" />
        </div>
        <div class="form-row" style="margin-bottom:0;">
          <input type="text" class="form-control item-desc" value="Intraoral X-Ray (IOPA)" placeholder="Description" />
          <input type="number" class="form-control item-amt" value="450" placeholder="Amount (₹)" />
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Discount Amount (₹)</label>
        <input type="number" class="form-control" id="inv-discount-input" value="450" />
      </div>
      <div class="form-group">
        <label class="form-label">Payment Method</label>
        <select class="form-control" id="inv-pay-method">
          <option>UPI / Online</option>
          <option>Credit Card</option>
          <option>Cash</option>
          <option>Insurance</option>
        </select>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-cancel-modal">Cancel</button>
    <button class="btn btn-primary btn-confirm-modal">Generate & Issue Invoice</button>
  `;

  ModalManager.open({
    title: 'Generate Itemized Dental Invoice',
    bodyHtml,
    footerHtml,
    onConfirm: (modalEl) => {
      const pId = modalEl.querySelector('#inv-patient-select').value;
      const patient = store.patients.find(p => p.id === pId);
      const discount = Number(modalEl.querySelector('#inv-discount-input').value) || 0;
      const payMethod = modalEl.querySelector('#inv-pay-method').value;

      const descEls = modalEl.querySelectorAll('.item-desc');
      const amtEls = modalEl.querySelectorAll('.item-amt');

      const items = [];
      let subtotal = 0;
      descEls.forEach((el, idx) => {
        const d = el.value;
        const a = Number(amtEls[idx]?.value) || 0;
        if (d && a > 0) {
          items.push({ description: d, category: 'Treatment', amount: a });
          subtotal += a;
        }
      });

      const grandTotal = Math.max(0, subtotal - discount);

      return store.createInvoice({
        patientId: pId,
        patientName: patient?.name || 'Patient',
        items,
        subtotal,
        discount,
        tax: 0,
        grandTotal,
        paidAmount: grandTotal,
        balance: 0,
        status: 'PAID',
        paymentMethod: payMethod
      });
    }
  });
}

function openPrintInvoiceModal(inv) {
  const bodyHtml = `
    <div class="printable-invoice" style="padding:1rem; font-family:var(--font-body);">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--primary-600); padding-bottom:1rem; margin-bottom:1rem;">
        <div>
          <h2 style="color:#ec4899; font-family:var(--font-heading); margin-bottom:0.2rem;">DENT-CARE DENTAL HOSPITAL</h2>
          <p style="font-size:0.8rem; color:var(--text-muted);">Multi-Specialty Dental Clinic & Laser Center<br/>Phone: +91 11 4567 8900 | GSTIN: 07AAAAD1234F1Z5</p>
        </div>
        <div style="text-align:right;">
          <h3 style="color:var(--text-main);">TAX INVOICE</h3>
          <div style="font-weight:700; color:var(--primary-600);">${inv.id}</div>
          <div style="font-size:0.8rem;">Date: ${inv.date}</div>
        </div>
      </div>

      <div style="margin-bottom:1.5rem; font-size:0.9rem; background:#f8fafc; padding:0.75rem; border-radius:var(--radius-md);">
        <strong>Billed To:</strong> ${inv.patientName} (ID: ${inv.patientId})<br/>
        <strong>Payment Method:</strong> ${inv.paymentMethod || 'UPI / Online'}
      </div>

      <table class="data-table" style="margin-bottom:1.5rem;">
        <thead>
          <tr>
            <th>Service Description</th>
            <th style="text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(inv.items || []).map(item => `
            <tr>
              <td>${item.description}</td>
              <td style="text-align:right;">₹ ${item.amount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display:flex; justify-content:flex-end; font-size:0.95rem;">
        <div style="width:250px; display:flex; flex-direction:column; gap:0.4rem;">
          <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span> <span>₹ ${inv.subtotal}</span></div>
          <div style="display:flex; justify-content:space-between; color:var(--danger-700);"><span>Discount:</span> <span>- ₹ ${inv.discount}</span></div>
          <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.1rem; border-top:1px solid var(--border-medium); padding-top:0.4rem; color:var(--primary-700);">
            <span>Grand Total:</span> <span>₹ ${inv.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  ModalManager.open({
    title: `Print Preview: ${inv.id}`,
    bodyHtml,
    footerHtml: `
      <button class="btn btn-secondary btn-cancel-modal">Close</button>
      <button class="btn btn-primary" onclick="window.print()"><i data-lucide="printer"></i> Print Invoice Now</button>
    `
  });
}
