import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Patient, PatientStage } from '../types';
import { Search, Plus, UserPlus, Car } from 'lucide-react';

export const RegistrationView = () => {
  const { addPatient } = useHospital();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    nhisNumber: '',
    vehiclePlate: '',
    isPriority: false,
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const patient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      opdNumber: `OPD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      fullName: newPatient.fullName,
      age: parseInt(newPatient.age),
      gender: newPatient.gender as 'Male' | 'Female',
      nhisNumber: newPatient.nhisNumber,
      vehiclePlate: newPatient.vehiclePlate.toUpperCase(),
      stage: PatientStage.TRIAGE, // Moves to Triage immediately
      queueNumber: `A${Math.floor(Math.random() * 900) + 100}`,
      arrivalTime: new Date().toISOString(),
      prescriptions: [],
      paymentStatus: 'Pending',
      totalBill: 0,
      isPriority: newPatient.isPriority,
    };

    addPatient(patient);
    setShowModal(false);
    setNewPatient({ fullName: '', age: '', gender: 'Male', nhisNumber: '', vehiclePlate: '', isPriority: false });
    alert(`Patient Registered!\nQueue Number: ${patient.queueNumber}\nProceed to Vitals Lane.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient Registration</h2>
          <p className="text-gray-500">Check-in arriving vehicles and verify NHIS details.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          <span>New Arrival</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by OPD #, NHIS #, or Vehicle Plate..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Placeholder for search results */}
        {search && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
            No active patients found matching "{search}" in the last 24 hours. 
            <br />
            <button onClick={() => setShowModal(true)} className="text-blue-600 font-medium hover:underline mt-1">Register new patient?</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 mb-2">Registration Tips</h3>
          <ul className="text-sm text-indigo-800 space-y-2 list-disc list-inside">
            <li>Verify NHIS expiry dates immediately.</li>
            <li>Tag elderly patients as <strong>Priority</strong>.</li>
            <li>Ensure vehicle plate is accurate for lane management.</li>
          </ul>
        </div>
      </div>

      {/* New Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="bg-blue-600 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="text-blue-200" />
                Register New Arrival
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleRegister} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Car className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      required 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg uppercase font-mono tracking-wider focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. GT-2023-24"
                      value={newPatient.vehiclePlate}
                      onChange={(e) => setNewPatient({...newPatient, vehiclePlate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={newPatient.fullName}
                    onChange={(e) => setNewPatient({...newPatient, fullName: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input 
                            required 
                            type="number" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={newPatient.age}
                            onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={newPatient.gender}
                            onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NHIS Number (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="8 digits"
                    value={newPatient.nhisNumber}
                    onChange={(e) => setNewPatient({...newPatient, nhisNumber: e.target.value})}
                  />
                </div>

                <div className="flex items-center pt-6">
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            checked={newPatient.isPriority}
                            onChange={(e) => setNewPatient({...newPatient, isPriority: e.target.checked})}
                        />
                        <span className="ml-2 text-gray-800 font-medium">Priority Patient (Elderly/Pregnant)</span>
                    </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-colors">Check-In</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
