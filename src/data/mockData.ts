// Shared mock data for synchronized dashboards

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  condition: string;
  lastVisit: string;
  status: 'active' | 'inactive' | 'critical';
  medicalHistory: string[];
  labReports: LabReport[];
  prescriptions: Prescription[];
  appointments: Appointment[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  expiryDate: string;
  category: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicines: {
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }[];
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testType: string;
  date: string;
  status: 'pending' | 'completed' | 'reviewed' | 'critical';
  results?: string;
  summary?: string;
  urgent: boolean;
  annotation?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
}

export interface PharmacyOrder {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  pharmacyId: string;
  medicines: {
    medicineId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  orderDate: string;
  deliveryAddress?: string;
  phone: string;
}

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Rajesh Sharma',
    specialization: 'Cardiology',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@medcenter.com'
  },
  {
    id: 'doc-002',
    name: 'Dr. Priya Johnson',
    specialization: 'Internal Medicine',
    phone: '+91 98765 43211',
    email: 'priya.johnson@medcenter.com'
  },
  {
    id: 'doc-003',
    name: 'Dr. Amit Brown',
    specialization: 'Orthopedics',
    phone: '+91 98765 43212',
    email: 'amit.brown@medcenter.com'
  }
];

// Mock Medicines
export const mockMedicines: Medicine[] = [
  {
    id: 'med-001',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    manufacturer: 'Sun Pharma',
    strength: '500mg',
    price: 15,
    stockQuantity: 150,
    minStockLevel: 50,
    expiryDate: '2025-12-31',
    category: 'Analgesic'
  },
  {
    id: 'med-002',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    manufacturer: 'Cipla',
    strength: '250mg',
    price: 85,
    stockQuantity: 8,
    minStockLevel: 25,
    expiryDate: '2025-08-15',
    category: 'Antibiotic'
  },
  {
    id: 'med-003',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    manufacturer: 'Dr. Reddy\'s',
    strength: '500mg',
    price: 45,
    stockQuantity: 22,
    minStockLevel: 30,
    expiryDate: '2026-03-20',
    category: 'Antidiabetic'
  },
  {
    id: 'med-004',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    manufacturer: 'Lupin',
    strength: '10mg',
    price: 120,
    stockQuantity: 75,
    minStockLevel: 20,
    expiryDate: '2025-11-10',
    category: 'ACE Inhibitor'
  },
  {
    id: 'med-005',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    manufacturer: 'Torrent',
    strength: '5mg',
    price: 95,
    stockQuantity: 45,
    minStockLevel: 15,
    expiryDate: '2025-09-25',
    category: 'Calcium Channel Blocker'
  }
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'pat-001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 11111',
    email: 'rajesh.kumar@email.com',
    condition: 'Hypertension, Diabetes',
    lastVisit: '2024-01-15',
    status: 'active',
    medicalHistory: [
      'Diagnosed with Type 2 Diabetes in 2020',
      'Hypertension since 2018',
      'No known allergies',
      'Family history of cardiac disease'
    ],
    labReports: [],
    prescriptions: [],
    appointments: []
  },
  {
    id: 'pat-002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    phone: '+91 98765 22222',
    email: 'priya.sharma@email.com',
    condition: 'Anemia, Thyroid',
    lastVisit: '2024-01-10',
    status: 'active',
    medicalHistory: [
      'Iron deficiency anemia diagnosed in 2023',
      'Hypothyroidism since 2019',
      'Allergic to penicillin',
      'Previous surgery: Appendectomy (2015)'
    ],
    labReports: [],
    prescriptions: [],
    appointments: []
  },
  {
    id: 'pat-003',
    name: 'Amit Singh',
    age: 28,
    gender: 'Male',
    phone: '+91 98765 33333',
    email: 'amit.singh@email.com',
    condition: 'Respiratory Issues',
    lastVisit: '2024-01-08',
    status: 'critical',
    medicalHistory: [
      'Chronic asthma since childhood',
      'Recent respiratory infection',
      'No known drug allergies',
      'Active smoker (counseled to quit)'
    ],
    labReports: [],
    prescriptions: [],
    appointments: []
  },
  {
    id: 'pat-004',
    name: 'Sunita Devi',
    age: 55,
    gender: 'Female',
    phone: '+91 98765 44444',
    email: 'sunita.devi@email.com',
    condition: 'Arthritis, Heart Disease',
    lastVisit: '2024-01-12',
    status: 'active',
    medicalHistory: [
      'Rheumatoid arthritis diagnosed in 2018',
      'Coronary artery disease',
      'Allergic to NSAIDs',
      'Previous cardiac stent placement (2022)'
    ],
    labReports: [],
    prescriptions: [],
    appointments: []
  },
  {
    id: 'pat-005',
    name: 'Vikram Patel',
    age: 38,
    gender: 'Male',
    phone: '+91 98765 55555',
    email: 'vikram.patel@email.com',
    condition: 'Migraine, Anxiety',
    lastVisit: '2024-01-14',
    status: 'active',
    medicalHistory: [
      'Chronic migraine disorder',
      'Generalized anxiety disorder',
      'No known allergies',
      'Family history of mental health issues'
    ],
    labReports: [],
    prescriptions: [],
    appointments: []
  }
];

