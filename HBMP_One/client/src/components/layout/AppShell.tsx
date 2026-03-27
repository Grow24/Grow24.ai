import { ReactNode } from 'react';
import TopNavBar from './TopNavBar';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <main className="p-6">{children}</main>
    </div>
  );
}

