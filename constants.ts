import { Patient, PatientStage } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    opdNumber: 'OPD-23-001',
    nhisNumber: '12345678',
    fullName: 'Kwame Mensah',
    age: 45,
    gender: 'Male',
    vehiclePlate: 'GT-2023-23',
    stage: PatientStage.TRIAGE,
    queueNumber: 'A001',
    arrivalTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    prescriptions: [],
    paymentStatus: 'Pending',
    totalBill: 0,
    isPriority: false,
  },
  {
    id: '2',
    opdNumber: 'OPD-23-005',
    nhisNumber: '87654321',
    fullName: 'Ama Serwaa',
    age: 68,
    gender: 'Female',
    vehiclePlate: 'AS-550-20',
    stage: PatientStage.CONSULTATION,
    queueNumber: 'A002',
    arrivalTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    vitals: {
      temperature: 36.5,
      systolic: 140,
      diastolic: 90,
      pulse: 78,
      weight: 70,
      timestamp: new Date().toISOString(),
    },
    prescriptions: [],
    paymentStatus: 'Pending',
    totalBill: 0,
    isPriority: true, // Elderly
  },
  {
    id: '3',
    opdNumber: 'OPD-23-012',
    fullName: 'Kofi Boateng',
    age: 32,
    gender: 'Male',
    vehiclePlate: 'GW-999-19',
    stage: PatientStage.PHARMACY,
    queueNumber: 'A003',
    arrivalTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    vitals: {
      temperature: 38.2,
      systolic: 120,
      diastolic: 80,
      pulse: 95,
      weight: 80,
      timestamp: new Date().toISOString(),
    },
    symptoms: 'Headache, Fever, Body pains',
    diagnosis: 'Malaria +',
    prescriptions: [
      { id: 'p1', drugName: 'Artemether-Lumefantrine', dosage: '20/120mg', quantity: 1, price: 45, dispensed: false },
      { id: 'p2', drugName: 'Paracetamol', dosage: '500mg', quantity: 20, price: 15, dispensed: false }
    ],
    paymentStatus: 'Paid',
    paymentMethod: undefined,
    totalBill: 60,
    isPriority: false,
  }
];

export const COMMON_DRUGS = [
  { name: 'Paracetamol 500mg', price: 10 },
  { name: 'Amoxicillin 500mg', price: 25 },
  { name: 'Ibuprofen 400mg', price: 15 },
  { name: 'Artemether-Lumefantrine', price: 45 },
  { name: 'Cetirizine 10mg', price: 12 },
  { name: 'Ciprofloxacin 500mg', price: 30 },
  { name: 'ORS Sachet', price: 5 },
  { name: 'Multivitamin Syrup', price: 35 },
];
