
import React, { useState, useEffect, useRef } from 'react';
import { TenantConfig } from '../types';
import { generateTenantContent } from '../services/geminiService';

interface TenantEditorProps {
  tenant: TenantConfig;
  onUpdate: (updated: TenantConfig) => void;
  onDelete: (id: string) => void;
}

export const TenantEditor: React.FC<TenantEditorProps> = ({ tenant, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState(tenant);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  useEffect(() => {
    setFormData(tenant);
  }, [tenant]);

  const handleSave = () => {
    onUpdate({ ...formData });
    alert("Configuration saved successfully!");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access to take a brand snapshot.");
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/png');
        setSnapshot(data);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.description || !formData.name) {
      alert("Please provide a name and description first.");
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await generateTenantContent(formData.description, formData.name);
      setFormData(prev => ({
        ...prev,
        primaryColor: result.suggestedColor || prev.primaryColor,
        content: {
          heroTitle: result.heroTitle,
          heroSubtitle: result.heroSubtitle,
          aboutSection: result.aboutSection
        }
      }));
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{tenant.name} <span className="text-sm font-normal text-slate-500 ml-2">ID: {tenant.id}</span></h2>
          <p className="text-sm text-slate-500">Global Configuration & Brand Management</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onDelete(tenant.id)}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-100"
          >
            Archive Tenant
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all text-sm font-bold"
          >
            Deploy Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-x divide-slate-100">
        {/* Settings Column */}
        <div className="col-span-2 p-8 space-y-8">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Branding</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subdomain Identity</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={formData.subdomain}
                    onChange={(e) => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/\s/g, '')})}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-l-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                  />
                  <span className="px-4 py-2.5 bg-slate-200 border border-l-0 border-slate-200 text-slate-600 rounded-r-lg text-xs font-bold flex items-center">.saas.io</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Copywriter</h3>
              <button 
                onClick={handleAiGenerate}
                disabled={isAiLoading}
                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-tighter hover:bg-indigo-100 disabled:opacity-50 transition-all flex items-center gap-1"
              >
                <i className={`fas fa-sparkles ${isAiLoading ? 'animate-pulse' : ''}`}></i>
                {isAiLoading ? 'Writing...' : 'Regenerate Content'}
              </button>
            </div>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the business in a few sentences..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm italic text-slate-600"
            ></textarea>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Website Copy</h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Hero Heading</label>
              <input 
                type="text" 
                value={formData.content.heroTitle}
                onChange={(e) => setFormData({...formData, content: { ...formData.content, heroTitle: e.target.value }})}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">About Us Narrative</label>
              <textarea 
                rows={4}
                value={formData.content.aboutSection}
                onChange={(e) => setFormData({...formData, content: { ...formData.content, aboutSection: e.target.value }})}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm leading-relaxed"
              ></textarea>
            </div>
          </section>
        </div>

        {/* Brand Assets Column */}
        <div className="p-8 bg-slate-50/30 space-y-8">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Brand Visuals</h3>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <input 
                type="color" 
                value={formData.primaryColor}
                onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                className="w-12 h-12 rounded-lg cursor-pointer border-none p-0"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">Primary Color</p>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{formData.primaryColor}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Brand Snapshot</h3>
            <div className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner flex items-center justify-center">
              {isCameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : snapshot ? (
                <img src={snapshot} alt="Snapshot" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                   <i className="fas fa-camera text-3xl text-slate-700 mb-2"></i>
                   <p className="text-[10px] text-slate-500 uppercase tracking-tighter">No snapshot taken</p>
                </div>
              )}
              
              <div className="absolute bottom-4 inset-x-4 flex gap-2">
                {!isCameraActive ? (
                  <button 
                    onClick={startCamera}
                    className="flex-1 py-2 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase hover:bg-white transition-all shadow-lg"
                  >
                    Open Camera
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={takeSnapshot}
                      className="flex-1 py-2 bg-indigo-600 rounded-lg text-white text-[10px] font-bold uppercase hover:bg-indigo-700 transition-all shadow-lg"
                    >
                      Capture
                    </button>
                    <button 
                      onClick={stopCamera}
                      className="px-3 py-2 bg-red-600 rounded-lg text-white text-[10px] font-bold uppercase hover:bg-red-700 transition-all"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </section>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex gap-3">
              <i className="fas fa-info-circle text-amber-500 mt-0.5"></i>
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase tracking-tighter mb-1">Production Tip</p>
                <p className="text-[10px] text-amber-700 leading-tight">These changes will propagate across the CDN globally within 60 seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
