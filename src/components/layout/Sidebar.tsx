import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'leads', label: 'Leads', icon: Users, path: '/leads' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/campaigns' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, currentPage, setCurrentPage } = useAppStore();
  const { user, logout } = useAuthStore();

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId as any);
  };

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-border transition-all duration-300 flex flex-col",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-foreground">Linkbird</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3",
                  sidebarCollapsed && "px-0 justify-center",
                  isActive && "bg-primary-light text-primary font-medium"
                )}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon className="h-4 w-4" />
                {!sidebarCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        {!sidebarCollapsed ? (
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-9 text-muted-foreground hover:text-foreground",
            sidebarCollapsed && "px-0 justify-center"
          )}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!sidebarCollapsed && (
            <span className="ml-3">Sign Out</span>
          )}
        </Button>
      </div>
    </div>
  );
};