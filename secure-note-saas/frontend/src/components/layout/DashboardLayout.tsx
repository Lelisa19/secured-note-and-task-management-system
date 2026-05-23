import { useState } from 'react';
import DashboardOverviewPage from '../../pages/dashboard/DashboardOverviewPage';
import NotesPage from '../../pages/dashboard/NotesPage';
import TasksPage from '../../pages/dashboard/TasksPage';
import CalendarPage from '../../pages/dashboard/CalendarPage';
import RemindersPage from '../../pages/dashboard/RemindersPage';
import FavoritesPage from '../../pages/dashboard/FavoritesPage';
import NotificationsPage from '../../pages/dashboard/NotificationsPage';
import ActivityPage from '../../pages/dashboard/ActivityPage';
import SecurityPage from '../../pages/dashboard/SecurityPage';
import ProfilePage from '../../pages/dashboard/ProfilePage';
import SettingsPage from '../../pages/dashboard/SettingsPage';
import BillingPage from '../../pages/dashboard/BillingPage';
import SubscriptionPage from '../../pages/dashboard/SubscriptionPage';
import ArchivedNotesPage from '../../pages/dashboard/ArchivedNotesPage';
import TrashPage from '../../pages/dashboard/TrashPage';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '📝', label: 'Notes', path: '/dashboard/notes' },
  { icon: '✅', label: 'Tasks', path: '/dashboard/tasks' },
  { icon: '📅', label: 'Calendar', path: '/dashboard/calendar' },
  { icon: '⏰', label: 'Reminders', path: '/dashboard/reminders' },
  { icon: '⭐', label: 'Favorites', path: '/dashboard/favorites' },
  { icon: '🔔', label: 'Notifications', path: '/dashboard/notifications' },
  { icon: '📈', label: 'Activity', path: '/dashboard/activity' },
  { icon: '🔒', label: 'Security', path: '/dashboard/security' },
  { icon: '👤', label: 'Profile', path: '/dashboard/profile' },
  { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
  { icon: '💳', label: 'Billing', path: '/dashboard/billing' },
  { icon: '📦', label: 'Subscription', path: '/dashboard/subscription' },
];

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            SecureFlow
          </h1>
        </div>

        {/* Workspace Switcher */}
        <div className="p-4 border-b border-slate-200">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">My Workspace</div>
                <div className="text-xs text-slate-500">Free Plan</div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">▼</button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    setActivePath(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activePath === item.path
                      ? 'bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Upgrade Plan Card */}
        <div className="p-4 border-t border-slate-200">
          <div className="bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-1">Upgrade to Pro</h3>
            <p className="text-sm opacity-90 mb-3">Unlock all features and unlimited storage</p>
            <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold text-sm">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              ☰
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-slate-400">Home</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-medium">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            {/* Theme Toggle */}
            <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              🌙
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activePath === '/dashboard' && <DashboardOverviewPage />}
          {activePath === '/dashboard/notes' && <NotesPage />}
          {activePath === '/dashboard/tasks' && <TasksPage />}
          {activePath === '/dashboard/calendar' && <CalendarPage />}
          {activePath === '/dashboard/reminders' && <RemindersPage />}
          {activePath === '/dashboard/favorites' && <FavoritesPage />}
          {activePath === '/dashboard/notifications' && <NotificationsPage />}
          {activePath === '/dashboard/activity' && <ActivityPage />}
          {activePath === '/dashboard/security' && <SecurityPage />}
          {activePath === '/dashboard/profile' && <ProfilePage />}
          {activePath === '/dashboard/settings' && <SettingsPage />}
          {activePath === '/dashboard/billing' && <BillingPage />}
          {activePath === '/dashboard/subscription' && <SubscriptionPage />}
          {activePath === '/dashboard/archived-notes' && <ArchivedNotesPage />}
          {activePath === '/dashboard/trash' && <TrashPage />}
          {!['/dashboard', '/dashboard/notes', '/dashboard/tasks', '/dashboard/calendar', '/dashboard/reminders', '/dashboard/favorites', '/dashboard/notifications', '/dashboard/activity', '/dashboard/security', '/dashboard/profile', '/dashboard/settings', '/dashboard/billing', '/dashboard/subscription', '/dashboard/archived-notes', '/dashboard/trash'].includes(activePath) && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Under Construction</h2>
              <p className="text-slate-600">This page is currently being built. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
