/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - CENTRAL REACTIVE STORE
 */
import { PermissionEngine, USERS, DEVICE_TYPES } from './permissionEngine.js';
import {
  INITIAL_PATIENTS,
  INITIAL_TEETH_DATA,
  INITIAL_APPOINTMENTS,
  INITIAL_LAB_CASES,
  INITIAL_INVOICES,
  INITIAL_INVENTORY,
  INITIAL_AUDIT_LOGS
} from './mockData.js';

class Store {
  constructor() {
    this.permissionEngine = new PermissionEngine();
    this.subscribers = [];

    // Session State
    this.currentUser = this.loadFromStorage('dhms_active_user', USERS[0]); // Default Dr. Rahul
    this.currentDevice = this.loadFromStorage('dhms_active_device', 'desktop'); // Default Desktop
    this.currentView = 'dashboard';
    this.selectedPatientId = 'PAT-1001';

    // Entities Datastore
    this.patients = this.loadFromStorage('dhms_patients', INITIAL_PATIENTS);
    this.teethData = this.loadFromStorage('dhms_teeth_data', INITIAL_TEETH_DATA);
    this.appointments = this.loadFromStorage('dhms_appointments', INITIAL_APPOINTMENTS);
    this.labCases = this.loadFromStorage('dhms_lab_cases', INITIAL_LAB_CASES);
    this.invoices = this.loadFromStorage('dhms_invoices', INITIAL_INVOICES);
    this.inventory = this.loadFromStorage('dhms_inventory', INITIAL_INVENTORY);
    this.auditLogs = this.loadFromStorage('dhms_audit_logs', INITIAL_AUDIT_LOGS);

    this.searchQuery = '';
    this.toastQueue = [];
  }

