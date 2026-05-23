const TasksPage = () => {
  const columns = [
    { id: 'todo', title: 'Todo', tasks: [
      { id: 1, title: 'Design landing page', priority: 'High', assignee: 'JD', due: 'Today' },
      { id: 2, title: 'Write documentation', priority: 'Medium', assignee: 'JS', due: 'Tomorrow' },
    ] },
    { id: 'in-progress', title: 'In Progress', tasks: [
      { id: 3, title: 'Build authentication', priority: 'High', assignee: 'MJ', due: 'Today' },
    ] },
    { id: 'review', title: 'Review', tasks: [
      { id: 4, title: 'Test API endpoints', priority: 'Medium', assignee: 'DK', due: 'Friday' },
    ] },
    { id: 'completed', title: 'Completed', tasks: [
      { id: 5, title: 'Setup project structure', priority: 'Low', assignee: 'JD', due: 'Yesterday' },
    ] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600">Manage your tasks and projects efficiently.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
            📅 Calendar
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            + New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[300px] bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                {column.title}
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </h3>
              <button className="text-slate-400 hover:text-slate-600">⋮</button>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-3">{task.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {task.assignee}
                      </div>
                      <span className="text-xs text-slate-500">{task.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
