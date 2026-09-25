import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { useAppContext } from '../../lib/context/AppContext';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const getInitials = (name: string) => {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0].toUpperCase();
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const personalMenuItems: MenuItem[] = [
    { icon: '👤', label: 'My Profile', path: '/dashboard/profile' },
    { icon: '⚙️', label: 'My Settings', path: '/dashboard/settings' },
    { icon: '🛡️', label: 'Security', path: '/dashboard/security' },
    { icon: '💳', label: 'Billing', path: '/dashboard/billing' },
    { icon: '📦', label: 'Subscription', path: '/dashboard/subscription' },
  ];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const activePath =
    location.pathname.endsWith('/admin') || location.pathname === '/admin'
      ? '/admin'
      : location.pathname;

  const isNavActive = (itemPath: string) => {
    if (itemPath === '/admin') {
      return location.pathname === '/admin' || location.pathname.endsWith('/admin');
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
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

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="pb-3 mb-3 border-b border-slate-100">
              <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform</p>
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isNavActive(item.path)
                      ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div>
              <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">My Account</p>
              {personalMenuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                      ? 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200 space-y-2">
            <div className="bg-slate-50 rounded-2xl p-4 mb-2">
              <h4 className="font-semibold text-slate-900 mb-2">System Status</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">All systems operational</span>
              </div>
              <p className="text-xs text-slate-500">Status not available yet.</p>
            </div>

            <button
              onClick={() => navigate('/dashboard/profile')}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user ? getInitials(user.fullName) : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {user?.fullName || 'Admin'}
                </div>
                <div className="text-xs text-slate-400 truncate">{user?.email}</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium"
            >
              <span>🏠</span>
              <span>Back to My Dashboard</span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                ☰
              </button>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Admin</span>
                <span>/</span>
                <span className="text-slate-900 font-medium">
                  {menuItems.find((item) => item.path === activePath)?.label || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                <span className="text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search users, workspaces..."
                  className="bg-transparent border-none outline-none w-64 text-slate-700"
                />
              </div>

              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
                🔔
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
                🌙
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 hover:bg-slate-50 rounded-xl transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user ? getInitials(user.fullName) : 'A'}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                      {user?.fullName || 'Admin'}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      Super Admin
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs">▾</span>
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-slate-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {user?.fullName || 'Admin'}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                    </div>
                    {personalMenuItems.map((item) => (
                      <button
                        key={item.path}
                        role="menuitem"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate(item.path);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <div className="my-1 border-t border-slate-100"></div>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    >
                      <span>🏠</span>
                      <span>Back to My Dashboard</span>
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="workspaces" element={<WorkspacesManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="subscriptions" element={<SubscriptionsManagementPage />} />
            <Route path="security" element={<SecurityLogsPage />} />
            <Route path="support" element={<SupportTicketsPage />} />
            <Route path="settings" element={<SystemSettingsPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
