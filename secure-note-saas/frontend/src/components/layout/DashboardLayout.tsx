import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../lib/context/AppContext';
import { ContextSwitcher } from './ContextSwitcher';
import { CreateWorkspaceModal } from '../workspace/CreateWorkspaceModal';
import { WorkspaceInvitationsModal } from '../workspace/WorkspaceInvitationsModal';

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
import NoteEditorPage from '../../pages/dashboard/NoteEditorPage';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const personalMenuItems: MenuItem[] = [
  { icon: '📊', label: 'Overview', path: '/dashboard' },
  { icon: '📝', label: 'My Notes', path: '/dashboard/notes' },
  { icon: '✅', label: 'My Tasks', path: '/dashboard/tasks' },
  { icon: '📅', label: 'Calendar', path: '/dashboard/calendar' },
  { icon: '⏰', label: 'Reminders', path: '/dashboard/reminders' },
  { icon: '⭐', label: 'Favorites', path: '/dashboard/favorites' },
  { icon: '📈', label: 'Activity', path: '/dashboard/activity' },
  { icon: '🔒', label: 'Security', path: '/dashboard/security' },
  { icon: '👤', label: 'Profile', path: '/dashboard/profile' },
  { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
];

const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};

const isNavActive = (pathname: string, itemPath: string) => {
  if (itemPath === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/dashboard/';
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, workspaces, invitationCount, loading, refreshWorkspaces, logout } = useAppContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              SecureFlow
            </h1>
            <p className="text-xs font-semibold text-slate-400">Personal Dashboard</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Private Space</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin')}
              className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-200"
              title="Super Admin Panel"
            >
              ADMIN
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Private Space
            </div>
            <ul className="space-y-1">
              {personalMenuItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isNavActive(location.pathname, item.path)
                        ? 'bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Collaboration
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-emerald-500 text-white hover:shadow-md transition-all"
              >
                <span>➕</span>
                <span>Create Workspace</span>
              </button>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase px-3 mb-1">
                  <span>📂</span>
                  <span>My Workspaces</span>
                </div>
                {workspaces.length === 0 ? (
                  <p className="text-xs text-slate-400 px-3 py-1">No workspaces yet</p>
                ) : (
                  <ul className="space-y-1">
                    {workspaces.map((ws) => (
                      <li key={ws.id}>
                        <button
                          onClick={() => {
                            navigate(`/workspace/${ws.id}`);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left truncate"
                        >
                          <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0">
                            {ws.logo || ws.name[0]}
                          </span>
                          <span className="truncate">{ws.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors mt-2"
              >
                <div className="flex items-center gap-2">
                  <span>📩</span>
                  <span>Workspace Invitations</span>
                </div>
                {invitationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {invitationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user ? getInitials(user.fullName) : 'U'}
            </div>
            <div className="truncate flex-1">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {user?.fullName || 'User'}
              </div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              ☰
            </button>
            <ContextSwitcher currentContext="personal" />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
              title="Workspace Invitations"
            >
              🔔
              {invitationCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>

            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user ? getInitials(user.fullName) : 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="notes/:id" element={<NoteEditorPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="archived-notes" element={<ArchivedNotesPage />} />
            <Route path="trash" element={<TrashPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refreshWorkspaces}
      />

      <WorkspaceInvitationsModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvitationAccepted={refreshWorkspaces}
      />
    </div>
  );
};

export default DashboardLayout;
