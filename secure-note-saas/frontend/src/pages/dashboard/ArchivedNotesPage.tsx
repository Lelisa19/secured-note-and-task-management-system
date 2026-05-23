import { useState } from 'react';

const ArchivedNotesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const archivedNotes = [
    { id: 1, title: 'Q4 2024 Planning', preview: 'Old quarterly plan documents...', time: '3 months ago', tag: 'Work' },
    { id: 2, title: 'Old Meeting Notes', preview: 'Notes from previous quarter meetings...', time: '2 months ago', tag: 'Meeting' },
    { id: 3, title: 'Archive Test Note', preview: 'Just a test note to archive...', time: '1 month ago', tag: 'Personal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Archived Notes</h1>
          <p className="text-slate-600">Restore or permanently delete archived notes.</p>
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

      <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {archivedNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{note.title}</h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full mt-2 inline-block">{note.tag}</span>
              </div>
              <span className="text-xs text-slate-400">{note.time}</span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">{note.preview}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium">
                Restore
              </button>
              <button className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {archivedNotes.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No archived notes</h2>
          <p className="text-slate-600">When you archive notes, they'll appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ArchivedNotesPage;
