import { useState } from 'react';
import AdminOverviewPage from '../../pages/admin/AdminOverviewPage';
import UsersManagementPage from '../../pages/admin/UsersManagementPage';
import WorkspacesManagementPage from '../../pages/admin/WorkspacesManagementPage';
import ReportsPage from '../../pages/admin/ReportsPage';
import AnalyticsPage from '../../pages/admin/AnalyticsPage';
import PaymentsPage from '../../pages/admin/PaymentsPage';
import SubscriptionsManagementPage from '../../pages/admin/SubscriptionsManagementPage';
import SecurityLogsPage from '../../pages/admin/SecurityLogsPage';
import SupportTicketsPage from '../../pages/admin/SupportTicketsPage';
import SystemSettingsPage from '../../pages/admin/SystemSettingsPage';
import AnnouncementsPage from '../../pages/admin/AnnouncementsPage';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const AdminLayout = () => {
  const [activePath, setActivePath] = useState('/admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: '📊', label: 'Admin Overview', path: '/admin' },
    { icon: '👤', label: 'Users', path: '/admin/users' },
    { icon: '🏢', label: 'Workspaces', path: '/admin/workspaces' },
    { icon: '📈', label: 'Reports', path: '/admin/reports' },
    { icon: '📉', label: 'Analytics', path: '/admin/analytics' },
    { icon: '💳', label: 'Payments', path: '/admin/payments' },
    { icon: '📦', label: 'Subscriptions', path: '/admin/subscriptions' },
    { icon: '🔒', label: 'Security Logs', path: '/admin/security' },
    { icon: '🎫', label: 'Support Tickets', path: '/admin/support' },
    { icon: '📢', label: 'Announcements', path: '/admin/announcements' },
    { icon: '⚙️', label: 'System Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          {/* Admin Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold">
                  AD
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Admin Panel</h2>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setActivePath(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activePath === item.path
                    ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-slate-200">
            <div className="bg-slate-50 rounded-2xl p-4">
              <h4 className="font-semibold text-slate-900 mb-2">System Status</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">All systems operational</span>
              </div>
              <p className="text-xs text-slate-500">99.9% uptime</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                ☰
              </button>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Admin</span>
                <span>/</span>
                <span className="text-slate-900 font-medium">
                  {menuItems.find(item => item.path === activePath)?.label || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Global Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                <span className="text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search users, workspaces..."
                  className="bg-transparent border-none outline-none w-64 text-slate-700"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
                🔔
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Theme Toggle */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
                🌙
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AD
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-900">Admin</span>
                <span className="text-slate-400">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activePath === '/admin' && <AdminOverviewPage />}
          {activePath === '/admin/users' && <UsersManagementPage />}
          {activePath === '/admin/workspaces' && <WorkspacesManagementPage />}
          {activePath === '/admin/reports' && <ReportsPage />}
          {activePath === '/admin/analytics' && <AnalyticsPage />}
          {activePath === '/admin/payments' && <PaymentsPage />}
          {activePath === '/admin/subscriptions' && <SubscriptionsManagementPage />}
          {activePath === '/admin/security' && <SecurityLogsPage />}
          {activePath === '/admin/support' && <SupportTicketsPage />}
          {activePath === '/admin/settings' && <SystemSettingsPage />}
          {activePath === '/admin/announcements' && <AnnouncementsPage />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
