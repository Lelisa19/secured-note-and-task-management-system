import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface SecLogUser {
  id: string;
  fullName: string;
  email: string;
}

interface AdminSecurityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: string | null;
  createdAt: string;
  user: SecLogUser;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  user: { name: string; email: string };
  ipAddress: string;
  location: string;
  device: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | string;
  status: 'success' | 'failed' | 'warning' | string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'critical' | 'medium' | string;
  time: string;
}

const fmtDateTime = (d: string) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
};

const fmtAgo = (d: string) => {
  try {
    const diff = Date.now() - new Date(d).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s} seconds ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} minutes ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hours ago`;
    return `${Math.floor(h / 24)} days ago`;
  } catch {
    return d;
  }
};

const deriveSeverity = (action: string, status: string): 'low' | 'medium' | 'high' | 'critical' => {
  const a = action.toLowerCase();
  const s = status.toLowerCase();
  if ((a.includes('login') && s === 'failed') || a.includes('fail') || a.includes('suspicious')) {
    return 'high';
  }
  if (a.includes('password') || a.includes('2fa') || a.includes('two-factor')) {
    return 'medium';
  }
  return 'low';
};

const deriveStatus = (action: string): 'success' | 'failed' | 'warning' => {
  const a = action.toLowerCase();
  if (a.includes('fail')) return 'failed';
  if (a.includes('suspicious') || a.includes('new device') || a.includes('unusual')) return 'warning';
  return 'success';
};

const SecurityLogsPage = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All Severities');
  const [dateRange, setDateRange] = useState<string>('All Time');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const raw: AdminSecurityLog[] = (await apiRequest('/admin/security-logs')) || [];
      const mapped: SecurityLog[] = raw.map((l) => {
        let metadata: any = {};
        try {
          if (l.metadata) metadata = JSON.parse(l.metadata);
        } catch {}
        const action = l.action || 'SECURITY_EVENT';
        const status = metadata.status || deriveStatus(action);
        const severity = metadata.severity || deriveSeverity(action, status);
        return {
          id: l.id,
          timestamp: fmtDateTime(l.createdAt),
          event: action,
          user: { name: l.user.fullName, email: l.user.email },
          ipAddress: l.ipAddress || metadata.ipAddress || '—',
          location: metadata.location || 'Unknown',
          device: l.userAgent || metadata.device || metadata.userAgent || 'Unknown Device',
          severity,
          status,
        };
      });
      setLogs(mapped);

      const derivedAlerts: Alert[] = mapped
        .filter((l) => l.severity === 'high' || l.severity === 'critical')
        .slice(0, 3)
        .map((l, idx) => ({
          id: `alert-${idx}-${l.id}`,
          title: l.event,
          description: `${l.user.name} — ${l.ipAddress}`,
          severity: l.severity as 'high' | 'critical' | 'medium',
          time: fmtAgo(l.timestamp),
        }));
      setAlerts(derivedAlerts);
    } catch (e: any) {
      setError(e?.message || 'Failed to load security logs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);
    const matchesSeverity = severityFilter === 'All Severities' || log.severity === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security Logs</h1>
          <p className="text-slate-600">Monitor all security events across the platform</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">📥 Export Logs</button>
          <button onClick={load} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/25">
            {loading ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">⚠️</div>
              <div>
                <h3 className="font-bold text-red-900">Security Alerts ({alerts.length})</h3>
                <p className="text-sm text-red-700">Recent high/critical severity events require attention</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-xl p-4 border border-red-100 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    alert.severity === 'critical' ? 'bg-red-600 text-white' :
                    alert.severity === 'high' ? 'bg-orange-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {alert.severity}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                    <p className="text-sm text-slate-600">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 whitespace-nowrap">{alert.time}</span>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 whitespace-nowrap">Investigate →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:flex-none sm:w-80">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-slate-700"
              />
            </div>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Severities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Time</option>
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Showing:</span>
            <span className="font-bold text-slate-900">{filteredLogs.length}</span>
            <span className="text-slate-600">of</span>
            <span className="font-bold text-slate-900">{logs.length}</span>
            <span className="text-slate-600">events</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading security logs…</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {logs.length === 0
              ? 'No security events logged yet.'
              : 'No security events match your filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Device</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-slate-700">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{log.event}</div>
                      <div className="text-xs text-slate-500">{log.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(log.user.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 truncate">{log.user.name}</div>
                          <div className="text-xs text-slate-500 truncate">{log.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{log.ipAddress}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{log.device}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        log.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                        log.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {typeof log.severity === 'string' ? log.severity.charAt(0).toUpperCase() + log.severity.slice(1) : log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {typeof log.status === 'string' ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Details</button>
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

export default SecurityLogsPage;
