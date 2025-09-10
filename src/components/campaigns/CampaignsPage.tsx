import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataStore, Campaign } from '@/stores/dataStore';
import { Search, Filter, Megaphone, MoreHorizontal, Play, Pause, Plus } from 'lucide-react';
import { NewCampaignDialog } from './NewCampaignDialog';
import { cn } from '@/lib/utils';

const statusColors = {
  'Draft': 'bg-muted text-muted-foreground',
  'Active': 'bg-success-light text-success',
  'Paused': 'bg-warning-light text-warning',
  'Completed': 'bg-primary-light text-primary',
};

const statusIcons = {
  'Draft': 'text-muted-foreground',
  'Active': 'text-success',
  'Paused': 'text-warning',
  'Completed': 'text-primary',
};

export const CampaignsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  
  const { campaigns, loading } = useDataStore();

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const statusOptions = ['All', 'Draft', 'Active', 'Paused', 'Completed'];

  // Calculate summary stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'Active').length,
    totalLeads: campaigns.reduce((sum, c) => sum + c.totalLeads, 0),
    avgResponseRate: campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + c.responseRate, 0) / campaigns.length 
      : 0
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Megaphone className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
        </div>
        <Button 
          className="linkbird-gradient"
          onClick={() => setNewCampaignOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="linkbird-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Campaigns</p>
              </div>
              <Megaphone className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="linkbird-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active Campaigns</p>
              </div>
              <Play className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="linkbird-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalLeads}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
                <span className="text-primary font-bold text-sm">L</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="linkbird-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgResponseRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Avg Response Rate</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success-light flex items-center justify-center">
                <span className="text-success font-bold text-sm">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="linkbird-shadow">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    statusFilter === status && "linkbird-gradient"  
                  )}
                >
                  {status}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card className="linkbird-shadow">
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Manage and monitor your campaign performance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-table-header border-b border-table-border text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Campaign Name</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Leads</div>
                <div className="col-span-1">Success</div>
                <div className="col-span-2">Response Rate</div>
                <div className="col-span-2">Progress</div>
                <div className="col-span-1">Created</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-table-border">
                {filteredCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-table-hover transition-colors"
                  >
                    {/* Campaign Name */}
                    <div className="col-span-3">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {new Date(campaign.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", statusColors[campaign.status])}
                      >
                        {campaign.status}
                      </Badge>
                    </div>

                    {/* Total Leads */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-medium text-foreground">
                        {campaign.totalLeads}
                      </span>
                    </div>

                    {/* Successful Leads */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-medium text-success">
                        {campaign.successfulLeads}
                      </span>
                    </div>

                    {/* Response Rate */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground">
                          {campaign.responseRate.toFixed(1)}%
                        </span>
                        <div className="flex-1 progress-bar h-2 min-w-[60px]">
                          <div 
                            className={cn(
                              "progress-fill",
                              campaign.responseRate >= 25 ? "progress-success" :
                              campaign.responseRate >= 15 ? "progress-warning" : "progress-primary"
                            )}
                            style={{ width: `${Math.min(campaign.responseRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {campaign.successfulLeads} / {campaign.totalLeads}
                          </span>
                        </div>
                        <div className="progress-bar h-2">
                          <div 
                            className="progress-fill progress-primary"
                            style={{ 
                              width: `${(campaign.successfulLeads / campaign.totalLeads) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end space-x-1">
                      {campaign.status === 'Active' ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : campaign.status === 'Paused' ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCampaigns.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'All' 
                      ? 'No campaigns match your search criteria.' 
                      : 'No campaigns found. Create your first campaign to get started.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <NewCampaignDialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen} />
    </div>
  );
};