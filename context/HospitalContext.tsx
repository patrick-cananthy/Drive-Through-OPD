import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, PatientStage, Role, Vitals, PrescriptionItem, PaymentMethod } from '../types';
import { MOCK_PATIENTS } from '../constants';

interface HospitalContextType {
  patients: Patient[];
  currentRole: Role;
  setRole: (role: Role) => void;
  addPatient: (patient: Patient) => void;
  updatePatientStage: (id: string, stage: PatientStage) => void;
  updateVitals: (id: string, vitals: Vitals) => void;
  updateClinicalNotes: (id: string, diagnosis: string, symptoms: string, prescriptions: PrescriptionItem[]) => void;
  processPayment: (id: string, method: PaymentMethod) => void;
  dispenseMedication: (patientId: string, drugId: string) => void;
  getPatientsByStage: (stage: PatientStage) => Patient[];
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider = ({ children }: { children?: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [currentRole, setRole] = useState<Role>(Role.REGISTRATION);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatientStage = (id: string, stage: PatientStage) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, stage } : p));
  };

  const updateVitals = (id: string, vitals: Vitals) => {
    setPatients(prev => prev.map(p => 
      p.id === id ? { ...p, vitals, stage: PatientStage.CONSULTATION } : p
    ));
  };

  const updateClinicalNotes = (
    id: string, 
    diagnosis: string, 
    symptoms: string, 
    prescriptions: PrescriptionItem[]
  ) => {
    const totalBill = prescriptions.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setPatients(prev => prev.map(p => 
      p.id === id ? { 
        ...p, 
        diagnosis, 
        symptoms, 
        prescriptions, 
        totalBill,
        stage: PatientStage.PAYMENT 
      } : p
    ));
  };

  const processPayment = (id: string, method: PaymentMethod) => {
    setPatients(prev => prev.map(p => 
      p.id === id ? { 
        ...p, 
        paymentStatus: 'Paid', 
        paymentMethod: method, 
        stage: PatientStage.PHARMACY 
      } : p
    ));
  };

  const dispenseMedication = (patientId: string, drugId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      
      const updatedPrescriptions = p.prescriptions.map(drug => 
        drug.id === drugId ? { ...drug, dispensed: true } : drug
      );

      const allDispensed = updatedPrescriptions.every(d => d.dispensed);
      
      return {
        ...p,
        prescriptions: updatedPrescriptions,
        stage: allDispensed ? PatientStage.COMPLETED : p.stage
      };
    }));
  };

  const getPatientsByStage = (stage: PatientStage) => {
    return patients.filter(p => p.stage === stage);
  };

  return (
    <HospitalContext.Provider value={{
      patients,
      currentRole,
      setRole,
      addPatient,
      updatePatientStage,
      updateVitals,
      updateClinicalNotes,
      processPayment,
      dispenseMedication,
      getPatientsByStage
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};