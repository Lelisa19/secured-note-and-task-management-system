import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface LogItem {
  id: string | number;
  user: string;
  action: string;
  item: string;
  time: string;
  type: string;
  avatar: string;
}

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivity = async () => {
    setLoading(true);
    try {
      const workspaces = await apiRequest('/workspaces');
      const list = workspaces?.data || workspaces || [];
      if (Array.isArray(list) && list.length > 0) {
        const wsId = list[0].id || list[0].workspaceId || list[0]._id;
        try {
          const raw = await apiRequest(`/workspaces/${wsId}/activity`);
          const acts = raw?.data || raw || [];
          if (Array.isArray(acts)) {
            setLogs(
              acts.map((a: any, idx: number) => {
                const user = a.userFullName || a.userName || a.actorName || a.fullName || 'Team member';
                const initials = user.split(' ').map((p: string) => p?.[0] || '').join('').slice(0, 2).toUpperCase() || 'U';
                return {
                  id: a.id || idx,
                  user,
                  action: a.action ? a.action.replace(/_/g, ' ').toLowerCase() : 'performed action',
                  item: a.targetName || a.itemName || a.title || '',
                  time: a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Recently',
                  type: a.type || 'activity',
                  avatar: initials,
                };
              })
            );
          }
        } catch {
          setLogs([]);
        }
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
          <p className="text-slate-600">Track all workspace activity and events in real-time.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold text-slate-800 text-sm mb-1">No Activity Logs Found</p>
            <p>Recent team actions, note edits, and task updates will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {log.avatar}
                  </div>
                  <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-900 text-sm">
                        <span className="font-semibold">{log.user}</span> {log.action}{' '}
                        <span className="text-indigo-600 font-medium">{log.item}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
