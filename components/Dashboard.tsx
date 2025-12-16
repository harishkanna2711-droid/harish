import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Activity, Battery, TrendingUp, AlertTriangle } from 'lucide-react';
import { Bin, KPI } from '../types';
import { WEEKLY_DATA } from '../constants';
import AssetMap from './AssetMap';

interface DashboardProps {
  bins: Bin[];
  kpi: KPI;
}

const Dashboard: React.FC<DashboardProps> = ({ bins, kpi }) => {
  const criticalCount = bins.filter(b => b.fillLevel > 80).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Collected</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpi.totalWasteCollected}t</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Efficiency</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpi.routeEfficiency}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Critical Bins</p>
            <h3 className="text-2xl font-bold text-slate-800">{criticalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-lg">
            <Battery className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Carbon Offset</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpi.carbonOffset} kg</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Map View */}
        <div className="lg:col-span-1 h-full">
           <AssetMap bins={bins} />
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Weekly Collection Efficiency</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-md px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="waste" name="Waste (Tons)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="efficiency" name="Efficiency %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alert List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Alerts</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="uppercase tracking-wider border-b border-slate-200 bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th scope="col" className="px-6 py-4">Bin ID</th>
                        <th scope="col" className="px-6 py-4">Location</th>
                        <th scope="col" className="px-6 py-4">Type</th>
                        <th scope="col" className="px-6 py-4">Issue</th>
                        <th scope="col" className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bins.filter(b => b.status !== 'NORMAL').map((bin) => (
                        <tr key={bin.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800">{bin.id}</td>
                            <td className="px-6 py-4 text-slate-600">{bin.locationName}</td>
                            <td className="px-6 py-4 text-slate-600">{bin.type}</td>
                            <td className="px-6 py-4">
                                {bin.fillLevel > 80 && <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> Overflow Risk ({bin.fillLevel}%)</span>}
                                {bin.temperature > 30 && <span className="text-amber-600 flex items-center gap-1"><Activity size={14}/> High Temp ({bin.temperature}°C)</span>}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    bin.status === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {bin.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {bins.filter(b => b.status !== 'NORMAL').length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No active alerts. All systems nominal.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;