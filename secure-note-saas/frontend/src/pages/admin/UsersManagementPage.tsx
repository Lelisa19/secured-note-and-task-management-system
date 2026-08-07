import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Pro User' | 'Free User';
  status: 'active' | 'suspended';
  joined: string;
  workspaces: number;
  notes: number;
  tasks: number;
  lastActive: string;
  subscription: string;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: string;
}

const UsersManagementPage = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joined: 'Jan 15, 2024', workspaces: 5, notes: 42, tasks: 18, lastActive: '2 minutes ago', subscription: 'Enterprise' },
    { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', role: 'Pro User', status: 'active', joined: 'Feb 20, 2024', workspaces: 3, notes: 28, tasks: 12, lastActive: '15 minutes ago', subscription: 'Pro' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Free User', status: 'suspended', joined: 'Mar 10, 2024', workspaces: 1, notes: 15, tasks: 5, lastActive: '3 days ago', subscription: 'Free' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Pro User', status: 'active', joined: 'Apr 05, 2024', workspaces: 4, notes: 35, tasks: 22, lastActive: '1 hour ago', subscription: 'Pro' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', role: 'Free User', status: 'active', joined: 'May 12, 2024', workspaces: 1, notes: 8, tasks: 3, lastActive: '5 hours ago', subscription: 'Free' },
    { id: 6, name: 'Jessica Brown', email: 'jessica@example.com', role: 'Admin', status: 'active', joined: 'Jun 01, 2024', workspaces: 6, notes: 50, tasks: 30, lastActive: 'Just now', subscription: 'Enterprise' },
    { id: 7, name: 'Chris Lee', email: 'chris@example.com', role: 'Pro User', status: 'active', joined: 'Jul 03, 2024', workspaces: 2, notes: 20, tasks: 10, lastActive: '1 day ago', subscription: 'Pro' },
    { id: 8, name: 'Amanda Taylor', email: 'amanda@example.com', role: 'Free User', status: 'active', joined: 'Aug 10, 2024', workspaces: 1, notes: 12, tasks: 4, lastActive: '2 days ago', subscription: 'Free' },
  ]);

  const [stats] = useState<Stat[]>([
    { label: 'Total Users', value: '12,847', change: '+234', color: 'from-indigo-500 to-indigo-600', icon: '👥' },
    { label: 'Active Users', value: '11,256', change: '+189', color: 'from-emerald-500 to-emerald-600', icon: '✅' },
    { label: 'New This Week', value: '412', change: '+56', color: 'from-purple-500 to-purple-600', icon: '🎉' },
    { label: 'Suspended', value: '152', change: '-8', color: 'from-amber-500 to-amber-600', icon: '🚫' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const usersPerPage = 6;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map((user) => {
      if (user.id === userId) {
        return { ...user, status: user.status === 'active' ? 'suspended' : 'active' };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
          <p className="text-slate-600">Manage all users across the SecureFlow platform</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25">
          + Add User
        </button>
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
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 text-slate-700"
                />
              </div>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Roles</option>
                <option>Admin</option>
                <option>Pro User</option>
                <option>Free User</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Activity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Pro User' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></div>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-slate-700"><span className="font-medium">{user.workspaces}</span> workspaces</p>
                      <p className="text-slate-500 text-xs">{user.notes} notes · {user.tasks} tasks</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        👁️
                      </button>
                      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                        ✏️
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active' 
                            ? 'text-amber-600 hover:bg-amber-50' 
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {user.status === 'active' ? '🚫' : '✅'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-slate-400">...</span>}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">User Profile</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-slate-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUser.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      selectedUser.role === 'Pro User' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {selectedUser.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                      selectedUser.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        selectedUser.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></div>
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">Subscription</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedUser.subscription}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">Joined</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedUser.joined}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">Last Active</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedUser.lastActive}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">Workspaces</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedUser.workspaces}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-slate-900 mb-4">Activity Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <p className="text-3xl font-bold text-indigo-600">{selectedUser.notes}</p>
                    <p className="text-sm text-slate-500">Notes</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <p className="text-3xl font-bold text-emerald-600">{selectedUser.tasks}</p>
                    <p className="text-sm text-slate-500">Tasks</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <p className="text-3xl font-bold text-purple-600">{selectedUser.workspaces}</p>
                    <p className="text-sm text-slate-500">Workspaces</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button 
                onClick={() => toggleUserStatus(selectedUser.id)}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                  selectedUser.status === 'active' 
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
              </button>
              <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;
