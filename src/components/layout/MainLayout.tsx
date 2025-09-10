import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LeadsPage } from '../leads/LeadsPage';
import { CampaignsPage } from '../campaigns/CampaignsPage';
import { DashboardPage } from '../dashboard/DashboardPage';
import { SettingsPage } from '../settings/SettingsPage';
import { useAppStore } from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';

const pageComponents = {
  dashboard: DashboardPage,
  leads: LeadsPage,
  campaigns: CampaignsPage,
  settings: SettingsPage,
};

export const MainLayout = () => {
  const currentPage = useAppStore((state) => state.currentPage);
  const { fetchLeads, fetchCampaigns } = useDataStore();
  
  useEffect(() => {
    // Load initial data
    fetchLeads();
    fetchCampaigns();
  }, [fetchLeads, fetchCampaigns]);

  const PageComponent = pageComponents[currentPage];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <PageComponent />
        </main>
      </div>
    </div>
  );
};