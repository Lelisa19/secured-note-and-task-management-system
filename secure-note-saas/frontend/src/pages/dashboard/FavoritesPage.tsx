import { useState } from 'react';

const FavoritesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const favoriteNotes = [
    { id: 1, title: 'Project Planning', preview: 'Detailed plan for upcoming projects...', time: '2 hours ago', tag: 'Work' },
    { id: 2, title: 'Meeting Notes', preview: 'Notes from today\'s standup meeting...', time: 'Yesterday', tag: 'Meeting' },
  ];

  const favoriteTasks = [
    { id: 1, title: 'Finish dashboard design', priority: 'High', due: 'Today', completed: false },
    { id: 2, title: 'Review team feedback', priority: 'Medium', due: 'Tomorrow', completed: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Favorites</h1>
          <p className="text-slate-600">Your most important notes and tasks.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setView('grid')}
            className={`px-4 py-2 rounded-xl transition-colors ${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-xl transition-colors ${view === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Favorite Notes */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Favorite Notes</h2>
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {favoriteNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{note.title}</h3>
                <button className="text-amber-500 hover:text-amber-600">⭐</button>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{note.preview}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{note.tag}</span>
                <span className="text-xs text-slate-400">{note.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Favorite Tasks</h2>
        <div className="space-y-3">
          {favoriteTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {task.completed && '✓'}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-500">{task.due}</span>
                    </div>
                  </div>
                </div>
                <button className="text-amber-500 hover:text-amber-600">⭐</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
