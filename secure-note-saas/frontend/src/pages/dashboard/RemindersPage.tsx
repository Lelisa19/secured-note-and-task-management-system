const RemindersPage = () => {
  const reminders = [
    { id: 1, title: 'Submit quarterly report', category: 'Work', priority: 'High', due: 'Today, 3:00 PM', completed: false },
    { id: 2, title: 'Doctor appointment', category: 'Personal', priority: 'Medium', due: 'Tomorrow, 10:00 AM', completed: false },
    { id: 3, title: 'Review team feedback', category: 'Work', priority: 'Low', due: 'Friday, 2:00 PM', completed: true },
    { id: 4, title: 'Buy groceries', category: 'Personal', priority: 'Medium', due: 'Saturday, 11:00 AM', completed: false },
  ];

  const categories = [
    { name: 'All', count: 4 },
    { name: 'Work', count: 2 },
    { name: 'Personal', count: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reminders</h1>
          <p className="text-slate-600">Never miss an important task or event.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
          + New Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium text-slate-900">{category.name}</span>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 mt-1 ${reminder.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {reminder.completed && '✓'}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${reminder.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {reminder.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{reminder.category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        reminder.priority === 'High' ? 'bg-red-100 text-red-700' :
                        reminder.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {reminder.priority}
                      </span>
                      <span className="text-sm text-slate-500">{reminder.due}</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">⋮</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;
