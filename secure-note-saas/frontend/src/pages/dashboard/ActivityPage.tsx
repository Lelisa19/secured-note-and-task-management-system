const ActivityPage = () => {
  const activities = [
    { id: 1, user: 'John Doe', action: 'created a new note', item: 'Project Planning', time: '5 min ago', avatar: 'JD', type: 'notes' },
    { id: 2, user: 'Jane Smith', action: 'completed a task', item: 'Wireframes', time: '15 min ago', avatar: 'JS', type: 'tasks' },
    { id: 3, user: 'Mike Johnson', action: 'added a comment', item: 'Design Review', time: '1 hour ago', avatar: 'MJ', type: 'activity' },
    { id: 4, user: 'John Doe', action: 'logged in', item: 'From Chrome on Windows', time: '2 hours ago', avatar: 'JD', type: 'login' },
    { id: 5, user: 'Jane Smith', action: 'edited a note', item: 'Meeting Notes', time: '3 hours ago', avatar: 'JS', type: 'notes' },
  ];

  const filters = ['All', 'Notes', 'Tasks', 'Login', 'Activity'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activity</h1>
          <p className="text-slate-600">Track all workspace activity and changes.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {filters.map((filter, idx) => (
          <button key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors whitespace-nowrap">
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activities.map((activity, idx) => (
          <div key={activity.id} className="relative">
            {idx < activities.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-slate-200"></div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10">
                {activity.avatar}
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                  <span className="text-indigo-600 font-medium">{activity.item}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
