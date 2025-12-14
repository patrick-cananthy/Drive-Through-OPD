import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { Role } from '../types';
import { 
  Activity, 
  Users, 
  Stethoscope, 
  Pill, 
  CreditCard, 
  LayoutDashboard,
  Menu,
  Car
} from 'lucide-react';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  isActive: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { currentRole, setRole } = useHospital();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const roles = Object.values(Role);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Car className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight">Drive-Through</h1>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">OPD System</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">My Workstation</h3>
            <SidebarItem 
              icon={Users} 
              label="Registration" 
              isActive={currentRole === Role.REGISTRATION} 
              onClick={() => setRole(Role.REGISTRATION)} 
            />
            <SidebarItem 
              icon={Activity} 
              label="Triage / Vitals" 
              isActive={currentRole === Role.NURSE} 
              onClick={() => setRole(Role.NURSE)} 
            />
            <SidebarItem 
              icon={Stethoscope} 
              label="Consultation" 
              isActive={currentRole === Role.DOCTOR} 
              onClick={() => setRole(Role.DOCTOR)} 
            />
            <SidebarItem 
              icon={Pill} 
              label="Pharmacy" 
              isActive={currentRole === Role.PHARMACY} 
              onClick={() => setRole(Role.PHARMACY)} 
            />
            <SidebarItem 
              icon={CreditCard} 
              label="Cashier" 
              isActive={currentRole === Role.CASHIER} 
              onClick={() => setRole(Role.CASHIER)} 
            />
          </div>

          <div>
             <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">Management</h3>
             <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              isActive={currentRole === Role.ADMIN} 
              onClick={() => setRole(Role.ADMIN)} 
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Current User Role</div>
          <div className="font-bold text-gray-800">{currentRole}</div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Online
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <Car className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-800">DT-OPD</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl z-10 border-b border-gray-200">
            <div className="p-4 space-y-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setRole(role);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg ${
                    currentRole === role ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};