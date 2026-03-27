import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content - No Sidebar */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
