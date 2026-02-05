
import React from 'react';
import { TenantConfig } from '../types';

interface SidebarProps {
  tenants: TenantConfig[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tenants, selectedId, onSelect }) => {
  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-layer-group text-indigo-400"></i>
          SaaS Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Multi-Tenant Platform</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <button
          onClick={() => onSelect(null)}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
            selectedId === null ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
          }`}
        >
          <i className="fas fa-chart-line w-5 text-center"></i>
          Overview
        </button>

        <div className="pt-4 pb-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase px-4 mb-2">My Tenants ({tenants.length}/4)</p>
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => onSelect(tenant.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm mb-1 ${
                selectedId === tenant.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: tenant.isActive ? tenant.primaryColor : '#475569' }}
              ></span>
              <span className="truncate">{tenant.name}</span>
            </button>
          ))}
          {tenants.length < 4 && (
             <div className="px-4 py-2 text-xs text-slate-600 border border-dashed border-slate-700 rounded-lg mt-2">
               {4 - tenants.length} slot(s) remaining
             </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full" alt="Avatar" />
          <div>
            <p className="font-medium text-white">Admin User</p>
            <p>Enterprise Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};