// Mock Lab Reports
export const mockLabReports: LabReport[] = [
  {
    id: 'lab-001',
    patientId: 'pat-001',
    patientName: 'Rajesh Kumar',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Sharma',
    testType: 'Complete Blood Count',
    date: '2024-01-15',
    status: 'completed',
    results: 'Normal hemoglobin levels, slightly elevated WBC count',
    summary: 'Mild infection markers present, recommend follow-up',
    urgent: false,
    annotation: 'Monitor WBC levels in next visit'
  },
  {
    id: 'lab-002',
    patientId: 'pat-002',
    patientName: 'Priya Sharma',
    doctorId: 'doc-002',
    doctorName: 'Dr. Priya Johnson',
    testType: 'Lipid Profile',
    date: '2024-01-14',
    status: 'pending',
    urgent: true,
    summary: 'Awaiting results for cholesterol analysis'
  },
  {
    id: 'lab-003',
    patientId: 'pat-003',
    patientName: 'Amit Singh',
    doctorId: 'doc-003',
    doctorName: 'Dr. Amit Brown',
    testType: 'HbA1c',
    date: '2024-01-13',
    status: 'completed',
    results: 'HbA1c: 7.8% - Above target range',
    summary: 'Diabetes management needs adjustment',
    urgent: false,
    annotation: 'Increase medication dosage, lifestyle counseling needed'
  },
  {
    id: 'lab-004',
    patientId: 'pat-004',
    patientName: 'Sunita Devi',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Sharma',
    testType: 'Thyroid Function',
    date: '2024-01-12',
    status: 'reviewed',
    results: 'TSH elevated, T3/T4 within normal range',
    summary: 'Subclinical hypothyroidism detected',
    urgent: false,
    annotation: 'Monitor thyroid function quarterly'
  },
  {
    id: 'lab-005',
    patientId: 'pat-005',
    patientName: 'Vikram Patel',
    doctorId: 'doc-002',
    doctorName: 'Dr. Priya Johnson',
    testType: 'Cardiac Enzymes',
    date: '2024-01-11',
    status: 'critical',
    results: 'Elevated troponin levels',
    summary: 'Possible cardiac event, immediate attention required',
    urgent: true,
    annotation: 'URGENT: Schedule immediate cardiology consult'
  }
];

