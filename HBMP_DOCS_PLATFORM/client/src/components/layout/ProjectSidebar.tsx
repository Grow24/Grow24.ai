import { Link, useParams, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Settings } from 'lucide-react';
import React from 'react';

export default function ProjectSidebar() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: `/projects/${projectId}`, icon: LayoutDashboard },
    { label: 'Business Case Docket', path: `/projects/${projectId}`, icon: FileText, section: 'business-case' },
    { label: 'Business Requirements Docket', path: `/projects/${projectId}`, icon: FileText, section: 'business-requirements' },
    { label: 'Test Docket', path: `/projects/${projectId}`, icon: FileText, section: 'test' },
    { label: 'Templates', path: `/projects/${projectId}/templates`, icon: FileText },
    { label: 'Settings', path: `/projects/${projectId}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-muted/40 p-4">
      <nav className="space-y-1">
        <div className="mb-4 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.section && location.hash === `#${item.section}`);
          const handleClick = (e: React.MouseEvent) => {
            if (item.section) {
              e.preventDefault();
              // Scroll to section on dashboard
              const element = document.getElementById(item.section);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          };
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={handleClick}
              className={cn(
                'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

