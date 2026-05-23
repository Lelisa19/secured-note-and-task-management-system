const AdminOverviewPage = () => {
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new workspace', time: '2 minutes ago', avatar: 'JD' },
    { id: 2, user: 'Sarah Miller', action: 'Upgraded to Pro plan', time: '15 minutes ago', avatar: 'SM' },
    { id: 3, user: 'Mike Johnson', action: 'Changed password', time: '1 hour ago', avatar: 'MJ' },
    { id: 4, user: 'Emily Davis', action: 'Created 5 new notes', time: '2 hours ago', avatar: 'ED' },
    { id: 5, user: 'David Wilson', action: 'Invited 3 team members', time: '3 hours ago', avatar: 'DW' },
  ];

  const quickActions = [
    { icon: '👤', label: 'Add User', color: 'from-blue-500 to-blue-600' },
    { icon: '🏢', label: 'Create Workspace', color: 'from-indigo-500 to-indigo-600' },
    { icon: '📢', label: 'New Announcement', color: 'from-purple-500 to-purple-600' },
    { icon: '🔧', label: 'System Update', color: 'from-emerald-500 to-emerald-600' },
  ];

  const systemHealth = [
    { name: 'API Servers', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '99.8%' },
    { name: 'Storage', status: 'healthy', uptime: '99.9%' },
    { name: 'Email Service', status: 'warning', uptime: '98.5%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening with SecureFlow.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25">
            View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
              💰
            </div>
            <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-slate-900">$28,450</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              👥
            </div>
            <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">+8.2%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-slate-900">12,847</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              🏢
            </div>
            <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">+5.1%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Active Workspaces</h3>
          <p className="text-2xl font-bold text-slate-900">3,421</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl">
              📦
            </div>
            <span className="text-slate-500 text-sm font-medium bg-slate-50 px-2 py-1 rounded-lg">0.3%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Active Subscriptions</h3>
          <p className="text-2xl font-bold text-slate-900">2,156</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue & User Growth</h3>
              <p className="text-sm text-slate-500">Last 6 months performance</p>
            </div>
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
            <div className="text-center text-slate-500">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-sm">Charts would render here with Recharts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">System Health</h3>
          <div className="space-y-4">
            {systemHealth.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'healthy' ? 'bg-emerald-500' : item.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm text-slate-500">{item.uptime}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-3">Support Tickets</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-600">5</p>
                <p className="text-xs text-red-600">Open</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">12</p>
                <p className="text-xs text-amber-600">Pending</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center col-span-2">
                <p className="text-2xl font-bold text-emerald-600">143</p>
                <p className="text-xs text-emerald-600">Resolved this month</p>
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
                className={`p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md group`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-white text-xl mb-2 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{activity.user}</p>
                  <p className="text-xs text-slate-500 truncate">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
