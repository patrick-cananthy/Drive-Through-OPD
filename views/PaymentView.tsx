import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { PatientStage, PaymentMethod } from '../types';
import { CreditCard, Smartphone, Banknote, CheckCircle, Car } from 'lucide-react';

export const PaymentView = () => {
  const { patients, processPayment } = useHospital();
  const queue = patients.filter(p => p.stage === PatientStage.PAYMENT);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handlePay = (method: PaymentMethod) => {
    if (selectedPatientId) {
        processPayment(selectedPatientId, method);
        setSelectedPatientId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Car className="text-green-600"/>
            Payment Queue
        </h2>
        <div className="space-y-3">
            {queue.length === 0 ? <p className="text-gray-400">No pending payments.</p> : queue.map(p => (
                <div 
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all ${selectedPatientId === p.id ? 'border-green-500 bg-green-50' : 'hover:border-green-300'}`}
                >
                    <div>
                        <div className="font-bold">{p.fullName}</div>
                        <div className="text-sm text-gray-500">{p.vehiclePlate}</div>
                    </div>
                    <div className="font-bold text-lg text-gray-800">
                        GHS {p.totalBill.toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Action */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {selectedPatient ? (
            <div className="flex flex-col h-full">
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Invoice For</h3>
                    <h2 className="text-2xl font-bold">{selectedPatient.fullName}</h2>
                    <p className="text-gray-600">{selectedPatient.opdNumber}</p>
                </div>

                <div className="flex-1">
                    <h4 className="font-bold mb-3">Bill Breakdown</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6 text-sm">
                        {selectedPatient.prescriptions.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.drugName} (x{item.quantity})</span>
                                <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-base">
                            <span>Total Due</span>
                            <span>GHS {selectedPatient.totalBill.toFixed(2)}</span>
                        </div>
                    </div>

                    <h4 className="font-bold mb-3">Select Payment Method</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <button 
                            onClick={() => handlePay(PaymentMethod.MOMO_MTN)}
                            className="p-4 border border-yellow-400 bg-yellow-50 rounded-lg flex items-center gap-3 font-semibold hover:bg-yellow-100 transition-colors"
                        >
                            <div className="bg-yellow-400 p-2 rounded text-white"><Smartphone size={20}/></div>
                            MTN Mobile Money
                        </button>
                        <button 
                            onClick={() => handlePay(PaymentMethod.MOMO_VODA)}
                            className="p-4 border border-red-400 bg-red-50 rounded-lg flex items-center gap-3 font-semibold hover:bg-red-100 transition-colors"
                        >
                            <div className="bg-red-500 p-2 rounded text-white"><Smartphone size={20}/></div>
                            Vodafone Cash
                        </button>
                        <button 
                            onClick={() => handlePay(PaymentMethod.CASH)}
                            className="p-4 border border-gray-300 bg-gray-50 rounded-lg flex items-center gap-3 font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <div className="bg-gray-600 p-2 rounded text-white"><Banknote size={20}/></div>
                            Cash Payment
                        </button>
                        <button 
                            onClick={() => handlePay(PaymentMethod.NHIS)}
                            className="p-4 border border-blue-300 bg-blue-50 rounded-lg flex items-center gap-3 font-semibold hover:bg-blue-100 transition-colors"
                        >
                            <div className="bg-blue-600 p-2 rounded text-white"><CreditCard size={20}/></div>
                            NHIS Claim (Processing)
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Banknote size={48} className="mb-4 opacity-20"/>
                <p>Select a vehicle to process payment.</p>
            </div>
        )}
      </div>
    </div>
  );
};
