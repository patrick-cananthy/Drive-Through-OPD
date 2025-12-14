import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { PatientStage } from '../types';
import { Pill, CheckCircle, Package } from 'lucide-react';

export const PharmacyView = () => {
  const { patients, dispenseMedication } = useHospital();
  const queue = patients.filter(p => p.stage === PatientStage.PHARMACY);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-teal-700">
            <Pill/> Pharmacy Queue
        </h2>
        <div className="space-y-3">
            {queue.length === 0 ? <p className="text-gray-400">No prescriptions waiting.</p> : queue.map(p => (
                <div 
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                        selectedPatientId === p.id ? 'border-teal-500 bg-teal-50' : 'hover:border-teal-300'
                    }`}
                >
                    <div>
                        <div className="font-bold text-gray-800">{p.fullName}</div>
                        <div className="text-xs text-green-600 font-bold uppercase">{p.paymentMethod} • Confirmed</div>
                    </div>
                    <div className="text-gray-400">
                        <Package size={20}/>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {selectedPatient ? (
            <div>
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.fullName}</h2>
                        <div className="text-sm text-gray-500">Diagnosis: {selectedPatient.diagnosis}</div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        PAID
                    </div>
                </div>

                <h3 className="font-bold text-gray-700 mb-4">Medications to Dispense</h3>
                
                <div className="space-y-3">
                    {selectedPatient.prescriptions.map(drug => (
                        <div key={drug.id} className={`p-4 border rounded-lg flex items-center justify-between ${drug.dispensed ? 'bg-gray-50 opacity-70' : 'bg-white border-gray-200'}`}>
                            <div>
                                <div className="font-bold text-lg">{drug.drugName}</div>
                                <div className="text-sm text-gray-600">Dosage: {drug.dosage}</div>
                                <div className="text-sm text-gray-600">Qty: {drug.quantity}</div>
                            </div>
                            <button
                                disabled={drug.dispensed}
                                onClick={() => dispenseMedication(selectedPatient.id, drug.id)}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                    drug.dispensed 
                                    ? 'bg-gray-200 text-gray-500 cursor-default' 
                                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                                }`}
                            >
                                {drug.dispensed ? (
                                    <>Dispensed <CheckCircle size={16}/></>
                                ) : (
                                    <>Dispense</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                
                {selectedPatient.prescriptions.every(d => d.dispensed) && (
                    <div className="mt-8 p-4 bg-green-50 text-green-800 rounded-lg text-center font-bold animate-pulse">
                        All medications dispensed. Patient can exit.
                    </div>
                )}
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <Pill size={48} className="mb-4 opacity-20"/>
                <p>Select a patient to dispense medication.</p>
            </div>
        )}
      </div>
    </div>
  );
};
