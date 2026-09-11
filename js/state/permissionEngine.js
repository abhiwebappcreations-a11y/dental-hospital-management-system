/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - PERMISSION ENGINE
 * Evaluates: USER -> DEVICE -> MODULE -> ACTION -> ALLOW/DENY
 */

export const USERS = [
  { id: 'usr_101', username: 'dr_rahul', name: 'Dr. Rahul Sharma', role: 'Dentist', avatar: 'RS', title: 'Senior Dental Surgeon' },
  { id: 'usr_102', username: 'dr_priya', name: 'Dr. Priya Patel', role: 'Specialist', avatar: 'PP', title: 'Endodontics Specialist' },
  { id: 'usr_103', username: 'sarah_recept', name: 'Sarah Jenkins', role: 'Receptionist', avatar: 'SJ', title: 'Front Desk Coordinator' },
  { id: 'usr_104', username: 'admin_mark', name: 'Mark Vance', role: 'Admin', avatar: 'MV', title: 'Hospital IT Administrator' },
];

export const DEVICE_TYPES = [
  { id: 'desktop', label: 'Desktop Workstation', icon: 'monitor' },
  { id: 'tablet', label: 'Clinical Tablet', icon: 'tablet' },
  { id: 'mobile', label: 'Mobile Device', icon: 'smartphone' },
];

export const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', section: 'Main' },
  { id: 'patients', label: 'Patients', icon: 'users', section: 'Clinical' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar', section: 'Clinical' },
  { id: 'dental_records', label: 'Dental Records', icon: 'file-text', section: 'Clinical' },
  { id: 'odontogram', label: 'Odontogram', icon: 'activity', section: 'Clinical' },
  { id: 'consultations', label: 'Consultations', icon: 'stethoscope', section: 'Clinical' },
  { id: 'treatment_plans', label: 'Treatment Plans', icon: 'clipboard-list', section: 'Clinical' },
  { id: 'prescriptions', label: 'Prescriptions', icon: 'pill', section: 'Clinical' },
  { id: 'laboratory', label: 'Laboratory', icon: 'flask-conical', section: 'Services' },
  { id: 'xrays', label: 'X-Rays & Documents', icon: 'image', section: 'Services' },
  { id: 'billing', label: 'Billing & Invoices', icon: 'receipt', section: 'Finance' },
  { id: 'payments', label: 'Payments', icon: 'credit-card', section: 'Finance' },
  { id: 'inventory', label: 'Inventory', icon: 'package', section: 'Operations' },
  { id: 'followups', label: 'Follow-ups', icon: 'bell', section: 'Operations' },
  { id: 'reports', label: 'Reports & Analytics', icon: 'bar-chart-3', section: 'Operations' },
  { id: 'staff', label: 'Staff Management', icon: 'user-check', section: 'Admin' },
  { id: 'access_control', label: 'Access Control', icon: 'shield-check', section: 'Admin' },
  { id: 'devices', label: 'Device Registry', icon: 'cpu', section: 'Admin' },
  { id: 'audit_logs', label: 'Audit Logs', icon: 'history', section: 'Admin' },
  { id: 'settings', label: 'Settings', icon: 'settings', section: 'Admin' }
];

// DEFAULT DYNAMIC PERMISSION RULES MATRIX
// Format: Key = `${user_id}_${device_type}_${module_id}_${action}` => boolean
const DEFAULT_PERMISSIONS = {
  // Dr. Rahul Rules
  'usr_101_desktop_billing_create_invoice': true,
  'usr_101_mobile_billing_create_invoice': false, // Explicit requirement example!
  'usr_101_desktop_billing_view': true,
  'usr_101_mobile_billing_view': true,
  'usr_101_mobile_patients_delete': false,
  'usr_101_desktop_patients_delete': true,

  // Sarah Receptionist Rules
  'usr_103_desktop_consultations_create': false,
  'usr_103_mobile_consultations_create': false,
  'usr_103_desktop_billing_create_invoice': true,
  'usr_103_mobile_billing_create_invoice': false,
  'usr_103_desktop_patients_create': true,
  'usr_103_desktop_patients_delete': false,
  'usr_103_desktop_access_control_view': false,
};

export class PermissionEngine {
  constructor(customRules = null) {
    this.rules = customRules || this.loadRulesFromStorage();
  }

  loadRulesFromStorage() {
    try {
      const stored = localStorage.getItem('dhms_permission_matrix');
      return stored ? JSON.parse(stored) : { ...DEFAULT_PERMISSIONS };
    } catch (e) {
      return { ...DEFAULT_PERMISSIONS };
    }
  }

  saveRulesToStorage() {
    localStorage.setItem('dhms_permission_matrix', JSON.stringify(this.rules));
  }

  /**
   * Check permission for USER -> DEVICE -> MODULE -> ACTION
   */
  hasPermission(userId, deviceType, moduleId, action = 'view') {
    // Admin override for system management
    if (userId === 'usr_104' && (moduleId === 'access_control' || moduleId === 'audit_logs' || action === 'view')) {
      return true;
    }

    const exactKey = `${userId}_${deviceType}_${moduleId}_${action}`;
    if (this.rules[exactKey] !== undefined) {
      return this.rules[exactKey];
    }

    // Role fallback logic if exact rule is not specified:
    const user = USERS.find(u => u.id === userId);
    if (!user) return false;

    // Mobile device general restriction rule for sensitive modules
    if (deviceType === 'mobile') {
      if ((moduleId === 'billing' || moduleId === 'access_control' || moduleId === 'staff') && (action === 'create' || action === 'delete' || action === 'edit')) {
        return false;
      }
    }

    // Receptionist restriction for clinical notes
    if (user.role === 'Receptionist') {
      if ((moduleId === 'consultations' || moduleId === 'prescriptions') && (action === 'create' || action === 'edit')) {
        return false;
      }
      if (moduleId === 'access_control' || moduleId === 'audit_logs') {
        return false;
      }
    }

    // Default allow viewing if not explicitly denied
    if (action === 'view') return true;
    return true;
  }

  /**
   * Set explicit permission toggle
   */
  setPermission(userId, deviceType, moduleId, action, allow) {
    const key = `${userId}_${deviceType}_${moduleId}_${action}`;
    this.rules[key] = allow;
    this.saveRulesToStorage();
  }

  getAllRules() {
    return this.rules;
  }

  resetToDefaults() {
    this.rules = { ...DEFAULT_PERMISSIONS };
    this.saveRulesToStorage();
  }
}
