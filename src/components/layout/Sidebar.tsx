import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  Car,
  LayoutDashboard,
  Wrench,
  AlertTriangle,
  Calendar,
  Fuel,
  Users,
  Bell,
  History,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeVariant?: 'default' | 'destructive' | 'warning';
}

const navItems: NavItem[] = [
  { titleKey: 'dashboard', href: '/', icon: LayoutDashboard },
  { titleKey: 'vehicles', href: '/vehicles', icon: Car },
  { titleKey: 'maintenance', href: '/maintenance', icon: Wrench, badge: 3, badgeVariant: 'warning' },
  { titleKey: 'breakdowns', href: '/breakdowns', icon: AlertTriangle, badge: 2, badgeVariant: 'destructive' },
  { titleKey: 'assignments', href: '/reservations', icon: Calendar },
  { titleKey: 'fuel', href: '/fuel', icon: Fuel },
  { titleKey: 'drivers', href: '/drivers', icon: Users },
  { titleKey: 'alerts', href: '/alerts', icon: Bell, badge: 5, badgeVariant: 'destructive' },
  { titleKey: 'history', href: '/history', icon: History },
  { titleKey: 'reports', href: '/reports', icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen flex flex-col bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 shadow-lg transition-all duration-300 ease-in-out',
          collapsed ? 'w-64 md:w-20' : 'w-64',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border/40 px-4 mb-2 shrink-0">
          <div className={cn("flex items-center gap-3", collapsed && "md:hidden")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight text-sidebar-foreground">
              Manager<span className="text-primary font-light">Pro</span>
            </span>
          </div>
          <div className={cn("hidden mx-auto h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md", collapsed && "md:flex")}>
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        {/* Toggle Button (Desktop only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-50 hidden md:flex h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Navigation */}
        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 px-3 py-1 overflow-hidden flex-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'relative group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-all duration-300',
                  'hover:bg-sidebar-accent/60 hover:translate-x-1',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground',
                  'animate-fade-in-up opacity-0'
                )}
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
              >
                <Icon className={cn('h-4 w-4 flex-shrink-0 transition-colors', isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-primary/80')} />
                
                <div className={cn("flex flex-1 items-center justify-between", collapsed && "md:hidden")}>
                  <span>{t(`sidebar.${item.titleKey}`, item.titleKey)}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant === 'destructive' ? 'destructive' : 'secondary'}
                      className={cn(
                        'h-4 min-w-4 px-1.5 justify-center text-[10px] font-bold shadow-sm',
                        item.badgeVariant === 'warning' && 'bg-warning/20 text-warning border border-warning/30',
                        item.badgeVariant === 'destructive' && 'animate-alert-pulse'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {/* Badge for collapsed state */}
                <div className={cn("hidden", collapsed && "md:block")}>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant === 'destructive' ? 'destructive' : 'secondary'}
                      className={cn(
                        'absolute right-1 top-1 h-3 min-w-3 px-0 justify-center text-[8px] font-bold shadow-sm',
                        item.badgeVariant === 'warning' && 'bg-warning text-warning-foreground',
                        item.badgeVariant === 'destructive' && 'animate-alert-pulse'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Settings at bottom */}
        {/* Settings at bottom */}
        <div className="p-4 mt-auto border-t border-sidebar-border/30 bg-sidebar/30 shrink-0">
          <NavLink
            to="/settings"
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-300 border',
              location.pathname === '/settings' 
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                : 'bg-transparent hover:bg-sidebar-accent/80 border-sidebar-border/50 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:shadow-sm'
            )}
          >
            <Settings className={cn("h-4 w-4 transition-transform duration-500", location.pathname !== '/settings' && "group-hover:rotate-90")} />
            <span className={cn(collapsed && "md:hidden")}>{t('sidebar.settings')}</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
