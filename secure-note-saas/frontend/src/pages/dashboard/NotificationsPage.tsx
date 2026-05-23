const NotificationsPage = () => {
  const notifications = [
    { id: 1, type: 'reminder', title: 'Reminder: Submit quarterly report', message: 'Due today at 3:00 PM', time: '5 min ago', read: false },
    { id: 2, type: 'activity', title: 'John Doe commented on your note', message: 'Great idea! Let\'s discuss this tomorrow.', time: '15 min ago', read: false },
    { id: 3, type: 'workspace', title: 'New team member joined', message: 'Jane Smith has joined the workspace.', time: '1 hour ago', read: true },
    { id: 4, type: 'reminder', title: 'Reminder: Doctor appointment', message: 'Tomorrow at 10:00 AM', time: '2 hours ago', read: true },
  ];

  const filters = ['All', 'Unread', 'Reminders', 'Activity', 'Workspace'];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600">Stay updated with your workspace activity.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
            Mark all as read
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {filters.map((filter, idx) => (
          <button key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors whitespace-nowrap">
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all ${!notification.read ? 'border-l-4 border-l-indigo-500' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                notification.type === 'reminder' ? 'bg-amber-100' :
                notification.type === 'activity' ? 'bg-indigo-100' :
                'bg-emerald-100'
              }`}>
                {notification.type === 'reminder' ? '🔔' :
                 notification.type === 'activity' ? '💬' :
                 '👥'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold text-lg ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-slate-400">{notification.time}</span>
                </div>
                <p className="text-sm text-slate-600">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
