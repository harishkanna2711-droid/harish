import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIOptimizer from './components/AIOptimizer';
import LoginScreen from './components/LoginScreen';
import CitizenPortal from './components/CitizenPortal';
import ReportsModule from './components/ReportsModule';
import { INITIAL_BINS, MOCK_KPI, MOCK_REPORTS } from './constants';
import { Bin, CitizenReport, ReportStatus } from './types';
import { MessageCircle, X, ArrowRight } from 'lucide-react';
import { chatWithAssistant } from './services/geminiService';

type UserRole = 'staff' | 'citizen' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [bins, setBins] = useState<Bin[]>(INITIAL_BINS);
  const [reports, setReports] = useState<CitizenReport[]>(MOCK_REPORTS);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([
    { role: 'model', parts: [{ text: "Hello! I'm your WasteAI Assistant. How can I help you with fleet operations today?" }] }
  ]);
  const [isChatting, setIsChatting] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBins(currentBins => 
        currentBins.map(bin => {
            // Randomly increase fill level slightly to simulate trash accumulation
            if (bin.status !== 'SERVICED') {
                const increase = Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0;
                let newFill = bin.fillLevel + increase;
                if (newFill > 100) newFill = 100;
                
                // Update Status based on new fill
                let newStatus = bin.status;
                if (newFill > 90) newStatus = 'CRITICAL';
                else if (newFill > 70) newStatus = 'WARNING';

                return { ...bin, fillLevel: newFill, status: newStatus as any };
            }
            return bin;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', parts: [{ text: chatMessage }] }];
    setChatHistory(newHistory);
    setChatMessage("");
    setIsChatting(true);

    const response = await chatWithAssistant(newHistory, chatMessage);
    
    setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsChatting(false);
  };

  const handleAddReport = (newReport: Omit<CitizenReport, 'id' | 'timestamp' | 'status'>) => {
    const report: CitizenReport = {
        ...newReport,
        id: `REP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        status: 'OPEN'
    };
    setReports(prev => [report, ...prev]);
  };

  const handleUpdateReportStatus = (id: string, status: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const renderAdminContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard bins={bins} kpi={MOCK_KPI} />;
      case 'routes':
        return <AIOptimizer bins={bins} />;
      case 'citizen-reports':
        return <ReportsModule reports={reports} onUpdateStatus={handleUpdateReportStatus} />;
      case 'assets':
        // Reuse Dashboard for simplicity in this demo, or filter to just list
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Asset Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bins.map(bin => (
                        <div key={bin.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">{bin.id}</span>
                                <span className="text-sm text-slate-500">{bin.type}</span>
                            </div>
                            <p className="text-slate-700 text-sm mb-3">{bin.locationName}</p>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                                <div className={`h-2.5 rounded-full ${bin.fillLevel > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${bin.fillLevel}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Fill: {bin.fillLevel}%</span>
                                <span>Temp: {bin.temperature}°C</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[50vh] text-slate-400">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
                <p>This module is under development.</p>
            </div>
          </div>
        );
    }
  };

  // 1. Auth check
  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }

  // 2. Citizen View
  if (userRole === 'citizen') {
    return <CitizenPortal onLogout={() => setUserRole(null)} onSubmitReport={handleAddReport} />;
  }

  // 3. Staff/Admin View
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 ml-64 p-8 relative">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 capitalize">
                {currentView.replace('-', ' ')}
            </h1>
            <p className="text-slate-500 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-medium text-slate-600">System Online</span>
            </div>
            <button 
                onClick={() => setUserRole(null)}
                className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm hover:bg-slate-300 transition-colors"
                title="Log Out"
            >
                AD
            </button>
          </div>
        </header>

        {renderAdminContent()}

        {/* Floating Chat Button (Admin only) */}
        <div className="fixed bottom-8 right-8 z-50">
            {!chatOpen && (
                <button 
                    onClick={() => setChatOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}
            
            {chatOpen && (
                <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                             <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                             WasteAI Assistant
                        </h3>
                        <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-emerald-600 text-white rounded-br-none' 
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.parts[0].text}
                                </div>
                            </div>
                        ))}
                        {isChatting && (
                             <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-100">
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full pl-4 pr-10 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                placeholder="Ask about schedules, alerts..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-1.5 p-1 bg-slate-900 rounded-full text-white hover:bg-slate-700 disabled:opacity-50">
                                <ArrowRight className="w-3 h-3" />
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default App;