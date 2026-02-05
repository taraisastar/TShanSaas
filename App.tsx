
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { TenantEditor } from './components/TenantEditor';
import { SitePreview } from './components/SitePreview';
import { TenantConfig, ThemeVariant } from './types';

const INITIAL_TENANTS: TenantConfig[] = [
  {
    id: 'T-001',
    name: 'Coffee Lab',
    subdomain: 'coffeelab',
    primaryColor: '#8B4513',
    theme: ThemeVariant.MODERN,
    description: 'Artisanal coffee roaster and cafe based in Seattle.',
    isActive: true,
    content: {
      heroTitle: 'Better Coffee for Better Mornings',
      heroSubtitle: 'Freshly roasted beans delivered from our shop to your doorstep.',
      aboutSection: 'Founded in 2022, Coffee Lab focuses on sustainable sourcing and perfect extraction.'
    }
  }
];

const App: React.FC = () => {
  const [tenants, setTenants] = useState<TenantConfig[]>(() => {
    const saved = localStorage.getItem('saas_tenants_v2');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });
  
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [logs, setLogs] = useState<string[]>(["[INF] Booting SaaS Gateway v4.2...", "[INF] Loading Tenant Store from LocalDB..."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('saas_tenants_v2', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string, level: 'INF' | 'WRN' | 'ERR' = 'INF') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setLogs(prev => [...prev, `[${timestamp} ${level}] ${msg}`]);
  };

  const handleCreateTenant = () => {
    if (tenants.length >= 4) {
      addLog("License Limit Reached: User attempted to create 5th tenant.", "WRN");
      alert("License limit reached. Please upgrade for more slots.");
      return;
    }
    
    const newTenant: TenantConfig = {
      id: `T-${Date.now().toString().slice(-4)}`,
      name: `Project ${tenants.length + 1}`,
      subdomain: `site-${Date.now().toString().slice(-4)}`,
      primaryColor: '#6366f1',
      theme: ThemeVariant.MODERN,
      description: '',
      isActive: true,
      content: {
        heroTitle: '',
        heroSubtitle: '',
        aboutSection: ''
      }
    };
    
    setTenants([...tenants, newTenant]);
    setSelectedTenantId(newTenant.id);
    addLog(`Created new tenant instance: ${newTenant.id}`);
  };

  const handleUpdateTenant = (updated: TenantConfig) => {
    setTenants(tenants.map(t => t.id === updated.id ? updated : t));
    addLog(`Updated configuration for ${updated.name}`);
  };

  const handleDeleteTenant = (id: string) => {
    if (confirm("Disconnect this tenant?")) {
      setTenants(tenants.filter(t => t.id !== id));
      setSelectedTenantId(null);
      addLog(`Tenant ${id} purged from system storage.`, "WRN");
    }
  };

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);
  
  // Detection logic for the GitHub Secret injection
  const isKeyInjected = process.env.API_KEY && process.env.API_KEY !== 'undefined' && process.env.API_KEY !== 'PLACEHOLDER';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9]">
      <Sidebar 
        tenants={tenants} 
        selectedId={selectedTenantId} 
        onSelect={setSelectedTenantId} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {selectedTenant ? (
            <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                 <nav className="flex text-[10px] font-black text-slate-400 uppercase tracking-widest gap-2 items-center">
                   <button onClick={() => setSelectedTenantId(null)} className="hover:text-indigo-600 transition-colors">Root Console</button>
                   <i className="fas fa-chevron-right text-[8px]"></i>
                   <span className="text-slate-900">{selectedTenant.name}</span>
                 </nav>
              </div>

              <TenantEditor 
                tenant={selectedTenant} 
                onUpdate={handleUpdateTenant} 
                onDelete={handleDeleteTenant}
              />

              <div className="pt-8 border-t border-slate-200">
                 <SitePreview tenant={selectedTenant} />
              </div>
            </div>
          ) : (
            <div className="p-8 lg:p-12 max-w-7xl mx-auto h-full flex flex-col space-y-8">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase">.NET SaaS Enterprise</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">v4.2.1-stable</span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Cluster Overview</h1>
                </div>
                {tenants.length < 4 && (
                  <button onClick={handleCreateTenant} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-200 flex items-center gap-3 transition-transform active:scale-95">
                    <i className="fas fa-plus"></i> Spin Up Instance
                  </button>
                )}
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1 lg:col-span-2 space-y-8">
                   {/* Deployment Debugger Card */}
                   <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <i className="fas fa-server text-indigo-500"></i>
                        Deployment Health Check
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isKeyInjected ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isKeyInjected ? 'bg-green-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                              <i className={`fas ${isKeyInjected ? 'fa-key' : 'fa-lock'}`}></i>
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">API Gateway</p>
                              <p className="text-[10px] uppercase font-bold text-slate-500">{isKeyInjected ? 'Authorized' : 'Action Required'}</p>
                           </div>
                        </div>
                        <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                              <i className="fas fa-globe"></i>
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">Branch Environment</p>
                              <p className="text-[10px] uppercase font-bold text-slate-500">GitHub Pages (gh-pages)</p>
                           </div>
                        </div>
                      </div>
                      
                      {!isKeyInjected && (
                        <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-slate-300 font-mono text-[10px]">
                           <p className="text-indigo-400 font-bold mb-2">// DIAGNOSTIC ACTION REQUIRED:</p>
                           <p>1. Ensure 'GEMINI_API_KEY' is set in GitHub Secrets.</p>
                           <p>2. Verify GitHub Actions build log for 'sed' replacement success.</p>
                           <p>3. Refresh this page after deployment completes.</p>
                        </div>
                      )}
                   </div>

                   <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tenants.map(tenant => (
                      <div 
                        key={tenant.id}
                        onClick={() => setSelectedTenantId(tenant.id)}
                        className="bg-white rounded-3xl border border-slate-200 p-8 hover:border-indigo-500 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg" style={{ backgroundColor: tenant.primaryColor }}>
                            {tenant.name.charAt(0)}
                          </div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{tenant.id}</span>
                        </div>
                        <h3 className="text-2xl font-black mb-1 group-hover:text-indigo-600 transition-colors">{tenant.name}</h3>
                        <p className="text-xs font-mono text-slate-400 mb-6">{tenant.subdomain}.saas.io</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Status</span>
                          <i className="fas fa-arrow-right text-indigo-600 group-hover:translate-x-2 transition-transform"></i>
                        </div>
                      </div>
                    ))}
                  </section>
                </div>

                <div className="col-span-1 space-y-6">
                   <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl h-[550px] flex flex-col">
                      <div className="flex justify-between items-center mb-4 px-2">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Live Runtime Logs
                         </span>
                         <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                         </div>
                      </div>
                      <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1 custom-scrollbar pr-2">
                         {logs.map((log, i) => (
                           <div key={i} className={`py-0.5 border-l-2 pl-3 ${
                             log.includes('ERR') ? 'text-red-400 border-red-500' : 
                             log.includes('WRN') ? 'text-amber-400 border-amber-500' : 
                             'text-indigo-400 border-indigo-500/30 opacity-80'
                           }`}>
                             {log}
                           </div>
                         ))}
                         <div ref={logEndRef} />
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-600 flex justify-between font-bold">
                         <span>VER: 4.2.1</span>
                         <span>NODE: v20.x</span>
                      </div>
                   </div>

                   <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 opacity-10">
                         <i className="fas fa-code text-9xl"></i>
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-2">Technical Specs</h4>
                      <p className="text-xs text-indigo-100 leading-relaxed mb-6">Built with strictly valid ESM components and .NET flavored UI logic.</p>
                      <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20">
                        API Documentation
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <span className="text-slate-300">System: Operational</span>
             </div>
             <div className="flex items-center gap-2">
                <i className={`fas ${isKeyInjected ? 'fa-key text-green-400' : 'fa-lock text-red-400'}`}></i>
                <span>Auth: {isKeyInjected ? 'Verified' : 'Pending Injection'}</span>
             </div>
           </div>
           <div className="flex items-center gap-4">
              <span>{systemTime}</span>
              <span className="text-slate-700">|</span>
              <span className="text-indigo-400">taraisastar.github.io</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
