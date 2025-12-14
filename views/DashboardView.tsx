import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { PatientStage } from '../types';
import { Users, Activity, DollarSign, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-4 rounded-full ${color}`}>
        <Icon size={24} className="text-white"/>
    </div>
    <div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  </div>
);

export const DashboardView = () => {
  const { patients } = useHospital();
  
  const totalPatients = patients.length;
  const pendingTriage = patients.filter(p => p.stage === PatientStage.TRIAGE).length;
  const completed = patients.filter(p => p.stage === PatientStage.COMPLETED).length;
  const totalRevenue = patients.reduce((acc, p) => acc + (p.paymentStatus === 'Paid' ? p.totalBill : 0), 0);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Hospital Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Arrivals" value={totalPatients} color="bg-blue-500" />
        <StatCard icon={Activity} label="Pending Triage" value={pendingTriage} color="bg-orange-500" />
        <StatCard icon={DollarSign} label="Revenue (GHS)" value={totalRevenue.toFixed(2)} color="bg-green-500" />
        <StatCard icon={Clock} label="Avg. Wait Time" value="12m" color="bg-purple-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4">Patient Flow Status</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="p-3">Vehicle</th>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Stage</th>
                        <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {patients.slice().reverse().map(p => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-mono">{p.vehiclePlate}</td>
                            <td className="p-3">{p.fullName}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    p.stage === PatientStage.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {p.stage}
                                </span>
                            </td>
                            <td className="p-3 text-gray-500">
                                {new Date(p.arrivalTime).toLocaleTimeString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
