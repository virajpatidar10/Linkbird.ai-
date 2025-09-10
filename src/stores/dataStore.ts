import { create } from 'zustand';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  campaignId: string;
  campaignName: string;
  status: 'Pending' | 'Contacted' | 'Responded' | 'Converted';
  lastContact: string;
  phone?: string;
  position?: string;
  notes?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  totalLeads: number;
  successfulLeads: number;
  responseRate: number;
  createdAt: string;
  updatedAt: string;
}

interface DataState {
  leads: Lead[];
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  fetchCampaigns: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>) => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
  getCampaignById: (id: string) => Campaign | undefined;
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    company: 'TechCorp Inc.',
    campaignId: '1',
    campaignName: 'Q1 Enterprise Outreach',
    status: 'Contacted',
    lastContact: '2024-01-15',
    phone: '+1 (555) 123-4567',
    position: 'CTO',
    notes: 'Interested in enterprise solutions. Follow up next week.',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@innovateads.com',
    company: 'InnovateAds',
    campaignId: '2',
    campaignName: 'Marketing Automation Campaign',
    status: 'Responded',
    lastContact: '2024-01-14',
    phone: '+1 (555) 987-6543',
    position: 'Marketing Director',
    notes: 'Scheduled demo for next Tuesday.',
    createdAt: '2024-01-08'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@dataflow.io',
    company: 'DataFlow Solutions',
    campaignId: '1',
    campaignName: 'Q1 Enterprise Outreach',
    status: 'Converted',
    lastContact: '2024-01-12',
    phone: '+1 (555) 456-7890',
    position: 'VP of Engineering',
    notes: 'Signed annual contract. Great success!',
    createdAt: '2024-01-05'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@growthco.com',
    company: 'GrowthCo',
    campaignId: '3',
    campaignName: 'SaaS Startup Outreach',
    status: 'Pending',
    lastContact: '2024-01-16',
    position: 'Founder & CEO',
    createdAt: '2024-01-16'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@fintech.co',
    company: 'FinTech Solutions',
    campaignId: '2',
    campaignName: 'Marketing Automation Campaign',
    status: 'Contacted',
    lastContact: '2024-01-13',
    phone: '+1 (555) 321-0987',
    position: 'Head of Operations',
    notes: 'Requested pricing information.',
    createdAt: '2024-01-07'
  }
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Enterprise Outreach',
    status: 'Active',
    totalLeads: 45,
    successfulLeads: 12,
    responseRate: 26.7,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Marketing Automation Campaign',
    status: 'Active',
    totalLeads: 38,
    successfulLeads: 8,
    responseRate: 21.1,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'SaaS Startup Outreach',
    status: 'Paused',
    totalLeads: 22,
    successfulLeads: 3,
    responseRate: 13.6,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: '4',
    name: 'Holiday Special Campaign',
    status: 'Completed',
    totalLeads: 67,
    successfulLeads: 19,
    responseRate: 28.4,
    createdAt: '2023-12-01',
    updatedAt: '2023-12-31'
  }
];

export const useDataStore = create<DataState>((set, get) => ({
  leads: [],
  campaigns: [],
  loading: false,
  error: null,
  
  fetchLeads: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ leads: mockLeads, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch leads', loading: false });
    }
  },
  
  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ campaigns: mockCampaigns, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch campaigns', loading: false });
    }
  },
  
  getLeadById: (id: string) => {
    return get().leads.find(lead => lead.id === id);
  },
  
  addLead: async (leadData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with Supabase API call
      const newLead: Lead = {
        ...leadData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({ 
        leads: [...state.leads, newLead],
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create lead', loading: false });
    }
  },

  addCampaign: async (campaignData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with Supabase API call
      const newCampaign: Campaign = {
        ...campaignData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({ 
        campaigns: [...state.campaigns, newCampaign],
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create campaign', loading: false });
    }
  },

  updateLeadStatus: async (id: string, status: Lead['status']) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with Supabase API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === id
            ? { ...lead, status, lastContact: new Date().toISOString() }
            : lead
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update lead status', loading: false });
    }
  },

  getCampaignById: (id: string) => {
    return get().campaigns.find(campaign => campaign.id === id);
  },
}));