  loadFromStorage(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this));
  }

  // SESSION CONTROLS
  setCurrentUser(userObj) {
    this.currentUser = userObj;
    this.saveToStorage('dhms_active_user', userObj);
    this.logAudit('Session Switch', `Switched active user persona to ${userObj.name} (${userObj.role})`);
    this.notify();
  }

  setCurrentDevice(deviceTypeId) {
    this.currentDevice = deviceTypeId;
    this.saveToStorage('dhms_active_device', deviceTypeId);
    document.body.className = `sim-device-${deviceTypeId}`;
    this.logAudit('Device Switch', `Switched active device simulation to ${deviceTypeId}`);
    this.notify();
  }

  setCurrentView(viewId, params = {}) {
    // Check permission to view module
    const allowed = this.permissionEngine.hasPermission(
      this.currentUser.id,
      this.currentDevice,
      viewId,
      'view'
    );

    if (!allowed) {
      this.addToast(
        'Access Denied',
        `User ${this.currentUser.name} on ${this.currentDevice.toUpperCase()} is not authorized to access module "${viewId}".`,
        'danger'
      );
      this.logAudit('Permission Denied', `Attempted to access module '${viewId}' on ${this.currentDevice} - DENIED`);
      return false;
    }

    this.currentView = viewId;
    if (params.patientId) {
      this.selectedPatientId = params.patientId;
    }
    this.notify();
    return true;
  }

  hasActionPermission(moduleId, action) {
    return this.permissionEngine.hasPermission(
      this.currentUser.id,
      this.currentDevice,
      moduleId,
      action
    );
  }

  // AUDIT LOGGING
  logAudit(action, details, module = this.currentView) {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      device: this.currentDevice,
      module,
      action,
      details
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    this.saveToStorage('dhms_audit_logs', this.auditLogs);
  }

  // TOAST NOTIFICATIONS
  addToast(title, message, type = 'info') {
    const toast = { id: Date.now(), title, message, type };
    this.toastQueue.push(toast);
    this.notify();

    setTimeout(() => {
      this.toastQueue = this.toastQueue.filter(t => t.id !== toast.id);
      this.notify();
    }, 4500);
  }

  // PATIENT MUTATIONS
  addPatient(patientData) {
    if (!this.hasActionPermission('patients', 'create')) {
      this.addToast('Permission Denied', `Action 'Create Patient' denied for ${this.currentUser.name} on ${this.currentDevice}.`, 'danger');
      this.logAudit('Create Patient', 'DENIED - Insufficient Permissions', 'patients');
      return false;
    }

    const newPatient = {
      id: `PAT-${1000 + this.patients.length + 1}`,
      ...patientData,
      lastVisit: new Date().toISOString().split('T')[0],
      nextAppointment: 'Not Scheduled',
      treatmentStatus: 'New',
      outstandingBalance: 0
    };
    this.patients.unshift(newPatient);
    this.saveToStorage('dhms_patients', this.patients);
    this.logAudit('Add Patient', `Created new patient record: ${newPatient.name} (${newPatient.id})`, 'patients');
    this.addToast('Patient Added', `${newPatient.name} added successfully!`, 'success');
    this.notify();
    return true;
  }

  deletePatient(patientId) {
    if (!this.hasActionPermission('patients', 'delete')) {
      this.addToast('Permission Denied', `Action 'Delete Patient' denied for ${this.currentUser.name} on ${this.currentDevice}.`, 'danger');
      this.logAudit('Delete Patient', `Attempted to delete ${patientId} - DENIED`, 'patients');
      return false;
    }

    const p = this.patients.find(x => x.id === patientId);
    this.patients = this.patients.filter(x => x.id !== patientId);
    this.saveToStorage('dhms_patients', this.patients);
    this.logAudit('Delete Patient', `Deleted patient record: ${p?.name || patientId}`, 'patients');
    this.addToast('Patient Deleted', `Patient ${patientId} deleted.`, 'warning');
    this.notify();
    return true;
  }

  // ODONTOGRAM / TEETH MUTATIONS
  updateToothCondition(patientId, toothNumber, condition, notes = '', surfaces = []) {
    if (!this.hasActionPermission('odontogram', 'edit')) {
      this.addToast('Permission Denied', `Action 'Update Odontogram' denied for ${this.currentUser.name} on ${this.currentDevice}.`, 'danger');
      this.logAudit('Update Odontogram', `Attempted tooth #${toothNumber} edit - DENIED`, 'odontogram');
      return false;
    }

    if (!this.teethData[patientId]) {
      this.teethData[patientId] = {};
    }

    this.teethData[patientId][toothNumber] = {
      condition,
      notes,
      surfaces,
      updatedBy: this.currentUser.name,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    this.saveToStorage('dhms_teeth_data', this.teethData);
    this.logAudit('Update Tooth', `Patient ${patientId} Tooth #${toothNumber} set to condition '${condition}'`, 'odontogram');
    this.addToast('Odontogram Updated', `Tooth #${toothNumber} updated to ${condition.toUpperCase()}`, 'success');
    this.notify();
    return true;
  }

  // LAB CASE MUTATIONS
  updateLabCaseStatus(caseId, newStatus) {
    if (!this.hasActionPermission('laboratory', 'edit')) {
      this.addToast('Permission Denied', `Action 'Update Lab Case' denied for ${this.currentUser.name} on ${this.currentDevice}.`, 'danger');
      return false;
    }

    const c = this.labCases.find(x => x.id === caseId);
    if (c) {
      c.status = newStatus;
      if (newStatus === 'RECEIVED' || newStatus === 'DELIVERED') {
        c.actualDate = new Date().toISOString().split('T')[0];
      }
      this.saveToStorage('dhms_lab_cases', this.labCases);
      this.logAudit('Update Lab Case', `Moved Lab Case ${caseId} to stage '${newStatus}'`, 'laboratory');
      this.addToast('Lab Case Updated', `Case ${caseId} stage updated to ${newStatus}`, 'info');
      this.notify();
      return true;
    }
    return false;
  }

  // INVOICE MUTATIONS
  createInvoice(invoiceData) {
    if (!this.hasActionPermission('billing', 'create_invoice')) {
      this.addToast('Permission Denied', `Action 'Create Invoice' denied for ${this.currentUser.name} on ${this.currentDevice}.`, 'danger');
      this.logAudit('Create Invoice', `Attempted to create invoice on ${this.currentDevice} - DENIED`, 'billing');
      return false;
    }

    const newInv = {
      id: `INV-2026-${100 + this.invoices.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      ...invoiceData
    };

    this.invoices.unshift(newInv);
    this.saveToStorage('dhms_invoices', this.invoices);
    this.logAudit('Create Invoice', `Generated Invoice ${newInv.id} for ${newInv.patientName} (Total: ₹${newInv.grandTotal})`, 'billing');
    this.addToast('Invoice Created', `Invoice ${newInv.id} issued successfully!`, 'success');
    this.notify();
    return true;
  }
}

export const store = new Store();
