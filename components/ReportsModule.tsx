import React from 'react';
import { CitizenReport, ReportStatus } from '../types';
import { MapPin, Calendar, CheckCircle, Clock, AlertCircle, Eye, Trash2 } from 'lucide-react';

interface ReportsModuleProps {
  reports: CitizenReport[];
  onUpdateStatus: (id: string, status: ReportStatus) => void;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ reports, onUpdateStatus }) => {
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-700 border-red-200';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
     switch (status) {
      case 'OPEN': return <AlertCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Citizen Reports</h2>
          <p className="text-slate-500 text-sm">Review and dispatch issues reported by the community.</p>
        </div>
        <div className="flex gap-2">
            <div className="text-center px-4 border-r border-slate-200">
                <span className="block text-2xl font-bold text-red-600">{reports.filter(r => r.status === 'OPEN').length}</span>
                <span className="text-xs text-slate-500 uppercase font-bold">Open</span>
            </div>
            <div className="text-center px-4">
                <span className="block text-2xl font-bold text-emerald-600">{reports.filter(r => r.status === 'RESOLVED').length}</span>
                <span className="text-xs text-slate-500 uppercase font-bold">Resolved</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-md">
            
            {/* Image Section */}
            <div className="relative h-48 bg-slate-100 group">
              <img 
                src={report.imageUrl} 
                alt="Evidence" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)} shadow-sm`}>
                   {getStatusIcon(report.status)}
                   {report.status}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-slate-200">
                    <Eye className="w-4 h-4" /> View Full Image
                 </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                 <div>
                    <span className="text-xs text-slate-400 font-mono">{report.id}</span>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{report.description}</h3>
                 </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(report.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{report.location}</span>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 flex-1">
                 <p className="text-xs font-bold text-indigo-600 mb-1 uppercase">AI Analysis</p>
                 <p className="text-sm text-slate-600 leading-snug">{report.aiAnalysis}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                {report.status !== 'RESOLVED' ? (
                   <>
                     <button 
                        onClick={() => onUpdateStatus(report.id, 'IN_PROGRESS')}
                        disabled={report.status === 'IN_PROGRESS'}
                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 disabled:opacity-50"
                     >
                        Dispatch
                     </button>
                     <button 
                        onClick={() => onUpdateStatus(report.id, 'RESOLVED')}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                     >
                        Resolve
                     </button>
                   </>
                ) : (
                    <div className="col-span-2 text-center text-sm text-emerald-600 font-medium py-2 bg-emerald-50 rounded-lg">
                        Case Closed
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                <p>No active reports found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReportsModule;