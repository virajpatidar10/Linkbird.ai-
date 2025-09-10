import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataStore } from '@/stores/dataStore';
import { Users, Target, TrendingUp, CheckCircle } from 'lucide-react';

export const DashboardPage = () => {
  const { leads, campaigns, loading } = useDataStore();

  const totalLeads = leads.length;
  const totalCampaigns = campaigns.length;
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'Active').length;

  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      description: 'Across all campaigns',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns,
      description: 'Currently running',
      icon: Target,
      color: 'text-success'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      description: 'Leads converted',
      icon: TrendingUp,
      color: 'text-warning'
    },
    {
      title: 'Converted Leads',
      value: convertedLeads,
      description: 'Successful conversions',
      icon: CheckCircle,
      color: 'text-success'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your lead generation performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="linkbird-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="linkbird-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">
                      {lead.name} from {lead.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Status: {lead.status} • {lead.campaignName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="linkbird-shadow">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Your most active campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {campaign.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {campaign.responseRate}%
                    </span>
                  </div>
                  <div className="progress-bar h-2">
                    <div 
                      className="progress-fill progress-primary"
                      style={{ width: `${campaign.responseRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};