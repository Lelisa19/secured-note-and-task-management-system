const TeamTasksPage = () => {
  const columns = [
    {
      id: 'todo',
      title: 'Todo',
      tasks: [
        { id: 1, title: 'Design homepage', assignee: 'JD', priority: 'High', due: 'Today' },
        { id: 2, title: 'Create wireframes', assignee: 'JS', priority: 'Medium', due: 'Tomorrow' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        { id: 3, title: 'Implement login', assignee: 'MJ', priority: 'High', due: 'Today' },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      tasks: [
        { id: 4, title: 'Code review', assignee: 'DK', priority: 'Medium', due: 'Tomorrow' },
      ],
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [
        { id: 5, title: 'Setup project', assignee: 'JD', priority: 'Low', due: 'Yesterday' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Tasks</h1>
          <p className="text-slate-600">Collaborate on tasks with your team.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
          + New Task
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80 bg-slate-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{column.title}</h3>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{column.tasks.length}</span>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {task.assignee}
                    </div>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">{task.title}</h4>
                  <div className="text-xs text-slate-500">Due: {task.due}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTasksPage;
