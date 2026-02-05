
export enum ThemeVariant {
  MODERN = 'modern',
  ELEGANT = 'elegant',
  MINIMAL = 'minimal',
  TECH = 'tech'
}

export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  primaryColor: string;
  theme: ThemeVariant;
  description: string;
  isActive: boolean;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    aboutSection: string;
  };
}

export interface AppState {
  tenants: TenantConfig[];
  selectedTenantId: string | null;
  isGenerating: boolean;
}
