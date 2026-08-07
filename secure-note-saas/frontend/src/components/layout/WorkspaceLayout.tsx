import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { WorkspaceProvider, type WorkspaceDetails } from '../../lib/context/WorkspaceContext';
import { ContextSwitcher } from './ContextSwitcher';

import WorkspaceOverviewPage from '../../pages/workspace/WorkspaceOverviewPage';
import SharedNotesPage from '../../pages/workspace/SharedNotesPage';
import TeamTasksPage from '../../pages/workspace/TeamTasksPage';
import MembersPage from '../../pages/workspace/MembersPage';
import RolesPermissionsPage from '../../pages/workspace/RolesPermissionsPage';
import ProjectsPage from '../../pages/workspace/ProjectsPage';
import FilesPage from '../../pages/workspace/FilesPage';
import ActivityLogsPage from '../../pages/workspace/ActivityLogsPage';
import WorkspaceSettingsPage from '../../pages/workspace/WorkspaceSettingsPage';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const workspaceMenuItems: MenuItem[] = [
  { icon: '📊', label: 'Team Overview', path: '' },
  { icon: '📝', label: 'Shared Notes', path: 'notes' },
  { icon: '✅', label: 'Team Tasks', path: 'tasks' },
  { icon: '📁', label: 'Projects', path: 'projects' },
  { icon: '👥', label: 'Members', path: 'members' },
  { icon: '🔒', label: 'Roles & Permissions', path: 'permissions' },
  { icon: '📄', label: 'Shared Files', path: 'files' },
  { icon: '📋', label: 'Activity Logs', path: 'activity' },
  { icon: '⚙️', label: 'Workspace Settings', path: 'settings' },
];

const isWorkspaceNavActive = (pathname: string, basePath: string, segment: string) => {
  if (segment === '') {
    return pathname === basePath || pathname === `${basePath}/`;
  }
  return pathname === `${basePath}/${segment}` || pathname.startsWith(`${basePath}/${segment}/`);
};

const WorkspaceLayout = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const basePath = `/workspace/${workspaceId}`;

  useEffect(() => {
    if (!workspaceId) {
      navigate('/dashboard', { replace: true });
      return;
    }

    setLoading(true);
    apiRequest<WorkspaceDetails>(`/workspaces/${workspaceId}`)
      .then((data) => setWorkspace(data))
      .catch((err) => {
        console.error('Failed to load workspace:', err);
        navigate('/dashboard', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [workspaceId, navigate]);

  if (loading || !workspace || !workspaceId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <WorkspaceProvider workspace={workspace} workspaceId={workspaceId}>
      <div className="flex h-screen bg-slate-50">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                  {workspace.logo || workspace.name[0]}
                </div>
                <div className="truncate">
                  <h2 className="font-bold text-slate-900 truncate">{workspace.name}</h2>
                  <p className="text-xs text-indigo-600 font-medium">Workspace Dashboard</p>
                  <p className="text-[10px] text-slate-400">Shared Collaboration Space</p>
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
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Team Collaboration
            </div>
            {workspaceMenuItems.map((item) => (
              <button
                key={item.path || 'overview'}
                onClick={() => {
                  navigate(item.path ? `${basePath}/${item.path}` : basePath);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                  isWorkspaceNavActive(location.pathname, basePath, item.path)
                    ? 'bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>👤</span>
              <span>Return to Personal</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                ☰
              </button>
              <ContextSwitcher currentContext={workspaceId} />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Exit Workspace
              </button>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route index element={<WorkspaceOverviewPage />} />
              <Route path="notes" element={<SharedNotesPage />} />
              <Route path="tasks" element={<TeamTasksPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="permissions" element={<RolesPermissionsPage />} />
              <Route path="files" element={<FilesPage />} />
              <Route path="activity" element={<ActivityLogsPage />} />
              <Route path="settings" element={<WorkspaceSettingsPage />} />
              <Route path="*" element={<Navigate to={basePath} replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </WorkspaceProvider>
  );
};

export default WorkspaceLayout;
