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

  const stats: { label: string; value: string; change: string; color: string; icon: string }[] = [];

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
        {stats.length === 0 ? (
          <>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-center">
                <p className="text-xs text-slate-400">No KPI data</p>
              </div>
            ))}
          </>
        ) : (
          stats.map((stat, idx) => (
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
          ))
        )}
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
                <div className="p-8 text-center text-xs text-slate-400">
                  No workspace ranking data yet.
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">User Activity</h3>
              <div className="space-y-3">
                <div className="p-8 text-center text-xs text-slate-400">
                  No activity summary yet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            <div className="p-4 text-center text-xs text-slate-400">
              Plan revenue breakdown not available yet.
            </div>
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
                onClick={() => { alert('Report generation not yet wired in the backend.'); }}
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
                onClick={() => { alert('Export not yet wired in the backend.'); }}
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
