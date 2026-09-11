/**
 * DENTAL HOSPITAL MANAGEMENT SYSTEM - MOCK DATASTORE
 * Realistic healthcare data for patients, teeth, appointments, lab cases, invoices, audit logs
 */

export const INITIAL_PATIENTS = [
  {
    id: 'PAT-1001',
    name: 'Anita Roy',
    age: 34,
    dob: '1992-05-14',
    gender: 'Female',
    phone: '+91 98765 43210',
    email: 'anita.roy@example.com',
    address: '42 Park Street, Metro City',
    lastVisit: '2026-09-02',
    nextAppointment: '2026-09-15 10:30 AM',
    treatmentStatus: 'In Progress',
    outstandingBalance: 3450,
    medicalHistory: ['Hypertension (Controlled)'],
    allergies: ['Penicillin', 'Sulfa drugs'],
    currentMedications: ['Amlodipine 5mg'],
    dentalHistory: 'Restoration on tooth 16, Root Canal on 26 in 2024.',
  },
  {
    id: 'PAT-1002',
    name: 'Vikram Malhotra',
    age: 48,
    dob: '1978-11-20',
    gender: 'Male',
    phone: '+91 98123 76543',
    email: 'v.malhotra@example.com',
    address: '108 Commercial Avenue',
    lastVisit: '2026-08-28',
    nextAppointment: '2026-09-12 02:00 PM',
    treatmentStatus: 'Scheduled',
    outstandingBalance: 0,
    medicalHistory: ['Type 2 Diabetes'],
    allergies: ['None known'],
    currentMedications: ['Metformin 500mg'],
    dentalHistory: 'Crown placement required on tooth 46.',
  },
  {
    id: 'PAT-1003',
    name: 'Sophia Chen',
    age: 26,
    dob: '2000-02-18',
    gender: 'Female',
    phone: '+91 97541 23890',
    email: 'sophia.c@example.com',
    address: '77 Silicon Heights',
    lastVisit: '2026-09-08',
    nextAppointment: '2026-09-20 11:00 AM',
    treatmentStatus: 'Completed',
    outstandingBalance: 0,
    medicalHistory: ['Asthma'],
    allergies: ['Latex'],
    currentMedications: ['Inhaler as needed'],
    dentalHistory: 'Composite fillings on teeth 14, 15, 24.',
  },
  {
    id: 'PAT-1004',
    name: 'Rajesh Sharma',
    age: 55,
    dob: '1971-08-04',
    gender: 'Male',
    phone: '+91 99001 12233',
    email: 'r.sharma55@example.com',
    address: '15 Green Wood Colony',
    lastVisit: '2026-09-10',
    nextAppointment: '2026-09-11 04:30 PM',
    treatmentStatus: 'In Progress',
    outstandingBalance: 12800,
    medicalHistory: ['Heart Stent (2021)'],
    allergies: ['Aspirin'],
    currentMedications: ['Clopidogrel', 'Atorvastatin'],
    dentalHistory: 'Full mouth scaling & multiple implants planned.',
  }
];

export const INITIAL_TEETH_DATA = {
  'PAT-1001': {
    '16': { condition: 'filling', notes: 'Composite restoration (2024)', surfaces: ['occlusal', 'mesial'] },
    '26': { condition: 'rootcanal', notes: 'RCT completed & crowned', surfaces: ['occlusal'] },
    '46': { condition: 'caries', notes: 'Deep occlusal caries detected', surfaces: ['occlusal'] },
    '38': { condition: 'missing', notes: 'Extracted 2022', surfaces: [] },
  },
  'PAT-1002': {
    '46': { condition: 'crown', notes: 'Zirconia crown prep done', surfaces: ['occlusal', 'buccal'] },
    '11': { condition: 'fracture', notes: 'Minor incisal edge chip', surfaces: ['incisal'] },
  }
};

export const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-801',
    patientId: 'PAT-1001',
    patientName: 'Anita Roy',
    dentistId: 'usr_101',
    dentistName: 'Dr. Rahul Sharma',
    date: '2026-09-11',
    time: '10:00 AM',
    duration: '45 mins',
    type: 'Root Canal Treatment',
    status: 'In Progress',
    notes: '2nd sitting RCT for tooth 46.'
  },
  {
    id: 'APT-802',
    patientId: 'PAT-1002',
    patientName: 'Vikram Malhotra',
    dentistId: 'usr_101',
    dentistName: 'Dr. Rahul Sharma',
    date: '2026-09-11',
    time: '02:00 PM',
    duration: '30 mins',
    type: 'Crown Fitting',
    status: 'Confirmed',
    notes: 'Trial zirconia crown tooth 46.'
  },
  {
    id: 'APT-803',
    patientId: 'PAT-1004',
    patientName: 'Rajesh Sharma',
    dentistId: 'usr_102',
    dentistName: 'Dr. Priya Patel',
    date: '2026-09-11',
    time: '04:30 PM',
    duration: '60 mins',
    type: 'Implant Consultation',
    status: 'Waiting',
    notes: 'Review CBCT scan for lower left quadrant.'
  },
  {
    id: 'APT-804',
    patientId: 'PAT-1003',
    patientName: 'Sophia Chen',
    dentistId: 'usr_102',
    dentistName: 'Dr. Priya Patel',
    date: '2026-09-12',
    time: '11:00 AM',
    duration: '30 mins',
    type: 'Routine Checkup & Cleaning',
    status: 'Scheduled',
    notes: 'Scaling and prophylaxis.'
  }
];

