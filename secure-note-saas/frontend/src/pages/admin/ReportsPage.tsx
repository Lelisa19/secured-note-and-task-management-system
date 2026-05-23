import { useState } from 'react';

interface DateFilter {
  label: string;
  value: string;
}

const ReportsPage = () => {
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [activeTab, setActiveTab] = useState('revenue');

  const dateFilters: DateFilter[] = [
    { label: 'Today', value: 'Today' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 30 Days', value: 'Last 30 Days' },
    { label: 'This Month', value: 'This Month' },
    { label: 'Last Month', value: 'Last Month' },
    { label: 'This Year', value: 'This Year' },
    { label: 'Custom Range', value: 'Custom Range' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$118,000', change: '+12.5%', color: 'from-emerald-500 to-emerald-600', icon: '💰' },
    { label: 'Active Users', value: '11,256', change: '+8.2%', color: 'from-blue-500 to-blue-600', icon: '👥' },
    { label: 'New Workspaces', value: '1,110', change: '+5.1%', color: 'from-purple-500 to-purple-600', icon: '🏢' },
    { label: 'Conversion Rate', value: '4.2%', change: '+1.1%', color: 'from-orange-500 to-orange-600', icon: '📈' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive insights and reports for SecureFlow</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span>📄</span>
            Export CSV
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span>📊</span>
            Download PDF
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
              <span className="text-sm font-medium text-emerald-600">
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
            <div className="flex flex-wrap gap-2">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                {dateFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
                Custom Range
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
              {['revenue', 'users', 'workspaces'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    activeTab === tab 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-80 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
            <div className="text-center text-slate-500">
              <div className="text-5xl mb-3">📈</div>
              <p className="text-lg font-medium text-slate-700">Charts would render here with Recharts</p>
              <p className="text-sm text-slate-500">Showing {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} data for {dateFilter}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Workspaces</h3>
              <div className="space-y-3">
                {[
                  { name: 'Acme Corp HQ', revenue: '$12,450', growth: '+12%' },
                  { name: 'Startup Inc', revenue: '$8,230', growth: '+8%' },
                  { name: 'Dev Team', revenue: '$6,120', growth: '+5%' },
                  { name: 'Design Studio', revenue: '$4,890', growth: '+3%' },
                  { name: 'Research Group', revenue: '$3,450', growth: '+2%' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{item.revenue}</p>
                      <p className="text-xs text-emerald-600">{item.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">User Activity</h3>
              <div className="space-y-3">
                {[
                  { metric: 'Daily Active Users', value: '2,847', change: '+156' },
                  { metric: 'New Signups', value: '412', change: '+56' },
                  { metric: 'Notes Created', value: '12,847', change: '+1,234' },
                  { metric: 'Tasks Completed', value: '8,521', change: '+987' },
                  { metric: 'Workspace Invites', value: '356', change: '+45' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-slate-700">{item.metric}</span>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{item.value}</p>
                      <p className="text-xs text-emerald-600">{item.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {[
              { plan: 'Enterprise', percentage: 45, color: 'bg-purple-500' },
              { plan: 'Business', percentage: 30, color: 'bg-blue-500' },
              { plan: 'Pro', percentage: 20, color: 'bg-indigo-500' },
              { plan: 'Free', percentage: 5, color: 'bg-slate-400' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{item.plan}</span>
                  <span className="text-sm text-slate-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'Monthly Revenue Summary', icon: '📊' },
              { name: 'User Growth Report', icon: '📈' },
              { name: 'Workspace Activity', icon: '🏢' },
              { name: 'Feature Usage Stats', icon: '🎯' },
              { name: 'Churn Analysis', icon: '📉' },
            ].map((report, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <span className="text-xl">{report.icon}</span>
                <span className="font-medium text-slate-900">{report.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Export Options</h3>
          <div className="space-y-3">
            {[
              { format: 'PDF Report', icon: '📄', description: 'Full printable report' },
              { format: 'CSV Data', icon: '📊', description: 'Raw data export' },
              { format: 'Excel Spreadsheet', icon: '📋', description: 'Formatted Excel file' },
              { format: 'JSON Export', icon: '📝', description: 'API-compatible JSON' },
            ].map((option, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center gap-3 px-4 py-3 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-colors text-left"
              >
                <span className="text-xl">{option.icon}</span>
                <div>
                  <p className="font-medium text-slate-900">{option.format}</p>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