// Mock Prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: 'pres-001',
    patientId: 'pat-001',
    patientName: 'Rajesh Kumar',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Sharma',
    medicines: [
      {
        medicineId: 'med-003',
        medicineName: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        quantity: 60
      },
      {
        medicineId: 'med-004',
        medicineName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30
      }
    ],
    date: '2024-01-15',
    status: 'active',
    notes: 'Take with food. Monitor blood pressure daily.'
  },
  {
    id: 'pres-002',
    patientId: 'pat-002',
    patientName: 'Priya Sharma',
    doctorId: 'doc-002',
    doctorName: 'Dr. Priya Johnson',
    medicines: [
      {
        medicineId: 'med-001',
        medicineName: 'Paracetamol',
        dosage: '500mg',
        frequency: 'As needed',
        duration: '7 days',
        quantity: 14
      }
    ],
    date: '2024-01-14',
    status: 'active',
    notes: 'For fever and pain relief. Do not exceed 4g daily.'
  },
  {
    id: 'pres-003',
    patientId: 'pat-003',
    patientName: 'Amit Singh',
    doctorId: 'doc-003',
    doctorName: 'Dr. Amit Brown',
    medicines: [
      {
        medicineId: 'med-002',
        medicineName: 'Amoxicillin',
        dosage: '250mg',
        frequency: 'Three times daily',
        duration: '7 days',
        quantity: 21
      }
    ],
    date: '2024-01-13',
    status: 'active',
    notes: 'Complete full course even if symptoms improve.'
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    patientId: 'pat-001',
    patientName: 'Rajesh Kumar',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Sharma',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'scheduled',
    type: 'follow-up',
    notes: 'Diabetes and hypertension review'
  },
  {
    id: 'appt-002',
    patientId: 'pat-002',
    patientName: 'Priya Sharma',
    doctorId: 'doc-002',
    doctorName: 'Dr. Priya Johnson',
    date: '2024-01-18',
    time: '2:30 PM',
    status: 'confirmed',
    type: 'consultation',
    notes: 'Thyroid function review'
  },
  {
    id: 'appt-003',
    patientId: 'pat-003',
    patientName: 'Amit Singh',
    doctorId: 'doc-003',
    doctorName: 'Dr. Amit Brown',
    date: '2024-01-19',
    time: '11:15 AM',
    status: 'scheduled',
    type: 'follow-up',
    notes: 'Respiratory infection follow-up'
  },
  {
    id: 'appt-004',
    patientId: 'pat-004',
    patientName: 'Sunita Devi',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Sharma',
    date: '2024-01-21',
    time: '4:00 PM',
    status: 'scheduled',
    type: 'consultation',
    notes: 'Arthritis pain management'
  }
];

// Mock Pharmacy Orders
export const mockPharmacyOrders: PharmacyOrder[] = [
  {
    id: 'ord-001',
    prescriptionId: 'pres-001',
    patientId: 'pat-001',
    patientName: 'Rajesh Kumar',
    pharmacyId: 'pharm-001',
    medicines: [
      { medicineId: 'med-003', name: 'Metformin 500mg', quantity: 60, price: 45 },
      { medicineId: 'med-004', name: 'Lisinopril 10mg', quantity: 30, price: 120 }
    ],
    totalAmount: 165,
    status: 'pending',
    orderDate: '2024-01-15',
    deliveryAddress: '123 Main Street, Mumbai',
    phone: '+91 98765 11111'
  },
  {
    id: 'ord-002',
    prescriptionId: 'pres-002',
    patientId: 'pat-002',
    patientName: 'Priya Sharma',
    pharmacyId: 'pharm-001',
    medicines: [
      { medicineId: 'med-001', name: 'Paracetamol 500mg', quantity: 14, price: 15 }
    ],
    totalAmount: 15,
    status: 'confirmed',
    orderDate: '2024-01-14',
    deliveryAddress: '456 Garden Road, Delhi',
    phone: '+91 98765 22222'
  },
  {
    id: 'ord-003',
    prescriptionId: 'pres-003',
    patientId: 'pat-003',
    patientName: 'Amit Singh',
    pharmacyId: 'pharm-001',
    medicines: [
      { medicineId: 'med-002', name: 'Amoxicillin 250mg', quantity: 21, price: 85 }
    ],
    totalAmount: 85,
    status: 'delivered',
    orderDate: '2024-01-13',
    deliveryAddress: '789 Park Lane, Bangalore',
    phone: '+91 98765 33333'
  }
];

// Update patient references with related data
mockPatients[0].labReports = [mockLabReports[0]];
mockPatients[0].prescriptions = [mockPrescriptions[0]];
mockPatients[0].appointments = [mockAppointments[0], mockAppointments[3]];

mockPatients[1].labReports = [mockLabReports[1]];
mockPatients[1].prescriptions = [mockPrescriptions[1]];
mockPatients[1].appointments = [mockAppointments[1]];

mockPatients[2].labReports = [mockLabReports[2]];
mockPatients[2].prescriptions = [mockPrescriptions[2]];
mockPatients[2].appointments = [mockAppointments[2]];

mockPatients[3].labReports = [mockLabReports[3]];
mockPatients[3].appointments = [];

mockPatients[4].labReports = [mockLabReports[4]];