export const INITIAL_LAB_CASES = [
  {
    id: 'LAB-501',
    patientName: 'Vikram Malhotra',
    dentistName: 'Dr. Rahul Sharma',
    labName: 'Apex Dental Craft Lab',
    workRequired: 'Zirconia Crown - Tooth #46 (A2 Shade)',
    sentDate: '2026-09-04',
    expectedDate: '2026-09-10',
    actualDate: '2026-09-10',
    status: 'RECEIVED',
    cost: 3200,
    notes: 'Shade matched with A2 guide.'
  },
  {
    id: 'LAB-502',
    patientName: 'Anita Roy',
    dentistName: 'Dr. Priya Patel',
    labName: 'Precision Porcelain Studio',
    workRequired: 'PFM Bridge 3 Units (#24-#26)',
    sentDate: '2026-09-08',
    expectedDate: '2026-09-14',
    actualDate: '',
    status: 'IN PRODUCTION',
    cost: 7500,
    notes: 'Wax-up approved by doctor.'
  },
  {
    id: 'LAB-503',
    patientName: 'Rajesh Sharma',
    dentistName: 'Dr. Rahul Sharma',
    labName: 'Apex Dental Craft Lab',
    workRequired: 'Surgical Implant Stent Upper Arch',
    sentDate: '2026-09-10',
    expectedDate: '2026-09-16',
    actualDate: '',
    status: 'SENT',
    cost: 4500,
    notes: 'Includes 3D printed guide.'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-091',
    patientId: 'PAT-1001',
    patientName: 'Anita Roy',
    date: '2026-09-02',
    items: [
      { description: 'Root Canal Treatment (Tooth 46)', category: 'Treatment', amount: 4500 },
      { description: 'X-Ray Intraoral Periapical (IOPA)', category: 'X-Ray', amount: 450 },
      { description: 'Amoxicillin + Clavulanic Acid 625mg', category: 'Medicine', amount: 500 }
    ],
    subtotal: 5450,
    discount: 500,
    tax: 0,
    grandTotal: 4950,
    paidAmount: 1500,
    balance: 3450,
    status: 'PARTIAL',
    paymentMethod: 'UPI / Online'
  },
  {
    id: 'INV-2026-092',
    patientId: 'PAT-1003',
    patientName: 'Sophia Chen',
    date: '2026-09-08',
    items: [
      { description: 'Composite Resin Restoration (Tooth 14, 15)', category: 'Treatment', amount: 3000 },
      { description: 'Consultation Fee', category: 'Consultation', amount: 500 }
    ],
    subtotal: 3500,
    discount: 0,
    tax: 0,
    grandTotal: 3500,
    paidAmount: 3500,
    balance: 0,
    status: 'PAID',
    paymentMethod: 'Credit Card'
  }
];

export const INITIAL_INVENTORY = [
  { id: 'INV-01', name: 'Composite Dental Restorative A2', category: 'Consumables', stock: 4, unit: 'Syringes', minStock: 5, price: 1200, status: 'LOW' },
  { id: 'INV-02', name: 'Lignocaine 2% Local Anesthetic', category: 'Anesthetics', stock: 120, unit: 'Cartridges', minStock: 30, price: 45, status: 'OK' },
  { id: 'INV-03', name: 'Nitrile Examination Gloves (M)', category: 'PPE', stock: 12, unit: 'Boxes', minStock: 10, price: 350, status: 'OK' },
  { id: 'INV-04', name: 'Endodontic NiTi Rotary Files', category: 'Endo Supplies', stock: 2, unit: 'Packs', minStock: 6, price: 2400, status: 'CRITICAL' },
  { id: 'INV-05', name: 'Dental Impression Alginate', category: 'Materials', stock: 15, unit: 'Packs', minStock: 5, price: 480, status: 'OK' }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'LOG-901', timestamp: '2026-09-11 09:30:15', userId: 'usr_101', userName: 'Dr. Rahul Sharma', device: 'desktop', module: 'Odontogram', action: 'Update Tooth #46 Condition to Caries' },
  { id: 'LOG-902', timestamp: '2026-09-11 10:15:40', userId: 'usr_103', userName: 'Sarah Jenkins', device: 'desktop', module: 'Appointments', action: 'Confirmed Appointment APT-802 for Vikram Malhotra' },
  { id: 'LOG-903', timestamp: '2026-09-11 11:05:00', userId: 'usr_101', userName: 'Dr. Rahul Sharma', device: 'mobile', module: 'Billing', action: 'Create Invoice - DENIED BY PERMISSION POLICY' },
];
