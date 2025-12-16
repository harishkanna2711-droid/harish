import React, { useState, useRef } from 'react';
import { Camera, MapPin, Send, Loader2, CheckCircle, LogOut, ImagePlus, AlertCircle } from 'lucide-react';
import { analyzeWasteImage } from '../services/geminiService';
import { CitizenReport } from '../types';

interface CitizenPortalProps {
  onLogout: () => void;
  onSubmitReport: (report: Omit<CitizenReport, 'id' | 'timestamp' | 'status'>) => void;
}

const CitizenPortal: React.FC<CitizenPortalProps> = ({ onLogout, onSubmitReport }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<string>('Detecting location...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect location on mount (simulated)
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      }, () => {
        setLocation("Location access denied");
      });
    } else {
        setLocation("Location unavailable");
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setImage(base64String);
        
        // Strip header for API
        const base64Data = base64String.split(',')[1];
        
        setAnalyzing(true);
        const analysisResult = await analyzeWasteImage(base64Data);
        setAiAnalysis(analysisResult);
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (image) {
        onSubmitReport({
            location,
            imageUrl: image,
            aiAnalysis: aiAnalysis || 'Analysis pending',
            description: description || 'No description provided'
        });

        setSubmitted(true);
        setTimeout(() => {
            // Reset after 3 seconds for new report
            setSubmitted(false);
            setImage(null);
            setAiAnalysis(null);
            setDescription('');
        }, 3000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in">
        <div className="bg-white p-6 rounded-full shadow-lg mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted!</h2>
        <p className="text-slate-600 mb-8">Thank you for helping keep our community clean. A dispatch team has been notified.</p>
        <button 
            onClick={() => setSubmitted(false)}
            className="text-emerald-600 font-bold hover:underline"
        >
            Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-slate-800 text-lg">New Report</h1>
          <p className="text-xs text-slate-500">Community Waste Watch</p>
        </div>
        <button onClick={onLogout} className="p-2 text-slate-400 hover:text-slate-600">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">1. Capture Evidence</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${
                image ? 'border-emerald-400 bg-slate-900' : 'border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              {image ? (
                <>
                    <img src={image} alt="Report preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 p-2 rounded-full text-white">
                            <Camera className="w-6 h-6" />
                        </div>
                    </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 p-3 rounded-full mb-3 text-blue-500">
                    <Camera className="w-8 h-8" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Tap to take photo</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* AI Analysis Result */}
          {analyzing && (
             <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-3 text-indigo-700 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">WasteAI is analyzing image...</span>
             </div>
          )}
          
          {!analyzing && aiAnalysis && (
            <div className="bg-white border border-indigo-100 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                     <div className="p-1 bg-indigo-100 rounded text-indigo-600">
                        <ImagePlus className="w-4 h-4" />
                     </div>
                     <span className="text-xs font-bold text-indigo-600 uppercase">AI Assessment</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis}</p>
            </div>
          )}

          {/* Location Info */}
          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-700 block">2. Location</label>
             <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-slate-600">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="text-sm font-mono">{location}</span>
             </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">3. Additional Details</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue (e.g., bin overflow, illegal dumping...)"
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] text-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={!image}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Report
          </button>
          
          {!image && (
             <p className="text-center text-xs text-amber-600 flex items-center justify-center gap-1">
                 <AlertCircle className="w-3 h-3" /> Photo required to submit
             </p>
          )}

        </form>
      </main>
    </div>
  );
};

export default CitizenPortal;