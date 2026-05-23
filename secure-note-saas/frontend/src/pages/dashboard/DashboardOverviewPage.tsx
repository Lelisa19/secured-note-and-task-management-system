const DashboardOverviewPage = () => {
  const stats = [
    {
      icon: '📝',
      label: 'Total Notes',
      value: '128',
      change: '+12%',
      positive: true,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: '✅',
      label: 'Completed Tasks',
      value: '45',
      change: '+8%',
      positive: true,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: '📅',
      label: 'Upcoming Events',
      value: '8',
      change: '+2',
      positive: true,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '👥',
      label: 'Team Members',
      value: '5',
      change: 'No change',
      positive: false,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const recentNotes = [
    { id: 1, title: 'Project Planning 2025', preview: 'Detailed plan for upcoming projects...', time: '2 hours ago', tag: 'Work' },
    { id: 2, title: 'Meeting Notes', preview: 'Notes from today\'s standup meeting...', time: 'Yesterday', tag: 'Meeting' },
    { id: 3, title: 'Shopping List', preview: 'Milk, eggs, bread, vegetables...', time: '3 days ago', tag: 'Personal' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Finish dashboard design', priority: 'High', due: 'Today', completed: false },
    { id: 2, title: 'Review team feedback', priority: 'Medium', due: 'Tomorrow', completed: false },
    { id: 3, title: 'Update documentation', priority: 'Low', due: 'Friday', completed: true },
  ];

  const activityFeed = [
    { id: 1, user: 'John Doe', action: 'created a new note', item: 'Project Planning', time: '5 min ago', avatar: 'JD' },
    { id: 2, user: 'Jane Smith', action: 'completed a task', item: 'Wireframes', time: '15 min ago', avatar: 'JS' },
    { id: 3, user: 'Mike Johnson', action: 'added a comment', item: 'Design Review', time: '1 hour ago', avatar: 'MJ' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good morning, John! 👋</h1>
          <p className="text-slate-600">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
            📅 Today
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            + New Note
          </button>
        </div>
      </div>

      {/* Productivity Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-slate-500'}`}>
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
        {/* Recent Notes */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Notes</h2>
            <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">View all →</a>
          </div>
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{note.title}</h3>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{note.tag}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-2">{note.preview}</p>
                <p className="text-xs text-slate-400">{note.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Tasks</h2>
            <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">View all →</a>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {task.completed && '✓'}
                  </div>
                  <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                  task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {task.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Activity Feed</h2>
          </div>
          <div className="space-y-4">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1">
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

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-start space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <span className="text-xl">📝</span>
              <span className="text-sm font-medium text-slate-900">Create new note</span>
            </button>
            <button className="w-full flex items-center justify-start space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <span className="text-xl">✅</span>
              <span className="text-sm font-medium text-slate-900">Add new task</span>
            </button>
            <button className="w-full flex items-center justify-start space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <span className="text-xl">📅</span>
              <span className="text-sm font-medium text-slate-900">Schedule event</span>
            </button>
            <button className="w-full flex items-center justify-start space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <span className="text-xl">👥</span>
              <span className="text-sm font-medium text-slate-900">Invite team member</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
