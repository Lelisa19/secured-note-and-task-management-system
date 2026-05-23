import { useState } from 'react';

const SharedNotesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const sharedNotes = [
    { id: 1, title: 'Project Planning', author: 'John Doe', lastEdited: '2 hours ago', collaborators: ['JD', 'JS', 'MJ'], tag: 'Design', comments: 5 },
    { id: 2, title: 'Q2 Goals', author: 'Jane Smith', lastEdited: 'Yesterday', collaborators: ['JS', 'DK'], tag: 'Planning', comments: 3 },
    { id: 3, title: 'Design System', author: 'John Doe', lastEdited: '3 days ago', collaborators: ['JD'], tag: 'Design', comments: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shared Notes</h1>
          <p className="text-slate-600">Collaborate on notes with your team.</p>
        </div>
        <div className="flex space-x-3">
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
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            + New Note
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {sharedNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{note.tag}</span>
              <div className="flex items-center gap-1">
                💬 <span className="text-xs text-slate-500">{note.comments}</span>
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">{note.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {note.collaborators.map((avatar, idx) => (
                    <div key={idx} className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {avatar}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-slate-500">by {note.author}</span>
              </div>
              <span className="text-xs text-slate-400">{note.lastEdited}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedNotesPage;
