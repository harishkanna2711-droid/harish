import React from 'react';
import { Bin, BinStatus } from '../types';

interface AssetMapProps {
  bins: Bin[];
}

const AssetMap: React.FC<AssetMapProps> = ({ bins }) => {
  // A conceptual coordinate system 0-100 for the SVG map
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Live Asset Grid</h3>
      <div className="relative w-full h-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden group">
        
        {/* Abstract Map Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
               backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* Bins as Dots */}
        {bins.map((bin) => {
          let colorClass = "bg-emerald-500";
          if (bin.status === BinStatus.WARNING) colorClass = "bg-amber-500";
          if (bin.status === BinStatus.CRITICAL) colorClass = "bg-red-500";

          return (
            <div
              key={bin.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out hover:z-10 cursor-pointer group-hover:scale-100"
              style={{ left: `${bin.coordinates.lng}%`, top: `${bin.coordinates.lat}%` }}
            >
              {/* Pulse effect for critical bins */}
              {bin.status === BinStatus.CRITICAL && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
              )}
              
              {/* The Dot */}
              <div className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow-sm ${colorClass}`}></div>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-48 bg-slate-900 text-white text-xs rounded-md py-2 px-3 opacity-0 hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-20 shadow-xl">
                <p className="font-bold text-emerald-400">{bin.id}</p>
                <p className="truncate">{bin.locationName}</p>
                <div className="mt-1 flex justify-between">
                  <span>Fill: {bin.fillLevel}%</span>
                  <span>{bin.temperature}°C</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Normal</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Warning</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span> Critical</div>
      </div>
    </div>
  );
};

export default AssetMap;