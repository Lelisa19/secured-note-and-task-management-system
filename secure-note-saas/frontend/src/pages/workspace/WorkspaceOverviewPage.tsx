const WorkspaceOverviewPage = () => {
  const analytics = [
    { label: 'Total Notes', value: '245', change: '+15%', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Completed Tasks', value: '128', change: '+8%', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Active Members', value: '5', change: 'No change', color: 'from-purple-500 to-purple-600' },
    { label: 'Projects', value: '8', change: '+2', color: 'from-amber-500 to-amber-600' },
  ];

  const recentNotes = [
    { id: 1, title: 'Project Planning', author: 'John Doe', time: '2 hours ago', tag: 'Design' },
    { id: 2, title: 'Q2 Goals', author: 'Jane Smith', time: 'Yesterday', tag: 'Planning' },
  ];

  const activeMembers = [
    { id: 1, name: 'John Doe', role: 'Design Lead', avatar: 'JD', status: 'online' },
    { id: 2, name: 'Jane Smith', role: 'Product Manager', avatar: 'JS', status: 'online' },
    { id: 3, name: 'Mike Johnson', role: 'Developer', avatar: 'MJ', status: 'away' },
    { id: 4, name: 'David Kim', role: 'QA Engineer', avatar: 'DK', status: 'offline' },
  ];

  const activityFeed = [
    { id: 1, user: 'John Doe', action: 'created a shared note', item: 'Project Planning', time: '5 min ago', avatar: 'JD' },
    { id: 2, user: 'Jane Smith', action: 'completed a team task', item: 'Wireframes', time: '15 min ago', avatar: 'JS' },
    { id: 3, user: 'Mike Johnson', action: 'commented on a note', item: 'Design Review', time: '1 hour ago', avatar: 'MJ' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace Overview</h1>
          <p className="text-slate-600">Track your team's productivity and collaboration.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
            📊 Reports
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            + New Project
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.label === 'Total Notes' ? '📝' :
                 stat.label === 'Completed Tasks' ? '✅' :
                 stat.label === 'Active Members' ? '👥' : '📁'}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Members & Recent Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Members */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Active Members</h3>
              <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">View all →</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {activeMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === 'online' ? 'bg-emerald-500' :
                      member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{member.name}</div>
                    <div className="text-xs text-slate-500">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Shared Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Recent Shared Notes</h3>
              <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">View all →</a>
            </div>
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-900">{note.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">by {note.author}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{note.tag}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{note.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Activity</h3>
          <div className="space-y-4">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {activity.avatar}
                </div>
                <div>
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="text-indigo-600 font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceOverviewPage;
