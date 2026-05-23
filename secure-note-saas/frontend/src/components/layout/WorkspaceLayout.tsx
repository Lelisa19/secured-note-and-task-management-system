import { useState } from 'react';
import WorkspaceOverviewPage from '../../pages/workspace/WorkspaceOverviewPage';
import SharedNotesPage from '../../pages/workspace/SharedNotesPage';
import TeamTasksPage from '../../pages/workspace/TeamTasksPage';
import MembersPage from '../../pages/workspace/MembersPage';
import RolesPermissionsPage from '../../pages/workspace/RolesPermissionsPage';
import ProjectsPage from '../../pages/workspace/ProjectsPage';
import FilesPage from '../../pages/workspace/FilesPage';
import ActivityLogsPage from '../../pages/workspace/ActivityLogsPage';
import WorkspaceAnalyticsPage from '../../pages/workspace/WorkspaceAnalyticsPage';
import WorkspaceBillingPage from '../../pages/workspace/WorkspaceBillingPage';
import WorkspaceSettingsPage from '../../pages/workspace/WorkspaceSettingsPage';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const WorkspaceLayout = () => {
  const [activePath, setActivePath] = useState('/workspace');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: '📊', label: 'Overview', path: '/workspace' },
    { icon: '📝', label: 'Shared Notes', path: '/workspace/notes' },
    { icon: '✅', label: 'Team Tasks', path: '/workspace/tasks' },
    { icon: '👥', label: 'Members', path: '/workspace/members' },
    { icon: '🔒', label: 'Roles & Permissions', path: '/workspace/permissions' },
    { icon: '📁', label: 'Projects', path: '/workspace/projects' },
    { icon: '📄', label: 'Files', path: '/workspace/files' },
    { icon: '📋', label: 'Activity Logs', path: '/workspace/activity' },
    { icon: '📈', label: 'Analytics', path: '/workspace/analytics' },
    { icon: '💳', label: 'Billing', path: '/workspace/billing' },
    { icon: '⚙️', label: 'Settings', path: '/workspace/settings' },
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
          {/* Workspace Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                  SF
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Design Team</h2>
                  <p className="text-xs text-slate-500">Workspace</p>
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
                    ? 'bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Invite Member Card */}
          <div className="p-4 border-t border-slate-200">
            <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Invite Team Member</h4>
              <p className="text-xs text-slate-600 mb-3">Add more members to your workspace.</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium">
                Invite Member
              </button>
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
              
              {/* Workspace Switcher */}
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                <span className="font-medium text-slate-900">Design Team</span>
                <span className="text-slate-400">▼</span>
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 max-w-md">
                <span className="text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search team, notes, tasks..."
                  className="bg-transparent border-none outline-none w-full text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
                🔔
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Team Avatars */}
              <div className="hidden md:flex items-center -space-x-2">
                {['JD', 'JS', 'MJ', 'DK'].map((avatar, idx) => (
                  <div key={idx} className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {avatar}
                  </div>
                ))}
                <button className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border-2 border-white text-sm font-bold">
                  +
                </button>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  JD
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-900">John Doe</span>
                <span className="text-slate-400">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activePath === '/workspace' && <WorkspaceOverviewPage />}
          {activePath === '/workspace/notes' && <SharedNotesPage />}
          {activePath === '/workspace/tasks' && <TeamTasksPage />}
          {activePath === '/workspace/members' && <MembersPage />}
          {activePath === '/workspace/permissions' && <RolesPermissionsPage />}
          {activePath === '/workspace/projects' && <ProjectsPage />}
          {activePath === '/workspace/files' && <FilesPage />}
          {activePath === '/workspace/activity' && <ActivityLogsPage />}
          {activePath === '/workspace/analytics' && <WorkspaceAnalyticsPage />}
          {activePath === '/workspace/billing' && <WorkspaceBillingPage />}
          {activePath === '/workspace/settings' && <WorkspaceSettingsPage />}
          {/* All Workspace Pages are now complete! */}
        </div>
      </main>
    </div>
  );
};

export default WorkspaceLayout;
