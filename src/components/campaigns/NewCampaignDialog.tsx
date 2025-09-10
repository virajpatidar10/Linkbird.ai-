import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/hooks/use-toast';

interface NewCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewCampaignDialog = ({ open, onOpenChange }: NewCampaignDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Draft' as 'Draft' | 'Active' | 'Paused' | 'Completed',
  });
  const [loading, setLoading] = useState(false);
  
  const { addCampaign } = useDataStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addCampaign({
        name: formData.name,
        status: formData.status,
        totalLeads: 0,
        successfulLeads: 0,
        responseRate: 0,
      });

      toast({
        title: "Campaign created successfully",
        description: `${formData.name} has been created.`,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        status: 'Draft',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error creating campaign",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new marketing campaign to manage your outreach efforts.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Q2 Enterprise Outreach"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Draft' | 'Active' | 'Paused' | 'Completed') => 
                setFormData({...formData, status: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the goals and target audience for this campaign..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="linkbird-gradient">
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};