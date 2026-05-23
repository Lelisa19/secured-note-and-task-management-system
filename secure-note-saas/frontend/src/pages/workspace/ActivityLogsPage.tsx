const ActivityLogsPage = () => {
  const logs = [
    { id: 1, user: 'John Doe', action: 'created a note', item: 'Project Brief', time: '5 min ago', type: 'note', avatar: 'JD' },
    { id: 2, user: 'Jane Smith', action: 'completed a task', item: 'Design wireframes', time: '15 min ago', type: 'task', avatar: 'JS' },
    { id: 3, user: 'Mike Johnson', action: 'uploaded a file', item: 'Design System.pdf', time: '1 hour ago', type: 'file', avatar: 'MJ' },
    { id: 4, user: 'David Kim', action: 'logged in', item: 'Chrome on Windows', time: '2 hours ago', type: 'login', avatar: 'DK' },
    { id: 5, user: 'John Doe', action: 'edited permissions', item: 'Added Guest role', time: '3 hours ago', type: 'security', avatar: 'JD' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
          <p className="text-slate-600">Track all workspace activity and events.</p>
        </div>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
          Export Logs
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6">
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
                      <p className="text-slate-900">
                        <span className="font-semibold">{log.user}</span> {log.action}{' '}
                        <span className="text-indigo-600 font-medium">{log.item}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          log.type === 'note' ? 'bg-indigo-100 text-indigo-700' :
                          log.type === 'task' ? 'bg-emerald-100 text-emerald-700' :
                          log.type === 'file' ? 'bg-purple-100 text-purple-700' :
                          log.type === 'login' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsPage;
