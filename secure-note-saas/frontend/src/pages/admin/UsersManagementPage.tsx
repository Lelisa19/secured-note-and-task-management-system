import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface AdminUserSubscription {
  id?: string;
  plan?: string;
  isActive?: boolean;
  startDate?: string;
}

interface AdminUserCounts {
  notes: number;
  createdTasks: number;
  ownedWorkspaces: number;
}

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  subscription?: AdminUserSubscription | null;
  _count: AdminUserCounts;
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
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return String(d);
  }
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
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  } catch {
    return '—';
  }
};

const UsersManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const usersPerPage = 6;

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest('/admin/users');
      setUsers(Array.isArray(res) ? res : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isVerified).length;
  const suspended = 0;
  const newThisWeek = users.filter((u) => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(u.createdAt).getTime() >= cutoff;
  }).length;

  const stats: Stat[] = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), change: `+${newThisWeek}`, color: 'from-indigo-500 to-indigo-600', icon: '👥' },
    { label: 'Verified Users', value: activeUsers.toLocaleString(), change: `+${activeUsers}`, color: 'from-emerald-500 to-emerald-600', icon: '✅' },
    { label: 'New This Week', value: newThisWeek.toLocaleString(), change: `+${newThisWeek}`, color: 'from-purple-500 to-purple-600', icon: '🎉' },
    { label: 'Suspended', value: suspended.toLocaleString(), change: `-${suspended}`, color: 'from-amber-500 to-amber-600', icon: '🚫' },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' ||
      (roleFilter === 'Admin' && user.role === 'ADMIN') ||
      (roleFilter === 'Free User' && user.role === 'USER') ||
      (roleFilter === 'Pro User' && user.role === 'USER');
    const matchesStatus = statusFilter === 'All Status' ||
      (statusFilter === 'active' && user.isVerified) ||
      (statusFilter === 'suspended' && !user.isVerified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
  };

  const displayRole = (role: string, plan?: string) => {
    if (role === 'ADMIN') return 'Admin';
    if (plan === 'PRO' || plan === 'BUSINESS' || plan === 'ENTERPRISE') return 'Pro User';
    return 'Free User';
  };

  const handleRoleChange = async (user: AdminUser, newRole: 'USER' | 'ADMIN') => {
    try {
      setActingId(user.id);
      await apiRequest(`/admin/users/${user.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    } catch (e: any) {
      alert(e?.message || 'Failed to update role');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600">View, search, and manage all platform users</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={load}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            {loading ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
              <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:flex-none sm:w-80">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none outline-none flex-1 text-slate-700"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>Pro User</option>
              <option>Free User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option>All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading users…</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              {searchQuery || roleFilter !== 'All Roles' || statusFilter !== 'All Status'
                ? 'No users match your filters.'
                : 'No users yet.'}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Activity</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Active</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentUsers.map((user) => {
                  const plan = user.subscription?.plan || 'FREE';
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                            {getInitials(user.fullName)}
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="font-medium text-slate-900 truncate text-left hover:text-indigo-600"
                            >
                              {user.fullName}
                            </button>
                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : plan === 'FREE'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {displayRole(user.role, plan)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.isVerified ? 'active' : 'unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{fmtDate(user.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>🏢 {user._count.ownedWorkspaces}</span>
                          <span>📝 {user._count.notes}</span>
                          <span>✅ {user._count.createdTasks}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{fmtAgo(user.updatedAt)}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {actingId === user.id ? (
                          <span className="text-xs text-slate-400">saving…</span>
                        ) : user.role === 'ADMIN' ? (
                          <button
                            onClick={() => handleRoleChange(user, 'USER')}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                          >
                            Demote to User
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user, 'ADMIN')}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          >
                            Promote to Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Showing {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(selectedUser.fullName)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedUser.fullName}</h3>
                  <p className="text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-slate-500">Role</dt>
                  <dd className="font-medium text-slate-900">{selectedUser.role}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Plan</dt>
                  <dd className="font-medium text-slate-900">{selectedUser.subscription?.plan || 'FREE'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Verified</dt>
                  <dd className="font-medium text-slate-900">{selectedUser.isVerified ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">2FA Enabled</dt>
                  <dd className="font-medium text-slate-900">{selectedUser.twoFactorEnabled ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Joined</dt>
                  <dd className="font-medium text-slate-900">{fmtDate(selectedUser.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Workspaces Owned</dt>
                  <dd className="font-medium text-slate-900">{selectedUser._count.ownedWorkspaces}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Notes</dt>
                  <dd className="font-medium text-slate-900">{selectedUser._count.notes}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tasks Created</dt>
                  <dd className="font-medium text-slate-900">{selectedUser._count.createdTasks}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;
