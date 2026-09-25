import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface WorkspaceOwner {
  id: string;
  fullName: string;
  email: string;
}

interface WorkspaceCounts {
  members: number;
  notes: number;
  tasks: number;
}

interface AdminWorkspace {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: WorkspaceOwner;
  _count: WorkspaceCounts;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: string;
}

const fmtDate = (d?: string | null) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString(); } catch { return String(d); }
};

const fmtAgo = (d?: string | null) => {
  if (!d) return '—';
  try {
    const diff = Date.now() - new Date(d).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return '—'; }
};

const WorkspacesManagementPage = () => {
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All Plans');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest('/admin/workspaces');
      setWorkspaces(Array.isArray(res) ? res : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const total = workspaces.length;
  const newThisWeek = workspaces.filter((w) => Date.now() - new Date(w.createdAt).getTime() <= 7 * 864e5).length;
  const totalStorageGB = workspaces.length * 0.5;

  const stats: Stat[] = [
    { label: 'Total Workspaces', value: total.toLocaleString(), change: `+${newThisWeek}`, color: 'from-blue-500 to-blue-600', icon: '🏢' },
    { label: 'Active Workspaces', value: total.toLocaleString(), change: `+${newThisWeek}`, color: 'from-emerald-500 to-emerald-600', icon: '✅' },
    { label: 'New This Week', value: newThisWeek.toLocaleString(), change: `+${newThisWeek}`, color: 'from-purple-500 to-purple-600', icon: '🎉' },
    { label: 'Total Storage (est.)', value: `${totalStorageGB.toFixed(1)} GB`, change: `+${totalStorageGB.toFixed(0)} GB`, color: 'from-orange-500 to-orange-600', icon: '💾' },
  ];

  const filteredWorkspaces = workspaces.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.owner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.owner.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'All Plans';
    const matchesStatus = statusFilter === 'All Status';
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const toggleWorkspaceStatus = (_id: string) => {
    alert('Workspace suspension is not yet wired in the backend.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspaces Management</h1>
          <p className="text-slate-600">All workspaces across the platform</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white text-2xl`}>{s.icon}</div>
              <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">{s.change}</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{s.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:flex-none sm:w-80">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-slate-700"
              />
            </div>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Plans</option>
              <option>Free</option>
              <option>Pro</option>
              <option>Business</option>
              <option>Enterprise</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl w-fit">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'card' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
            >
              🗂️ Card
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
            >
              📋 Table
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">Loading workspaces…</div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">No workspaces found.</div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((ws) => (
            <div key={ws.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {ws.logo || ws.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{ws.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{ws.owner.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700`}>active</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-slate-900">{ws._count.members}</p>
                  <p className="text-[10px] text-slate-500">Members</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-slate-900">{ws._count.notes}</p>
                  <p className="text-[10px] text-slate-500">Notes</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-slate-900">{ws._count.tasks}</p>
                  <p className="text-[10px] text-slate-500">Tasks</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Storage</span>
                  <span>~{((ws._count.notes + ws._count.tasks) * 0.02).toFixed(1)} MB / ~5 GB</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, ((ws._count.notes + ws._count.tasks) * 0.02 / 5000) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Created {fmtDate(ws.createdAt)}</span>
                <button
                  onClick={() => toggleWorkspaceStatus(ws.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors"
                >
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stats</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Active</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkspaces.map((ws) => (
                <tr key={ws.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">{ws.logo || ws.name[0]}</div>
                      <div>
                        <p className="font-medium text-slate-900">{ws.name}</p>
                        <p className="text-xs text-slate-500">{ws._count.members} members</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{ws.owner.fullName}</p>
                    <p className="text-xs text-slate-500">{ws.owner.email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    📝 {ws._count.notes} · ✅ {ws._count.tasks}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">~{((ws._count.notes + ws._count.tasks) * 0.02).toFixed(1)} MB</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fmtDate(ws.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fmtAgo(ws.updatedAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => toggleWorkspaceStatus(ws.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkspacesManagementPage;
