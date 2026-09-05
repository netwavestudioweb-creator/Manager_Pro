import React, { useState } from 'react';
import { Bell, Search, User, Moon, Sun, LogOut, Menu, RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRecentAlerts } from '@/hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header = ({ sidebarCollapsed, setMobileMenuOpen }: HeaderProps) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: alerts = [] } = useRecentAlerts();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const unreadAlerts = alerts.filter((a: any) => !a.is_read).length;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || t('header.roles.user');
  const avatarUrl = user?.user_metadata?.avatar_url || '';

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'admin': return t('header.roles.admin');
      case 'gestionnaire': return t('header.roles.manager');
      case 'lecteur': return t('header.roles.reader');
      default: return t('header.roles.user');
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-border/40 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 transition-all duration-300 shadow-sm",
        "left-0",
        sidebarCollapsed ? "md:left-20" : "md:left-64"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Search & Menu */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder={t('header.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/20 w-full rounded-full transition-all duration-300 shadow-inner-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 min-w-5 justify-center p-0 text-[10px] animate-alert-pulse"
                  >
                    {unreadAlerts}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{t('header.notifications')}</span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                  {t('header.markAllRead')}
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t('header.noNotifications')}
                </div>
              ) : (
                alerts.slice(0, 3).map((alert: any) => (
                  <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        alert.priority === 'urgent' ? 'bg-destructive animate-pulse' :
                        alert.priority === 'warning' ? 'bg-warning' : 'bg-info'
                      }`} />
                      <span className="font-medium">{alert.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {alert.message}
                    </p>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="justify-center text-primary cursor-pointer"
                onClick={() => navigate('/alerts')}
              >
                {t('header.viewAllNotifications')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-2 py-1.5 h-auto hover:bg-muted/60 rounded-full transition-all duration-200">
                <Avatar className="h-9 w-9 border border-primary/20 shadow-sm transition-transform hover:scale-105">
                  <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start md:flex pr-2">
                  <span className="text-sm font-semibold leading-none mb-1">{displayName}</span>
                  <span className="text-xs text-muted-foreground leading-none">{getRoleLabel(role)}</span>
                </div>
                {unreadAlerts > 0 && role === 'admin' && (
                  <AlertTriangle className="h-4 w-4 text-destructive animate-pulse ml-2" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('header.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/landing')}>
                <Home className="mr-2 h-4 w-4" />
                Page d'accueil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                {t('header.profile')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => {
                toast({ title: t('header.switchAccount'), description: t('header.mockSwitch') });
              }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('header.switchAccount')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('header.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
