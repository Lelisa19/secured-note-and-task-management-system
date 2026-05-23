import { useState } from 'react';

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  user: {
    name: string;
    email: string;
  };
  ipAddress: string;
  location: string;
  device: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'warning';
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'medium' | 'high' | 'critical';
  time: string;
}

const SecurityLogsPage = () => {
  const [logs] = useState<SecurityLog[]>([
    { id: 'log_001', timestamp: 'Jan 20, 2024 14:30:00', event: 'Successful Login', user: { name: 'John Doe', email: 'john@example.com' }, ipAddress: '192.168.1.100', location: 'New York, USA', device: 'Chrome on Windows 10', severity: 'low', status: 'success' },
    { id: 'log_002', timestamp: 'Jan 20, 2024 13:45:00', event: 'Failed Login Attempt', user: { name: 'Sarah Miller', email: 'sarah@example.com' }, ipAddress: '203.0.113.50', location: 'London, UK', device: 'Safari on macOS', severity: 'medium', status: 'failed' },
    { id: 'log_003', timestamp: 'Jan 20, 2024 12:15:00', event: 'Password Changed', user: { name: 'Mike Johnson', email: 'mike@example.com' }, ipAddress: '198.51.100.25', location: 'Berlin, Germany', device: 'Firefox on Ubuntu', severity: 'low', status: 'success' },
    { id: 'log_004', timestamp: 'Jan 20, 2024 11:00:00', event: 'Suspicious Login from New Device', user: { name: 'Emily Davis', email: 'emily@example.com' }, ipAddress: '172.16.0.75', location: 'Tokyo, Japan', device: 'Mobile Safari on iPhone 15', severity: 'high', status: 'warning' },
    { id: 'log_005', timestamp: 'Jan 20, 2024 10:30:00', event: 'Two-Factor Authentication Enabled', user: { name: 'David Wilson', email: 'david@example.com' }, ipAddress: '10.0.0.15', location: 'San Francisco, USA', device: 'Chrome on macOS', severity: 'low', status: 'success' },
    { id: 'log_006', timestamp: 'Jan 20, 2024 09:15:00', event: 'Multiple Failed Logins', user: { name: 'Jessica Brown', email: 'jessica@example.com' }, ipAddress: '192.0.2.100', location: 'Paris, France', device: 'Unknown', severity: 'critical', status: 'failed' },
  ]);

  const [alerts] = useState<Alert[]>([
    { id: 'alert_001', title: 'Multiple Failed Logins', description: '5 failed login attempts from IP 192.0.2.100', severity: 'critical', time: '10 minutes ago' },
    { id: 'alert_002', title: 'New Device Login', description: 'Login from new device in Tokyo, Japan', severity: 'high', time: '1 hour ago' },
    { id: 'alert_003', title: 'Unusual Location', description: 'Access from unexpected geographic region', severity: 'medium', time: '2 hours ago' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All Severities');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All Events');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.ipAddress.includes(searchQuery);
    const matchesSeverity = severityFilter === 'All Severities' || log.severity === severityFilter;
    const matchesEventType = eventTypeFilter === 'All Events';
    return matchesSearch && matchesSeverity && matchesEventType;
  });

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success': return 'bg-emerald-100 text-emerald-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getAlertSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      default: return '🟢';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security Logs</h1>
          <p className="text-slate-600">Monitor and review security events across the platform</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/25 flex items-center gap-2">
          <span>📄</span>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:flex-none sm:w-80">
                  <span className="text-slate-400">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search security logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-slate-700"
                  />
                </div>
                <select 
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
                >
                  <option>All Severities</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select 
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
                >
                  <option>All Events</option>
                  <option>Login</option>
                  <option>Password Change</option>
                  <option>2FA</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Timestamp</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Event</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">IP & Location</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Severity</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{log.timestamp.split(' ')[0]}</p>
                        <p className="text-xs text-slate-500">{log.timestamp.split(' ')[1]}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{log.event}</p>
                        <p className="text-xs text-slate-500">{log.device}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900">{log.user.name}</p>
                        <p className="text-xs text-slate-500">{log.user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-slate-900">{log.ipAddress}</p>
                        <p className="text-xs text-slate-500">{log.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityBadgeClass(log.severity)}`}>
                          {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(log.status)}`}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span>🚨</span>
                Active Alerts
              </h3>
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {alerts.length}
              </span>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-slate-50 rounded-xl border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getAlertSeverityIcon(alert.severity)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-slate-400 mt-2">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Events Today', value: '1,247', color: 'text-indigo-600' },
                { label: 'Failed Logins', value: '42', color: 'text-red-600' },
                { label: '2FA Enabled', value: '89%', color: 'text-emerald-600' },
                { label: 'New Devices', value: '15', color: 'text-amber-600' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-700">{stat.label}</span>
                  <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Actions</h3>
            <div className="space-y-3">
              {[
                { name: 'View Recent Logins', icon: '🔐', description: 'Login activity' },
                { name: 'Block IP Address', icon: '🚫', description: 'Restrict access' },
                { name: 'Force Password Reset', icon: '🔑', description: 'Reset user passwords' },
                { name: 'Review 2FA Settings', icon: '🛡️', description: 'Security settings' },
              ].map((action, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-colors text-left"
                >
                  <span className="text-xl">{action.icon}</span>
                  <div>
                    <p className="font-medium text-slate-900">{action.name}</p>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityLogsPage;
