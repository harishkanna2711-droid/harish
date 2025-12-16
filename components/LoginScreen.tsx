import React, { useState } from 'react';
import { Trash2, ShieldCheck, User, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'staff' | 'citizen') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'citizen'>('staff');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <Trash2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">WasteAI Studio</h1>
        <p className="text-slate-400 mt-2">Intelligent Waste Management Platform</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'staff' 
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-500' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Staff Portal
          </button>
          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'citizen' 
                ? 'bg-white text-blue-600 border-b-2 border-blue-500' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            Citizen Report
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'staff' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Employee ID</label>
                <input 
                  type="text" 
                  defaultValue="ADMIN-001"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <input 
                  type="password" 
                  defaultValue="password"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-800"
                />
              </div>
              <button 
                onClick={() => onLogin('staff')}
                className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                Access Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-center text-slate-400 mt-4">Authorized personnel only. All actions are logged.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Help Keep Your City Clean</h3>
                <p className="text-sm text-slate-500">
                  Report overflowing bins, illegal dumping, or request pickups directly from your phone.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
                <p className="flex items-start gap-2">
                  <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  Take a photo of the issue.
                </p>
                <p className="flex items-start gap-2 mt-2">
                   <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                   Our AI will analyze the waste type.
                </p>
                <p className="flex items-start gap-2 mt-2">
                   <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                   GPS location is automatically tagged.
                </p>
              </div>

              <button 
                onClick={() => onLogin('citizen')}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                Start Reporting
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;