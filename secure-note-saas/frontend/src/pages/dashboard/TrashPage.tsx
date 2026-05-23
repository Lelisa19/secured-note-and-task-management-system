const TrashPage = () => {
  const trashItems = [
    { id: 1, type: 'note', title: 'Old Project Plan', deleted: '2 days ago' },
    { id: 2, type: 'task', title: 'Complete documentation', deleted: '1 week ago' },
    { id: 3, type: 'note', title: 'Draft meeting notes', deleted: '3 weeks ago' },
  ];

  const stats = [
    { label: 'Notes in Trash', value: '2' },
    { label: 'Tasks in Trash', value: '1' },
    { label: 'Total Items', value: '3' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trash</h1>
          <p className="text-slate-600">Restore or permanently delete items.</p>
        </div>
        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
          Empty Trash
        </button>
      </div>

      {/* Trash Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Trash Items */}
      <div className="space-y-3">
        {trashItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  item.type === 'note' ? 'bg-indigo-100' : 'bg-emerald-100'
                }`}>
                  {item.type === 'note' ? '📝' : '✅'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.type === 'note' ? 'Note' : 'Task'} • Deleted {item.deleted}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium">
                  Restore
                </button>
                <button className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {trashItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🗑️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Trash is empty</h2>
          <p className="text-slate-600">When you delete items, they'll appear here.</p>
        </div>
      )}
    </div>
  );
};

export default TrashPage;
