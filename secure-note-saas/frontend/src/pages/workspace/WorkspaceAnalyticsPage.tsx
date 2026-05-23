const WorkspaceAnalyticsPage = () => {
  const stats = [
    { label: 'Total Notes', value: '245', change: '+15%', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Completed Tasks', value: '128', change: '+8%', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Active Members', value: '4', change: 'No change', color: 'from-purple-500 to-purple-600' },
    { label: 'Files Uploaded', value: '36', change: '+12%', color: 'from-amber-500 to-amber-600' },
  ];

  const memberRankings = [
    { name: 'John Doe', notes: 89, tasks: 45, score: 92 },
    { name: 'Jane Smith', notes: 72, tasks: 38, score: 85 },
    { name: 'Mike Johnson', notes: 56, tasks: 32, score: 74 },
    { name: 'David Kim', notes: 28, tasks: 13, score: 52 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace Analytics</h1>
          <p className="text-slate-600">Track your team's productivity and performance.</p>
        </div>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
          Export Report
        </button>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.label === 'Total Notes' ? '📝' :
                 stat.label === 'Completed Tasks' ? '✅' :
                 stat.label === 'Active Members' ? '👥' : '📄'}
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Member Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Member Productivity</h3>
          <div className="space-y-4">
            {memberRankings.map((member, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{member.name}</div>
                  <div className="text-sm text-slate-500">
                    {member.notes} notes • {member.tasks} tasks
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-600">#{idx + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Activity</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-slate-500 w-12">{day}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.random() * 80 + 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceAnalyticsPage;
