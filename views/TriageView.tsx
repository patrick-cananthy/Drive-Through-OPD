import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { PatientStage, Vitals } from '../types';
import { Activity, Thermometer, Heart, Scale, Clock, AlertCircle, Car } from 'lucide-react';

export const TriageView = () => {
  const { patients, updateVitals } = useHospital();
  
  // Filter patients waiting for triage
  const queue = patients.filter(p => p.stage === PatientStage.TRIAGE);
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [vitals, setVitals] = useState({
    temperature: '',
    systolic: '',
    diastolic: '',
    pulse: '',
    weight: ''
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    const newVitals: Vitals = {
      temperature: parseFloat(vitals.temperature),
      systolic: parseInt(vitals.systolic),
      diastolic: parseInt(vitals.diastolic),
      pulse: parseInt(vitals.pulse),
      weight: parseFloat(vitals.weight),
      timestamp: new Date().toISOString()
    };

    updateVitals(selectedPatientId, newVitals);
    setSelectedPatientId(null);
    setVitals({ temperature: '', systolic: '', diastolic: '', pulse: '', weight: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Queue List */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Car size={18} className="text-blue-500"/>
                Waiting Line
            </h3>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{queue.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {queue.length === 0 ? (
                <div className="text-center p-8 text-gray-400">No vehicles in triage lane.</div>
            ) : (
                queue.map(patient => (
                    <div 
                        key={patient.id} 
                        onClick={() => setSelectedPatientId(patient.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedPatientId === patient.id 
                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                            : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-gray-800">{patient.fullName}</span>
                            <span className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">{patient.queueNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Car size={12}/> {patient.vehiclePlate}</span>
                            <span>{patient.age}yrs / {patient.gender.charAt(0)}</span>
                        </div>
                        {patient.isPriority && (
                            <div className="mt-2 inline-flex items-center gap-1 text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                                <AlertCircle size={12} /> Priority Patient
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Vitals Form */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
        {selectedPatient ? (
            <div className="p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.fullName}</h2>
                        <p className="text-gray-500 flex items-center gap-2">
                            <span>{selectedPatient.opdNumber}</span> • <span>{selectedPatient.vehiclePlate}</span>
                        </p>
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
                        Recording Vitals
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* BP */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <Activity className="text-red-500" size={18}/> Blood Pressure (mmHg)
                            </label>
                            <div className="flex items-center gap-2">
                                <input 
                                    required
                                    type="number" 
                                    placeholder="Sys" 
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none text-center text-lg"
                                    value={vitals.systolic}
                                    onChange={e => setVitals({...vitals, systolic: e.target.value})}
                                />
                                <span className="text-gray-400">/</span>
                                <input 
                                    required
                                    type="number" 
                                    placeholder="Dia" 
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none text-center text-lg"
                                    value={vitals.diastolic}
                                    onChange={e => setVitals({...vitals, diastolic: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Temp */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <Thermometer className="text-orange-500" size={18}/> Temperature (°C)
                            </label>
                            <input 
                                required
                                type="number"
                                step="0.1" 
                                placeholder="36.5" 
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 outline-none text-center text-lg"
                                value={vitals.temperature}
                                onChange={e => setVitals({...vitals, temperature: e.target.value})}
                            />
                        </div>

                        {/* Pulse */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <Heart className="text-pink-500" size={18}/> Pulse (bpm)
                            </label>
                            <input 
                                required
                                type="number" 
                                placeholder="72" 
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-200 outline-none text-center text-lg"
                                value={vitals.pulse}
                                onChange={e => setVitals({...vitals, pulse: e.target.value})}
                            />
                        </div>

                        {/* Weight */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <Scale className="text-blue-500" size={18}/> Weight (kg)
                            </label>
                            <input 
                                required
                                type="number"
                                step="0.1" 
                                placeholder="70.5" 
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none text-center text-lg"
                                value={vitals.weight}
                                onChange={e => setVitals({...vitals, weight: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2">
                            <span>Save & Send to Doctor</span>
                            <Clock size={18} />
                        </button>
                    </div>
                </form>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="text-lg">Select a patient from the waiting line to record vitals.</p>
            </div>
        )}
      </div>
    </div>
  );
};