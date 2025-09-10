import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataStore, Lead } from '@/stores/dataStore';
import { useAppStore } from '@/stores/appStore';
import { Search, Filter, Users, MoreHorizontal, Plus } from 'lucide-react';
import { LeadDetailSheet } from './LeadDetailSheet';
import { NewLeadDialog } from './NewLeadDialog';
import { cn } from '@/lib/utils';

const statusColors = {
  'Pending': 'status-pending',
  'Contacted': 'status-contacted',
  'Responded': 'status-responded',
  'Converted': 'status-converted',
};

export const LeadsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  
  const { leads, loading } = useDataStore();
  const { openLeadSheet } = useAppStore();

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const statusOptions = ['All', 'Pending', 'Contacted', 'Responded', 'Converted'];

  const handleLeadClick = (leadId: string) => {
    openLeadSheet(leadId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-muted rounded flex-1"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
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
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            className="linkbird-gradient"
            onClick={() => setNewLeadOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredLeads.length} of {leads.length} leads
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="linkbird-shadow">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, company, or campaign..."
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

      {/* Leads Table */}
      <Card className="linkbird-shadow">
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-table-header border-b border-table-border text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Lead</div>
                <div className="col-span-2">Company</div>
                <div className="col-span-2">Campaign</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Last Contact</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-table-border">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-table-hover cursor-pointer transition-colors"
                    onClick={() => handleLeadClick(lead.id)}
                  >
                    {/* Lead Info */}
                    <div className="col-span-3">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-foreground">{lead.company}</span>
                    </div>

                    {/* Campaign */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-foreground">{lead.campaignName}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", statusColors[lead.status])}
                      >
                        {lead.status}
                      </Badge>
                    </div>

                    {/* Last Contact */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-muted-foreground">
                        {new Date(lead.lastContact).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredLeads.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'All' 
                      ? 'No leads match your search criteria.' 
                      : 'No leads found.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <LeadDetailSheet />
      <NewLeadDialog open={newLeadOpen} onOpenChange={setNewLeadOpen} />
    </div>
  );
};