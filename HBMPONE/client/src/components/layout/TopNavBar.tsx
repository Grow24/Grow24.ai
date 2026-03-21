import { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, HelpCircle, User, LayoutDashboard, FileText, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects.api';
import { cn } from '@/lib/utils';

export default function TopNavBar() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [context, setContext] = useState<'Personal' | 'Organization'>('Personal');

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId!),
    enabled: !!projectId,
  });

  const mainNavItems = projectId
    ? [
        { label: 'Dashboard', path: `/projects/${projectId}`, icon: LayoutDashboard },
        { label: 'Templates', path: `/projects/${projectId}/templates`, icon: FileText },
      ]
    : [];

  const docketItems = projectId
    ? [
        { label: 'Business Case', path: `/projects/${projectId}`, icon: FileText, section: 'business-case' },
        { label: 'Business Requirements', path: `/projects/${projectId}`, icon: FileText, section: 'business-requirements' },
        { label: 'Test', path: `/projects/${projectId}`, icon: FileText, section: 'test' },
      ]
    : [];

  const handleLogout = () => {
    localStorage.removeItem('hbmp_user');
    navigate('/login');
  };

  const handleNavClick = (item: typeof docketItems[0], e: React.MouseEvent) => {
    if (item.section) {
      e.preventDefault();
      // Scroll to section on dashboard
      const element = document.getElementById(item.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isDocketsActive = docketItems.some(
    (item) => location.pathname === item.path || (item.section && location.hash === `#${item.section}`)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between gap-6 px-6">
        {/* Left: Logo */}
        <Link to="/projects" className="flex shrink-0 items-center">
          <div className="text-lg font-semibold text-gray-900">HBMP One</div>
        </Link>

        {/* Center: Navigation Menu */}
        {projectId && mainNavItems.length > 0 && (
          <nav className="flex flex-1 items-center justify-start gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Dockets Dropdown */}
            {docketItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                      isDocketsActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Dockets</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {docketItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (item.section && location.hash === `#${item.section}`);
                    return (
                      <DropdownMenuItem
                        key={item.label}
                        onClick={(e) => handleNavClick(item, e)}
                        className={cn(
                          'flex items-center gap-2',
                          isActive && 'bg-blue-50 text-blue-700'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Settings */}
            {projectId && (
              <Link
                to={`/projects/${projectId}/settings`}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  location.pathname === `/projects/${projectId}/settings`
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            )}
          </nav>
        )}

        {/* Right: Project Selector, Context, Notifications, Help, User */}
        <div className="flex shrink-0 items-center gap-3">
          {project && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {project.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/projects')}>
                  Switch Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="h-6 w-px bg-gray-200" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-sm text-gray-600 hover:bg-gray-50">
                {context}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setContext('Personal')}>
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContext('Organization')}>
                Organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-50">
            <Bell className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-50">
            <HelpCircle className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-50">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

