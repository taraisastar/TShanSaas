
import React from 'react';
import { TenantConfig } from '../types';

interface SitePreviewProps {
  tenant: TenantConfig;
}

export const SitePreview: React.FC<SitePreviewProps> = ({ tenant }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-slate-200 h-6 rounded-md flex items-center px-3 text-[10px] text-slate-500 font-mono">
          https://{tenant.subdomain}.saas.io
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 min-h-[500px] overflow-hidden flex flex-col">
        {/* Mock Site Header */}
        <header className="px-8 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="font-bold text-lg" style={{ color: tenant.primaryColor }}>
            {tenant.name}
          </div>
          <nav className="flex gap-6 text-sm text-slate-600 font-medium">
            <span className="cursor-pointer hover:text-slate-900">Home</span>
            <span className="cursor-pointer hover:text-slate-900">Products</span>
            <span className="cursor-pointer hover:text-slate-900">About</span>
            <span className="px-4 py-1.5 rounded text-white" style={{ backgroundColor: tenant.primaryColor }}>Contact</span>
          </nav>
        </header>

        {/* Mock Site Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-8 py-20 bg-slate-50/50">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 max-w-2xl leading-tight">
            {tenant.content.heroTitle || 'Your Inspiring Title Here'}
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mb-8">
            {tenant.content.heroSubtitle || 'Tell the world what makes your brand unique and amazing.'}
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-lg text-white font-bold transition-transform hover:scale-105" style={{ backgroundColor: tenant.primaryColor }}>
              Get Started
            </button>
            <button className="px-8 py-3 rounded-lg border-2 font-bold transition-all hover:bg-white" style={{ borderColor: tenant.primaryColor, color: tenant.primaryColor }}>
              Learn More
            </button>
          </div>
        </section>

        {/* Mock Site Body */}
        <section className="px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-slate-100">
          <div className="order-2 md:order-1">
             <h2 className="text-2xl font-bold mb-4">About Our Story</h2>
             <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
               {/* Fixed: Accessing content.aboutSection instead of non-existent tenant.aboutSection */}
               {tenant.content.aboutSection || 'Add some details about your company philosophy, history, and goals to build trust with your visitors.'}
             </p>
          </div>
          <div className="order-1 md:order-2 bg-slate-200 aspect-video rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden shadow-inner">
             <img src={`https://picsum.photos/seed/${tenant.id}/800/450`} alt="Brand" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-8 bg-slate-900 text-slate-400 text-sm text-center">
          <p>© {new Date().getFullYear()} {tenant.name}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
