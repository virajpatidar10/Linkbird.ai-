import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Target,
  ExternalLink,
  Edit,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors = {
  'Pending': 'status-pending',
  'Contacted': 'status-contacted',
  'Responded': 'status-responded',
  'Converted': 'status-converted',
};

export const LeadDetailSheet = () => {
  const { selectedLeadId, leadSheetOpen, closeLeadSheet } = useAppStore();
  const { getLeadById, getCampaignById } = useDataStore();

  const lead = selectedLeadId ? getLeadById(selectedLeadId) : null;
  const campaign = lead ? getCampaignById(lead.campaignId) : null;

  if (!lead) return null;

  const statusHistory = [
    { status: 'Pending', date: lead.createdAt, note: 'Lead added to campaign' },
    { status: 'Contacted', date: lead.lastContact, note: 'Initial outreach sent' },
    ...(lead.status === 'Responded' || lead.status === 'Converted' ? [
      { status: 'Responded', date: lead.lastContact, note: 'Lead responded to outreach' }
    ] : []),
    ...(lead.status === 'Converted' ? [
      { status: 'Converted', date: lead.lastContact, note: 'Lead successfully converted' }
    ] : [])
  ];

  return (
    <Sheet open={leadSheetOpen} onOpenChange={closeLeadSheet}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <SheetTitle className="text-xl flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>{lead.name}</span>
              </SheetTitle>
              <SheetDescription className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{lead.email}</span>
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={closeLeadSheet}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={cn("text-sm", statusColors[lead.status])}
            >
              {lead.status}
            </Badge>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Last contact: {new Date(lead.lastContact).toLocaleDateString()}
            </span>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <User className="h-4 w-4 text-primary" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Company</span>
                  </div>
                  <p className="font-medium">{lead.company}</p>
                </div>
                
                {lead.position && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Position</span>
                    </div>
                    <p className="font-medium">{lead.position}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{lead.email}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {lead.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone</span>
                    </div>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Campaign Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Campaign Name</p>
                <p className="font-medium">{lead.campaignName}</p>
              </div>
              
              {campaign && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Leads</p>
                      <p className="font-medium">{campaign.totalLeads}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Response Rate</p>
                      <p className="font-medium">{campaign.responseRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Status History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs", statusColors[entry.status as keyof typeof statusColors])}
                        >
                          {entry.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {lead.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{lead.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button className="flex-1 linkbird-gradient">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};