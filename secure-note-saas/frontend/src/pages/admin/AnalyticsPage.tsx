import { useState } from 'react';

interface KPI {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: string;
  isPositive: boolean;
}

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [darkMode, setDarkMode] = useState(false);

  const timeRanges = [
    { label: 'Today', value: 'Today' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 30 Days', value: 'Last 30 Days' },
    { label: 'This Month', value: 'This Month' },
    { label: 'Last Month', value: 'Last Month' },
    { label: 'This Year', value: 'This Year' },
  ];

  const kpis: KPI[] = [
    { label: 'Total Revenue', value: '$118,450', change: '+12.5%', color: 'from-emerald-500 to-emerald-600', icon: '💰', isPositive: true },
    { label: 'Total Users', value: '12,847', change: '+8.2%', color: 'from-blue-500 to-blue-600', icon: '👥', isPositive: true },
    { label: 'Active Workspaces', value: '3,105', change: '+5.1%', color: 'from-purple-500 to-purple-600', icon: '🏢', isPositive: true },
    { label: 'Conversion Rate', value: '4.2%', change: '+1.1%', color: 'from-orange-500 to-orange-600', icon: '📈', isPositive: true },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Upgraded to Pro', time: '2 minutes ago', amount: '$49' },
    { id: 2, user: 'Sarah Miller', action: 'Created new workspace', time: '15 minutes ago', amount: '—' },
    { id: 3, user: 'Mike Johnson', action: 'Renewed subscription', time: '1 hour ago', amount: '$99' },
    { id: 4, user: 'Emily Davis', action: 'Invited 3 members', time: '2 hours ago', amount: '—' },
    { id: 5, user: 'David Wilson', action: 'Purchased add-on', time: '3 hours ago', amount: '$29' },
  ];

  const topPlans = [
    { name: 'Pro', percentage: 45, color: 'bg-indigo-500', count: '5,781' },
    { name: 'Business', percentage: 30, color: 'bg-blue-500', count: '3,854' },
    { name: 'Enterprise', percentage: 20, color: 'bg-purple-500', count: '2,569' },
    { name: 'Free', percentage: 5, color: 'bg-slate-400', count: '643' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
          <p className="text-slate-600">Comprehensive business and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span>📄</span>
            Export CSV
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <span>📊</span>
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {kpi.icon}
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${kpi.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.change}
                <span className="text-xs">{kpi.isPositive ? '↑' : '↓'}</span>
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{kpi.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue & Growth</h3>
              <p className="text-sm text-slate-500">Performance over time</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">Revenue</button>
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Users</button>
              <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Workspaces</button>
            </div>
          </div>
          <div className="h-80 bg-slate-50 rounded-xl flex items-center justify-center">
            <div className="text-center text-slate-500">
              <div className="text-5xl mb-3">📈</div>
              <p className="text-lg font-medium text-slate-700">Revenue Chart</p>
              <p className="text-sm text-slate-500">Charts would render here with Recharts</p>
              <p className="text-xs text-slate-400 mt-2">Showing {timeRange}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Subscription Breakdown</h3>
          <div className="space-y-4">
            {topPlans.map((plan, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{plan.name}</span>
                    <span className="text-xs text-slate-500">({plan.count})</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{plan.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${plan.color}`}
                    style={{ width: `${plan.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-indigo-600">42%</p>
                <p className="text-xs text-slate-500">Pro Plan</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">89%</p>
                <p className="text-xs text-slate-500">Renewal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">User Growth Trends</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
            <div className="text-center text-slate-500">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-sm">User growth chart (Recharts)</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-xl font-bold text-emerald-600">+412</p>
              <p className="text-xs text-slate-500">New Users</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-xl font-bold text-blue-600">11,256</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-xl font-bold text-purple-600">2.3x</p>
              <p className="text-xs text-slate-500">Growth</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{activity.user}</p>
                  <p className="text-xs text-slate-500 truncate">{activity.action}</p>
                </div>
                <div className="text-right">
                  {activity.amount !== '—' && (
                    <p className="text-sm font-semibold text-emerald-600">{activity.amount}</p>
                  )}
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Workspace Activity</h3>
            <p className="text-sm text-slate-500">Workspaces created and activity metrics</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">Weekly</button>
            <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Monthly</button>
          </div>
        </div>
        <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
          <div className="text-center text-slate-500">
            <div className="text-4xl mb-2">🏢</div>
            <p className="text-sm">Workspace activity chart (Recharts)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
