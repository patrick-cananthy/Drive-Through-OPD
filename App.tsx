import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Layout } from './components/Layout';
import { Role } from './types';

// Views
import { RegistrationView } from './views/RegistrationView';
import { TriageView } from './views/TriageView';
import { ConsultationView } from './views/ConsultationView';
import { PharmacyView } from './views/PharmacyView';
import { PaymentView } from './views/PaymentView';
import { DashboardView } from './views/DashboardView';

const ViewRouter = () => {
  const { currentRole } = useHospital();

  switch (currentRole) {
    case Role.REGISTRATION:
      return <RegistrationView />;
    case Role.NURSE:
      return <TriageView />;
    case Role.DOCTOR:
      return <ConsultationView />;
    case Role.PHARMACY:
      return <PharmacyView />;
    case Role.CASHIER:
      return <PaymentView />;
    case Role.ADMIN:
      return <DashboardView />;
    default:
      return <div className="p-8 text-center text-gray-500">Select a role to begin.</div>;
  }
};

const App = () => {
  return (
    <HospitalProvider>
      <Layout>
        <ViewRouter />
      </Layout>
    </HospitalProvider>
  );
};

export default App;
