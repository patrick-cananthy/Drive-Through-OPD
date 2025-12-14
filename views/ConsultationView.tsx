import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { PatientStage, PrescriptionItem } from '../types';
import { COMMON_DRUGS } from '../constants';
import { analyzePatientCondition } from '../services/geminiService';
import { Stethoscope, FileText, Plus, Trash2, Brain, Loader2, Wand2 } from 'lucide-react';

export const ConsultationView = () => {
  const { patients, updateClinicalNotes } = useHospital();
  
  const queue = patients.filter(p => p.stage === PatientStage.CONSULTATION);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionList, setPrescriptionList] = useState<PrescriptionItem[]>([]);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [diagnosisSuggestions, setDiagnosisSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleAddDrug = (drugName: string, price: number) => {
    const newItem: PrescriptionItem = {
      id: Math.random().toString(36).substr(2, 9),
      drugName,
      dosage: '1 tab daily', // Default
      quantity: 1,
      price,
      dispensed: false
    };
    setPrescriptionList([...prescriptionList, newItem]);
  };

  const handleRemoveDrug = (id: string) => {
    setPrescriptionList(prescriptionList.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setPrescriptionList(prescriptionList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAiConsult = async () => {
    if (!selectedPatient) return;
    setIsAiLoading(true);
    setAiAnalysis(null);
    setDiagnosisSuggestions([]);
    
    const result = await analyzePatientCondition(
        selectedPatient.age,
        selectedPatient.gender,
        symptoms,
        selectedPatient.vitals
    );
    
    setAiAnalysis(result.analysis);
    setDiagnosisSuggestions(result.suggestions);
    setIsAiLoading(false);
  };

  const handleFinish = () => {
    if (selectedPatientId) {
        updateClinicalNotes(selectedPatientId, diagnosis, symptoms, prescriptionList);
        setSelectedPatientId(null);
        setSymptoms('');
        setDiagnosis('');
        setPrescriptionList([]);
        setAiAnalysis(null);
        setDiagnosisSuggestions([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Patient List */}
      <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-700">Waiting for Doctor</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {queue.map(patient => (
                <div 
                    key={patient.id} 
                    onClick={() => {
                        setSelectedPatientId(patient.id);
                        setAiAnalysis(null);
                        setDiagnosisSuggestions([]);
                        setSymptoms('');
                        setDiagnosis('');
                        setPrescriptionList([]);
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPatientId === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                >
                    <div className="font-bold text-gray-800">{patient.fullName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        BP: {patient.vitals?.systolic}/{patient.vitals?.diastolic} • T: {patient.vitals?.temperature}
                    </div>
                </div>
            ))}
            {queue.length === 0 && <div className="text-center p-8 text-gray-400">No patients waiting.</div>}
        </div>
      </div>

      {/* Clinical Workspace */}
      <div className="lg:col-span-9 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {selectedPatient ? (
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{selectedPatient.fullName}</h2>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                            <span><strong>Age:</strong> {selectedPatient.age}</span>
                            <span><strong>Vitals:</strong> {selectedPatient.vitals?.systolic}/{selectedPatient.vitals?.diastolic}mmHg, {selectedPatient.vitals?.temperature}°C</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clinical Notes */}
                        <div className="space-y-4">
                            <div className="flex flex-col h-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms & History</label>
                                <textarea 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-60 resize-none"
                                    placeholder="Patient complaints..."
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                />
                            </div>
                            
                            {/* AI Assist Button */}
                            <div className="flex flex-col gap-2">
                                <button 
                                    type="button"
                                    disabled={!symptoms || isAiLoading}
                                    onClick={handleAiConsult}
                                    className="self-start text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-purple-200 transition-colors disabled:opacity-50"
                                >
                                    {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <Brain size={16}/>}
                                    Analyze & Suggest Diagnoses
                                </button>
                                
                                {aiAnalysis && (
                                    <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm text-gray-800 whitespace-pre-line animate-fadeIn">
                                        <div className="font-bold text-purple-800 mb-1">AI Recommendation:</div>
                                        {aiAnalysis}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    Diagnosis (ICD-10) 
                                    {diagnosisSuggestions.length > 0 && <span className="text-xs font-normal text-gray-500">(Click a tag to select)</span>}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Malaria, URI..."
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                    />
                                    {isAiLoading && <Loader2 size={16} className="absolute right-3 top-3.5 text-gray-400 animate-spin"/>}
                                </div>
                                
                                {diagnosisSuggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {diagnosisSuggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setDiagnosis(suggestion)}
                                                className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all shadow-sm"
                                            >
                                                <Wand2 size={10} />
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prescription Pad */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col h-full">
                            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText size={18}/> e-Prescription
                            </h3>
                            
                            <div className="mb-4">
                                <select 
                                    className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-sm"
                                    onChange={(e) => {
                                        if(e.target.value) {
                                            const [name, price] = e.target.value.split('|');
                                            handleAddDrug(name, parseFloat(price));
                                            e.target.value = '';
                                        }
                                    }}
                                >
                                    <option value="">+ Add Medication</option>
                                    {COMMON_DRUGS.map(drug => (
                                        <option key={drug.name} value={`${drug.name}|${drug.price}`}>
                                            {drug.name} (GHS {drug.price})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2">
                                {prescriptionList.map(item => (
                                    <div key={item.id} className="bg-white p-2 rounded border border-gray-200 text-sm">
                                        <div className="flex justify-between font-medium">
                                            <span>{item.drugName}</span>
                                            <button onClick={() => handleRemoveDrug(item.id)} className="text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <input 
                                                type="text" 
                                                className="border rounded px-2 py-1 text-xs" 
                                                value={item.dosage} 
                                                onChange={(e) => handleUpdateItem(item.id, 'dosage', e.target.value)}
                                            />
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500">Qty:</span>
                                                <input 
                                                    type="number" 
                                                    className="border rounded px-1 py-1 text-xs w-12" 
                                                    value={item.quantity} 
                                                    onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between font-bold text-gray-800">
                                    <span>Total Est. Cost:</span>
                                    <span>GHS {prescriptionList.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
                    <button 
                        onClick={handleFinish}
                        disabled={!diagnosis || prescriptionList.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sign & Send to Pharmacy
                    </button>
                </div>
            </div>
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
                <Stethoscope size={64} className="opacity-20 mb-4"/>
            </div>
        )}
      </div>
    </div>
  );
};