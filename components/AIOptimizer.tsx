import React, { useState } from 'react';
import { Bot, MapPin, ArrowRight, Loader2, Play, Truck } from 'lucide-react';
import { Bin } from '../types';
import { generateOptimizationReport, OptimizationResult } from '../services/geminiService';

interface AIOptimizerProps {
  bins: Bin[];
}

const AIOptimizer: React.FC<AIOptimizerProps> = ({ bins }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleOptimization = async () => {
    setLoading(true);
    try {
      // Simulate network delay for UX if API is too fast, or real call
      const data = await generateOptimizationReport(bins);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const criticalBins = bins.filter(b => b.fillLevel > 60 || b.temperature > 30);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel: Context */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">AI Route Dispatcher</h2>
              <p className="text-sm text-slate-500">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>

          <p className="text-slate-600 mb-6">
            The system has detected <strong className="text-slate-900">{criticalBins.length} priority locations</strong> requiring immediate service based on predictive fill-levels and sensor anomalies.
          </p>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Priority Queue</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {criticalBins.map(bin => (
                <div key={bin.id} className="flex justify-between items-center bg-white p-3 rounded border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700">{bin.locationName}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    bin.fillLevel > 80 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {bin.fillLevel}% Full
                  </span>
                </div>
              ))}
              {criticalBins.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No critical bins detected.</p>
              )}
            </div>
          </div>

          <button
            onClick={handleOptimization}
            disabled={loading || criticalBins.length === 0}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-4 rounded-lg font-semibold transition-all shadow-lg active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing Sensors...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Generate Optimized Route</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="flex flex-col h-full">
        {result ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full animate-fade-in flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-4">Optimization Results</h3>
            
            <div className="mb-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Analysis</span>
                <p className="text-slate-700 mt-1 leading-relaxed">{result.analysis}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                   <span className="text-xs font-bold text-emerald-600 uppercase">Est. Savings</span>
                   <p className="text-emerald-800 font-bold text-lg">{result.estimatedSavings}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                   <span className="text-xs font-bold text-blue-600 uppercase">Stops</span>
                   <p className="text-blue-800 font-bold text-lg">{result.recommendedRoute.length}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase mb-3">Recommended Sequence</span>
                <div className="flex-1 overflow-y-auto space-y-0 relative border-l-2 border-slate-200 ml-3 pl-6 pb-6">
                    {result.recommendedRoute.map((binId, idx) => {
                        const bin = bins.find(b => b.id === binId);
                        return (
                            <div key={idx} className="relative mb-6 last:mb-0">
                                <div className="absolute -left-[31px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                                    {idx + 1}
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-slate-800">{bin?.locationName || binId}</span>
                                        <span className="text-xs text-slate-500">{binId}</span>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                         <span className="text-xs bg-white border px-1 rounded text-slate-600">
                                            {bin?.type}
                                         </span>
                                    </div>
                                </div>
                                {idx < result.recommendedRoute.length - 1 && (
                                     <div className="absolute left-1/2 -bottom-4 text-slate-300">
                                         <ArrowRight className="w-4 h-4 rotate-90" />
                                     </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <button className="mt-6 w-full py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Export to Driver App
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-full flex items-center justify-center text-slate-400 p-8 text-center">
            <div>
              <Truck className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Run the optimization to view the generated route plan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIOptimizer;