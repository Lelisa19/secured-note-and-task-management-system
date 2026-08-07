import { useState } from 'react';

interface Workspace {
  id: number;
  name: string;
  owner: {
    name: string;
    email: string;
  };
  members: number;
  notes: number;
  tasks: number;
  storage: {
    used: string;
    total: string;
    percentage: number;
  };
  status: 'active' | 'suspended' | 'archived';
  plan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  createdAt: string;
  lastActivity: string;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: string;
}

const WorkspacesManagementPage = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 1,
      name: 'Acme Corp HQ',
      owner: { name: 'John Doe', email: 'john@example.com' },
      members: 24,
      notes: 156,
      tasks: 89,
      storage: { used: '2.4 GB', total: '10 GB', percentage: 24 },
      status: 'active',
      plan: 'Enterprise',
      createdAt: 'Jan 10, 2024',
      lastActivity: '5 minutes ago'
    },
    {
      id: 2,
      name: 'Startup Inc',
      owner: { name: 'Sarah Miller', email: 'sarah@example.com' },
      members: 8,
      notes: 67,
      tasks: 45,
      storage: { used: '850 MB', total: '5 GB', percentage: 17 },
      status: 'active',
      plan: 'Pro',
      createdAt: 'Feb 15, 2024',
      lastActivity: '20 minutes ago'
    },
    {
      id: 3,
      name: 'Design Studio',
      owner: { name: 'Mike Johnson', email: 'mike@example.com' },
      members: 5,
      notes: 34,
      tasks: 12,
      storage: { used: '3.2 GB', total: '5 GB', percentage: 64 },
      status: 'suspended',
      plan: 'Pro',
      createdAt: 'Mar 05, 2024',
      lastActivity: '2 days ago'
    },
    {
      id: 4,
      name: 'Dev Team',
      owner: { name: 'Emily Davis', email: 'emily@example.com' },
      members: 12,
      notes: 98,
      tasks: 56,
      storage: { used: '1.8 GB', total: '10 GB', percentage: 18 },
      status: 'active',
      plan: 'Business',
      createdAt: 'Apr 20, 2024',
      lastActivity: '1 hour ago'
    },
    {
      id: 5,
      name: 'Marketing Team',
      owner: { name: 'David Wilson', email: 'david@example.com' },
      members: 6,
      notes: 45,
      tasks: 32,
      storage: { used: '1.2 GB', total: '5 GB', percentage: 24 },
      status: 'active',
      plan: 'Free',
      createdAt: 'May 01, 2024',
      lastActivity: '3 hours ago'
    },
    {
      id: 6,
      name: 'Research Group',
      owner: { name: 'Jessica Brown', email: 'jessica@example.com' },
      members: 15,
      notes: 120,
      tasks: 78,
      storage: { used: '4.5 GB', total: '10 GB', percentage: 45 },
      status: 'active',
      plan: 'Enterprise',
      createdAt: 'Jun 10, 2024',
      lastActivity: 'Just now'
    },
  ]);

  const [stats] = useState<Stat[]>([
    { label: 'Total Workspaces', value: '3,421', change: '+128', color: 'from-blue-500 to-blue-600', icon: '🏢' },
    { label: 'Active Workspaces', value: '3,105', change: '+89', color: 'from-emerald-500 to-emerald-600', icon: '✅' },
    { label: 'New This Week', value: '47', change: '+12', color: 'from-purple-500 to-purple-600', icon: '🎉' },
    { label: 'Total Storage', value: '12.4 TB', change: '+2.1 TB', color: 'from-orange-500 to-orange-600', icon: '💾' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All Plans');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         workspace.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.owner.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'All Plans' || workspace.plan === planFilter;
    const matchesStatus = statusFilter === 'All Status' || workspace.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const toggleWorkspaceStatus = (workspaceId: number) => {
    setWorkspaces(workspaces.map((workspace) => {
      if (workspace.id === workspaceId) {
        return { 
          ...workspace, 
          status: workspace.status === 'active' ? 'suspended' : 'active' 
        };
      }
      return workspace;
    }));
  };

  const deleteWorkspace = (workspaceId: number) => {
    if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      setWorkspaces(workspaces.filter(workspace => workspace.id !== workspaceId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspaces Management</h1>
          <p className="text-slate-600">Manage all workspaces across the SecureFlow platform</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25">
            + Create Workspace
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-slate-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
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
              <select 
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Plans</option>
                <option>Free</option>
                <option>Pro</option>
                <option>Business</option>
                <option>Enterprise</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
                <option>Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'card' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'card' ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => (
              <div key={workspace.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {workspace.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{workspace.name}</h3>
                      <p className="text-xs text-slate-500">{workspace.owner.name}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    workspace.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                    workspace.plan === 'Business' ? 'bg-blue-100 text-blue-700' :
                    workspace.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {workspace.plan}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      workspace.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      workspace.status === 'suspended' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        workspace.status === 'active' ? 'bg-emerald-500' : 
                        workspace.status === 'suspended' ? 'bg-amber-500' :
                        'bg-slate-500'
                      }`}></div>
                      {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-500">Storage</span>
                      <span className="text-slate-700 font-medium">{workspace.storage.used} / {workspace.storage.total}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          workspace.storage.percentage > 80 ? 'bg-red-500' : 
                          workspace.storage.percentage > 60 ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${workspace.storage.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-lg font-bold text-slate-900">{workspace.members}</p>
                      <p className="text-xs text-slate-500">Members</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-lg font-bold text-slate-900">{workspace.notes}</p>
                      <p className="text-xs text-slate-500">Notes</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-lg font-bold text-slate-900">{workspace.tasks}</p>
                      <p className="text-xs text-slate-500">Tasks</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
                    View Details
                  </button>
                  <button 
                    onClick={() => toggleWorkspaceStatus(workspace.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      workspace.status === 'active' 
                        ? 'text-amber-600 hover:bg-amber-50' 
                        : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {workspace.status === 'active' ? '🚫' : '✅'}
                  </button>
                  <button 
                    onClick={() => deleteWorkspace(workspace.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Workspace</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Owner</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Members</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Storage</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkspaces.map((workspace) => (
                  <tr key={workspace.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {workspace.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{workspace.name}</p>
                          <p className="text-xs text-slate-500">Created {workspace.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-slate-900">{workspace.owner.name}</p>
                        <p className="text-xs text-slate-500">{workspace.owner.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        workspace.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                        workspace.plan === 'Business' ? 'bg-blue-100 text-blue-700' :
                        workspace.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {workspace.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${
                        workspace.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                        workspace.status === 'suspended' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          workspace.status === 'active' ? 'bg-emerald-500' : 
                          workspace.status === 'suspended' ? 'bg-amber-500' :
                          'bg-slate-500'
                        }`}></div>
                        {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-slate-700"><span className="font-medium">{workspace.members}</span> members</p>
                        <p className="text-slate-500 text-xs">{workspace.notes} notes · {workspace.tasks} tasks</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">{workspace.storage.used}</span>
                          <span className="text-slate-700">{workspace.storage.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all ${
                              workspace.storage.percentage > 80 ? 'bg-red-500' : 
                              workspace.storage.percentage > 60 ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${workspace.storage.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                          👁️
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                          ✏️
                        </button>
                        <button 
                          onClick={() => toggleWorkspaceStatus(workspace.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            workspace.status === 'active' 
                              ? 'text-amber-600 hover:bg-amber-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {workspace.status === 'active' ? '🚫' : '✅'}
                        </button>
                        <button 
                          onClick={() => deleteWorkspace(workspace.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacesManagementPage;
