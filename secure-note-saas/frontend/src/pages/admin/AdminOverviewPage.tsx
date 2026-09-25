import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

interface AdminStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalNotes: number;
  totalTasks: number;
  activeSubscriptions: number;
}

interface RecentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminOverviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const quickActions = [
    { icon: '👤', label: 'Manage Users', color: 'from-blue-500 to-blue-600', path: '/admin/users' },
    { icon: '🏢', label: 'All Workspaces', color: 'from-indigo-500 to-indigo-600', path: '/admin/workspaces' },
    { icon: '📢', label: 'Announcements', color: 'from-purple-500 to-purple-600', path: '/admin/announcements' },
    { icon: '⚙️', label: 'System Settings', color: 'from-emerald-500 to-emerald-600', path: '/admin/settings' },
  ];

  const systemHealth: { name: string; status: 'healthy' | 'warning' | 'critical'; uptime: string; }[] = [];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiRequest('/admin/stats');
        if (!cancelled) {
          setStats(data.stats);
          setRecentUsers(data.recentUsers || []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load admin stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fmtNumber = (n: number | undefined | null) => {
    if (n === undefined || n === null) return '0';
    return n.toLocaleString();
  };

  const fmtDate = (s: string) => {
    try {
      return new Date(s).toLocaleDateString();
    } catch {
      return s;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return (
      ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-600">Platform control center — monitor users, workspaces & activity.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/reports')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Export Report
          </button>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25"
          >
            View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              👥
            </div>
            <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '…' : error ? 'N/A' : fmtNumber(stats?.totalUsers)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              🏢
            </div>
            <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Workspaces</h3>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '…' : error ? 'N/A' : fmtNumber(stats?.totalWorkspaces)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
              📝
            </div>
            <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Notes</h3>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '…' : error ? 'N/A' : fmtNumber(stats?.totalNotes)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl">
              📦
            </div>
            <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Active Subscriptions</h3>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? '…' : error ? 'N/A' : fmtNumber(stats?.activeSubscriptions)}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">
          ⚠️ Could not load live stats: {error} — ensure your backend server is running.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Platform Growth</h3>
              <p className="text-sm text-slate-500">Aggregate usage across the system</p>
            </div>
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full px-6 text-center">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-3xl font-bold text-indigo-600">
                  {loading ? '…' : fmtNumber(stats?.totalUsers)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Users</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-3xl font-bold text-purple-600">
                  {loading ? '…' : fmtNumber(stats?.totalWorkspaces)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Workspaces</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-3xl font-bold text-emerald-600">
                  {loading ? '…' : fmtNumber(stats?.totalNotes)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Notes</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-3xl font-bold text-orange-600">
                  {loading ? '…' : fmtNumber(stats?.totalTasks)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Tasks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">System Health</h3>
          <div className="space-y-4">
            {systemHealth.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                System health data not available yet.
              </div>
            ) : (
              systemHealth.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'healthy'
                          ? 'bg-emerald-500'
                          : item.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">{item.uptime}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-3">Active Subscriptions</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-xl p-4 text-center border border-slate-200">
                <p className="text-3xl font-bold text-emerald-600">
                  {loading ? '…' : fmtNumber(stats?.activeSubscriptions)}
                </p>
                <p className="text-xs text-emerald-700 mt-1">Currently Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className={`p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md group text-left`}
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-white text-xl mb-2 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Signups</h3>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
            >
              View All Users
            </button>
          </div>
          <div className="space-y-3">
            {loading && (
              <p className="text-sm text-slate-400 px-3 py-8 text-center">Loading recent users…</p>
            )}
            {!loading && recentUsers.length === 0 && (
              <p className="text-sm text-slate-400 px-3 py-8 text-center">No users yet</p>
            )}
            {!loading &&
              recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      u.role === 'ADMIN'
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                        : 'bg-gradient-to-br from-emerald-500 to-indigo-500'
                    }`}
                  >
                    {getInitials(u.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{u.fullName}</p>
                      {u.role === 'ADMIN' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{fmtDate(u.createdAt)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
