'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRole, UserPermissions } from '@/lib/permissions';
import { ALL_NAV_ITEMS, ROLE_DASHBOARD_ROUTES, type NavItem } from '@/lib/navigation-items';

interface MobileSidebarProps {
  role: UserRole;
  permissions: Partial<UserPermissions>;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ role, permissions, isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  // Filter navigation items based on user's role and permissions
  const filteredItems = ALL_NAV_ITEMS.filter((item) => {
    // Check if item is restricted to specific roles
    if (item.roles && !item.roles.includes(role)) {
      return false;
    }

    // Check permission
    return permissions[item.permission] === true;
  }).map((item) => {
    // Dashboard Home is special - update href based on role (but only for the generic /dashboard route)
    if (item.permission === 'dashboard' && item.href === '/dashboard') {
      return { ...item, href: ROLE_DASHBOARD_ROUTES[role] };
    }
    return item;
  });

  // Group items by section
  const sections: Record<string, NavItem[]> = {};
  filteredItems.forEach((item) => {
    const section = item.section || 'Other';
    if (!sections[section]) {
      sections[section] = [];
    }
    sections[section].push(item);
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TG</span>
              </div>
              <span className="text-lg font-semibold">Tax Genius Pro</span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)] px-4 py-4">
          <nav className="space-y-6">
            {Object.entries(sections).map(([sectionName, items]) => (
              <div key={sectionName} className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  {sectionName}
                </h3>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
