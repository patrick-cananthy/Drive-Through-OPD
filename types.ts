import React from 'react';

export enum Role {
  REGISTRATION = 'Registration',
  NURSE = 'Nurse (Triage)',
  DOCTOR = 'Doctor',
  PHARMACY = 'Pharmacy',
  CASHIER = 'Cashier',
  ADMIN = 'Administrator'
}

export enum PatientStage {
  REGISTRATION = 'Registration',
  TRIAGE = 'Triage',
  CONSULTATION = 'Consultation',
  PAYMENT = 'Payment',
  PHARMACY = 'Pharmacy',
  COMPLETED = 'Completed'
}

export enum PaymentMethod {
  CASH = 'Cash',
  MOMO_MTN = 'MTN Mobile Money',
  MOMO_VODA = 'Vodafone Cash',
  MOMO_AT = 'AirtelTigo Money',
  NHIS = 'NHIS Claim',
  POS = 'Card / POS'
}

export interface Vitals {
  temperature?: number;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  weight?: number;
  notes?: string;
  timestamp: string;
}

export interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
  quantity: number;
  price: number;
  dispensed: boolean;
}

export interface Patient {
  id: string;
  opdNumber: string;
  nhisNumber?: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female';
  vehiclePlate: string;
  stage: PatientStage;
  queueNumber: string;
  arrivalTime: string;
  vitals?: Vitals;
  symptoms?: string;
  diagnosis?: string;
  prescriptions: PrescriptionItem[];
  paymentStatus: 'Pending' | 'Paid' | 'Waived';
  paymentMethod?: PaymentMethod;
  totalBill: number;
  isPriority: boolean; // Elderly, Pregnant, etc.
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}